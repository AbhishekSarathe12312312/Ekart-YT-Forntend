import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    profileImage: null,
  });

  useEffect(() => {
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
          firstName: res.data.user.firstName || "",
          lastName: res.data.user.lastName || "",
          mobile: res.data.user.mobile || "",
          email: res.data.user.email || "",
          profileImage: null,
        });
      } catch {
        toast.error("Failed to fetch user");
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e) =>
    setForm({ ...form, profileImage: e.target.files[0] });

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const userId = storedUser?._id || storedUser?.id;

      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        if (form[key]) formData.append(key, form[key]);
      });

      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/user/${userId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setEditMode(false);
      toast.success("Profile updated!");
    } catch {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-black px-4">
        <div className="w-full max-w-sm bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-5 shadow-2xl">
          {/* Avatar */}
          <div className="flex flex-col items-center text-center">
            {/* AVATAR */}
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                className="w-20 h-20 rounded-xl object-cover border-2 border-white/10 shadow-md"
              />
            ) : (
              <div className="w-20 h-20 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-xl font-bold text-white shadow-md">
                {user?.firstName?.charAt(0)}
              </div>
            )}

            {/* NAME */}
            <h2 className="mt-3 text-lg font-semibold text-white">
              {user?.firstName} {user?.lastName}
            </h2>

            {/* EMAIL */}
            <p className="text-sm text-gray-400 mt-1">{user?.email}</p>
          </div>

          {/* VIEW MODE */}
          {!editMode ? (
            <div className="mt-6 space-y-3">
              <div className="bg-white/5 border border-white/10 p-3 rounded-lg text-sm text-gray-300">
                📱 {user?.mobile || "No mobile added"}
              </div>

              <button
                onClick={() => setEditMode(true)}
                className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-medium"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            /* EDIT MODE */
            <div className="mt-4 space-y-2">
              {/* INPUT GRID */}
              <div className="grid grid-cols-2 gap-2">
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="text-white w-full px-2 py-2 rounded-lg bg-zinc-800/60 border border-white/10 text-xs outline-none focus:border-blue-500"
                />

                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className=" text-white w-full px-2 py-2 rounded-lg bg-zinc-800/60 border border-white/10 text-xs outline-none focus:border-blue-500"
                />
              </div>

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="text-white w-full px-2 py-2 rounded-lg bg-zinc-800/60 border border-white/10 text-xs outline-none focus:border-blue-500"
              />

              <input
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder="Mobile"
                className="text-white w-full px-2 py-2 rounded-lg bg-zinc-800/60 border border-white/10 text-xs outline-none focus:border-blue-500"
              />

              {/* FILE UPLOAD (compact card style) */}
              <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-800/40 border border-white/10">
                <span className="text-xs text-gray-300">Profile Image</span>
                <input
                  type="file"
                  onChange={handleImage}
                  className="text-[10px] text-gray-300 w-[140px]"
                />
              </div>

              {/* IMAGE PREVIEW */}
              {form.profileImage && (
                <div className="flex justify-center mt-1">
                  <img
                    src={URL.createObjectURL(form.profileImage)}
                    className="w-14 h-14 rounded-full border border-white/20 object-cover"
                  />
                </div>
              )}

              {/* ACTION BUTTONS */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className="flex-1 py-2 rounded-lg bg-green-600 active:scale-95 transition text-xs font-medium"
                >
                  {loading ? "Saving..." : "Save"}
                </button>

                <button
                  onClick={() => setEditMode(false)}
                  className="text-white flex-1 py-2 rounded-lg bg-white/10 active:scale-95 transition text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
