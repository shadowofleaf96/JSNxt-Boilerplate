"use client"

import Image from "next/image";
import { FaQuoteLeft } from "react-icons/fa";
import { useTranslation } from "next-i18next";

const Testimonials: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div
      id="testimonials"
      className="relative z-10 mt-12 bg-gray-900 pb-2 sm:mt-16 sm:pb-4 xl:pb-0"
    >
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[calc(50%-36rem)] left-[calc(50%-19rem)] transform-gpu blur-3xl">
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="aspect-1097/1023 w-[68.5625rem] bg-gradient-to-r from-[#ff4694] to-[#776fff] opacity-25"
          />
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center gap-x-8 gap-y-10 px-6 sm:gap-y-8 lg:px-8 xl:flex-row xl:items-stretch">
        <div className="-mt-8 w-full max-w-2xl xl:-mb-8 xl:w-96 xl:flex-none">
          <div className="relative aspect-2/1 h-full md:-mx-8 xl:mx-0 xl:aspect-auto">
            <Image
              width={0}
              height={0}
              placeholder="blur"
              blurDataURL="data:image/png;base64,..."
              sizes="(max-width: 768px) 100vw, 50vw"
              alt="Background Image"
              src="https://raw.githubusercontent.com/shadowofleaf96/PortFolio-NextJS/refs/heads/main/public/images/Profile%20Skecth%20Art.webp"
              className="absolute inset-0 size-full rounded-2xl bg-gray-800 object-cover shadow-2xl"
            />
          </div>
        </div>

        <div className="w-full max-w-2xl xl:max-w-none xl:flex-auto xl:px-16 xl:py-24">
          <figure className="relative isolate pt-6 sm:pt-12">
            <FaQuoteLeft className="absolute top-0 left-0 text-white/20 text-5xl" />
            <blockquote className="text-xl/8 font-semibold text-white sm:text-2xl/9">
              <p>{t("testimonial.text")}</p>
            </blockquote>
            <figcaption className="mt-8 text-base">
              <div className="font-semibold text-white">{t("testimonial.author")}</div>
              <div className="mt-1 text-gray-400">{t("testimonial.title")}</div>
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
