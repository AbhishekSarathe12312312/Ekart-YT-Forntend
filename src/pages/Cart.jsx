import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Payment from "../../features/Payment";

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
        },
      );

      const items = res.data.items || res.data.cart?.items || [];
      setCart(items);
    } catch (error) {
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
        },
      );

      toast.success("Item removed");
      fetchCart();
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      toast.error("Remove failed");
    }
  };

  // ================= TOTAL =================
  const total = cart.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.qty,
    0,
  );

  return (
    <>
      <Navbar />
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="pt-24 min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">🛒 Your Cart</h1>

        {cart.length === 0 ? (
          <p className="text-center text-gray-300">Cart is empty</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ITEMS */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => {
                if (!item.product) return null;

                const img = item.product.images?.[0] || item.product.image;

                return (
                  <div
                    key={item._id}
                    onClick={() => navigate(`/product/${item.product._id}`)}
                    className="
                      bg-white/10 p-3 sm:p-4 rounded-2xl 
                      flex flex-col sm:flex-row gap-3 sm:gap-4 
                      cursor-pointer hover:scale-[1.02] transition
                    "
                  >
                    <img
                      src={img || "https://via.placeholder.com/100"}
                      className="w-full sm:w-24 h-32 sm:h-24 object-cover rounded-lg"
                      alt="product"
                    />

                    <div className="flex flex-col justify-between w-full">
                      <div>
                        <h2 className="font-semibold text-sm sm:text-base">
                          {item.product.name}
                        </h2>

                        <p className="text-xs text-gray-300">
                          {item.product.category}
                        </p>

                        <p className="text-[10px] sm:text-xs text-gray-400">
                          Qty: {item.qty}
                        </p>
                      </div>

                      <div className="flex justify-between items-center mt-2 sm:mt-0">
                        <p className="text-yellow-400 font-bold text-sm sm:text-base">
                          ₹{item.product.price * item.qty}
                        </p>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(item.product._id);
                          }}
                          className="text-red-400 text-xs sm:text-sm"
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
            <div
              className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/60 
p-5 sm:p-6 rounded-3xl border border-white/10 shadow-xl backdrop-blur-xl"
            >
              {/* TITLE */}
              <h2 className="text-xl sm:text-2xl font-semibold mb-5 tracking-wide">
                Order Summary
              </h2>

              {/* ITEMS */}
              <div className="flex justify-between text-sm text-gray-300">
                <span>Items</span>
                <span className="font-medium text-white">{cart.length}</span>
              </div>

              {/* DELIVERY */}
              <div className="flex justify-between mt-3 text-sm text-gray-300">
                <span>Delivery</span>
                <span className="text-green-400 font-medium">Free</span>
              </div>

              {/* DIVIDER */}
              <div className="my-5 border-t border-white/10"></div>

              {/* TOTAL */}
              <div className="flex justify-between items-center text-lg sm:text-xl font-bold">
                <span>Total</span>
                <span className="text-yellow-400">₹{total}</span>
              </div>

              {/* EXTRA NOTE */}
              <p className="text-xs text-gray-400 mt-2">
                Taxes included. No hidden charges.
              </p>

              {/* PAYMENT BUTTON */}
              <div className="mt-6">
                <Payment
                  cart={cart}
                  total={total}
                  onSuccess={() => {
                    toast.success("Payment Successful 🎉");
                    setCart([]);
                    window.dispatchEvent(new Event("cartUpdated"));
                    navigate("/");
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
