import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, CheckCircle } from "lucide-react";

export default function Sign() {
  
  const navigate = useNavigate();
  const location = useLocation();

  // 👉 detect mode from Intro
  const defaultSignup = location.state?.mode === "signup";
  const [isSignup, setIsSignup] = useState(defaultSignup);

  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (isSignup) {
      if (form.password !== form.confirmPassword) return;

      localStorage.setItem(
        "user",
        JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        })
      );

      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        setIsSignup(false); // 👉 switch to Sign In
      }, 1600);
    } else {
      const savedUser = JSON.parse(localStorage.getItem("user"));

      if (
        savedUser &&
        savedUser.email === form.email &&
        savedUser.password === form.password
      ) {
        localStorage.setItem("isLoggedIn", "true");
        navigate("/home");
      }
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/bg-content.png')" }}
    >
      <div className="absolute inset-0 bg-black/60" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-[380px] p-10 rounded-2xl
        bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl text-white"
      >
        <h2 className="text-2xl font-bold text-center mb-8">
          {isSignup ? "Create Account" : "Sign In"}
        </h2>

        {isSignup && (
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-2 rounded-lg bg-white/80 text-black"
          />
        )}

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 rounded-lg bg-white/80 text-black"
        />

        {/* PASSWORD */}
        <div className="relative mb-4">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-white/80 text-black pr-10"
          />
          {form.password && (
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-700"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>

        {/* CONFIRM */}
        {isSignup && (
          <div className="relative mb-6">
            <input
              name="confirmPassword"
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/80 text-black pr-10"
            />
            {form.confirmPassword && (
              <button
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-2.5 text-gray-700"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-700 transition font-semibold"
        >
          {isSignup ? "Create Account" : "Sign In"}
        </button>

        <p
          onClick={() => setIsSignup(!isSignup)}
          className="mt-6 text-center text-sm cursor-pointer opacity-80 hover:underline"
        >
          {isSignup ? "Already have an account? Sign In" : "New here? Create Account"}
        </p>

        {/* ✅ SUCCESS ANIMATION */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center
              bg-black/70 rounded-2xl"
            >
              <CheckCircle size={48} className="text-green-400 mb-3" />
              <p className="font-semibold">Account Created</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
