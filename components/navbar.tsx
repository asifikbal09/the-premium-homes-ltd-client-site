"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Phone, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavItem {
  number: string;
  name: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { number: "01", name: "HOME", href: "/" },
  { number: "02", name: "ABOUT US", href: "/about" },
  { number: "03", name: "ALL PROJECTS", href: "/projects" },
  { number: "04", name: "PROJECTS PROGRESS", href: "/project-progress" },
  { number: "05", name: "LIFE AT TPHL", href: "/life-at-premium-homes" },
  { number: "06", name: "LEADERSHIP TEAM", href: "/team" },
  { number: "07", name: "BLOGS & ARTICLES", href: "/blogs" },
  { number: "08", name: "CAREERS", href: "/careers" },
  { number: "09", name: "FAQ", href: "/faq" },
  { number: "10", name: "CONTACT US", href: "/contact" },
];

export interface NavDropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

/**
 * Off-Canvas Luxury Side Drawer Navigation Menu (Concept 3)
 * Portals directly into document.body to guarantee freedom from parent overflow/clipping.
 * Features luxury dark emerald backdrop, smooth spring slide-in, active indicators,
 * direct contact actions, and touch-friendly scrolling.
 */
export function NavDropdownMenu({
  isOpen,
  onClose,
  className,
}: NavDropdownMenuProps) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          data-navigation-drawer="true"
          className={cn(
            "fixed inset-0 z-[9999] flex justify-end select-none pointer-events-auto",
            className,
          )}
        >
          {/* Backdrop Blur Overlay */}
          <motion.div
            key="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={onClose}
            onMouseDown={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
            aria-hidden="true"
          />

          {/* Off-Canvas Luxury Side Drawer Panel */}
          <motion.aside
            key="drawer-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-[420px] sm:max-w-[460px] h-[100dvh] bg-[#031310] border-l border-white/10 shadow-[-24px_0_64px_rgba(0,0,0,0.85)] flex flex-col justify-between overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Site Navigation"
          >
            {/* Top Bar with Brand & Close Button */}
            <div className="shrink-0 px-6 sm:px-8 py-4 sm:py-5 border-b border-white/10 flex items-center justify-between bg-[#031310]/90 backdrop-blur-md">
              <Link
                href="/"
                onClick={onClose}
                className="group relative flex items-center transition-transform duration-200 hover:scale-[1.02]"
                aria-label="The Premium Homes"
              >
                <div className="relative h-7 sm:h-8 w-32 sm:w-36">
                  <Image
                    src="/image/logo/LOGO-WHITE.png"
                    alt="Premium Homes"
                    fill
                    sizes="160px"
                    className="object-contain object-left"
                  />
                </div>
              </Link>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close navigation menu"
                className="group inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] font-semibold tracking-[0.14em] uppercase text-white bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/40 transition-all duration-200 cursor-pointer active:scale-95"
              >
                <X className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-90 text-[#d0a65b]" />
                <span>CLOSE</span>
              </button>
            </div>

            {/* Scrollable Navigation Items */}
            <div className="flex-1 overflow-y-auto px-5 sm:px-7 py-5 space-y-1 scrollbar-thin scrollbar-thumb-white/15">
              <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#d0a65b] mb-2.5 px-3">
                Navigation
              </div>

              <nav className="flex flex-col space-y-1">
                {NAV_ITEMS.map((item, index) => {
                  const isActive = pathname === item.href;
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.04 + index * 0.025,
                        duration: 0.28,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "group flex items-center justify-between px-3.5 py-2.5 sm:py-3 rounded-xl transition-all duration-200",
                          isActive
                            ? "bg-white/[0.08] text-[#d0a65b] border border-[#d0a65b]/35 shadow-xs"
                            : "text-white/80 hover:text-white hover:bg-white/[0.04] border border-transparent",
                        )}
                      >
                        <div className="flex items-center gap-3.5">
                          <span
                            className={cn(
                              "text-[10px] font-mono tracking-wider transition-colors duration-200",
                              isActive
                                ? "text-[#d0a65b] font-bold"
                                : "text-white/40 group-hover:text-[#d0a65b]",
                            )}
                          >
                            {item.number}
                          </span>
                          <span
                            className={cn(
                              "text-xs sm:text-[13px] font-semibold tracking-[0.14em] uppercase transition-transform duration-200 group-hover:translate-x-1",
                              isActive
                                ? "text-[#d0a65b]"
                                : "text-white/90 group-hover:text-white",
                            )}
                          >
                            {item.name}
                          </span>
                        </div>

                        <ArrowRight
                          className={cn(
                            "w-3.5 h-3.5 transition-all duration-200",
                            isActive
                              ? "text-[#d0a65b] opacity-100"
                              : "text-white/30 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:text-[#d0a65b]",
                          )}
                        />
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Section: CTA & Direct Contact */}
            <div className="shrink-0 p-5 sm:p-7 bg-[#020c0a] border-t border-white/10 space-y-4">
              {/* Primary CTA */}
              <Link
                href="/contact"
                onClick={onClose}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 rounded-xl text-xs font-semibold tracking-[0.14em] uppercase text-[#031310] bg-[#d0a65b] hover:bg-[#e0b768] transition-all duration-200 shadow-md active:scale-98"
              >
                <span>SCHEDULE PRIVATE VIEWING</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              {/* Direct Phone & Office Info */}
              <div className="grid grid-cols-2 gap-3 pt-1 text-xs text-white/70">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[#d0a65b] font-medium mb-1 flex items-center gap-1">
                    <Phone className="w-2.5 h-2.5" /> Direct Call
                  </div>
                  <a
                    href="tel:+8801794621487"
                    className="hover:text-white transition-colors block text-[11px] font-mono"
                  >
                    +880 1794-621487
                  </a>
                  <a
                    href="tel:+971543086000"
                    className="hover:text-white transition-colors block text-[11px] font-mono mt-0.5"
                  >
                    +971 54 308 6000
                  </a>
                </div>

                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[#d0a65b] font-medium mb-1 flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5" /> Office
                  </div>
                  <p className="text-[11px] text-white/60 leading-tight">
                    House 15, Road 7, Block B, Bashundhara R/A, Dhaka
                  </p>
                </div>
              </div>

              {/* Social Channels & Copyright */}
              <div className="pt-2.5 border-t border-white/[0.08] flex items-center justify-between text-[10px] text-white/40">
                <span>© 2026 The Premium Homes</span>
                <div className="flex items-center gap-3">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#d0a65b] transition-colors"
                  >
                    Facebook
                  </a>
                  <span>•</span>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#d0a65b] transition-colors"
                  >
                    Instagram
                  </a>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body,
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
      const target = event.target as Element;
      if (target?.closest?.("[data-navigation-drawer]")) {
        return;
      }
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
                  src="/image/logo/LOGO-WHITE.png"
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

      {/* Off-Canvas Luxury Side Drawer attached to Navbar */}
      <NavDropdownMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </header>
  );
}

// Deprecated alias for backwards compatibility
export const LuxuryMenuModal = NavDropdownMenu;
