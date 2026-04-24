import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import Payment from "../../features/Payment";

const SingleProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [showPayment, setShowPayment] = useState(false);

  // ================= FETCH PRODUCT =================
  const fetchProduct = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/product/getSingleProduct/${id}`
      );

      const data = res.data.product;
      setProduct(data);

      if (data?.images?.length > 0) {
        setMainImage(data.images[0]);
      } else {
        setMainImage(data?.image || "");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load product ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  // ================= ADD TO CART =================
  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first 🔐");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/cart/addCart`,
        { productId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Added to cart 🛒");
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.log(error);
      toast.error("Failed to add to cart ❌");
    }
  };

  // ================= BUY NOW =================
  const handleBuyNow = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first 🔐");
      navigate("/login");
      return;
    }

    setShowPayment(true);
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white">
          Loading...
        </div>
      </>
    );
  }

  // ================= NOT FOUND =================
  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-black text-red-400">
          Product not found ❌
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="relative min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white overflow-hidden">

        {/* Glow */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 opacity-20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500 opacity-20 blur-3xl rounded-full"></div>

        {/* MAIN CONTENT */}
        <div className="relative max-w-6xl mx-auto px-4 py-24 grid md:grid-cols-2 gap-10 items-center">

          {/* LEFT IMAGE */}
          <div className="flex flex-col items-center">
            <div className="bg-white/10 border border-white/20 p-6 rounded-2xl backdrop-blur-md">
              <img
                src={mainImage || "https://via.placeholder.com/300"}
                className="w-[280px] md:w-[350px] h-[280px] object-contain bg-white rounded-xl hover:scale-105 transition"
                alt="product"
              />
            </div>

            <div className="flex gap-3 mt-4 overflow-x-auto">
              {product.images?.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setMainImage(img)}
                  className={`w-14 h-14 object-cover rounded-lg cursor-pointer border-2 ${
                    mainImage === img
                      ? "border-yellow-400"
                      : "border-transparent"
                  }`}
                  alt="thumb"
                />
              ))}
            </div>
          </div>

          {/* RIGHT DETAILS */}
          <div className="text-center md:text-left">

            <span className="bg-yellow-400 text-black px-4 py-1 rounded-full text-xs font-semibold">
              {product.category}
            </span>

            <h1 className="text-3xl md:text-5xl font-bold mt-4">
              {product.name}
            </h1>

            <p className="text-gray-300 mt-4 text-sm md:text-base">
              {product.description}
            </p>

            <div className="mt-6 text-3xl font-bold text-yellow-400">
              ₹{product.price}
            </div>

            {/* BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">

              {/* ADD TO CART */}
              <button
                onClick={handleAddToCart}
                className="bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold hover:scale-105 transition"
              >
                Add to Cart
              </button>

              {/* BUY NOW */}
              <button
                onClick={handleBuyNow}
                className="bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition"
              >
                Buy Now
              </button>

            </div>

          </div>
        </div>

        {/* ================= PAYMENT MODAL ================= */}
        {showPayment && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70">
            <Payment
              cart={[{ product: product, qty: 1 }]}
              total={product.price}
              text="Pay Now"
              onSuccess={() => {
                toast.success("Payment Successful 🎉");
                window.dispatchEvent(new Event("cartUpdated"));
                setShowPayment(false);
                navigate("/orders");
              }}
            />
          </div>
        )}

      </div>
    </>
  );
};

export default SingleProduct;