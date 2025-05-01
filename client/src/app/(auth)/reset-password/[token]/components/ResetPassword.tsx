"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import AxiosConfig from "../../../../../components/utils/AxiosConfig";
import LoadingSpinner from "@/src/components/ui/LoadingSpinner";
import Image from "next/image";

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    try {
      setLoading(true);
      await AxiosConfig.put(`/users/reset-password/${token}`, { password });
      toast.success("Password reset successfully.");
      router.push("/login");
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Error resetting password."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8">
        <div className="flex justify-center mb-6">
          <Image
            src="/jsnxt-logo-black.webp"
            alt="Logo"
            className="h-16 w-16"
            width={1200}
            height={800}
            priority
            placeholder="blur"
            blurDataURL="data:image/png;base64,..."
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Reset Password
        </h1>
        <p className="text-sm text-center text-gray-600 mb-6">
          Enter a new password for your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 transition"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-800 text-white font-medium py-3 rounded-lg hover:bg-gray-600 transition disabled:opacity-50"
          >
            {loading ? <LoadingSpinner size={5} /> : "Confirm"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
