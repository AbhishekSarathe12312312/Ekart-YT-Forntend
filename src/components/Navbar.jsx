import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiShoppingCart, FiUser, FiMenu } from "react-icons/fi";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";

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

  const navigate = useNavigate();

  // ================= CART =================
  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) return setCartCount(0);

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/cart/getCart`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
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
    const handleCartUpdate = () => {
      fetchCart();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
    };
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser) {
      setUser(storedUser);
      setUserPhoto(storedUser.profileImage || storedUser.avatar || "");
    }

    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      const userId = storedUser?._id || storedUser?.id;
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setUser(res.data.user);
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
      const token = localStorage.getItem("token");

      // 🔥 AUTH CHECK
      if (!token) {
        toast.error("Login first");
        return;
      }

      // 🔥 BASIC VALIDATION (safe guard)
      if (!product.name || !product.price) {
        toast.error("Name and Price are required");
        return;
      }

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
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success("Product added successfully 🎉");

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
      toast.error(error.response?.data?.message || "Error adding product ❌");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setUserPhoto("");
    setCartCount(0);
    setSidebar(false);
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-zinc-900/80 via-zinc-900/70 to-zinc-900/80 backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-5 sm:px-8 py-4 text-white">
          <h1
            onClick={() => navigate("/")}
            className="text-2xl sm:text-3xl font-extrabold cursor-pointer"
          >
            Shopify<span className="text-yellow-400">X</span>
          </h1>

          <ul className="hidden md:flex gap-8 text-gray-300">
            <li
              onClick={() => navigate("/")}
              className="cursor-pointer hover:text-yellow-400"
            >
              Home
            </li>
            <li
              onClick={() => {
                navigate("/products");
              }}
              className="cursor-pointer hover:text-yellow-400"
            >
              Products
            </li>
          </ul>

          <div className="flex items-center gap-5">
            {user && (
              <button
                onClick={() => setShowModal(true)}
                className="hidden md:block bg-yellow-400 text-black px-5 py-2 rounded-full"
              >
                + Add Product
              </button>
            )}

            <div
              onClick={() => {
                if (!user) {
                  navigate("/login");
                  toast.error("Login first then see cart");
                  return;
                }
                navigate("/cart");
              }}
              className="relative cursor-pointer"
            >
              <FiShoppingCart className="text-2xl" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
                  {cartCount}
                </span>
              )}
            </div>

            <div
              onClick={() => {
                if (!user) {
                  toast.error("Login first then see profile");
                  return;
                }
                navigate("/profile");
              }}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center cursor-pointer overflow-hidden"
            >
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  className="w-full h-full object-cover"
                />
              ) : (
                <FiUser />
              )}
            </div>

            {user ? (
              <button
                onClick={handleLogout}
                className="cursor-pointer hidden md:block bg-white text-black px-4 py-2 rounded-full"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="cursor-pointer hidden md:block bg-yellow-400 text-black px-4 py-2 rounded-full"
              >
                Login
              </button>
            )}

            <button
              className="md:hidden text-2xl"
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
      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative z-[10000] bg-zinc-900 p-6 rounded-xl w-full max-w-lg text-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Add Product</h2>

              <button
                onClick={() => setShowModal(false)}
                className="text-white/70 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            {/* Inputs */}
            {["name", "description", "price", "category", "stock"].map((f) => (
              <input
                key={f}
                name={f}
                value={product[f]}
                onChange={handleChange}
                placeholder={f}
                className="w-full p-2 mb-3 bg-zinc-800 rounded outline-none focus:ring-2 focus:ring-yellow-400"
              />
            ))}

            {/* File Upload */}
            <input
              type="file"
              multiple
              onChange={handleImageChange}
              className="mb-4 w-full text-sm"
            />

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="w-1/2 bg-zinc-700 py-2 rounded hover:bg-zinc-600"
              >
                Cancel
              </button>

              <button
                onClick={handleAddProduct}
                className="w-1/2 bg-yellow-400 text-black py-2 rounded hover:bg-yellow-300"
              >
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
