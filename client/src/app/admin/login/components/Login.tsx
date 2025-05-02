"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/src/components/ui/LoadingSpinner";
import { toast } from "react-toastify";
import { useReCaptcha } from "next-recaptcha-v3";
import AxiosConfig from "@/src/components/utils/AxiosConfig";
import DOMPurify from "dompurify";
import Image from "next/image";

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { executeRecaptcha } = useReCaptcha();
  const [error, setError] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role === "admin") {
      router.push("/admin/dashboard");
    }
  }, [router]);

  const sanitizeInput = (input: string): string => {
    return DOMPurify.sanitize(input.trim());
  };

  const validateCredentials = (): boolean => {
    if (!username || !password) return false;
    if (username.length < 4 || username.length > 20) return false;
    if (password.length < 8 || password.length > 50) return false;
    return true;
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const sanitizedUsername = sanitizeInput(username);
    const sanitizedPassword = sanitizeInput(password);

    if (!validateCredentials()) {
      setError("Invalid credentials format");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const recaptchaToken = await executeRecaptcha("form_submit");

      const response = await AxiosConfig.post<{
        data: any;
        token: string;
      }>(`/users/login`, {
        identifier: sanitizedUsername,
        password: sanitizedPassword,
        recaptchaToken,
      });

      const respdata = response.data.data;

      if (respdata.role === "admin") {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("role", respdata.role);
        router.push("/admin/dashboard");
      } else {
        setLoading(false);
        toast.error("Invalid credentials. Please try again.");
        return;
      }
    } catch (err: any) {
      setLoading(false);
      console.log(err);
      const message = "Invalid credentials. Please try again.";
      toast.error(message);
      setError(message);
    }
  };

  return (
    <div className="h-screen m-auto flex items-center">
      <div className="w-full max-w-sm p-6 mx-auto bg-white rounded-lg shadow-md">
        <div className="flex justify-center mx-auto">
          <Image
            className="w-auto h-24 sm:h-24"
            width={0}
            height={0}
            priority
            placeholder="blur"
            blurDataURL="data:image/png;base64,..."
            sizes="(max-width: 768px) 100vw, 50vw"
            src="/jsnxt-logo-black.webp"
            alt="Company Logo"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/fallback-logo.png";
            }}
          />
        </div>
        <h1 className="text-2xl font-bold flex justify-center text-gray-800 my-4">
          Login
        </h1>

        <form className="mt-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="username" className="block text-sm text-gray-800">
              Username
            </label>
            <input
              type="text"
              name="username"
              required
              minLength={4}
              maxLength={20}
              pattern="[a-zA-Z0-9]+"
              value={username}
              autoComplete="username"
              onChange={(e) =>
                setUsername(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))
              }
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>

          <div className="mt-4">
            <label htmlFor="password" className="block text-sm text-gray-800">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              minLength={8}
              maxLength={50}
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-lg focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
            />
          </div>

          {error && (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {loading ? <LoadingSpinner size={6} /> : "Sign In"}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          <p>For security reasons, please:</p>
          <ul className="list-disc list-inside text-left mt-2">
            <li>Use a strong password</li>
            <li>Don&apos;t reuse passwords</li>
            <li>Keep your credentials private</li>
          </ul>
        </div>
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
      </div>
    </div>
  );
};

export default Login;
