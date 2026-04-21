import React from "react";
import { FaFacebook, FaYoutube, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">

      <div className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Brand */}
        <div>
          <h1 className="text-2xl font-bold mb-3">ShopifyX</h1>
          <p className="text-gray-400 text-sm">
            Your one-stop destination for fashion, gadgets and lifestyle products.
          </p>
        </div>

        {/* Links */}
        <div>
          <h2 className="font-semibold mb-3">Quick Links</h2>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="hover:text-white cursor-pointer">Home</li>
            <li className="hover:text-white cursor-pointer">Shop</li>
            <li className="hover:text-white cursor-pointer">Categories</li>
            <li className="hover:text-white cursor-pointer">Contact</li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h2 className="font-semibold mb-3">Support</h2>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="hover:text-white cursor-pointer">Help Center</li>
            <li className="hover:text-white cursor-pointer">Shipping Info</li>
            <li className="hover:text-white cursor-pointer">Returns</li>
            <li className="hover:text-white cursor-pointer">Privacy Policy</li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h2 className="font-semibold mb-3">Follow Us</h2>

          <div className="flex gap-5 mt-3 text-2xl">

            <FaFacebook className="hover:text-blue-500 cursor-pointer transition" />
            <FaYoutube className="hover:text-red-500 cursor-pointer transition" />
            <FaInstagram className="hover:text-pink-500 cursor-pointer transition" />

          </div>
        </div>

      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 py-4 text-center text-gray-400 text-sm">
        © 2026 ShopifyX. Made with ❤️ for ecommerce
      </div>

    </footer>
  );
};

export default Footer;