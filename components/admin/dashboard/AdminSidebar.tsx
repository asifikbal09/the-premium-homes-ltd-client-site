"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  ImageIcon,
  Eye,
  Star,
  Gavel,
  HelpCircle,
  Briefcase,
  Download,
  Sparkles,
  UserCheck,
  Users,
  LogOut,
  X,
  Bell,
  Megaphone,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminUser } from "@/context/AdminAuthContext";

export type AdminTab =
  | "dashboard"
  | "about"
  | "blogs"
  | "sliders"
  | "virtual-tours"
  | "reviews"
  | "live-streams"
  | "notifications"
  | "project-notices"
  | "auctions"
  | "faqs"
  | "investor-leads"
  | "brochure-leads"
  | "festival-leads"
  | "contacts"
  | "guest-users";

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  admin: AdminUser | null;
  onLogout: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const NAV_ITEMS: { id: AdminTab; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "about", label: "About Page", icon: Info },
  { id: "blogs", label: "Blogs", icon: FileText },
  { id: "sliders", label: "Sliders", icon: ImageIcon },
  { id: "virtual-tours", label: "Virtual Tours", icon: Eye },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "project-notices", label: "Project Notices", icon: Megaphone },
  { id: "auctions", label: "Auctions", icon: Gavel },
  { id: "faqs", label: "FAQs", icon: HelpCircle },
  { id: "investor-leads", label: "Investor Leads", icon: Briefcase },
  { id: "brochure-leads", label: "Brochure Leads", icon: Download },
  { id: "festival-leads", label: "Festival Leads", icon: Sparkles },
  { id: "contacts", label: "Contacts", icon: Users },
  { id: "guest-users", label: "Guest Users List", icon: UserCheck },
];

export function AdminSidebar({
  activeTab,
  setActiveTab,
  admin,
  onLogout,
  isOpen = false,
  onClose,
}: AdminSidebarProps) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 w-[275px] bg-white border-r border-stone-200 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-full lg:z-auto shrink-0 font-normal overflow-y-auto",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Top: Logo & Menu */}
        <div>
          {/* Bigger Logo Header */}
          <div className="h-[84px] px-6 flex items-center justify-between border-b border-stone-100">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2"
              aria-label="The Premium Homes Home"
            >
              <div className="relative h-13 w-56">
                <Image
                  src="/image/logo/LOGO-GREEN.png"
                  alt="The Premium Homes Ltd."
                  fill
                  priority
                  sizes="230px"
                  className="object-contain object-left"
                />
              </div>
            </Link>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="lg:hidden p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 cursor-pointer"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 pb-2 text-[11px] uppercase tracking-wider text-stone-400 font-normal">
              Main Menu
            </div>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    if (onClose) onClose();
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-colors font-normal cursor-pointer text-left",
                    isActive
                      ? "bg-[#044133]/8 text-[#044133] font-normal"
                      : "text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4 shrink-0",
                      isActive ? "text-[#044133]" : "text-stone-400"
                    )}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom: Admin User Info & Sign Out */}
        <div className="p-4 border-t border-stone-100">
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#044133]/10 text-[#044133] flex items-center justify-center text-xs font-normal shrink-0">
              {(admin?.name || "A").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-stone-800 truncate font-normal">
                {admin?.name || "Super Admin"}
              </p>
              <p className="text-[11px] text-stone-400 truncate font-normal">
                {admin?.email || "admin@example.com"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-stone-200 hover:bg-red-50 hover:border-red-200 text-xs font-normal text-stone-600 hover:text-red-600 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
