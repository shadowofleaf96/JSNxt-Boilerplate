"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/src/components/Utils/LoadingSpinner";

const VerificationSuccess = () => {
  const router = useRouter();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      const role = "user";
      localStorage.setItem("role", role);

      router.push("/");
    } else {
      const timeout = setTimeout(() => {
        router.push("/login");
      }, 5000);

      return () => clearTimeout(timeout);
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="py-8">
        <img
          className="h-24 sm:h-24 mx-auto"
          src="/jsnxt-logo-black.webp"
          alt="Your Company"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/fallback-logo.png";
          }}
        />
      </div>
      <h1 className="text-3xl font-bold mb-4 text-center">Email Verified!</h1>

      <p className="text-lg text-gray-700 mb-8 text-center">
        Logging you in automatically...
      </p>
      <LoadingSpinner size={8} className="mx-auto" />
    </div>
  );
};

export default VerificationSuccess;
