import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiShoppingCart, FiUser } from "react-icons/fi";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [userPhoto, setUserPhoto] = useState("");
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
    const token = localStorage.getItem("token");
    if (!token) {
      setCartCount(0);
      return;
    }
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/cart/getCart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const items = res.data?.items || res.data?.cart?.items || [];
      const totalQty = Array.isArray(items) 
        ? items.reduce((sum, item) => sum + (Number(item?.qty || item?.quantity || 0)), 0) 
        : 0;
      setCartCount(totalQty);
    } catch (error) {
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

    const updateCart = () => fetchCart();
    window.addEventListener("cartUpdated", updateCart);
    const interval = setInterval(fetchCart, 3000); // Polling for cart updates

    return () => {
      window.removeEventListener("cartUpdated", updateCart);
      clearInterval(interval);
    };
  }, []);

  // ================= INPUT HANDLERS =================
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setProduct({ ...product, images: Array.from(e.target.files) });
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
      product.images.forEach((file) => formData.append("images", file));

      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/product/add`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert(res.data.message);
      setShowModal(false);
      setProduct({ name: "", description: "", price: "", category: "", stock: "", images: [] });
      navigate("/products");
    } catch (error) {
      alert(error.response?.data?.message || "Error adding product");
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setUserPhoto("");
    setCartCount(0);
  };

  return (
    <>
      {/* NAVBAR (Glassmorphism Design) */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 text-white">
          
          <h1 onClick={() => navigate("/")} className="text-2xl font-extrabold cursor-pointer">
            Shopify<span className="text-yellow-400">X</span>
          </h1>

          <ul className="hidden md:flex gap-8 text-gray-200">
            <li onClick={() => navigate("/home")} className="cursor-pointer hover:text-yellow-400 transition">Home</li>
            <li onClick={() => navigate("/products")} className="cursor-pointer hover:text-yellow-400 transition">Products</li>
          </ul>

          <div className="flex items-center gap-5">
            {user ? (
              <>
                {/* Add Button */}
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-yellow-400 text-black px-4 py-2 rounded-full font-semibold hover:scale-105 transition"
                >
                  + Add
                </button>

                {/* Cart Icon with Red Badge */}
                <div onClick={() => navigate("/cart")} className="relative cursor-pointer">
                  <FiShoppingCart className="text-xl hover:text-yellow-400 transition" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white/20 animate-pulse">
                      {cartCount}
                    </span>
                  )}
                </div>

                {/* User Profile Section (ICON ME PHOTO) */}
                <div 
                  className="flex items-center gap-2 cursor-pointer group"
                  onClick={() => navigate("/profile")}
                >
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center border border-white/40 group-hover:border-yellow-400 transition overflow-hidden">
                    {userPhoto ? (
                      <img 
                        src={userPhoto} 
                        alt="Profile" 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <FiUser className="text-lg" />
                    )}
                  </div>
                  <span className="hidden sm:inline font-medium text-sm">{user}</span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="bg-white text-black px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-200 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-yellow-400 text-black px-6 py-2 rounded-full font-bold hover:scale-105 transition"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* ================= PREMIUM MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md" onClick={() => setShowModal(false)}>
          <div onClick={(e) => e.stopPropagation()} className="relative w-[420px] max-w-[95%] rounded-3xl p-6 bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.6)] text-white">
            <h2 className="text-2xl font-bold mb-5 text-center">✨ Add <span className="text-yellow-400">Premium Product</span></h2>
            <div className="space-y-3">
              {["name", "description", "price", "category", "stock"].map((field) => (
                <input key={field} name={field} placeholder={field.toUpperCase()} value={product[field]} onChange={handleChange} className="w-full p-3 rounded-xl bg-white/10 border border-white/20 placeholder-gray-300 text-white outline-none focus:ring-2 focus:ring-yellow-400" />
              ))}
              <input type="file" multiple accept="image/*" onChange={handleImageChange} className="w-full p-3 rounded-xl bg-white/10 border border-white/20" />
            </div>
            {product.images.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {product.images.map((img, i) => (
                  <img key={i} src={URL.createObjectURL(img)} className="w-16 h-16 object-cover rounded-xl border border-white/20" alt="preview" />
                ))}
              </div>
            )}
            <div className="flex gap-3 mt-6">
              <button onClick={handleAddProduct} className="w-full py-2 rounded-xl font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:scale-105 transition">🚀 Save Product</button>
              <button onClick={() => setShowModal(false)} className="w-full py-2 rounded-xl border border-white/30 hover:bg-white hover:text-black transition">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;