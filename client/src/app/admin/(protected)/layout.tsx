"use client";
import { useState, useEffect } from "react";
import Navbar from "@/app/admin/components/Layout/Navbar";
import Sidebar from "@/app/admin/components/Layout/Sidebar";
import ProtectedRoute from "@/components/utils/ProtectedRoute";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      if (!mobile && !isSidebarOpen) {
        setIsSidebarOpen(true);
      } else if (mobile && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    const initialMobile = window.innerWidth < 768;
    setIsMobile(initialMobile);
    if (!initialMobile) {
      setIsSidebarOpen(true);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen flex">
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          isMobile={isMobile}
        />
        <div className="flex-1">
          <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
          <main className="md:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
