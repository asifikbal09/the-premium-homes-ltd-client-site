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
          "fixed top-0 bottom-0 left-0 z-50 w-[270px] h-screen bg-white border-r border-stone-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 lg:sticky lg:top-0 lg:z-30 shrink-0 overflow-y-auto",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Top: Logo & Close Button (Mobile) */}
        <div className="flex flex-col shrink-0">
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
                    "w-full flex items-center gap-3.5 px-4 py-2.5 rounded-full text-[13.5px] transition-all duration-200 cursor-pointer select-none text-left",
                    isActive
                      ? "bg-[#044133] text-white shadow-xs font-normal tracking-normal"
                      : "text-stone-600 hover:bg-stone-100/80 hover:text-stone-900 font-normal"
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
        <div className="flex-1 flex flex-col gap-3 p-4 min-h-0">
          <div className="pt-2 border-t border-stone-100 space-y-1">
            <button
              type="button"
              onClick={() => {
                setActiveTab("profile");
                if (onClose) onClose();
              }}
              className={cn(
                "w-full flex items-center gap-3.5 px-4 py-2.5 rounded-full text-[13.5px] transition-all duration-200 cursor-pointer select-none text-left",
                activeTab === "profile"
                  ? "bg-[#044133] text-white font-normal"
                  : "text-stone-600 hover:bg-stone-100/80 hover:text-stone-900 font-normal"
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
          <div
            className="relative flex-1 min-h-[220px] w-full rounded-xl overflow-hidden px-4 pt-6 text-center text-white shadow-lg flex flex-col items-center bg-[#d3d3d3] bg-cover bg-no-repeat bg-bottom"
            style={{
              backgroundImage: "url('/image/home_hero_bg.png')",
            }}
          >
            {/* Dark top fading to show buildings at bottom */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0b1020] via-[#0b1020]/70 to-transparent z-0 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center space-y-4 w-full">
              <h4 className="font-heading text-[16px] sm:text-[18px] md:text-[20px] font-medium leading-[1.1] tracking-tight text-white capitalize">
                Find Your
                <br />
                Dream Home With
                <br />
                Premium Homes
              </h4>

              <Link
                href="/projects"
                className="w-[140px] h-[36px] flex items-center justify-center rounded-full text-xs font-bold tracking-[0.14em] uppercase text-[#2F3233] bg-[#CFA866] hover:bg-[#dfb775] active:scale-95 transition-all shadow-[0_7px_21px_rgba(207,168,102,0.3)] backdrop-blur-[50px]"
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
