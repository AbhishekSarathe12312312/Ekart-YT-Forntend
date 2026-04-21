import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const SingleProduct = () => {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ MAIN IMAGE STATE
  const [mainImage, setMainImage] = useState("");

  // ================= FETCH PRODUCT =================
  const fetchProduct = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/product/getSingleProduct/${id}`
      );

      const data = res.data.product;

      setProduct(data);

      // ✅ FIRST IMAGE AS DEFAULT (ImageKit URL)
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

      alert("Added to cart ✅");
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      alert("Error ❌");
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

      <div className="pt-28 min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white">

        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10">

          {/* ================= IMAGE GALLERY ================= */}
          <div className="flex gap-4">

            {/* THUMBNAILS */}
            <div className="flex flex-col gap-3">

              {product.images?.map((img, i) => (
                <img
                  key={i}
                  src={img}   // ✅ direct URL
                  onClick={() => setMainImage(img)}
                  className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 ${
                    mainImage === img
                      ? "border-yellow-400"
                      : "border-transparent"
                  }`}
                  alt="thumb"
                />
              ))}

            </div>

            {/* MAIN IMAGE */}
            <div className="flex-1 flex justify-center">

              <div className="bg-white/10 p-4 rounded-2xl border border-white/20">

                <img
                  src={mainImage}   // ✅ direct URL
                  className="w-[300px] h-[300px] object-cover rounded-xl transition duration-300 hover:scale-105"
                  alt="product"
                />

              </div>

            </div>

          </div>

          {/* ================= DETAILS ================= */}
          <div className="flex flex-col gap-5">

            <span className="bg-yellow-400 text-black px-3 py-1 text-xs rounded-full w-fit font-semibold">
              {product.category}
            </span>

            <h1 className="text-3xl font-bold">
              {product.name}
            </h1>

            <p className="text-gray-300 text-sm">
              {product.description}
            </p>

            <div className="flex gap-4 items-center">
              <span className="text-3xl text-yellow-400 font-bold">
                ₹{product.price}
              </span>
            </div>

            <button
              onClick={handleAddToCart}
              className="bg-yellow-400 text-black px-6 py-2 rounded-full font-semibold hover:scale-105 transition"
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