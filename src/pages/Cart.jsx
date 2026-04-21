import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  // ================= FETCH CART =================
  const fetchCart = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/cart/getCart`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const items = res.data.items || res.data.cart?.items || [];
      setCart(items);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load cart");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ================= REMOVE ITEM =================
  const handleRemove = async (id) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/cart/removeFromCart`,
        { productId: id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Item removed");
      fetchCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.log(error);
      toast.error("Remove failed");
    }
  };

  // ================= TOTAL =================
  const total = cart.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.qty,
    0
  );

  // ================= RAZORPAY CHECKOUT =================
  const handleCheckout = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/orders/createOrder`,
        {
          items: cart,
          amount: total,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = res.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.razorpayOrder.amount,
        currency: "INR",
        name: "Ekart Store",
        description: "Order Payment",
        order_id: data.razorpayOrder.id,

        handler: async function (response) {
          try {
            const verify = await axios.post(
              `${import.meta.env.VITE_API_BASE_URL}/orders/verifyPayment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            if (verify.data.success) {
              toast.success("Payment Successful 🎉");
              setCart([]);
              window.dispatchEvent(new Event("cartUpdated"));
              navigate("/orders");
            } else {
              toast.error("Payment verification failed");
            }
          } catch (err) {
            console.log(err);
            toast.error("Verification error");
          }
        },

        prefill: {
          name: "Customer",
          email: "customer@example.com",
        },

        theme: {
          color: "#FACC15",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.log(error);
      toast.error("Checkout failed");
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="pt-28 min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white">
        <div className="px-6">

          <h1 className="text-3xl font-bold mb-8">🛒 Your Cart</h1>

          {cart.length === 0 ? (
            <p className="text-center text-gray-300">Cart is empty</p>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">

              {/* ITEMS */}
              <div className="md:col-span-2 space-y-4">

                {cart.map((item) => {
                  if (!item.product) return null;

                  // ✅ ImageKit compatible
                  const img =
                    item.product.images?.[0] || item.product.image;

                  return (
                    <div
                      key={item._id}
                      onClick={() =>
                        navigate(`/product/${item.product._id}`)
                      }
                      className="bg-white/10 p-4 rounded-2xl flex gap-4 cursor-pointer hover:scale-[1.02] transition"
                    >
                      <img
                        src={
                          img
                            ? img // ✅ direct URL (ImageKit)
                            : "https://via.placeholder.com/100"
                        }
                        className="w-24 h-24 object-cover rounded-lg"
                        alt="product"
                      />

                      <div className="flex flex-col justify-between w-full">
                        <div>
                          <h2 className="font-semibold">
                            {item.product.name}
                          </h2>
                          <p className="text-sm text-gray-300">
                            {item.product.category}
                          </p>
                          <p className="text-xs text-gray-400">
                            Qty: {item.qty}
                          </p>
                        </div>

                        <div className="flex justify-between items-center">
                          <p className="text-yellow-400 font-bold">
                            ₹{item.product.price * item.qty}
                          </p>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemove(item.product._id);
                            }}
                            className="text-red-400 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

              </div>

              {/* SUMMARY */}
              <div className="bg-white/10 p-6 rounded-2xl">
                <h2 className="text-xl font-semibold mb-4">
                  Order Summary
                </h2>

                <div className="flex justify-between">
                  <span>Items</span>
                  <span>{cart.length}</span>
                </div>

                <div className="flex justify-between mt-2">
                  <span>Delivery</span>
                  <span className="text-green-400">Free</span>
                </div>

                <hr className="my-4 border-gray-600" />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-yellow-400">₹{total}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="mt-5 w-full bg-yellow-400 text-black py-2 rounded-full"
                >
                  Checkout
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default Cart;