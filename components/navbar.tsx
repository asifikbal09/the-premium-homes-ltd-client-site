"use client";

import React, { useState, useEffect, useRef, useMemo, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { FALLBACK_PROJECTS } from "@/lib/projects";

const emptySubscribe = () => () => {};

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

interface NavMenuItemConfig {
  name: string;
  href: string;
  subItems?: { name: string; href: string }[];
}

const NAV_ITEMS_CONFIG: NavMenuItemConfig[] = [
  { name: "Home", href: "/" },
  {
    name: "About TPHL",
    href: "/about",
    subItems: [
      { name: "About Overview", href: "/about" },
      { name: "Leadership Team", href: "/team" },
      { name: "Frequently Asked Questions", href: "/faq" },
    ],
  },
  {
    name: "Projects",
    href: "/projects",
    subItems: [
      { name: "All Projects", href: "/projects" },
      { name: "Projects Progress", href: "/project-progress" },
    ],
  },
  { name: "Life At TPHL", href: "/life-at-premium-homes" },
  { name: "Careers", href: "/careers" },
  { name: "News & Events", href: "/blogs" },
  {
    name: "Contact Us",
    href: "/contact",
    subItems: [
      { name: "Contact & Viewing", href: "/contact" },
      { name: "Client Portal & Dashboard", href: "/dashboard" },
    ],
  },
  
];

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

function TiktokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01v8.83c0 2.23-.74 4.49-2.31 6.08-1.58 1.6-3.84 2.43-6.07 2.37-2.24-.06-4.45-.98-5.96-2.64-1.51-1.65-2.26-3.92-2.1-6.16.16-2.24 1.19-4.36 2.9-5.78 1.7-1.42 3.97-2.06 6.17-1.79v4.14c-1.13-.19-2.34.05-3.26.74-.92.68-1.47 1.77-1.49 2.91-.02 1.14.49 2.25 1.39 2.96.9.71 2.11.96 3.23.68 1.12-.28 2.04-1.16 2.33-2.27.1-.38.15-.77.15-1.16V.02z" />
    </svg>
  );
}

export interface NavDropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

/**
 * Clean & Professional Glass Drawer Navigation Menu
 * - Opens strictly from the right side.
 * - NO full-page blur or dark overlay (page remains 100% visible and unblurred).
 * - Real glassmorphic drawer background (backdrop-blur-2xl with subtle translucency).
 * - Live "Search Projects" functionality.
 * - Clean, spacious typography matching modern luxury design aesthetic.
 * - Expandable sub-links with subtle chevrons.
 * - "Follow Us" with circular outlined social buttons.
 */
export function NavDropdownMenu({
  isOpen,
  onClose,
  className,
}: NavDropdownMenuProps) {
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const handleClose = React.useCallback(() => {
    setSearchQuery("");
    setExpandedMenu(null);
    onClose();
  }, [onClose]);

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
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  // Live filter matching projects for the search input
  const matchingProjects = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return FALLBACK_PROJECTS.filter((p) => {
      const nameMatch = p.name?.toLowerCase().includes(q);
      const locMatch = p.location?.toLowerCase().includes(q);
      const commMatch = p.community?.name?.toLowerCase().includes(q);
      return nameMatch || locMatch || commMatch;
    }).slice(0, 6);
  }, [searchQuery]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Transparent Outside Click-Catcher (NO blur, NO dark overlay on full page) */}
          <motion.div
            key="drawer-transparent-backdrop"
            data-navigation-drawer="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleClose}
            className="fixed inset-0 z-[9998] bg-transparent cursor-default pointer-events-auto"
            aria-hidden="true"
          />

          {/* Right-Side Glass Drawer Panel */}
          <motion.aside
            key="drawer-panel"
            data-navigation-drawer="true"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={cn(
              "fixed top-0 right-0 bottom-0 z-[9999] w-full max-w-[360px] sm:max-w-[400px] md:max-w-[420px] h-[100dvh] flex flex-col justify-between overflow-hidden select-none",
              // Premium glassmorphism: frosted glass with deep charcoal/emerald tone, fine left border, and ambient shadow
              "bg-[#070e0d]/85 sm:bg-[#070e0d]/80 backdrop-blur-2xl border-l border-white/10 shadow-[-20px_0_60px_rgba(0,0,0,0.6)]",
              className &&
                className
                  .split(" ")
                  .filter((c) => !c.startsWith("mt-") && !c.startsWith("rounded-"))
                  .join(" ")
            )}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation Menu"
          >
            {/* TOP BAR: Brand Logo + Minimalist CLOSE Button */}
            <div className="shrink-0 pt-6 sm:pt-8 px-6 sm:px-8 pb-3 flex items-center justify-between">
              <Link
                href="/"
                onClick={handleClose}
                className="relative h-6 sm:h-7 w-28 sm:w-32 opacity-85 hover:opacity-100 transition-opacity"
                aria-label="The Premium Homes"
              >
                <Image
                  src="/image/logo/LOGO-WHITE.png"
                  alt="Premium Homes"
                  fill
                  sizes="130px"
                  className="object-contain object-left"
                />
              </Link>

              <button
                type="button"
                onClick={handleClose}
                aria-label="Close navigation menu"
                className="group inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] uppercase text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <span>CLOSE</span>
                <X className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-90 text-white/90" />
              </button>
            </div>

            {/* SEARCH PROJECTS INPUT */}
            <div className="shrink-0 px-6 sm:px-8 pt-3 pb-4">
              <div className="relative flex items-center w-full py-2 border-b border-white/20 focus-within:border-[#d0a65b]/80 transition-colors">
                <Search className="w-4 h-4 text-white/45 shrink-0 mr-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      router.push(
                        `/projects?q=${encodeURIComponent(searchQuery.trim())}`
                      );
                      handleClose();
                    }
                  }}
                  placeholder="Search Projects"
                  className="w-full bg-transparent text-sm sm:text-base text-white placeholder:text-white/40 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-white/40 hover:text-white p-1 transition-colors cursor-pointer"
                    aria-label="Clear search query"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* SCROLLABLE MAIN CONTENT: Live Search Results OR Clean Navigation Items */}
            <div className="flex-1 min-h-0 overflow-y-auto px-6 sm:px-8 py-3 scrollbar-thin scrollbar-thumb-white/10">
              {searchQuery.trim() ? (
                /* LIVE PROJECT SEARCH RESULTS */
                <div className="space-y-3 py-1">
                  <div className="text-[11px] uppercase tracking-wider text-white/45 mb-2 font-medium">
                    Projects ({matchingProjects.length})
                  </div>
                  {matchingProjects.length > 0 ? (
                    matchingProjects.map((project) => (
                      <Link
                        key={project.id}
                        href={`/projects/${project.id}`}
                        onClick={handleClose}
                        className="group flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 transition-all"
                      >
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-white/5">
                          <Image
                            src={project.image}
                            alt={project.name}
                            fill
                            sizes="48px"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs sm:text-sm font-medium text-white truncate group-hover:text-[#d0a65b] transition-colors">
                            {project.name}
                          </h4>
                          <p className="text-[11px] text-white/50 truncate">
                            {project.location || project.community?.name}
                          </p>
                          {project.price && (
                            <p className="text-[10px] text-[#d0a65b] font-medium mt-0.5">
                              {project.price}
                            </p>
                          )}
                        </div>
                        <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
                      </Link>
                    ))
                  ) : (
                    <div className="py-8 text-center text-white/50 text-xs">
                      <p>No projects matching &ldquo;{searchQuery}&rdquo;</p>
                      <Link
                        href="/projects"
                        onClick={handleClose}
                        className="inline-block mt-3 text-[#d0a65b] hover:underline text-xs"
                      >
                        Explore All Projects →
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                /* CLEAN NAVIGATION MENU ITEMS */
                <nav className="flex flex-col space-y-4 sm:space-y-5 py-2 pb-8">
                  {NAV_ITEMS_CONFIG.map((item) => {
                    const isActive = pathname === item.href;
                    const isExpanded = expandedMenu === item.name;

                    if (item.subItems && item.subItems.length > 0) {
                      return (
                        <div key={item.name} className="flex flex-col">
                          <div className="flex items-center justify-between">
                            <Link
                              href={item.href}
                              onClick={handleClose}
                              className={cn(
                                "group flex items-center text-lg sm:text-xl font-medium transition-all duration-200",
                                isActive
                                  ? "text-[#d0a65b] font-semibold"
                                  : "text-white/90 hover:text-white"
                              )}
                            >
                              <span className="group-hover:translate-x-1 transition-transform duration-200">
                                {item.name}
                              </span>
                            </Link>

                            <button
                              type="button"
                              onClick={() =>
                                setExpandedMenu(isExpanded ? null : item.name)
                              }
                              aria-label={`Toggle ${item.name} submenu`}
                              className="p-1.5 -mr-1.5 text-white/40 hover:text-[#d0a65b] transition-colors cursor-pointer"
                            >
                              <ChevronRight
                                className={cn(
                                  "w-4 h-4 transition-transform duration-200",
                                  isExpanded && "rotate-90 text-[#d0a65b]"
                                )}
                              />
                            </button>
                          </div>

                          {/* Smooth Accordion Submenu */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.22, ease: "easeOut" }}
                                className="overflow-hidden"
                              >
                                <div className="pl-3.5 pt-2.5 pb-1 mt-1 space-y-2 border-l border-white/15 ml-1">
                                  {item.subItems.map((sub) => (
                                    <Link
                                      key={sub.href}
                                      href={sub.href}
                                      onClick={handleClose}
                                      className={cn(
                                        "block text-sm sm:text-[15px] transition-colors py-1",
                                        pathname === sub.href
                                          ? "text-[#d0a65b] font-medium"
                                          : "text-white/65 hover:text-white hover:translate-x-1 transition-transform"
                                      )}
                                    >
                                      {sub.name}
                                    </Link>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={handleClose}
                        className={cn(
                          "group flex items-center text-lg sm:text-xl font-medium transition-all duration-200",
                          isActive
                            ? "text-[#d0a65b] font-semibold"
                            : "text-white/90 hover:text-white"
                        )}
                      >
                        <span className="group-hover:translate-x-1 transition-transform duration-200">
                          {item.name}
                        </span>
                      </Link>
                    );
                  })}
                </nav>
              )}
            </div>

            {/* BOTTOM SECTION: Follow Us & Social Outlined Icon Buttons */}
            <div className="shrink-0 px-6 sm:px-8 pt-4 pb-6 sm:pb-7 border-t border-white/10 mt-auto bg-black/10">
              <div className="text-xs sm:text-sm font-medium text-white/90 mb-3 tracking-wide">
                Follow Us
              </div>
              <div className="flex items-center gap-2.5">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 rounded-full border border-white/20 hover:border-[#d0a65b] bg-white/[0.02] hover:bg-[#d0a65b]/10 flex items-center justify-center text-white/80 hover:text-[#d0a65b] transition-all duration-200 active:scale-95 group"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>

                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-full border border-white/20 hover:border-[#d0a65b] bg-white/[0.02] hover:bg-[#d0a65b]/10 flex items-center justify-center text-white/80 hover:text-[#d0a65b] transition-all duration-200 active:scale-95 group"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>

                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-9 h-9 rounded-full border border-white/20 hover:border-[#d0a65b] bg-white/[0.02] hover:bg-[#d0a65b]/10 flex items-center justify-center text-white/80 hover:text-[#d0a65b] transition-all duration-200 active:scale-95 group"
                >
                  <YoutubeIcon className="w-4 h-4" />
                </a>

                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-9 h-9 rounded-full border border-white/20 hover:border-[#d0a65b] bg-white/[0.02] hover:bg-[#d0a65b]/10 flex items-center justify-center text-white/80 hover:text-[#d0a65b] transition-all duration-200 active:scale-95 group"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>

                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="w-9 h-9 rounded-full border border-white/20 hover:border-[#d0a65b] bg-white/[0.02] hover:bg-[#d0a65b]/10 flex items-center justify-center text-white/80 hover:text-[#d0a65b] transition-all duration-200 active:scale-95 group"
                >
                  <TiktokIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body
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
