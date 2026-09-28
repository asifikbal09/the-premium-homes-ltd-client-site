"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Search, Sparkles, Bell, Menu } from "lucide-react";
import { ClientUser } from "./types";
import profile from "@/public/image/profile.png"

interface DashboardHeaderProps {
  user: ClientUser | null;
  onOpenMobileMenu?: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onNotificationClick?: () => void;
  onSparklesClick?: () => void;
}

export function DashboardHeader({
  user,
  onOpenMobileMenu,
  searchQuery,
  setSearchQuery,
  onNotificationClick,
  onSparklesClick,
}: DashboardHeaderProps) {
  const [greeting, setGreeting] = useState("Good morning");

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting("Good morning");
    } else if (currentHour < 17) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);




  return (
    <header className="sticky top-0 z-30 h-[76px] bg-white border-b border-stone-200/80 px-4 sm:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu Toggle + Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full pl-9 pr-4 py-2 text-[13.5px] rounded-full border border-stone-200 bg-stone-50/50 text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-[#044133] focus:bg-white focus:ring-2 focus:ring-[#044133]/10 transition-all"
          />
        </div>
      </div>

      {/* Right: Sparkles, Notification Bell, User Avatar */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        {/* AI / Concierge Sparkles Button */}
        <button
          type="button"
          onClick={onSparklesClick}
          aria-label="TPHL Concierge AI"
          title="TPHL Concierge Assistant"
          className="w-9 h-9 rounded-full bg-[#044133] hover:bg-[#065442] active:scale-95 text-white flex items-center justify-center transition-all shadow-xs cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#f7e7cb]" />
        </button>

        {/* Notification Bell with Badge */}
        <button
          type="button"
          onClick={onNotificationClick}
          aria-label="View notifications"
          title="8 New Updates"
          className="relative w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200/80 active:scale-95 text-stone-600 flex items-center justify-center transition-all cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
            8
          </span>
        </button>

        {/* User Profile Pill */}
        <div className="flex items-center gap-2.5 pl-1 sm:pl-2 border-l border-stone-200">
          <div className="relative w-9 h-9 rounded-full overflow-hidden bg-stone-200 ring-2 ring-stone-100 shrink-0">
            <Image
              src={profile}
              alt="Profile"
              fill
              sizes="36px"
              className="object-cover object-top"
              onError={(e) => {
                // fallback if image fails
                const target = e.target as HTMLElement;
                target.style.display = "none";
              }}
            />
          </div>

          <div className="hidden sm:flex flex-col text-left leading-tight">
            <span className="text-[11px] text-stone-400 font-normal">
              {greeting}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-stone-900 max-w-[140px] truncate">
              {user?.name}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
