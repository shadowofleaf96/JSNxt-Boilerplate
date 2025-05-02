"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Verification = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="py-8">
        <Image
          className="md:w-32 w-20 h-auto mx-auto"
          width={0}
          height={0}
          placeholder="blur"
          blurDataURL="data:image/png;base64,..."
          sizes="(max-width: 768px) 100vw, 50vw"
          src="/jsnxt-logo-black.webp"
          alt="Your Company"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/fallback-logo.png";
          }}
        />
      </div>
      <h1 className="text-3xl font-bold mb-4">Verify your email!</h1>
      <p className="text-lg text-gray-700 mb-8 text-center">
        We have sent you a verification email. Please check your inbox and
        verify your account.
      </p>
      <button
        onClick={() => router.push("/login")}
        className="px-6 py-3 rounded-md text-white bg-black hover:bg-gray-700"
      >
        Back to Login
      </button>
    </div>
  );
};

export default Verification;
