"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { toast } from "react-toastify";
import AxiosConfig from "@/components/utils/AxiosConfig";
import DOMPurify from "dompurify";
import { useReCaptcha } from "next-recaptcha-v3";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import Modal from "@/components/ui/Modal";
import Image from "next/image";
import { useTranslation } from "next-i18next";

const registrationSchema = z.object({
  name: z.string(),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password must be at most 50 characters"),
  acceptPolicy: z.literal(true, {
    errorMap: () => ({ message: "You must accept the privacy policy" }),
  }),
});

const Registration: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const { executeRecaptcha } = useReCaptcha();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const error = "";
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
  }, [router]);

  const onSubmit = async (data: any) => {
    const sanitizedData = {
      name: DOMPurify.sanitize(data.name.trim()),
      email: DOMPurify.sanitize(data.email.trim()),
      password: DOMPurify.sanitize(data.password.trim()),
    };

    try {
      setLoading(true);
      const recaptchaToken = await executeRecaptcha("form_submit");

      await AxiosConfig.post(`/users/register`, {
        ...sanitizedData,
        recaptchaToken,
      });

      router.push("/verify-email");
    } catch (err: any) {
      console.log(err);
      const msg =
        "Registration failed. Please try again." + err?.response?.data?.message;
      toast.error(msg);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-1">
      <div className="relative hidden w-0 flex-1 lg:block">
        <Image
          width={0}
          height={0}
          placeholder="blur"
          blurDataURL="data:image/png;base64,..."
          sizes="(max-width: 768px) 100vw, 50vw"
          alt="Background Image"
          src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
          className="absolute inset-0 size-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <Image
              className="md:w-32 w-20 h-auto mx-auto"
              width={0}
              height={0}
              placeholder="blur"
              blurDataURL="data:image/png;base64,..."
              sizes="(max-width: 768px) 100vw, 50vw"
              src="/images/jsnxt-logo-black.webp"
              alt="Your Company"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/fallback-logo.png";
              }}
            />
            <h2 className="mt-8 text-2xl font-bold tracking-tight text-gray-900">
              {t("register.create_account")}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {t("register.already_have_account")}{" "}
              <Link
                href="/login"
                className="font-semibold text-gray-600 hover:text-gray-500"
              >
                {t("register.sign_in_here")}
              </Link>
            </p>
          </div>

          <div className="mt-10">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-900"
                >
                  {t("register.name")}{" "}
                </label>
                <div className="mt-2">
                  <input
                    {...register("name")}
                    id="name"
                    type="name"
                    placeholder="John Doe"
                    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-gray-600 focus:ring-gray-600 sm:text-sm"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-900"
                >
                  {t("register.email")}{" "}
                </label>
                <div className="mt-2">
                  <input
                    {...register("email")}
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-gray-600 focus:ring-gray-600 sm:text-sm"
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
                  {t("register.password")}{" "}
                </label>
                <div className="mt-2">
                  <input
                    {...register("password")}
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-gray-600 focus:ring-gray-600 sm:text-sm"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    {...register("acceptPolicy")}
                    id="acceptPolicy"
                    type="checkbox"
                    required
                    className="h-4 w-4 rounded border-gray-300 text-black accent-gray-700 focus:ring-black rtl:ml-3"
                  />
                </div>
                <label htmlFor="acceptPolicy">
                  {t("register.accept_policy")}{" "}
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="underline"
                  >
                    {t("register.privacy_policy")}
                  </button>
                </label>
                {errors.acceptPolicy && (
                  <p className="text-sm text-red-600">
                    {t(errors.acceptPolicy.message as string)}
                  </p>
                )}
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded-md bg-black px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-gray-600 disabled:opacity-60"
                >
                  {loading ? <LoadingSpinner size={5} /> : t("register.submit")}
                </button>
              </div>
              <p className="text-xs text-center text-gray-500 mt-6">
                {t("register.recaptcha_disclaimer")}{" "}
                <a
                  href="https://policies.google.com/privacy"
                  className="underline"
                >
                  {t("register.privacy")}
                </a>{" "}
                &{" "}
                <a
                  href="https://policies.google.com/terms"
                  className="underline"
                >
                  {t("register.terms")}
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h2 className="text-xl font-bold mb-4">{t("register.policy_title")}</h2>
        {Object.values(
          t("register.policy_content", { returnObjects: true })
        ).map((text, index) => (
          <p key={index} className="mb-2">
            {text}
          </p>
        ))}
      </Modal>
    </div>
  );
};

export default Registration;
