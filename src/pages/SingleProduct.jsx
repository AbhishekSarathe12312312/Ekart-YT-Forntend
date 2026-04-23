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

  // ================= FETCH PRODUCT =================
  const fetchProduct = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/product/getSingleProduct/${id}`
      );

      const data = res.data.product;
      setProduct(data);

      if (data.images?.length > 0) {
        setMainImage(data.images[0]);
      } else {
        setMainImage(data.image);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load product ❌");
    } finally {
      setLoading(false);
    }
  };

  // ================= ADD TO CART =================
  const handleAddToCart = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/cart/addCart`,
        { productId: id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Added to cart ✅");
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      toast.error("Failed to add to cart ❌");
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

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

        {/* Glow Effects */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 opacity-20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500 opacity-20 blur-3xl rounded-full"></div>

        {/* Content */}
        <div className="relative max-w-6xl mx-auto px-4 py-24 grid md:grid-cols-2 gap-10 items-center">

          {/* LEFT - IMAGE */}
          <div className="flex flex-col items-center">
            <div className="bg-white/10 border border-white/20 p-6 rounded-2xl backdrop-blur-md">
              <img
                src={mainImage || "https://via.placeholder.com/300"}
                className="w-[280px] md:w-[350px] h-[280px] object-contain bg-white rounded-xl hover:scale-105 transition"
                alt="product"
              />
            </div>

            {/* thumbnails */}
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

          {/* RIGHT - DETAILS */}
          <div className="text-center md:text-left">

            {/* category */}
            <span className="bg-yellow-400 text-black px-4 py-1 rounded-full text-xs font-semibold">
              {product.category}
            </span>

            {/* name */}
            <h1 className="text-3xl md:text-5xl font-bold mt-4">
              {product.name}
            </h1>

            {/* description */}
            <p className="text-gray-300 mt-4 text-sm md:text-base leading-relaxed">
              {product.description}
            </p>

            {/* price */}
            <div className="mt-6 text-3xl font-bold text-yellow-400">
              ₹{product.price}
            </div>

            {/* buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold hover:scale-105 transition"
              >
                Add to Cart
              </button>

              {/* Buy Now (Payment Component) */}
              <Payment
                cart={[{ product: product, qty: 1 }]}
                total={product.price}
                text="Buy Now"
                onSuccess={() => {
                  toast.success("Payment Successful 🎉");
                  window.dispatchEvent(new Event("cartUpdated"));
                  navigate("/orders");
                }}
              />

            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default SingleProduct;