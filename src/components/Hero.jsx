import { FiSearch } from "react-icons/fi";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔍 SEARCH FUNCTION
  const handleSearch = () => {
    if (!query.trim()) {
      alert("Please enter something to search");
      return;
    }

    setLoading(true);

    // simulate small delay (UX feel)
    setTimeout(() => {
      navigate(`/products?search=${query}`);
      setLoading(false);
    }, 400);
  };

  // ENTER KEY SUPPORT
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-black via-zinc-900 to-gray-950 text-white overflow-hidden min-h-screen">
      {/* 🔥 Glow Effects */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-600 opacity-20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-600 opacity-20 blur-[140px] rounded-full"></div>

      {/* CONTENT */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-24 flex flex-col items-center text-center">
        {/* BADGE */}
        <span className="bg-yellow-400/90 text-black px-4 py-1 rounded-full text-xs sm:text-sm font-semibold mb-6 shadow">
          🚀 Mega Sale - Up to 70% OFF
        </span>

        {/* HEADING */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-4 tracking-tight">
          Discover & Shop <br />
          <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Premium Products
          </span>
        </h1>

        {/* SUBTEXT */}
        <p className="text-gray-400 text-sm sm:text-base max-w-2xl mb-10">
          Explore fashion, electronics, gadgets and lifestyle essentials —
          curated for you with the best deals.
        </p>

        {/* 🔍 SEARCH BAR */}
        <div className="w-full max-w-xl sm:max-w-2xl mx-auto mb-8">
          <div
            className="flex items-center bg-white/10 backdrop-blur-xl border border-white/10 
  rounded-full shadow-md sm:shadow-lg hover:shadow-2xl transition overflow-hidden 
  focus-within:ring-2 focus-within:ring-yellow-400"
          >
            {/* ICON */}
            <FiSearch className="text-gray-400 ml-3 sm:ml-4 text-lg sm:text-xl" />

            {/* INPUT */}
            <input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-2 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-base text-white bg-transparent outline-none placeholder:text-gray-400"
            />

            {/* BUTTON */}
            <button
              onClick={handleSearch}
              disabled={loading}
              className={`flex items-center gap-1 sm:gap-2 px-6 sm:px-6 py-3 sm:py-2.5 m-1 rounded-full 
      text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap
      ${
        loading
          ? "bg-yellow-300 text-black cursor-not-allowed"
          : "bg-yellow-400 text-black hover:scale-105 hover:shadow-lg active:scale-95"
      }`}
            >
              <FiSearch className="text-sm sm:text-base font-bold" />
              <span className="hidden sm:inline">
                {loading ? "Searching..." : "Search"}
              </span>
            </button>
          </div>
        </div>

        {/* CTA BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            className="bg-yellow-400 text-black px-6 py-2.5 rounded-full font-semibold text-sm sm:text-base hover:scale-105 transition shadow-lg"
            onClick={() => navigate("/products")}
          >
            Shop Now
          </button>

          <button
            className="border border-white/20 px-6 py-2.5 rounded-full text-sm sm:text-base hover:bg-white hover:text-black transition"
            onClick={() => navigate("/deals")}
          >
            Explore Deals
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
