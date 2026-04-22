import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

const SingleProduct = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");

  const fetchProduct = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/product/getSingleProduct/${id}`
      );

      const data = res.data.product;
      setProduct(data);

      if (data.images && data.images.length > 0) {
        setMainImage(data.images[0]);
      } else if (data.image) {
        setMainImage(data.image);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="pt-28 flex justify-center text-white bg-black min-h-screen">
          Loading...
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="pt-28 text-center text-red-400 bg-black min-h-screen">
          Product not found ❌
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="pt-20 sm:pt-28 min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white">

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">

          {/* ================= IMAGE SECTION ================= */}
          <div className="flex flex-col sm:flex-row gap-4">

            {/* THUMBNAILS */}
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0">

              {product.images?.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  onClick={() => setMainImage(img)}
                  className={`w-16 h-16 sm:w-14 sm:h-14 md:w-16 md:h-16 flex-shrink-0 object-cover rounded-lg cursor-pointer border-2 transition ${
                    mainImage === img
                      ? "border-yellow-400"
                      : "border-transparent"
                  }`}
                  alt="thumb"
                />
              ))}

            </div>

            {/* MAIN IMAGE */}
            <div className="flex-1 flex justify-center items-center">

              <div className="bg-white/10 p-4 sm:p-6 rounded-2xl border border-white/20 w-full flex justify-center">

                <img
                  src={mainImage}
                  className="w-[220px] sm:w-[280px] md:w-[320px] lg:w-[350px] h-[220px] sm:h-[280px] md:h-[320px] object-cover rounded-xl transition duration-300 hover:scale-105"
                  alt="product"
                />

              </div>

            </div>

          </div>

          {/* ================= DETAILS ================= */}
          <div className="flex flex-col gap-4 sm:gap-5">

            <span className="bg-yellow-400 text-black px-3 py-1 text-xs rounded-full w-fit font-semibold">
              {product.category}
            </span>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
              {product.name}
            </h1>

            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center gap-4">
              <span className="text-2xl sm:text-3xl text-yellow-400 font-bold">
                ₹{product.price}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              className="bg-yellow-400 text-black px-5 py-2 sm:px-6 sm:py-3 rounded-full font-semibold hover:scale-105 transition w-full sm:w-fit"
            >
              Add to Cart
            </button>

          </div>

        </div>
      </div>
    </>
  );
};

export default SingleProduct;