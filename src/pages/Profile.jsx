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
          `${import.meta.env.VITE_API_BASE_URL}/user/${userId}`
        );

        setUser(res.data.user);

        setForm({
          firstName: res.data.user.firstName || "",
          lastName: res.data.user.lastName || "",
          mobile: res.data.user.mobile || "",
          email: res.data.user.email || "",
          profileImage: null,
        });
      } catch (err) {
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
      formData.append("firstName", form.firstName);
      formData.append("lastName", form.lastName);
      formData.append("email", form.email);
      formData.append("mobile", form.mobile);

      if (form.profileImage) {
        formData.append("profileImage", form.profileImage);
      }

      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/user/${userId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setEditMode(false);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      {/* MAIN WRAPPER */}
      <div className="min-h-screen pt-20 sm:pt-24 flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-3 py-6">

        {/* PROFILE CARD */}
        <div className="
          w-full max-w-[260px] sm:max-w-xs md:max-w-sm
          bg-white/5 backdrop-blur-xl border border-white/10
          rounded-xl shadow-xl p-3 sm:p-4
        ">

          {/* PROFILE HEADER */}
          <div className="flex flex-col items-center text-center">

            {user?.profileImage ? (
              <img
                src={user.profileImage}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border border-white/20"
              />
            ) : (
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-base sm:text-lg font-bold text-white">
                {user?.firstName?.charAt(0)}
              </div>
            )}

            <h2 className="text-sm sm:text-base font-semibold text-white mt-2">
              {user?.firstName} {user?.lastName}
            </h2>

            <p className="text-gray-400 text-[10px] sm:text-xs">
              {user?.email}
            </p>
          </div>

          {/* VIEW MODE */}
          {!editMode ? (
            <div className="mt-3 sm:mt-4 space-y-3">

              <div className="bg-white/5 border border-white/10 p-2 rounded-lg text-gray-300 text-[10px] sm:text-xs">
                Mobile: {user?.mobile}
              </div>

              <button
                onClick={() => setEditMode(true)}
                className="w-full py-2 rounded-lg bg-blue-600 text-white text-xs sm:text-sm"
              >
                Edit
              </button>

            </div>
          ) : (
            /* EDIT MODE */
            <div className="mt-3 sm:mt-4 space-y-2">

              {["firstName", "lastName", "email", "mobile"].map((f) => (
                <input
                  key={f}
                  name={f}
                  value={form[f]}
                  onChange={handleChange}
                  placeholder={f}
                  className="w-full px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-[10px] sm:text-xs outline-none"
                />
              ))}

              <input
                type="file"
                onChange={handleImage}
                className="w-full text-[10px] sm:text-xs text-gray-300"
              />

              {form.profileImage && (
                <img
                  src={URL.createObjectURL(form.profileImage)}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mx-auto"
                />
              )}

              <button
                onClick={handleUpdate}
                disabled={loading}
                className="w-full py-2 rounded-lg bg-green-600 text-white text-xs sm:text-sm"
              >
                {loading ? "Saving..." : "Save"}
              </button>

              <button
                onClick={() => setEditMode(false)}
                className="w-full py-1.5 rounded-lg bg-white/10 text-white text-[10px] sm:text-xs"
              >
                Cancel
              </button>

            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default Profile;