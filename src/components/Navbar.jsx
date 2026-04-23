import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiShoppingCart, FiUser, FiMenu, FiX } from "react-icons/fi";
import Sidebar from "./Sidebar";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [userPhoto, setUserPhoto] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [sidebar, setSidebar] = useState(false);

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    images: [],
  });

  const [form, setForm] = useState({
    profileImage: null,
  });

  const navigate = useNavigate();

  // ================= CART =================
  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return setCartCount(0);

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/cart/getCart`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const items = res.data?.items || res.data?.cart?.items || [];

      const totalQty = Array.isArray(items)
        ? items.reduce(
            (sum, item) => sum + Number(item?.qty || item?.quantity || 0),
            0,
          )
        : 0;

      setCartCount(totalQty);
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser) {
      setUser(storedUser.firstName || "User");
      setUserPhoto(storedUser.profilePic || storedUser.avatar || "");
    }

    const fetchUser = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        const userId = storedUser?._id || storedUser?.id;

        if (!userId) return toast.error("Invalid user id");

        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/user/${userId}`,
        );

        setUser(res.data.user);

        setForm({
          profileImage: null,
        });
      } catch {
        toast.error("Failed to fetch user");
      }
    };

    fetchUser();
    fetchCart();
  }, []);

  // ================= HANDLERS =================
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setProduct({ ...product, images: Array.from(e.target.files) });
  };

  const handleAddProduct = async () => {
    try {
      const formData = new FormData();

      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("price", Number(product.price));
      formData.append("category", product.category);
      formData.append("stock", Number(product.stock));

      product.images.forEach((file) => formData.append("images", file));

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/product/add`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      alert("Product added successfully");
      setShowModal(false);

      setProduct({
        name: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        images: [],
      });

      navigate("/products");
    } catch (error) {
      alert(error.response?.data?.message || "Error adding product");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setUserPhoto("");
    setCartCount(0);
    setSidebar(false);
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav
        className="fixed top-0 left-0 w-full z-50 
      bg-gradient-to-r from-zinc-900/80 via-zinc-900/70 to-zinc-900/80 
      backdrop-blur-2xl border-b border-white/10 
      shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-8 py-4 text-white">
          {/* LOGO */}
          <h1
            onClick={() => navigate("/")}
            className="text-2xl sm:text-3xl font-extrabold cursor-pointer tracking-wide"
          >
            Shopify<span className="text-yellow-400">X</span>
          </h1>

          {/* MENU */}
          <ul className="hidden md:flex gap-8 text-base text-gray-300 font-medium">
            <li
              onClick={() => navigate("/")}
              className="cursor-pointer hover:text-yellow-400 transition"
            >
              Home
            </li>
            <li
              onClick={() => navigate("/products")}
              className="cursor-pointer hover:text-yellow-400 transition"
            >
              Products
            </li>
          </ul>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-5 sm:gap-6">
            {/* ADD BUTTON */}
            {user && (
              <button
                onClick={() => setShowModal(true)}
                className="hidden md:block bg-yellow-400 text-black px-5 py-2 rounded-full text-sm font-semibold hover:scale-105 transition shadow-md"
              >
                + Add Product
              </button>
            )}

            {/* CART */}
            <div
              onClick={() => navigate("/cart")}
              className="relative cursor-pointer group"
            >
              <FiShoppingCart className="text-2xl group-hover:text-yellow-400 transition" />

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[11px] min-w-[20px] h-[20px] px-1 flex items-center justify-center rounded-full font-bold shadow">
                  {cartCount}
                </span>
              )}
            </div>

            {/* USER */}
            <div
              onClick={() => navigate("/profile")}
              className="w-10 h-10 rounded-full overflow-hidden bg-white/10 flex items-center justify-center cursor-pointer border border-white/10"
            >
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <FiUser className="text-lg" />
              )}
            </div>

            {/* LOGIN / LOGOUT */}
            {user ? (
              <button
                onClick={handleLogout}
                className="hidden cursor-pointer md:block bg-white text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-gray-200 transition"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="hidden md:block bg-yellow-400 text-black px-6 py-2 rounded-full text-sm font-bold hover:scale-105 transition"
              >
                Login
              </button>
            )}

            {/* MOBILE MENU */}
            <button
              className="md:hidden text-3xl"
              onClick={() => setSidebar(true)}
            >
              <FiMenu />
            </button>
          </div>
        </div>
      </nav>

      {/* ================= SIDEBAR ================= */}
      <Sidebar
        sidebar={sidebar}
        setSidebar={setSidebar}
        user={user}
        setShowModal={setShowModal}
        handleLogout={handleLogout}
      />

      {/* ================= MODAL ================= */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4"
          onClick={() => setShowModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl p-7 bg-zinc-900 border border-white/10 text-white shadow-2xl animate-scaleIn"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Add Product</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/60 hover:text-red-400 text-xl"
              >
                ✕
              </button>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              {["name", "description", "price", "category", "stock"].map(
                (f) => (
                  <input
                    key={f}
                    name={f}
                    value={product[f]}
                    onChange={handleChange}
                    placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-white/10 text-sm outline-none focus:border-yellow-400 transition"
                  />
                ),
              )}

              {/* File Upload */}
              <div className="border border-dashed border-white/20 rounded-xl p-4 text-center bg-zinc-800/50">
                <input
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  className="text-xs text-white/70"
                />
                <p className="text-[12px] text-white/40 mt-2">
                  Upload product images
                </p>
              </div>
            </div>

            {/* Button */}
            <button
              onClick={handleAddProduct}
              className="w-full mt-6 bg-yellow-400 text-black py-3 rounded-xl font-semibold text-sm hover:scale-[1.02] active:scale-95 transition"
            >
              Save Product
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
