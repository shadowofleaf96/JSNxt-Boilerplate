"use client";

import React, { useState } from "react";
import AxiosConfig from "../../../../components/Utils/AxiosConfig";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import LoadingSpinner from "@/src/components/Utils/LoadingSpinner";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await AxiosConfig.post("/users/forgot-password", { email });
      toast.success("Check your email for password reset instructions.");
      setEmail("");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Error sending reset email. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-black text-2xl cursor-pointer"
          aria-label="Close modal"
        >
          <IoClose size={24} />
        </button>
        <div className="flex justify-center mb-6">
          <img src="/jsnxt-logo-black.webp" alt="Logo" className="h-16 w-16" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Forgot your password?
        </h2>
        <p className="text-sm text-center text-gray-600 mb-4">
          Enter your email address to receive a password reset link.
        </p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            {loading ? <LoadingSpinner size={5} /> : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
