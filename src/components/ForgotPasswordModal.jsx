// src/components/ForgotPasswordModal.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";

export default function ForgotPasswordModal({ onClose }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // null | "loading" | "sent" | "error"
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error((await res.json()).message || "Error");
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className='fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50 p-4'>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className='bg-[#1a1a1a] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-700 p-6'
      >
        <h2 className='text-xl font-bold text-white mb-4'>Forgot Password</h2>

        {status === "sent" ? (
          <div>
            <p className='text-gray-300'>
              If this email exists, a reset link has been sent.
            </p>
            <button
              onClick={onClose}
              className='mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg'
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-gray-300 text-sm mb-1'>Email</label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder='Enter your email'
                className='w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
            </div>
            {error && <p className='text-red-400 text-sm'>{error}</p>}
            <button
              type='submit'
              className='w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg'
            >
              Send Reset Link
            </button>
            <button
              type='button'
              onClick={onClose}
              className='w-full mt-2 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg'
            >
              Cancel
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
