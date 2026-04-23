import React from "react";
import { FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Sidebar = ({
  sidebar,
  setSidebar,
  user,
  setShowModal,
  handleLogout,
}) => {
  const navigate = useNavigate();

  const handleNav = (path) => {
    navigate(path);
    setSidebar(false);
  };

  return (
    <>
      {/* Overlay */}
      <div
        onClick={() => setSidebar(false)}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity ${
          sidebar ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-72 sm:w-80 z-50
        bg-gradient-to-b from-zinc-900 via-zinc-950 to-black
        text-white shadow-2xl border-l border-white/10
        transform transition-transform duration-300 ease-in-out
        ${sidebar ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-5 flex flex-col h-full">

          {/* HEADER */}
          <div className="flex justify-between items-center pb-4 border-b border-white/10">
            <h2 className="text-lg font-semibold tracking-wide">
              ⚡ Menu
            </h2>

            <FiX
              onClick={() => setSidebar(false)}
              className="text-2xl cursor-pointer hover:text-red-400 transition"
            />
          </div>

          {/* NAV ITEMS */}
          <div className="flex flex-col gap-2 mt-6">

            <button
              onClick={() => handleNav("/")}
              className="px-4 py-3 rounded-xl text-left hover:bg-white/10 transition flex items-center gap-2"
            >
              🏠 Home
            </button>

            <button
              onClick={() => handleNav("/products")}
              className="px-4 py-3 rounded-xl text-left hover:bg-white/10 transition flex items-center gap-2"
            >
              🛍️ Products
            </button>

            {user && (
              <button
                onClick={() => {
                  setShowModal(true);
                  setSidebar(false);
                }}
                className="px-4 py-3 rounded-xl text-left bg-yellow-400/10 text-yellow-300 hover:bg-yellow-400/20 transition flex items-center gap-2"
              >
                ➕ Add Product
              </button>
            )}

            <button
              onClick={() => handleNav("/cart")}
              className="px-4 py-3 rounded-xl text-left hover:bg-white/10 transition flex items-center gap-2"
            >
              🛒 Cart
            </button>

            <button
              onClick={() => handleNav("/profile")}
              className="px-4 py-3 rounded-xl text-left hover:bg-white/10 transition flex items-center gap-2"
            >
              👤 Profile
            </button>
          </div>

          {/* BOTTOM SECTION */}
          <div className="mt-auto pt-5 border-t border-white/10">

            {user ? (
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
              >
                🚪 Logout
              </button>
            ) : (
              <button
                onClick={() => handleNav("/login")}
                className="w-full px-4 py-3 rounded-xl bg-yellow-400/10 text-yellow-300 hover:bg-yellow-400/20 transition"
              >
                🔑 Login
              </button>
            )}

          </div>

        </div>
      </div>
    </>
  );
};

export default Sidebar;