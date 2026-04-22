import React from "react";
import { FaFacebook, FaYoutube, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-white">

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 sm:py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

        {/* BRAND */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold mb-2">
            Shopify<span className="text-yellow-400">X</span>
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
            One-stop destination for fashion, gadgets and lifestyle products.
          </p>
        </div>

        {/* LINKS */}
        <div>
          <h2 className="text-sm sm:text-base font-semibold mb-3">
            Quick Links
          </h2>

          <ul className="space-y-2 text-gray-400 text-xs sm:text-sm">
            <li className="hover:text-white cursor-pointer">Home</li>
            <li className="hover:text-white cursor-pointer">Shop</li>
            <li className="hover:text-white cursor-pointer">Categories</li>
            <li className="hover:text-white cursor-pointer">Offers</li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h2 className="text-sm sm:text-base font-semibold mb-3">
            Support
          </h2>

          <ul className="space-y-2 text-gray-400 text-xs sm:text-sm">
            <li className="hover:text-white cursor-pointer">Help Center</li>
            <li className="hover:text-white cursor-pointer">Shipping Info</li>
            <li className="hover:text-white cursor-pointer">Returns</li>
            <li className="hover:text-white cursor-pointer">Privacy Policy</li>
          </ul>
        </div>

        {/* SOCIAL */}
        <div>
          <h2 className="text-sm sm:text-base font-semibold mb-3">
            Follow Us
          </h2>

          <div className="flex gap-4 text-xl sm:text-2xl text-gray-300">
            <FaFacebook className="hover:text-blue-500 cursor-pointer transition" />
            <FaYoutube className="hover:text-red-500 cursor-pointer transition" />
            <FaInstagram className="hover:text-pink-500 cursor-pointer transition" />
          </div>
        </div>

      </div>

      {/* BOTTOM */}
      <div className="border-t border-gray-800">

        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between text-gray-500 text-xs sm:text-sm gap-2">

          <p>© 2026 ShopifyX. All rights reserved.</p>

          <p className="text-center sm:text-right">
            Made with <span className="text-red-500">❤️</span> for ecommerce
          </p>

        </div>

      </div>

    </footer>
  );
};

export default Footer;