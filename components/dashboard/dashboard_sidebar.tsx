"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LayoutGrid,
  CreditCard,
  BarChart2,
  Calendar,
  Video,
  Gift,
  Headphones,
  User,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type DashboardTab =
  | "overviews"
  | "payment"
  | "progress"
  | "notice"
  | "live-camera"
  | "refer"
  | "support"
  | "profile";

interface DashboardSidebarProps {
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
  onLogout: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const NAV_ITEMS: { id: DashboardTab; label: string; icon: React.ElementType }[] = [
  { id: "overviews", label: "Overviews", icon: LayoutGrid },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "progress", label: "Progress", icon: BarChart2 },
  { id: "notice", label: "Notice", icon: Calendar },
  { id: "live-camera", label: "Live Camera", icon: Video },
  { id: "refer", label: "Refer & Earn", icon: Gift },
  { id: "support", label: "Support", icon: Headphones },
];

export function DashboardSidebar({
  activeTab,
  setActiveTab,
  onLogout,
  isOpen = false,
  onClose,
}: DashboardSidebarProps) {
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
          "fixed top-0 bottom-0 left-0 z-50 w-[265px] bg-white border-r border-stone-200/80 flex flex-col  transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto shrink-0",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Top: Logo & Close Button (Mobile) */}
        <div>
          <div className="h-[76px] px-6 flex items-center justify-between border-b border-stone-100">
            <Link
              href="/"
              className="flex items-center gap-2 group"
              aria-label="The Premium Homes Home"
            >
              <div className="relative h-10 w-44">
                <Image
                  src="/image/logo/LOGO-GREEN.png"
                  alt="Premium Homes"
                  fill
                  priority
                  sizes="180px"
                  className="object-contain object-left"
                />
              </div>
            </Link>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="lg:hidden p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation Menu Links */}
          <nav className="p-4 space-y-1">
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
                    "w-full flex items-center gap-3.5 px-4 py-2.5 rounded-full text-[13.5px] font-medium transition-all duration-200 cursor-pointer select-none text-left",
                    isActive
                      ? "bg-[#044133] text-white shadow-xs font-semibold"
                      : "text-stone-600 hover:bg-stone-100/80 hover:text-stone-900"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-[18px] h-[18px] shrink-0 transition-colors",
                      isActive ? "text-white" : "text-stone-500"
                    )}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Lower Navigation & Promo Card */}
        <div className="p-4 space-y-4">
          <div className="pt-2 border-t border-stone-100 space-y-1">
            <button
              type="button"
              onClick={() => {
                setActiveTab("profile");
                if (onClose) onClose();
              }}
              className={cn(
                "w-full flex items-center gap-3.5 px-4 py-2.5 rounded-full text-[13.5px] font-medium transition-all duration-200 cursor-pointer select-none text-left",
                activeTab === "profile"
                  ? "bg-[#044133] text-white font-semibold"
                  : "text-stone-600 hover:bg-stone-100/80 hover:text-stone-900"
              )}
            >
              <User
                className={cn(
                  "w-[18px] h-[18px] shrink-0",
                  activeTab === "profile" ? "text-white" : "text-stone-500"
                )}
              />
              <span>Profile Setting</span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-full text-[13.5px] font-medium text-stone-600 hover:text-red-700 hover:bg-red-50/70 transition-all duration-200 cursor-pointer select-none text-left"
            >
              <LogOut className="w-[18px] h-[18px] shrink-0 text-stone-500 hover:text-red-700" />
              <span>Log Out</span>
            </button>
          </div>

          {/* Bottom Card: Find Your Dream Home */}
          <div className="relative rounded-2xl overflow-hidden p-5 text-center text-white shadow-md bg-stone-900 min-h-[170px] flex flex-col justify-end items-center">
            {/* Background architectural image */}
            <div className="absolute inset-0 z-0">
              <Image
                src="/image/home_hero_bg.png"
                alt="Find Your Dream Home"
                fill
                sizes="250px"
                className="object-cover object-center opacity-45 brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#021b15]/95 via-[#021b15]/70 to-transparent" />
            </div>

            <div className="relative z-10 space-y-3">
              <h4 className="font-serif text-[15px] font-medium leading-snug tracking-tight text-white/95">
                Find Your
                <br />
                Dream Home With
                <br />
                Premium Homes
              </h4>

              <Link
                href="/projects"
                className="inline-block px-5 py-2 rounded-full text-[11px] font-bold tracking-[0.14em] uppercase text-stone-900 bg-[#dfb775] hover:bg-[#ebd097] active:scale-95 transition-all shadow-sm"
              >
                READ MORE
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
