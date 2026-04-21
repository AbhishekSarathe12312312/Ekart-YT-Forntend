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

  // ================= FETCH USER =================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));

        if (!storedUser) {
          toast.error("User not found in localStorage");
          return;
        }

        const userId = storedUser?._id || storedUser?.id;

        if (!userId) {
          toast.error("Invalid user id");
          return;
        }

        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/user/${userId}`
        );

        setUser(res.data.user);

        // ✅ safe form set
        setForm({
          firstName: res.data.user.firstName || "",
          lastName: res.data.user.lastName || "",
          mobile: res.data.user.mobile || "",
          email: res.data.user.email || "",
          profileImage: null,
        });

      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch user");
      }
    };

    fetchUser();
  }, []);

  // ================= INPUT =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= IMAGE =================
  const handleImage = (e) => {
    setForm({ ...form, profileImage: e.target.files[0] });
  };

  // ================= UPDATE =================
  const handleUpdate = async () => {
    setLoading(true);

    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));

      const userId = storedUser?._id || storedUser?.id;

      if (!userId) {
        toast.error("User ID missing");
        return;
      }

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
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(res.data.message);

      setUser(res.data.user);

      // reset form
      setForm({
        firstName: res.data.user.firstName,
        lastName: res.data.user.lastName,
        mobile: res.data.user.mobile,
        email: res.data.user.email,
        profileImage: null,
      });

      // update localStorage
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setEditMode(false);

    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="pt-28 min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 px-4">

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl w-full max-w-md">

          {/* PROFILE IMAGE */}
          <div className="flex flex-col items-center mb-6">

            {user?.profileImage ? (
              <img
                src={user.profileImage} // ✅ ImageKit URL
                className="w-20 h-20 rounded-full object-cover"
                alt="profile"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-2xl font-bold">
                {user?.firstName?.charAt(0)}
              </div>
            )}

            <h2 className="text-xl font-bold mt-3 text-white">
              {user?.firstName} {user?.lastName}
            </h2>

            <p className="text-gray-400 text-sm">
              {user?.email}
            </p>
          </div>

          {!editMode ? (
            <div>
              <div className="text-gray-300 mb-3">
                Mobile: {user?.mobile}
              </div>

              <button
                onClick={() => setEditMode(true)}
                className="w-full bg-blue-500 py-2 rounded-full"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <div className="space-y-3">

              {["firstName", "lastName", "email", "mobile"].map((f) => (
                <input
                  key={f}
                  name={f}
                  value={form[f]}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-white/10 text-white"
                />
              ))}

              <input
                type="file"
                accept="image/*"
                onChange={handleImage}
                className="w-full p-2 text-white"
              />

              {/* PREVIEW */}
              {form.profileImage && (
                <img
                  src={URL.createObjectURL(form.profileImage)}
                  className="w-16 h-16 rounded-full"
                  alt="preview"
                />
              )}

              <button
                onClick={handleUpdate}
                disabled={loading}
                className="w-full bg-green-500 py-2 rounded-full"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>

            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default Profile;