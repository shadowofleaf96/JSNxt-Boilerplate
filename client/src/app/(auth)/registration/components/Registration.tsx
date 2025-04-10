"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../../../components/Utils/LoadingSpinner";
import { toast } from "react-toastify";
import AxiosConfig from "../../../components/Utils/AxiosConfig";
import DOMPurify from "dompurify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const registrationSchema = z.object({
  username: z
    .string()
    .min(4, "Username must be at least 4 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(/^[a-zA-Z0-9]+$/, "Only alphanumeric characters are allowed"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password must be at most 50 characters"),
  email: z.string().email("Please enter a valid email address"),
});

const Registration: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registrationSchema) });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role === "user") {
      router.push("/");
    }
  }, []);

  const onSubmit = async (data: any) => {
    if (attempts >= 3) {
      toast.error("Too many attempts. Please try again later.");
      return;
    }

    const sanitizedData = {
      username: DOMPurify.sanitize(data.username.trim()),
      password: DOMPurify.sanitize(data.password.trim()),
      email: DOMPurify.sanitize(data.email.trim()),
    };

    try {
      setLoading(true);
      setError("");

      const response = await AxiosConfig.post<{ token: string }>(
        `/users/register`,
        sanitizedData
      );

      localStorage.setItem("token", response.data.token);
      router.push("/");
    } catch (err: any) {
      setAttempts((prev) => prev + 1);
      const msg = "Registration failed. Please try again.";
      toast.error(msg);
      setError(msg);
      setLoading(false);
      if (attempts >= 2) {
        setTimeout(() => setAttempts(0), 30000);
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-1">
      <div className="relative hidden w-0 flex-1 lg:block">
        <img
          alt=""
          src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
          className="absolute inset-0 size-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <img
              className="h-16 w-auto mx-auto"
              src="../../../logo-wlidaty.webp"
              alt="Your Company"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/fallback-logo.png";
              }}
            />
            <h2 className="mt-8 text-2xl font-bold tracking-tight text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Sign in here
              </a>
            </p>
          </div>

          <div className="mt-10">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-900"
                >
                  Username
                </label>
                <div className="mt-2">
                  <input
                    {...register("username")}
                    id="username"
                    type="text"
                    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-indigo-600 focus:ring-indigo-600 sm:text-sm"
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.username.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    {...register("email")}
                    id="email"
                    type="email"
                    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-indigo-600 focus:ring-indigo-600 sm:text-sm"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-900"
                >
                  Password
                </label>
                <div className="mt-2">
                  <input
                    {...register("password")}
                    id="password"
                    type="password"
                    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-indigo-600 focus:ring-indigo-600 sm:text-sm"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div>
                <button
                  type="submit"
                  disabled={loading || attempts >= 3}
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-60"
                >
                  {loading ? (
                    <LoadingSpinner size={5} />
                  ) : (
                    `Register${attempts > 0 ? ` (${3 - attempts} left)` : ""}`
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
