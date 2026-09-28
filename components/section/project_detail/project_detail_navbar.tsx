"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavDropdownMenu } from "@/components/navbar";

export function ProjectDetailNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (target?.closest?.("[data-navigation-drawer]")) {
        return;
      }
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={headerRef} className="w-full bg-[#031310] border-b border-white/10 relative z-30">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-12 py-3.5 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="group relative flex items-center transition-transform duration-300 hover:scale-[1.02]"
            aria-label="Premium Homes Home"
          >
            <div className="relative h-7 sm:h-8 w-32 sm:w-40">
              <Image
                src="/image/logo.png"
                alt="Premium Homes"
                fill
                sizes="180px"
                className="object-contain object-left"
              />
            </div>
          </Link>

          {/* Action Links & Menu */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-semibold tracking-[0.12em] uppercase text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-200"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>ALL PROJECTS</span>
            </Link>

            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-label={isOpen ? "Close Navigation Menu" : "Open Navigation Menu"}
              aria-expanded={isOpen}
              className={cn(
                "inline-flex items-center justify-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-semibold tracking-[0.14em] uppercase text-white border transition-all duration-200 cursor-pointer active:scale-95",
                isOpen
                  ? "bg-white/25 border-white/40"
                  : "bg-white/10 hover:bg-white/20 border-white/20",
              )}
            >
              <span className="flex flex-col justify-center gap-[4px] w-3" aria-hidden="true">
                <span
                  className={cn(
                    "block h-[1.5px] w-full bg-white rounded-full transition-transform duration-200",
                    isOpen && "rotate-45 translate-y-[2.5px]",
                  )}
                />
                <span
                  className={cn(
                    "block h-[1.5px] w-full bg-white rounded-full transition-transform duration-200",
                    isOpen && "-rotate-45 -translate-y-[2.5px]",
                  )}
                />
              </span>
              <span>MENU</span>
            </button>
          </div>
        </div>
      </div>

      {/* Nav Dropdown */}
      <NavDropdownMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}

