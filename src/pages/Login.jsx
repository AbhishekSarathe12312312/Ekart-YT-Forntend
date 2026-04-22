import { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  // ================= MODE =================
  const [mode, setMode] = useState("login");
  // login | forgot | otp | reset

  // ================= LOADING (FIXED) =================
  const [loading, setLoading] = useState({
    login: false,
    forgot: false,
    otp: false,
    reset: false,
  });

  const setLoad = (key, value) => {
    setLoading((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // ================= STATES =================
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= LOGIN =================
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoad("login", true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/user/login`,
        form
      );

      toast.success(res.data.message);

      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/");

    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoad("login", false);
    }
  };

  // ================= FORGOT PASSWORD =================
  const handleForgot = async (e) => {
    e.preventDefault();
    setLoad("forgot", true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/user/forgot-password`,
        { email }
      );

      toast.success(res.data.message);
      setMode("otp");

    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoad("forgot", false);
    }
  };

  // ================= VERIFY OTP =================
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoad("otp", true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/user/verify-forgot-otp`,
        { email, otp }
      );

      toast.success(res.data.message);
      setMode("reset");

    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoad("otp", false);
    }
  };

  // ================= RESET PASSWORD =================
  const handleReset = async (e) => {
    e.preventDefault();
    setLoad("reset", true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/user/reset-password`,
        { email, newPassword }
      );

      toast.success(res.data.message);

      setMode("login");
      setEmail("");
      setOtp("");
      setNewPassword("");

    } catch (error) {
      toast.error(error.response?.data?.message);
    } finally {
      setLoad("reset", false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">

      <ToastContainer />

      <div className="w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-8">

        {/* ================= TITLE ================= */}
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          {mode === "login" && "Welcome Back"}
          {mode === "forgot" && "Forgot Password"}
          {mode === "otp" && "Verify OTP"}
          {mode === "reset" && "Reset Password"}
        </h2>

        {/* ================= LOGIN ================= */}
        {mode === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">

            <input
              name="email"
              placeholder="Email"
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 text-white border rounded-lg"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 text-white border rounded-lg"
            />

            <button className="w-full py-3 bg-blue-600 text-white rounded-lg flex justify-center items-center gap-2">
              {loading.login ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>

            <p
              onClick={() => setMode("forgot")}
              className="text-center text-yellow-400 text-sm cursor-pointer"
            >
              Forgot Password?
            </p>

            <p className="text-white text-center mt-4">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-400 underline">
                Register
              </Link>
            </p>
          </form>
        )}

        {/* ================= FORGOT ================= */}
        {mode === "forgot" && (
          <form onSubmit={handleForgot} className="space-y-4">

            <input
              placeholder="Enter Email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 text-white border rounded-lg"
            />

            <button className="w-full py-3 bg-yellow-500 text-white rounded-lg">
              {loading.forgot ? "Sending OTP..." : "Send OTP"}
            </button>

            <p
              onClick={() => setMode("login")}
              className="text-center text-white text-sm cursor-pointer"
            >
              Back to Login
            </p>

          </form>
        )}

        {/* ================= OTP ================= */}
        {mode === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">

            <input
              placeholder="Enter OTP"
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 text-white border rounded-lg text-center tracking-widest"
            />

            <button className="w-full py-3 bg-green-500 text-white rounded-lg">
              {loading.otp ? "Verifying..." : "Verify OTP"}
            </button>

          </form>
        )}

        {/* ================= RESET ================= */}
        {mode === "reset" && (
          <form onSubmit={handleReset} className="space-y-4">

            <input
              type="password"
              placeholder="New Password"
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 text-white border rounded-lg"
            />

            <button className="w-full py-3 bg-purple-600 text-white rounded-lg">
              {loading.reset ? "Resetting..." : "Reset Password"}
            </button>

          </form>
        )}

      </div>
    </div>
  );
}

export default Login;