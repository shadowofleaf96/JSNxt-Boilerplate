"use client";
import React from "react";
import Link from "next/link";
import { HiOutlineInformationCircle, HiOutlineArrowLeft } from "react-icons/hi";
import { useTranslation } from "next-i18next";
import { usePathname } from "next/navigation";

function NotFound() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';

  return (
    <section className="bg-white">
      <div className="container flex items-center min-h-screen px-6 py-12 mx-auto">
        <div className="flex flex-col items-center max-w-sm mx-auto text-center">
          <p className="p-3 text-sm font-medium text-black-500 rounded-full bg-blue-50">
            <HiOutlineInformationCircle className="w-6 h-6" />
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-gray-800 md:text-3xl">
            {t("notfound.title")}
          </h1>
          <p className="mt-4 text-gray-500">{t("notfound.description")}</p>

          <div className="flex items-center w-full mt-6 gap-x-3 shrink-0 sm:w-auto">
            <Link
              href={`/${locale}`}
              prefetch={false}
              className="flex items-center justify-center w-1/2 px-5 py-2 text-sm text-gray-700 transition-colors duration-200 bg-white border rounded-lg gap-x-2 sm:w-auto hover:bg-gray-100"
            >
              <HiOutlineArrowLeft className="w-5 h-5 rtl:rotate-180" />
              <span>{t("notfound.goBack")}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default NotFound;