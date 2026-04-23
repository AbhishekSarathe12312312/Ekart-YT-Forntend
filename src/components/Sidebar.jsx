import React from "react";
import { FiX } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";

const Sidebar = ({ sidebar, setSidebar, user, setShowModal, handleLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (path) => {
    navigate(path);
    setSidebar(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* ================= OVERLAY ================= */}
      <div
        onClick={() => setSidebar(false)}
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-300 ${
          sidebar ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* ================= SIDEBAR ================= */}
      <div
        className={`fixed top-0 right-0 h-full w-72 sm:w-80 z-50
        bg-zinc-950 text-white shadow-2xl border-l border-white/10
        transform transition-transform duration-300 ease-in-out
        ${sidebar ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col h-full p-5">

          {/* HEADER */}
          <div className="flex justify-between items-center pb-4 border-b border-white/10">
            <h2 className="text-xl font-semibold tracking-wide">Menu</h2>

            <FiX
              onClick={() => setSidebar(false)}
              className="text-2xl cursor-pointer hover:text-red-400 transition"
            />
          </div>

          {/* ================= USER SECTION ================= */}
          {user && (
            <div className="flex items-center gap-3 mt-5 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition">

              {/* PROFILE IMAGE */}
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 flex items-center justify-center border border-white/10">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-bold text-yellow-400">
                    {user?.firstName?.charAt(0)}
                  </span>
                )}
              </div>

              {/* USER INFO */}
              <div className="flex flex-col">
                <p className="text-sm font-medium">{user.firstName}</p>
                <p className="text-xs text-gray-400 truncate max-w-[160px]">
                  {user.email}
                </p>
              </div>
            </div>
          )}

          {/* ================= NAV ITEMS ================= */}
          <div className="flex flex-col gap-2 mt-6">
            {[
              { name: "Home", path: "/" },
              { name: "Products", path: "/products" },
              { name: "Cart", path: "/cart" },
              { name: "Profile", path: "/profile" },
            ].map((item, i) => (
              <button
                key={i}
                onClick={() => handleNav(item.path)}
                className={`w-full text-left px-4 py-3 rounded-xl transition flex items-center justify-between group
                ${
                  isActive(item.path)
                    ? "bg-yellow-400/20 text-yellow-300"
                    : "hover:bg-white/10"
                }`}
              >
                <span className="text-sm">{item.name}</span>
                <span className="text-gray-500 group-hover:text-white transition">
                  →
                </span>
              </button>
            ))}

            {/* ADD PRODUCT */}
            {user && (
              <button
                onClick={() => {
                  setShowModal(true);
                  setSidebar(false);
                }}
                className="mt-2 px-4 py-3 rounded-xl bg-yellow-400/10 text-yellow-300 hover:bg-yellow-400/20 transition text-left"
              >
                + Add Product
              </button>
            )}
          </div>

          {/* ================= FOOTER ================= */}
          <div className="mt-auto pt-5 border-t border-white/10">
            {user ? (
              <button
                onClick={() => {
                  handleLogout();
                  setSidebar(false);
                  navigate("/");
                }}
                className="w-full px-4 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => handleNav("/login")}
                className="w-full px-4 py-3 rounded-xl bg-yellow-400/10 text-yellow-300 hover:bg-yellow-400/20 transition"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;