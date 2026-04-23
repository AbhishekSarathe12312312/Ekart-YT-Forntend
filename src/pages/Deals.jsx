import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const Deals = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [category, setCategory] = useState("All");
  const navigate = useNavigate();

  // ================= FETCH PRODUCTS =================
  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/product/getAllProducts`,
      );
      setProducts(res.data.products || []);
      setFiltered(res.data.products || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ================= FILTER =================
  useEffect(() => {
    if (category === "All") {
      setFiltered(products);
    } else {
      setFiltered(products.filter((p) => p.category === category));
    }
  }, [category, products]);

  // ================= DISCOUNT LOGIC =================
  const getDiscount = (price) => {
    const discount = Math.floor(Math.random() * 40) + 10; // 10-50%
    const newPrice = Math.floor(price - (price * discount) / 100);
    return { discount, newPrice };
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white px-4 sm:px-6 pt-24">
        {/* 🔥 HERO */}
        <div className="relative rounded-3xl overflow-hidden p-6 sm:p-10 mb-12 shadow-2xl border border-white/10 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-sm"></div>

          <div className="relative z-10">
            <h1 className="text-3xl sm:text-5xl font-extrabold text-black tracking-tight">
              Mega Deals Festival
            </h1>

            <p className="text-black/80 mt-3 text-sm sm:text-base max-w-xl">
              Grab the best offers before they disappear. Limited time deals
              with massive discounts.
            </p>

            <button
              onClick={() => navigate("/products")}
              className="mt-6 bg-black text-white px-6 py-2.5 rounded-full text-sm hover:scale-105 transition shadow-lg"
            >
              Shop Now
            </button>
          </div>
        </div>

        {/* 🏷 FILTER */}
        <div className="flex flex-wrap gap-3 mb-10 justify-center sm:justify-start">
          {["All", "Electronics", "Fashion", "Clothing"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200
            ${
              category === cat
                ? "bg-yellow-400 text-black shadow-md scale-105"
                : "bg-white/5 border border-white/10 hover:bg-white/10"
            }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ⚡ TITLE */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-wide">
            Flash Deals
          </h2>

          <span className="text-sm text-gray-400">Limited stock ⚡</span>
        </div>

        {/* 🛍 GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((product) => {
            const { discount, newPrice } = getDiscount(product.price);
            const img =
              product.images?.[0] || "https://via.placeholder.com/300";

            return (
              <div
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
                className="group relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-lg hover:scale-[1.03] transition-all duration-300 cursor-pointer"
              >
                {/* IMAGE */}
                <div className="relative bg-white p-4">
                  <img
                    src={img}
                    className="w-full h-36 sm:h-44 object-contain transition-transform duration-300 group-hover:scale-110"
                    alt="product"
                  />

                  {/* BADGE */}
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full shadow">
                    {discount}% OFF
                  </span>
                </div>

                {/* CONTENT */}
                <div className="p-4">
                  <h3 className="text-sm sm:text-base font-semibold line-clamp-2 group-hover:text-yellow-400 transition">
                    {product.name}
                  </h3>

                  <p className="text-xs text-gray-400 mt-1">
                    {product.category}
                  </p>

                  {/* PRICE */}
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-yellow-400 font-bold text-lg">
                      ₹{newPrice}
                    </span>

                    <span className="text-gray-500 line-through text-xs">
                      ₹{product.price}
                    </span>
                  </div>

                  {/* BUTTON */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/product/${product._id}`);
                    }}
                    className="mt-4 w-full py-2 rounded-full text-xs sm:text-sm font-medium bg-gradient-to-r from-yellow-400 to-orange-400 text-black hover:opacity-90 transition"
                  >
                    View Deal
                  </button>
                </div>

                {/* HOVER GLOW */}
                <div className="absolute inset-0 bg-yellow-400/5 opacity-0 group-hover:opacity-100 transition pointer-events-none"></div>
              </div>
            );
          })}
        </div>

        {/* EMPTY */}
        {filtered.length === 0 && (
          <div className="text-center text-gray-400 mt-12 text-lg">
            No deals found
          </div>
        )}

        {/* EXTRA */}
        <div className="mt-20 text-center bg-gradient-to-r from-zinc-800 to-zinc-900 border border-white/10 rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-3">More Deals Coming Soon 🚀</h2>

          <p className="text-gray-400 text-sm mb-6">
            Stay tuned for upcoming flash sales and exclusive discounts.
          </p>

          <button
            onClick={() => navigate("/products")}
            className="bg-yellow-400 text-black px-6 py-2.5 rounded-full hover:scale-105 transition"
          >
            Browse Products
          </button>
        </div>
      </div>
    </>
  );
};

export default Deals;
