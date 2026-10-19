"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFormUserAuth } from "@/context/FormUserAuthContext";
import {
  LayoutDashboard,
  Files,
  PlusCircle,
  Inbox,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";

export function FormUserSidebar() {
  const pathname = usePathname();
  const { user, logout } = useFormUserAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      path: "/tphl-forms/dashboard",
      icon: <LayoutDashboard size={19} />,
      isActive: pathname === "/tphl-forms" || pathname === "/tphl-forms/dashboard",
    },
    {
      name: "All Forms",
      path: "/tphl-forms/dashboard",
      icon: <Files size={19} />,
      isActive: pathname === "/tphl-forms/dashboard",
    },
    {
      name: "Create Form",
      path: "/tphl-forms/builder",
      icon: <PlusCircle size={19} />,
      isActive: pathname.startsWith("/tphl-forms/builder") || pathname.includes("/edit"),
    },
    {
      name: "Submissions",
      path: "/tphl-forms/submissions",
      icon: <Inbox size={19} />,
      isActive:
        pathname.startsWith("/tphl-forms/submissions") ||
        pathname.includes("/responses"),
    },
  ];

  return (
    <>
      {/* Mobile Top Bar with Hamburger */}
      <div className="lg:hidden flex items-center justify-between bg-white border-b border-stone-200 px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center gap-2.5 text-[#044133] font-normal text-base">
          <Files size={20} className="text-[#00a86b]" />
          <span>TPHL Forms</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50 cursor-pointer"
          aria-label="Toggle Navigation"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-60 bg-white border-r border-stone-200 flex flex-col justify-between transition-transform duration-200 ease-in-out shrink-0 select-none ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Top Brand Header */}
        <div>
          <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between">
            <Link
              href="/tphl-forms/dashboard"
              className="flex items-center gap-2.5 text-[#044133] font-normal text-lg tracking-tight hover:opacity-90 transition-opacity"
            >
              <Files size={22} className="text-[#00a86b]" />
              <span>TPHL Forms</span>
            </Link>
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1 text-stone-400 hover:text-stone-600"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="py-4 px-3 space-y-1">
            {navItems.map((item, idx) => (
              <Link
                key={`${item.name}-${idx}`}
                href={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-normal transition-all cursor-pointer ${
                  item.isActive
                    ? "bg-[#e8f5ed] text-[#00875a]"
                    : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                }`}
              >
                <span className={item.isActive ? "text-[#00875a]" : "text-stone-500"}>
                  {item.icon}
                </span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Footer Area with User Profile & Logout */}
        <div className="p-3 border-t border-stone-200 space-y-1">
          {/* User Info */}
          <div className="flex items-center gap-3 px-3.5 py-2 text-stone-700 text-xs font-normal">
            <User size={18} className="text-stone-500 shrink-0" />
            <span className="truncate">{user?.name || "Form Admin"}</span>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3.5 py-2 text-red-600 hover:bg-red-50/80 rounded-xl transition-colors text-xs font-normal text-left cursor-pointer"
          >
            <LogOut size={18} className="text-red-600 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
