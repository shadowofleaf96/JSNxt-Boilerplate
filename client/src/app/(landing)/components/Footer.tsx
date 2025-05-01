"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer: React.FC = () => {
  const footerNavigation = {
    solutions: [
      { name: "Features", href: "#features" },
      { name: "Testimonials", href: "#testimonials" },
      { name: "Pricing", href: "#pricing" },
      { name: "FAQ", href: "#faq" },
    ],
    support: [
      { name: "Help Center", href: "#" },
      { name: "Contact Us", href: "#" },
      { name: "Status", href: "#" },
    ],
    company: [
      { name: "About", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Careers", href: "#" },
    ],
    legal: [
      { name: "Privacy", href: "#" },
      { name: "Terms", href: "#" },
      { name: "Security", href: "#" },
    ],
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-12 sm:pb-4 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <Image alt="JSNXT"
            src="/jsnxt-logo-white.webp"
            className="h-26"
            width={1200}
            height={800}
            priority
            placeholder="blur"
            blurDataURL="data:image/png;base64,..."
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="mt-8 flex flex-wrap gap-8 xl:col-span-2 xl:mt-0">
            {Object.entries(footerNavigation).map(([section, links]) => (
              <div key={section} className="min-w-[120px]">
                <h3 className="text-sm font-semibold capitalize">{section}</h3>
                <ul className="mt-4 space-y-2">
                  {links.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        prefetch={false}
                        className="text-sm text-gray-400 hover:text-white"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-4 text-sm text-gray-400 text-center">
          © {new Date().getFullYear()} JSNXT. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
