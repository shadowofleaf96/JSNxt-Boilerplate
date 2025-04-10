"use client";

import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import LoadingSpinner from "../../../../../components/Utils/LoadingSpinner";
import AxiosConfig from "../../../../../components/Utils/AxiosConfig";
import { useForm } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const userSchema = z.object({
  avatar: z
    .any()
    .refine((files) => {
      if (!files || files.length === 0) return true;
      return files[0] instanceof File;
    }, "Invalid file format")
    .refine(
      (files) => !files || files.length === 0 || files[0].size <= 5000000,
      "File size should be less than 5MB"
    )
    .optional(),
  name: z
    .string()
    .min(3, "Username must be at least 3 characters.")
    .max(20, "Username must be less than 20 characters.")
    .trim(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters.")
    .max(20, "Username must be less than 20 characters.")
    .trim(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(20, "Password must be less than 20 characters.")
    .trim(),
  email: z.string().email("Please enter a valid email.").trim(),
  role: z.string().min(1, "Role is required."),
  status: z.enum(["active", "inactive"]),
});

interface UserData {
  _id?: string;
  name: string;
  username: string;
  role: string;
  email: string;
  status: string;
}

interface UsersFormProps {
  onClose: () => void;
  refreshUsers: () => void;
  initialData?: UserData | null;
  isEditMode?: boolean;
}

const UsersForm: React.FC<UsersFormProps> = ({
  onClose,
  refreshUsers,
  initialData = null,
  isEditMode = false,
}) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      avatar: null,
      name: "",
      username: "",
      password: "",
      role: "admin",
      email: "",
      status: "active",
    },
  });

  useEffect(() => {
    if (initialData) {
      setValue("username", initialData.username || "");
      setValue("name", initialData.name || "");
      setValue("password", "");
      setValue("role", initialData.role || "admin");
      setValue("email", initialData.email || "");
      setValue(
        "status",
        (initialData.status as "active" | "inactive") || "active"
      );
    }
  }, [initialData, setValue]);

  const onSubmit = async (data: Record<string, any>) => {
    setIsSubmitting(true);

    const userData = new FormData();

    const avatarFile = data.avatar?.item?.(0);
    if (avatarFile instanceof File) {
      userData.append("avatar", avatarFile);
    }

    Object.entries(data).forEach(([key, value]) => {
      if (value && key !== "avatar") {
        userData.append(key, value);
      }
    });

    try {
      if (isEditMode && initialData?._id) {
        await AxiosConfig.put(`/users/${initialData._id}`, userData);
        toast.success("User updated successfully!");
      } else {
        await AxiosConfig.post(`/users/register`, userData);
        toast.success("User added successfully!");
      }
      onClose();
      refreshUsers();
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black/75 z-50">
      <div
        ref={modalRef}
        className="bg-white p-4 rounded-xl shadow-lg w-3/4 max-w-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full"
        >
          <IoClose size={24} />
        </button>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {isEditMode ? "Edit User" : "Add User"}
          </h2>

          <div className="flex space-x-4 mb-4">
            <div className="w-1/2">
              <label htmlFor="username" className="block mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Example: Admin"
                {...register("username")}
                className={`border ${
                  errors.username ? "border-red-500" : "border-gray-300"
                } bg-white p-2 rounded w-full`}
              />
              {errors.username && (
                <p className="text-red-500 text-sm">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="w-1/2">
              <label htmlFor="password" className="block mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Example: 123456"
                {...register("password")}
                className={`border ${
                  errors.password ? "border-red-500" : "border-gray-300"
                } bg-white p-2 rounded w-full`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Example: example@example.com"
              {...register("email")}
              className={`border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } bg-white p-2 rounded w-full`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="flex space-x-4 mb-4">
            <div className="w-1/2">
              <label htmlFor="name" className="block mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Example: John Doe"
                {...register("name")}
                className={`border ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } bg-white p-2 rounded w-full`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
            <div className="w-1/2">
              <label htmlFor="role" className="block mb-2">
                Role
              </label>
              <select
                id="role"
                {...register("role")}
                className={`border ${
                  errors.role ? "border-red-500" : "border-gray-300"
                } bg-white p-2 rounded w-full`}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="other">Other</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-sm">{errors.role.message}</p>
              )}
            </div>
          </div>

          <div className="flex space-x-4 mb-4">
            <div className="w-1/2">
              <label htmlFor="status" className="block mb-2">
                Status
              </label>
              <select
                id="status"
                {...register("status")}
                className={`border ${
                  errors.status ? "border-red-500" : "border-gray-300"
                } bg-white p-2 rounded w-full`}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              {errors.status && (
                <p className="text-red-500 text-sm">{errors.status.message}</p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium">Avatar</label>
            <div className="relative">
              <input
                type="file"
                id="avatar"
                accept="image/*"
                {...register("avatar")}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <label
                htmlFor="avatar"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                Choose File
              </label>

              <span className="ml-2 text-sm text-gray-500">
                {watch("avatar")?.[0]?.name || "No file chosen"}
              </span>
            </div>
            {errors.avatar && (
              <p className="mt-1 text-sm text-red-500">
                {errors.avatar?.message?.toString()}
              </p>
            )}
          </div>

          <div className="flex justify-center items-start">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 text-white py-2 font-light px-4 rounded transition-colors duration-200 hover:bg-blue-600"
            >
              {isSubmitting ? (
                <LoadingSpinner
                  size={6}
                  className="w-auto py-1 px-3 h-auto text-white"
                />
              ) : isEditMode ? (
                "Update User"
              ) : (
                "Add User"
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-light py-2 px-4 ml-4"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsersForm;
