"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface NavItem {
  name: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [


  { name: "ABOUT", href: "/about" },
  { name: "TEAM", href: "/team" },
  { name: "BLOGS", href: "/blogs" },
  { name: "Life At Premium Homes", href: "/life-at-premium-homes" },
  { name: "FAQ", href: "/faq" },
  { name: "Projects Progress", href: "/project-progress" },
  { name: "Careers", href: "/careers" },
  {name: "Contact", href: "/contact" },
];

export interface NavDropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

/**
 * Reusable dropdown menu that slides down directly underneath the header/bar.
 * Exactly matches the design reference with a clean white background and uppercase nav links.
 */
export function NavDropdownMenu({
  isOpen,
  onClose,
  className,
}: NavDropdownMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -6, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -6, height: 0 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "w-full bg-white border-b border-black/10 shadow-xl overflow-hidden select-none",
            className,
          )}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 md:py-5">
            <nav
              aria-label="Dropdown Navigation Menu"
              className="flex flex-wrap items-center justify-center gap-x-5 sm:gap-x-7 md:gap-x-9 lg:gap-x-12 gap-y-2.5"
            >
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className="text-xs sm:text-[13px] md:text-sm font-semibold tracking-[0.14em] uppercase text-[#1e293b] hover:text-[#044133] transition-colors duration-200 py-1"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle ESC key to close dropdown
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navContainerRef.current &&
        !navContainerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <header
      ref={navContainerRef}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0 pointer-events-none",
      )}
    >
      {/* Floating Scrolled Header Bar */}
      <div className="bg-[#031310]/95 backdrop-blur-md shadow-md border-b border-white/10 py-3 sm:py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="group relative flex items-center transition-transform duration-300 hover:scale-[1.02]"
              aria-label="Premium Homes Home"
            >
              <div className="relative h-8 sm:h-9 w-36 sm:w-44">
                <Image
                  src="/image/logo.png"
                  alt="Premium Homes"
                  fill
                  sizes="180px"
                  className="object-contain object-left"
                />
              </div>
            </Link>

            <div className="flex items-center gap-2.5 sm:gap-3.5">
              <Link
                href="/projects"
                className="group relative inline-flex items-center justify-center px-4 sm:px-5 py-2 rounded-full text-[11px] sm:text-xs font-semibold tracking-[0.14em] uppercase text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300 shadow-sm"
              >
                <span>ALL PROJECT</span>
              </Link>

              {/* MENU Toggle Button */}
              <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label={
                  isOpen ? "Close Navigation Menu" : "Open Navigation Menu"
                }
                aria-expanded={isOpen}
                className={cn(
                  "group relative inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 rounded-full text-[11px] sm:text-xs font-semibold tracking-[0.14em] uppercase text-white border transition-all duration-300 shadow-sm cursor-pointer active:scale-95",
                  isOpen
                    ? "bg-white/25 border-white/40"
                    : "bg-white/10 hover:bg-white/20 border-white/20",
                )}
              >
                <span
                  className="flex flex-col justify-center gap-[4.5px] w-3.5"
                  aria-hidden="true"
                >
                  <span
                    className={cn(
                      "block h-[1.5px] w-full bg-white rounded-full transition-transform duration-200",
                      isOpen && "rotate-45 translate-y-[3px]",
                    )}
                  />
                  <span
                    className={cn(
                      "block h-[1.5px] w-full bg-white rounded-full transition-transform duration-200",
                      isOpen && "-rotate-45 -translate-y-[3px]",
                    )}
                  />
                </span>
                <span>MENU</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dropdown Menu attached directly beneath the header */}
      <NavDropdownMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </header>
  );
}

// Deprecated alias for backwards compatibility
export const LuxuryMenuModal = NavDropdownMenu;
