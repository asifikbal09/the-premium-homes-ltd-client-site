"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export type DashboardTab =
  | "overviews"
  | "payment"
  | "progress"
  | "wishlist"
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

/* Exact 24x24 Figma Sidebar Icons */
function IconOverviews({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3.5" y="3.5" width="7" height="7" rx="2.2" stroke="currentColor" strokeWidth="1.7" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="2.2" stroke="currentColor" strokeWidth="1.7" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="2.2" stroke="currentColor" strokeWidth="1.7" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="2.2" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function IconPayment({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M20 11V6C20 4.89543 19.1046 4 18 4H4C2.89543 4 2 4.89543 2 6V16C2 17.1046 2.89543 18 4 18H9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M2 8.5H20" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M13.5 17.5L16 20L21.5 14.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconProgress({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <rect x="4" y="9" width="3.5" height="11" rx="0.8" />
      <rect x="10.25" y="4" width="3.5" height="16" rx="0.8" />
      <rect x="16.5" y="13" width="3.5" height="7" rx="0.8" />
    </svg>
  );
}

function IconNotice({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect
        x="3.5"
        y="4"
        width="17"
        height="16"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M3.5 8.5H20.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function IconLiveCamera({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect
        x="2.5"
        y="5.5"
        width="14.5"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M17 10.2L21.5 7.5V16.5L17 13.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.5 12H13M6.5 12L8.3 10.2M6.5 12L8.3 13.8M13 12L11.2 10.2M13 12L11.2 13.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconRefer({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect
        x="3.5"
        y="8.5"
        width="17"
        height="3.5"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M5 12V19C5 19.5523 5.44772 20 6 20H18C18.5523 20 19 19.5523 19 19V12"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path d="M12 8.5V20" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M12 8.5C12 8.5 10.5 4.5 8.2 4.5C6.7 4.5 5.8 5.6 6.2 6.9C6.6 8.2 8.5 8.5 12 8.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M12 8.5C12 8.5 13.5 4.5 15.8 4.5C17.3 4.5 18.2 5.6 17.8 6.9C17.4 8.2 15.5 8.5 12 8.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSupport({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M4 13V12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12V16.5C20 18.433 18.433 20 16.5 20H13"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <rect x="3" y="11.5" width="3" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
      <rect x="18" y="11.5" width="3" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="9.5" cy="12" r="1" fill="currentColor" />
      <circle cx="14.5" cy="12" r="1" fill="currentColor" />
      <path
        d="M9.5 15.2C10.2 15.9 11.1 16.2 12 16.2C12.9 16.2 13.8 15.9 14.5 15.2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconProfile({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="8" r="3.6" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M5 19.5C5 16.4624 8.13401 14 12 14C15.866 14 19 16.4624 19 19.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconLogout({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M11 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20H11"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M9.5 12H20M20 12L16.5 8.5M20 12L16.5 15.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconWishlist({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M19.4626 3.99415C16.7809 2.34923 14.4404 3.01211 13.0344 4.06801C12.4578 4.50096 12.1696 4.71743 12 4.71743C11.8304 4.71743 11.5422 4.50096 10.9656 4.06801C9.55962 3.01211 7.21909 2.34923 4.53744 3.99415C1.01807 6.15294 0.22172 13.2749 8.33953 19.2834C9.88572 20.4278 10.6588 21 12 21C13.3412 21 14.1143 20.4278 15.6605 19.2834C23.7783 13.2749 22.9819 6.15294 19.4626 3.99415Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const NAV_ITEMS: { id: DashboardTab; label: string; icon: React.ElementType }[] = [
  { id: "overviews", label: "Overviews", icon: IconOverviews },
  { id: "payment", label: "Payment", icon: IconPayment },
  { id: "progress", label: "Progress", icon: IconProgress },
  { id: "wishlist", label: "Wishlist", icon: IconWishlist },
  { id: "notice", label: "Notice", icon: IconNotice },
  { id: "live-camera", label: "Live Camera", icon: IconLiveCamera },
  { id: "refer", label: "Refer & Earn", icon: IconRefer },
  { id: "support", label: "Support", icon: IconSupport },
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
          "fixed top-0 bottom-0 left-0 z-50 w-[280px] h-screen bg-white border-r border-[#f0f0f0] flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:sticky lg:top-0 lg:z-30 shrink-0 overflow-y-auto no-scrollbar",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Top Logo Header (Figma 8313:22290: p-[24px], logo 195.078x44, menu starts at y=117) */}
        <div className="pt-[24px] px-[24px] pb-[49px] flex items-center justify-between shrink-0">
          <Link
            href="/"
            className="inline-flex items-center group"
            aria-label="The Premium Homes Home"
          >
            <div className="relative h-[44px] w-[195.08px]">
              <Image
                src="/image/logo/LOGO-GREEN.png"
                alt="Premium Homes"
                fill
                priority
                sizes="196px"
                className="object-contain object-left"
              />
            </div>
          </Link>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-1.5 text-[#546360] hover:text-[#054b3c] rounded-lg hover:bg-stone-100"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation + Account Links Block (Figma 8313:22201: gap-[20px], w-[280px]) */}
        <div className="flex flex-col gap-[20px] items-center w-full shrink-0">
          {/* Primary Navigation (Figma 8313:22202: gap-[4px]) */}
          <nav className="flex flex-col gap-[4px] items-center justify-center w-full px-[16px]">
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
                    "relative w-[248px] flex items-center gap-[12px] px-[24px] rounded-[100px] font-sans text-[16px] font-normal leading-none transition-colors duration-200 cursor-pointer select-none text-left overflow-hidden",
                    isActive
                      ? "text-white h-[48px] py-[12px]"
                      : "text-[#546360] hover:bg-[#054b3c]/5 hover:text-[#054b3c] h-[52px] py-[14px]",
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="dashboard-sidebar-active-pill"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                      className="absolute inset-0 bg-[#054b3c] rounded-[100px] z-0"
                    />
                  )}
                  <Icon
                    className={cn(
                      "relative z-10 size-[24px] shrink-0 transition-colors",
                      isActive ? "text-white" : "text-[#546360]",
                    )}
                  />
                  <span className="relative z-10 whitespace-nowrap">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Mint-Teal Divider Line (Figma 8313:22264: bg-[#c7e6e0] h-px w-[248px]) */}
          <div className="bg-[#c7e6e0] h-px w-[248px] shrink-0" />

          {/* Lower Account Links (Figma 8313:22265: Profile Setting & Log Out) */}
          <div className="flex flex-col items-center w-full px-[16px]">
            <button
              type="button"
              onClick={() => {
                setActiveTab("profile");
                if (onClose) onClose();
              }}
              className={cn(
                "relative w-[248px] h-[53px] flex items-center gap-[12px] px-[24px] py-[8px] rounded-[100px] font-sans text-[16px] font-normal leading-none transition-colors duration-200 cursor-pointer select-none text-left overflow-hidden",
                activeTab === "profile"
                  ? "text-white"
                  : "text-[#546360] hover:bg-[#054b3c]/5 hover:text-[#054b3c]",
              )}
            >
              {activeTab === "profile" && (
                <motion.span
                  layoutId="dashboard-sidebar-active-pill"
                  transition={{
                    type: "spring",
                    stiffness: 380,
                    damping: 32,
                  }}
                  className="absolute inset-0 bg-[#054b3c] rounded-[100px] z-0"
                />
              )}
              <IconProfile
                className={cn(
                  "relative z-10 size-[24px] shrink-0 transition-colors",
                  activeTab === "profile" ? "text-white" : "text-[#546360]",
                )}
              />
              <span className="relative z-10 whitespace-nowrap">Profile Setting</span>
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="w-[248px] h-[53px] flex items-center gap-[12px] px-[24px] py-[8px] rounded-[100px] font-sans text-[16px] font-normal leading-none text-[#546360] hover:text-red-700 hover:bg-red-50/70 transition-all duration-200 cursor-pointer select-none text-left group"
            >
              <IconLogout className="size-[24px] shrink-0 text-[#546360] group-hover:text-red-700 transition-colors" />
              <span className="whitespace-nowrap">Log Out</span>
            </button>
          </div>
        </div>

        {/* Bottom Promo Card: Find your Dream home with premium homes (Figma 8313:22284) */}
        <div className="mt-[26px] mb-[24px] px-[16px] shrink-0 flex justify-center">
          <div
            className="relative w-[248px] h-[318px] rounded-[8px] overflow-hidden bg-[#f1f2f6] bg-cover bg-no-repeat bg-bottom"
            style={{
              backgroundImage: "url('/image/home_hero_bg.png')",
            }}
          >
            {/* Dark top gradient fading to show architectural towers at bottom */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#040c18] via-[#07182c]/75 to-transparent pointer-events-none" />

            <div className="absolute left-[20px] top-[20px] w-[209px] flex flex-col items-center gap-[16px] z-10">
              <h4 className="font-[family-name:var(--font-heading)] text-[24px] font-medium leading-[1.1] text-white text-center capitalize">
                Find your
                <br />
                Dream home with premium homes
              </h4>

              <Link
                href="/projects"
                className="press relative flex w-[140px] h-[36px] items-center justify-center overflow-hidden rounded-[100px] px-[32px] py-[14px] shadow-[0px_4px_22.2px_-10px_rgba(50,38,29,0),0px_12px_20px_0px_rgba(108,73,19,0.1)]"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-[100px] backdrop-blur-[50px] bg-[#cfa564] pointer-events-none"
                />
                <span className="trim relative z-10 font-sans text-[12px] font-medium leading-[1.7] tracking-[2px] uppercase text-[#2f3233] text-center whitespace-nowrap">
                  Read more
                </span>
                <span
                  aria-hidden
                  className="absolute inset-0 rounded-[inherit] shadow-[inset_0px_7px_21px_0px_rgba(255,255,255,0.27),inset_0px_-6px_21px_0px_rgba(207,165,100,0.07)] pointer-events-none"
                />
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
