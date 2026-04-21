import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiShoppingCart, FiUser, FiSearch } from "react-icons/fi";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    images: [],
  });

  const navigate = useNavigate();

  // ================= FETCH CART =================
  const fetchCart = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/cart/getCart`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const items = res.data?.items || res.data?.cart?.items || [];

      if (!Array.isArray(items)) {
        setCartCount(0);
        return;
      }

      const totalQty = items.reduce((sum, item) => {
        return sum + (item?.qty || 0);
      }, 0);

      setCartCount(totalQty);
    } catch (error) {
      setCartCount(0);
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser.firstName || "User");

    fetchCart();

    const updateCart = () => fetchCart();
    window.addEventListener("cartUpdated", updateCart);

    return () => window.removeEventListener("cartUpdated", updateCart);
  }, []);

  // ================= INPUT =================
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setProduct({
      ...product,
      images: Array.from(e.target.files),
    });
  };

  // ================= ADD PRODUCT =================
  const handleAddProduct = async () => {
    try {
      const formData = new FormData();

      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("price", Number(product.price));
      formData.append("category", product.category);
      formData.append("stock", Number(product.stock));

      product.images.forEach((file) => {
        formData.append("images", file);
      });

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/product/add`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert(res.data.message);

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

  // ================= LOGOUT =================
  const handleLogout = async () => {
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/user/logout`);

    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setUser(null);
    setCartCount(0);

    navigate("/login");
  };

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 text-white">

          <h1
            onClick={() => navigate("/")}
            className="text-2xl font-extrabold cursor-pointer"
          >
            Shopify<span className="text-yellow-400">X</span>
          </h1>

          <ul className="hidden md:flex gap-8 text-gray-200">
            <li onClick={() => navigate("/home")} className="cursor-pointer hover:text-yellow-400">Home</li>
            <li onClick={() => navigate("/products")} className="cursor-pointer hover:text-yellow-400">Products</li>
          </ul>

          <div className="flex items-center gap-5">

            <button
              onClick={() => setShowModal(true)}
              className="bg-yellow-400 text-black px-4 py-2 rounded-full font-semibold hover:scale-105 transition"
            >
              + Add
            </button>

            {/* CART */}
            <div
              onClick={() => navigate("/cart")}
              className="relative cursor-pointer"
            >
              <FiShoppingCart className="text-xl" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </div>

            <FiUser
              onClick={() => navigate("/profile")}
              className="text-xl cursor-pointer"
            />

            <button
              onClick={handleLogout}
              className="bg-white text-black px-4 py-2 rounded-full"
            >
              Logout
            </button>

          </div>
        </div>
      </nav>

      {/* ================= PREMIUM MODAL ================= */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
          onClick={() => setShowModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-[420px] max-w-[95%] rounded-3xl p-6
            bg-white/10 backdrop-blur-2xl border border-white/20
            shadow-[0_0_40px_rgba(0,0,0,0.6)] text-white"
          >
            {/* Glow */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-purple-500/30 blur-3xl rounded-full"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-yellow-400/20 blur-3xl rounded-full"></div>

            {/* Title */}
            <h2 className="text-2xl font-bold mb-5 text-center">
              ✨ Add <span className="text-yellow-400">Premium Product</span>
            </h2>

            {/* Inputs */}
            <div className="space-y-3">
              {["name", "description", "price", "category", "stock"].map((field) => (
                <input
                  key={field}
                  name={field}
                  placeholder={field.toUpperCase()}
                  value={product[field]}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl bg-white/10 border border-white/20
                  placeholder-gray-300 text-white outline-none
                  focus:ring-2 focus:ring-yellow-400"
                />
              ))}

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-3 rounded-xl bg-white/10 border border-white/20"
              />
            </div>

            {/* Preview */}
            {product.images.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {product.images.map((img, i) => (
                  <img
                    key={i}
                    src={URL.createObjectURL(img)}
                    className="w-16 h-16 object-cover rounded-xl border border-white/20"
                  />
                ))}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddProduct}
                className="w-full py-2 rounded-xl font-semibold
                bg-gradient-to-r from-yellow-400 to-orange-500 text-black
                hover:scale-105 transition"
              >
                🚀 Save Product
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="w-full py-2 rounded-xl border border-white/30
                hover:bg-white hover:text-black transition"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;