"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginUser, signupUser, clearError } from "@/store/authSlice";
import { useRouter } from "next/navigation";

export default function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const dispatch = useAppDispatch();
  const { loading, error, token } = useAppSelector((state) => state.auth);
  const router = useRouter();

  // Clear form and errors when modal opens/closes or mode changes
  useEffect(() => {
    if (!open) {
      setEmail("");
      setPassword("");
      setFullName("");
      dispatch(clearError());
    }
  }, [open, dispatch]);

  // Redirect on successful login
  useEffect(() => {
    if (token && open) {
      router.push("/chat");
      onClose();
    }
  }, [token, open, router, onClose]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    if (isLogin) {
      // Login: use email as username
      await dispatch(
        loginUser({
          username: email,
          password,
          grant_type: "password",
        })
      );
    } else {
      // Signup
      const result = await dispatch(
        signupUser({
          email,
          full_name: fullName,
          password,
        })
      );

      // If signup successful, automatically login
      if (signupUser.fulfilled.match(result)) {
        await dispatch(
          loginUser({
            username: email,
            password,
            grant_type: "password",
          })
        );
      }
    }
  };

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://km-backend-yj1m.onrender.com";

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg shadow-xl p-6 relative">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-semibold mb-4 text-black">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {/* Google Login */}
        <a href={`${API_BASE_URL}/auth/google`}>
          <button
            type="button"
            className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Continue with Google
          </button>
        </a>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-4 text-gray-500 text-sm">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {typeof error === "string" ? error : JSON.stringify(error)}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Full Name Input (Signup only) */}
          {!isLogin && (
            <input
              type="text"
              className="w-full p-2 border rounded-md mb-3 text-black"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required={!isLogin}
            />
          )}

          {/* Email Input */}
          <input
            type="email"
            className="w-full p-2 border rounded-md mb-3 text-black"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* Password Input */}
          <input
            type="password"
            className="w-full p-2 border rounded-md mb-4 text-black"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        {/* Toggle between Login and Signup */}
        <div className="mt-4 text-center text-sm">
          <span className="text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </span>
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              dispatch(clearError());
            }}
            className="text-black font-medium hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Sadiq
