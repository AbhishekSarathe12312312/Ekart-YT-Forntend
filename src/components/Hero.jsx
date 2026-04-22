import { FiSearch } from "react-icons/fi";
import React from "react";

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white overflow-x-hidden">

      {/* Glow background */}
      <div className="absolute top-10 left-5 sm:left-10 w-40 sm:w-72 h-40 sm:h-72 bg-purple-500 opacity-20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-10 right-5 sm:right-10 w-48 sm:w-80 h-48 sm:h-80 bg-blue-500 opacity-20 blur-3xl rounded-full"></div>

      {/* CONTENT */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 flex flex-col items-center text-center">

        {/* BADGE */}
        <span className="bg-yellow-400 text-black px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-5">
          Mega Sale - Up to 70% OFF
        </span>

        {/* HEADING */}
        <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold leading-tight mb-3 sm:mb-4">
          Discover & Shop <br />
          <span className="text-yellow-400">Premium Products</span>
        </h1>

        {/* SUBTEXT */}
        <p className="text-gray-300 text-xs sm:text-sm md:text-base max-w-xl sm:max-w-2xl mb-6 sm:mb-8">
          Fashion, electronics, gadgets and lifestyle products — all in one place at unbeatable prices.
        </p>

        {/* SEARCH BAR */}
        <div className="flex items-center w-full max-w-md sm:max-w-lg bg-white/90 backdrop-blur-md border border-gray-200 rounded-full shadow-md hover:shadow-xl transition overflow-hidden focus-within:ring-2 focus-within:ring-yellow-400 mb-6 sm:mb-8">

          <FiSearch className="text-gray-500 ml-3 sm:ml-4 text-lg sm:text-xl" />

          <input
            type="text"
            placeholder="Search products..."
            className="flex-1 px-2 sm:px-4 py-2 text-sm sm:text-base text-gray-800 bg-transparent outline-none"
          />

          <button className="bg-black text-white px-4 sm:px-6 py-2 m-1 rounded-full text-xs sm:text-sm hover:bg-gray-900 active:scale-95 transition">
            Search
          </button>

        </div>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">

          <button className="bg-yellow-400 text-black px-5 sm:px-6 py-2 rounded-full font-semibold text-sm sm:text-base hover:scale-105 transition shadow-md">
            Shop Now
          </button>

          <button className="border border-white px-5 sm:px-6 py-2 rounded-full text-sm sm:text-base hover:bg-white hover:text-black transition">
            Explore Deals
          </button>

        </div>

      </div>
    </div>
  );
};

export default Hero;