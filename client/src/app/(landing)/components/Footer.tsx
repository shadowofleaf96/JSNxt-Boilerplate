"use client";
import React from "react";

const Footer: React.FC = () => {
  const footerNavigation = {
    solutions: [
      { name: "Features", href: "#" },
      { name: "Pricing", href: "#" },
      { name: "Integrations", href: "#" },
      { name: "API", href: "#" },
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
    <footer className="mt-24 bg-gray-900 text-white sm:mt-32">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8 lg:py-32">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <img alt="JSNxt" src="/jsnxt-logo-white.webp" className="h-26" />
          <div className="mt-8 flex flex-wrap gap-8 xl:col-span-2 xl:mt-0">
            {Object.entries(footerNavigation).map(([section, links]) => (
              <div key={section} className="min-w-[120px]">
                <h3 className="text-sm font-semibold capitalize">{section}</h3>
                <ul className="mt-4 space-y-2">
                  {links.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="text-sm text-gray-400 hover:text-white"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-4 text-sm text-gray-400 text-center">
          © {new Date().getFullYear()} JSNxt. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
