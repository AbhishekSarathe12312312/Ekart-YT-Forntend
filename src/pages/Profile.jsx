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
        <div className="w-full max-w-md sm:max-w-lg bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 sm:p-7 shadow-2xl">
          {/* Avatar Section */}
          <div className="flex flex-col items-center text-center">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border border-white/10 shadow-md"
              />
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-2xl sm:text-3xl font-bold text-white shadow-md">
                {user?.firstName?.charAt(0)}
              </div>
            )}

            <h2 className="mt-4 text-xl sm:text-2xl font-semibold text-white">
              {user?.firstName} {user?.lastName}
            </h2>

            <p className="text-sm sm:text-base text-gray-400 mt-1 break-all">
              {user?.email}
            </p>
          </div>

          {/* VIEW MODE */}
          {!editMode ? (
            <div className="mt-6 space-y-4">
              <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-sm sm:text-base text-gray-300 text-center">
                📱 {user?.mobile || "No mobile added"}
              </div>

              <button
                onClick={() => setEditMode(true)}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-medium text-sm sm:text-base"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            /* EDIT MODE */
            <div className="mt-6 space-y-3">
              {/* INPUT GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className="text-white px-3 py-2.5 rounded-xl bg-zinc-800/60 border border-white/10 text-sm outline-none focus:border-blue-500"
                />

                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className="text-white px-3 py-2.5 rounded-xl bg-zinc-800/60 border border-white/10 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="text-white w-full px-3 py-2.5 rounded-xl bg-zinc-800/60 border border-white/10 text-sm outline-none focus:border-blue-500"
              />

              <input
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder="Mobile"
                className="text-white w-full px-3 py-2.5 rounded-xl bg-zinc-800/60 border border-white/10 text-sm outline-none focus:border-blue-500"
              />

              {/* FILE UPLOAD */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-3 py-2.5 rounded-xl bg-zinc-800/40 border border-white/10">
                <span className="text-xs sm:text-sm text-gray-300">
                  Profile Image
                </span>
                <input
                  type="file"
                  onChange={handleImage}
                  className="text-xs text-gray-300"
                />
              </div>

              {/* IMAGE PREVIEW */}
              {form.profileImage && (
                <div className="flex justify-center mt-2">
                  <img
                    src={URL.createObjectURL(form.profileImage)}
                    className="w-16 h-16 rounded-full border border-white/20 object-cover"
                  />
                </div>
              )}

              {/* ACTION BUTTONS */}
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-green-600 active:scale-95 transition text-sm font-medium"
                >
                  {loading ? "Saving..." : "Save"}
                </button>

                <button
                  onClick={() => setEditMode(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 active:scale-95 transition text-sm text-white"
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
