import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiShoppingCart, FiUser, FiMenu, FiX } from "react-icons/fi";

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
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const items = res.data?.items || res.data?.cart?.items || [];

      const totalQty = Array.isArray(items)
        ? items.reduce(
            (sum, item) => sum + (Number(item?.qty || item?.quantity || 0)),
            0
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

      product.images.forEach((file) =>
        formData.append("images", file)
      );

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/product/add`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
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
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg">

        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 text-white">

          {/* LOGO */}
          <h1
            onClick={() => navigate("/")}
            className="text-2xl font-extrabold cursor-pointer"
          >
            Shopify<span className="text-yellow-400">X</span>
          </h1>

          {/* MENU */}
          <ul className="hidden md:flex gap-8 text-gray-200">
            <li onClick={() => navigate("/home")} className="cursor-pointer hover:text-yellow-400">
              Home
            </li>
            <li onClick={() => navigate("/products")} className="cursor-pointer hover:text-yellow-400">
              Products
            </li>
          </ul>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-5">

            {/* ADD BUTTON */}
            {user && (
              <button
                onClick={() => setShowModal(true)}
                className="hidden md:block bg-yellow-400 text-black px-4 py-2 rounded-full font-semibold hover:scale-105 transition"
              >
                + Add
              </button>
            )}

            {/* CART */}
            <div
              onClick={() => navigate("/cart")}
              className="relative cursor-pointer"
            >
              <FiShoppingCart className="text-xl hover:text-yellow-400" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </div>

            {/* USER */}
            <div
              onClick={() => navigate("/profile")}
              className="w-9 h-9 rounded-full overflow-hidden bg-white/20 flex items-center justify-center cursor-pointer"
            >
              {userPhoto ? (
                <img src={userPhoto} className="w-full h-full object-cover" />
              ) : (
                <FiUser />
              )}
            </div>

            {/* LOGIN / LOGOUT */}
            {user ? (
              <button
                onClick={handleLogout}
                className="hidden md:block bg-white text-black px-4 py-2 rounded-full text-sm font-semibold"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="hidden md:block bg-yellow-400 text-black px-6 py-2 rounded-full font-bold"
              >
                Login
              </button>
            )}

            {/* MOBILE MENU */}
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
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-black/90 backdrop-blur-xl z-50 transition-transform duration-300 ${
          sidebar ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 text-white">

          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold">Menu</h2>
            <FiX onClick={() => setSidebar(false)} className="text-2xl cursor-pointer" />
          </div>

          <div className="space-y-4">

            <p onClick={() => { navigate("/"); setSidebar(false); }} className="cursor-pointer">🏠 Home</p>
            <p onClick={() => { navigate("/products"); setSidebar(false); }} className="cursor-pointer">🛍️ Products</p>

            {user && (
              <p onClick={() => { setShowModal(true); setSidebar(false); }} className="cursor-pointer text-yellow-400">
                ➕ Add Product
              </p>
            )}

            <p onClick={() => { navigate("/cart"); setSidebar(false); }} className="cursor-pointer">🛒 Cart</p>
            <p onClick={() => { navigate("/profile"); setSidebar(false); }} className="cursor-pointer">👤 Profile</p>

            {user ? (
              <p onClick={handleLogout} className="cursor-pointer text-red-400">🚪 Logout</p>
            ) : (
              <p onClick={() => navigate("/login")} className="cursor-pointer text-yellow-400">🔑 Login</p>
            )}

          </div>
        </div>
      </div>

      {/* ================= SMALL MODAL ================= */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
          onClick={() => setShowModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-[340px] sm:w-[380px] max-w-[92%] rounded-xl p-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white"
          >
            <h2 className="text-lg font-bold mb-3 text-center">
              Add Product
            </h2>

            <div className="space-y-2">
              {["name", "description", "price", "category", "stock"].map((f) => (
                <input
                  key={f}
                  name={f}
                  value={product[f]}
                  onChange={handleChange}
                  placeholder={f.toUpperCase()}
                  className="w-full p-2.5 rounded-lg bg-white/10 border border-white/20 text-sm outline-none"
                />
              ))}

              <input
                type="file"
                multiple
                onChange={handleImageChange}
                className="w-full text-xs"
              />
            </div>

            <button
              onClick={handleAddProduct}
              className="w-full mt-3 bg-yellow-400 text-black py-2 rounded-lg font-semibold text-sm"
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