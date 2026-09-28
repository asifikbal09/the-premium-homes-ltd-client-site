import React from "react";
import Image from "next/image";

export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading page"
      className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden bg-[#031512] select-none"
    >
      {/* Ambient Luxury Lighting & Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 65% 65% at 50% 50%, rgba(208, 166, 91, 0.14) 0%, rgba(4, 65, 51, 0.28) 45%, rgba(3, 21, 18, 0.95) 85%, #020f0d 100%)",
        }}
      />

      {/* Subtle Architectural Fine Grid Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(208, 166, 91, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(208, 166, 91, 0.4) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Decorative Corner Architectural Accents */}
      <div className="absolute top-6 left-6 sm:top-10 sm:left-10 w-8 h-8 sm:w-12 sm:h-12 border-t border-l border-[#d0a65b]/25 pointer-events-none" />
      <div className="absolute top-6 right-6 sm:top-10 sm:right-10 w-8 h-8 sm:w-12 sm:h-12 border-t border-r border-[#d0a65b]/25 pointer-events-none" />
      <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 w-8 h-8 sm:w-12 sm:h-12 border-b border-l border-[#d0a65b]/25 pointer-events-none" />
      <div className="absolute bottom-6 right-6 sm:bottom-10 sm:right-10 w-8 h-8 sm:w-12 sm:h-12 border-b border-r border-[#d0a65b]/25 pointer-events-none" />

      {/* Centerpiece Content */}
      <div className="relative z-10 flex flex-col items-center px-4 max-w-sm text-center">
        {/* Dual Concentric Orbital Rings with Glowing Halo */}
        <div className="relative flex items-center justify-center w-36 h-36 sm:w-44 sm:h-44 mb-8">
          {/* Ambient Glow */}
          <div className="absolute inset-0 rounded-full bg-[#d0a65b]/10 blur-xl animate-pulse" />

          {/* Outer Rotating Fine Ring with Gold Gradient Arc */}
          <div className="absolute inset-0 rounded-full border border-white/5 border-t-[#d0a65b] border-r-[#d0a65b]/50 animate-[spin_3s_linear_infinite]" />

          {/* Middle Counter-Rotating Dotted Accent Ring */}
          <div className="absolute inset-2 sm:inset-3 rounded-full border border-dashed border-[#d0a65b]/25 animate-[spin_9s_linear_infinite_reverse]" />

          {/* Inner Glowing Glass Disc with Logo */}
          <div className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#04241d]/75 backdrop-blur-md border border-[#d0a65b]/30 shadow-[0_0_35px_rgba(208,166,91,0.18)]">
            <div className="relative w-16 h-8 sm:w-20 sm:h-10">
              <Image
                src="/image/logo/LOGO-WHITE.png"
                alt="The Premium Homes"
                fill
                sizes="(max-width: 640px) 80px, 100px"
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>

        {/* Brand Titles & Tagline */}
        <div className="space-y-2 mb-7">
          <h2 className="font-heading text-lg sm:text-xl font-light tracking-[0.28em] text-[#fdfdf8] uppercase">
            The Premium Homes
          </h2>
          <p className="text-[11px] sm:text-xs font-sans tracking-[0.22em] text-[#d0a65b] uppercase font-medium">
            Crafting Architectural Excellence
          </p>
        </div>

        {/* Precision Progress Bar */}
        <div className="w-48 sm:w-56 h-[2px] bg-white/10 rounded-full overflow-hidden relative shadow-[0_0_10px_rgba(208,166,91,0.15)]">
          <div className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-[#d0a65b] to-transparent animate-luxury-shimmer" />
        </div>

        {/* Screen Reader Announcement */}
        <span className="sr-only">Loading application...</span>
      </div>
    </div>
  );
}
