import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  // ================= ADD TO CART =================
  const handleAddToCart = async (id) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/cart/addCart`,
        { productId: id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.log(error);
    }
  };

  // ================= FETCH PRODUCTS =================
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/product/all`);

      setProducts(res.data.products);
      setFilteredProducts(res.data.products);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ================= SEARCH =================
  useEffect(() => {
    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredProducts(filtered);
  }, [search, products]);

  return (
    <>
      <Navbar />

      <div className="pt-24 min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white">

        <div className="px-6">

          {/* TOP BAR */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

            <div>
              <h1 className="text-xl md:text-2xl font-bold">
                Trending Products
              </h1>
              <p className="text-gray-400 text-xs">
                Best picks for you
              </p>
            </div>

            {/* SEARCH */}
            <div className="flex items-center w-full md:w-[350px] bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2">
              <FiSearch className="text-gray-300" />

              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none px-3 w-full text-sm placeholder-gray-400"
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-xs bg-red-500 px-2 py-1 rounded-full"
                >
                  ✕
                </button>
              )}
            </div>

          </div>

          {/* PRODUCTS */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array(8).fill(0).map((_, i) => (
                <div
                  key={i}
                  className="bg-white/10 border border-white/20 rounded-xl animate-pulse overflow-hidden"
                >
                  <div className="h-40 bg-gray-600"></div>
                  <div className="p-3">
                    <div className="h-3 bg-gray-500 w-3/4 rounded"></div>
                    <div className="h-3 bg-gray-500 w-1/2 mt-2 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">

              {filteredProducts.length === 0 ? (
                <p className="text-gray-400 col-span-full text-center">
                  No products found 😢
                </p>
              ) : (
                filteredProducts.map((p) => {

                  // ✅ ImageKit compatible
                  const mainImage =
                    p.images?.[0] || p.image || "";

                  return (
                    <div
                      key={p._id}
                      onClick={() => navigate(`/product/${p._id}`)}
                      className="group bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden hover:scale-[1.03] hover:shadow-lg transition cursor-pointer"
                    >

                      {/* IMAGE */}
                      <div className="relative overflow-hidden">
                        <img
                          src={
                            mainImage
                              ? mainImage   // ✅ direct URL
                              : "https://via.placeholder.com/300"
                          }
                          alt={p.name}
                          className="h-40 w-full object-cover group-hover:scale-110 transition"
                        />

                        <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded-full">
                          {p.category}
                        </span>
                      </div>

                      {/* CONTENT */}
                      <div className="p-3">
                        <h2 className="text-sm font-semibold truncate">
                          {p.name}
                        </h2>

                        <p className="text-xs text-gray-300 mt-1 line-clamp-2">
                          {p.description}
                        </p>

                        <div className="flex items-center justify-between mt-3">

                          <p className="text-yellow-400 font-bold text-sm">
                            ₹{p.price}
                          </p>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(p._id);
                            }}
                            className="bg-yellow-400 text-black text-xs px-3 py-1 rounded-full hover:scale-105 transition font-semibold"
                          >
                            Add +
                          </button>

                        </div>
                      </div>

                    </div>
                  );
                })
              )}

            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Products;