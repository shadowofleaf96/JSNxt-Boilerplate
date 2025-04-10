"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AxiosConfig from "../../../../components/Utils/AxiosConfig";
import LoadingSpinner from "../../../../components/Utils/LoadingSpinner";
import Link from "next/link";
import DOMPurify from "dompurify";
import { toast } from "react-toastify";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role === "user") {
      router.push("/");
    }
  }, []);

  const sanitizeInput = (input: string) => DOMPurify.sanitize(input.trim());

  const validateCredentials = () => {
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
      const res = await AxiosConfig.post<{
        data: any;
        role: string;
        token: string;
      }>(`/users/login`, {
        username: sanitizedUsername,
        password: sanitizedPassword,
      });

      const respdata = res.data.data;

      if (respdata.role === "user") {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", respdata.role);
        router.push("/");
      } else {
        setLoading(false);
        toast.error("Invalid credentials. Please try again.");
        return;
      }
    } catch (err: any) {
      setLoading(false);
      const message = "Invalid credentials. Please try again.";
      toast.error(message);
      console.log(err);
    }
  };

  return (
    <div className="flex min-h-screen flex-1">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <img
              className="h-24 sm:h-24 mx-auto"
              src="../../../jsnxt-logo-black.webp"
              alt="Your Company"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/fallback-logo.png";
              }}
            />
            <h2 className="mt-8 text-2xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Not a member?{" "}
              <Link
                href="/registration"
                className="font-semibold text-gray-600 hover:text-gray-500"
              >
                Register your account
              </Link>
            </p>
          </div>

          <div className="mt-10">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-900"
                >
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  autoComplete="username"
                  minLength={4}
                  maxLength={20}
                  pattern="[a-zA-Z0-9]+"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value.replace(/[^a-zA-Z0-9]/g, ""))
                  }
                  className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-gray-600 sm:text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-900"
                >
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  minLength={8}
                  maxLength={50}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-gray-600 sm:text-sm"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 accent-gray-600 text-gray-600 focus:ring-gray-600"
                  />
                  <label
                    htmlFor="remember-me"
                    className="text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-gray-600 hover:text-gray-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600 disabled:opacity-50"
                >
                  {loading ? <LoadingSpinner size={5} /> : "Sign In"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          alt=""
          src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
          className="absolute inset-0 size-full object-cover"
        />
      </div>
    </div>
  );
};

export default Login;
