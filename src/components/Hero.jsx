import { FiSearch } from "react-icons/fi";
import React from "react";

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white">
      {/* Glow background (premium feel) */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 opacity-20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-blue-500 opacity-20 blur-3xl rounded-full"></div>

      {/* Content */}
      <div className="relative max-w-5xl mx-auto px-6 py-24 flex flex-col items-center text-center">
        {/* Badge */}
        <span className="bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-semibold mb-5">
          Mega Sale - Up to 70% OFF
        </span>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
          Discover & Shop <br />
          <span className="text-yellow-400">Premium Products</span>
        </h1>

        {/* Subtext */}
        <p className="text-gray-300 max-w-2xl mb-8">
          Fashion, electronics, gadgets and lifestyle products — all in one
          place at unbeatable prices.
        </p>

        {/* Search Bar */}
        <div className="flex items-center w-full max-w-lg bg-white/90 backdrop-blur-md border border-gray-200 rounded-full shadow-md hover:shadow-xl transition overflow-hidden focus-within:ring-2 focus-within:ring-yellow-400 mb-8">
          <FiSearch className="text-gray-500 ml-4 text-xl" />

          <input
            type="text"
            placeholder="Search products..."
            className="flex-1 px-4 py-2 text-gray-800 bg-transparent outline-none"
          />

          <button className="bg-black text-white px-6 py-2 m-1 rounded-full hover:bg-gray-900 active:scale-95 transition">
            Search
          </button>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button className="bg-yellow-400 text-black px-6 py-2 rounded-full font-semibold hover:scale-105 transition shadow-md">
            Shop Now
          </button>

          <button className="border border-white px-6 py-2 rounded-full hover:bg-white hover:text-black transition">
            Explore Deals
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
