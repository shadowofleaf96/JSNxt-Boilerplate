"use client";
import React from "react";
import { FaHome, FaUser } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isMobile: boolean;
}

export default function Sidebar({
  isOpen,
  toggleSidebar,
  isMobile,
}: SidebarProps) {
  const pathname = usePathname();

  const sideElements = [
    {
      name: "Dashboard",
      href: `/admin/dashboard`,
      current: pathname === `/admin/dashboard`,
      icon: <FaHome className="text-xl md:text-2xl" />,
    },
    {
      name: "Users",
      href: `/admin/users`,
      current: pathname === `/admin/users`,
      icon: <FaUser className="text-xl md:text-2xl" />,
    },
  ];

  return (
    <>
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-56 fixed md:relative h-screen bg-white border-r border-gray-300 z-50 transition-transform duration-300 ease-in-out flex flex-col`}
      >
        <div className="p-2 flex items-center justify-center">
          <Link className="flex justify-center" href="/">
            <img
              className="max-h-16 w-auto object-contain"
              src="/logo-wlidaty.webp"
              alt="Brand Logo"
            />
          </Link>
          {isMobile && (
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <IoClose className="text-xl" />
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <nav className="space-y-1">
            {sideElements.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => isMobile && toggleSidebar()}
                className={`flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                  item.current
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <span
                  className={`${
                    item.current ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  {item.icon}
                </span>
                <span className="ml-3 text-sm font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}
