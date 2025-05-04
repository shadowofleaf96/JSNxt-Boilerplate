"use client";

import React, { useState } from "react";
import AxiosConfig from "@/components/utils/AxiosConfig";
import { toast } from "react-toastify";
import { useReCaptcha } from "next-recaptcha-v3";
import { IoClose } from "react-icons/io5";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Image from "next/image";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState("");
  const { executeRecaptcha } = useReCaptcha();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const recaptchaToken = await executeRecaptcha("form_submit");

      await AxiosConfig.post("/users/forgot-password", {
        email,
        recaptchaToken,
      });
      toast.success("Check your email for password reset instructions.");
      setEmail("");
      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(
        "Error sending reset email. Please try again later." + error.message
      );
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
          <Image
            src="/jsnxt-logo-black.webp"
            width={0}
            height={0}
            placeholder="blur"
            blurDataURL="data:image/png;base64,..."
            sizes="(max-width: 768px) 100vw, 50vw"
            alt="Logo"
            className="h-16 w-16"
          />
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
          <p className="mt-6 text-xs text-gray-500 text-center">
            This site is protected by reCAPTCHA and the Google{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-700 transition-colors"
            >
              Privacy Policy
            </a>{" "}
            and{" "}
            <a
              href="https://policies.google.com/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-700 transition-colors"
            >
              Terms of Service
            </a>{" "}
            apply.
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
