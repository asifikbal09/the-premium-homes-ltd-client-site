"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Search, Menu } from "lucide-react";
import { ClientUser } from "./types";
import { NotificationBell } from "./notification_bell";
import profile from "@/public/image/profile.png";

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
    <header className="sticky top-0 z-30 h-[80px] shrink-0 bg-white border-b border-[#f0f0f0] pl-4 sm:pl-[32px] pr-4 sm:pr-[24px] py-[20px] flex items-center justify-between gap-4">
      {/* Left: Mobile Menu Toggle + Search Box (Figma 8313:22319) */}
      <div className="flex items-center gap-3 flex-1 max-w-[500px]">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-[#546360] hover:text-[#054b3c] rounded-lg hover:bg-stone-100 cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative w-full h-[46px] flex items-center gap-[8px] rounded-[999px] border border-[#e9ebf1] bg-white pl-[16px] pr-[12px] py-[12px] focus-within:border-[#054b3c] focus-within:ring-2 focus-within:ring-[#054b3c]/10 transition-all">
          <Search className="size-[20px] shrink-0 text-[#546360] stroke-[1.75]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full bg-transparent font-sans text-[14px] font-normal leading-[16px] text-[#3b3e40] placeholder:text-[#546360] focus:outline-none"
          />
        </div>
      </div>

      {/* Right: AI Sparkles, Notification Bell, Divider & User Profile (Figma 8313:22322) */}
      <div className="flex items-center gap-[16px] shrink-0">
        <div className="flex items-center gap-[12px]">
          {/* AI / Concierge Sparkles Button (Figma 8313:22324) */}
          <button
            type="button"
            onClick={onSparklesClick}
            aria-label="TPHL Concierge AI"
            title="TPHL Concierge Assistant"
            className="size-[44px] p-[10px] rounded-full active:scale-95 text-white flex items-center justify-center transition-transform cursor-pointer"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgb(0, 133, 110) 0%, rgb(0, 61, 51) 100%)",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-[24px] drop-shadow-[0px_2px_0px_rgba(0,0,0,0.45)]"
            >
              <path d="M10.5 3.5L12.3 8.2L17 10L12.3 11.8L10.5 16.5L8.7 11.8L4 10L8.7 8.2L10.5 3.5Z" />
              <path d="M17.5 13.5L18.5 16L21 17L18.5 18L17.5 20.5L16.5 18L14 17L16.5 16L17.5 13.5Z" />
              <circle cx="10.5" cy="19.5" r="1.2" />
            </svg>
          </button>

          {/* Notification Bell with Dropdown (Figma 8313:22329) */}
          <NotificationBell />
        </div>

        {/* Vertical Divider (Figma 8313:22335) */}
        <div className="h-[32px] w-px bg-[#eaecf0] shrink-0" />

        {/* User Profile Block (Figma 8313:22336) */}
        <div className="flex items-center gap-[8px]">
          <div className="relative size-[44px] rounded-full overflow-hidden bg-[#888] shrink-0">
            <Image
              src={user?.avatar || profile}
              alt="Profile"
              fill
              sizes="44px"
              className="object-cover object-top"
              onError={(e) => {
                const target = e.target as HTMLElement;
                target.style.display = "none";
              }}
            />
          </div>

          <div className="hidden sm:flex flex-col gap-[8px] items-start leading-none">
            <span className="font-sans text-[12px] font-normal leading-none text-[#546360] whitespace-nowrap">
              {greeting}
            </span>
            <span className="font-sans text-[14px] font-medium leading-none text-[#3b3e40] max-w-[140px] truncate whitespace-nowrap">
              {user?.name || "Guest User"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
