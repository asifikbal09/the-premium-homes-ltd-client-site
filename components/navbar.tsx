"use client";

import React, { useState, useEffect, useRef, useMemo, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, ChevronRight, LogIn, LogOut, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProjectData } from "@/lib/projects";

const emptySubscribe = () => () => { };

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
}

const NAV_ITEMS_CONFIG: NavMenuItemConfig[] = [
  { name: "Home", href: "/" },
  { name: "About TPHL", href: "/about" },
  { name: "Leadership Team", href: "/team" },
  { name: "Projects", href: "/projects" },
  { name: "Projects Progress", href: "/project-progress" },
  { name: "Life At TPHL", href: "/life-at-premium-homes" },
  { name: "Careers", href: "/careers" },
  { name: "News & Events", href: "/blogs" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact Us", href: "/contact" },
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
// Module-level cache so we only fetch projects once for search
let cachedProjects: ProjectData[] | null = null;

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [liveProjects, setLiveProjects] = useState<ProjectData[]>(() => cachedProjects || []);
  const pathname = usePathname();
  const router = useRouter();

  // Check user login state whenever drawer opens or storage event fires
  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkAuth = () => {
        const token =
          localStorage.getItem("tphl_auth_token") ||
          localStorage.getItem("token") ||
          localStorage.getItem("tphl_user") ||
          localStorage.getItem("user");
        setIsLoggedIn(Boolean(token));
      };
      checkAuth();
      window.addEventListener("storage", checkAuth);
      return () => window.removeEventListener("storage", checkAuth);
    }
  }, [isOpen]);

  const handleLogout = () => {
    try {
      localStorage.removeItem("tphl_auth_token");
      localStorage.removeItem("token");
      localStorage.removeItem("tphl_user_id");
      localStorage.removeItem("user_id");
      localStorage.removeItem("tphl_user");
      localStorage.removeItem("user");
      localStorage.removeItem("tphl_auth_data");
    } catch {
      // ignore
    }
    setIsLoggedIn(false);
    handleClose();
    router.push("/login");
  };

  // Load live projects for search from API (cached across opens)
  useEffect(() => {
    if (isOpen) {
      if (cachedProjects && cachedProjects.length > 0) {
        setLiveProjects(cachedProjects);
        return;
      }
      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL;
      if (baseUrl) {
        const cleanBase = baseUrl.replace(/\/+$/, "");
        fetch(`${cleanBase}/projects`)
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            const rawList = Array.isArray(data)
              ? data
              : data?.projects || data?.data || [];
            if (Array.isArray(rawList)) {
              cachedProjects = rawList;
              setLiveProjects(rawList);
            }
          })
          .catch((err) =>
            console.error("[NavDropdownMenu] Search projects fetch error:", err),
          );
      }
    }
  }, [isOpen]);

  const handleClose = React.useCallback(() => {
    setSearchQuery("");
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
    return liveProjects
      .filter((p) => {
        const nameMatch = p.name?.toLowerCase().includes(q);
        const locMatch = p.location?.toLowerCase().includes(q);
        const commMatch = p.community?.name?.toLowerCase().includes(q);
        return nameMatch || locMatch || commMatch;
      })
      .slice(0, 6);
  }, [searchQuery, liveProjects]);

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
            className="fixed inset-0 z-[9998] bg-black/40 cursor-default pointer-events-auto"
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
              "bg-[#070e0d]/95 sm:bg-[#070e0d]/90 backdrop-blur-2xl border-l border-white/10 shadow-[-20px_0_60px_rgba(0,0,0,0.6)]",
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
            <div className="shrink-0 pt-6 sm:pt-8 px-6 sm:px-8 pb-3 flex items-center justify-between border-b border-white/5">
              <Link
                href="/"
                onClick={handleClose}
                className="relative h-6 sm:h-7 w-28 sm:w-32 opacity-90 hover:opacity-100 transition-opacity"
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
                className="group inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] uppercase text-white/80 hover:text-white transition-colors cursor-pointer py-1 px-1.5 -mr-1.5"
              >
                <span>CLOSE</span>
                <X className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90 text-white/90" />
              </button>
            </div>

            {/* SEARCH PROJECTS INPUT */}
            <div className="shrink-0 px-6 sm:px-8 pt-4 pb-3">
              <div className="relative flex items-center w-full py-2 border-b border-white/20 focus-within:border-[#d0a65b] transition-colors">
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
                  placeholder="Search Projects..."
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
                        href={`/projects/${project.slug || project.id}`}
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
                <nav className="flex flex-col space-y-3.5 sm:space-y-4 py-2 pb-6">
                  {NAV_ITEMS_CONFIG.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={handleClose}
                        className={cn(
                          "group flex items-center text-base sm:text-lg font-medium transition-all duration-200",
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

                  {/* Auth Action: Login or Dashboard + Logout */}
                  <div className="pt-4 mt-2 border-t border-white/10 space-y-2.5">
                    {isLoggedIn ? (
                      <>
                        <Link
                          href="/dashboard"
                          onClick={handleClose}
                          className="group flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#d0a65b]/15 hover:bg-[#d0a65b] border border-[#d0a65b]/30 text-[#d0a65b] hover:text-[#044133] font-medium text-sm transition-all"
                        >
                          <span>Dashboard</span>
                          <LayoutDashboard className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-red-500/15 border border-white/10 hover:border-red-500/30 text-white/80 hover:text-red-400 font-medium text-sm transition-all cursor-pointer"
                        >
                          <span>Log Out</span>
                          <LogOut className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <Link
                        href="/login"
                        onClick={handleClose}
                        className="group flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#d0a65b] hover:bg-[#b88f46] text-[#044133] font-semibold text-sm transition-all shadow-md"
                      >
                        <span>Login</span>
                        <LogIn className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </nav>
              )}
            </div>

            {/* DRAWER FOOTER: Quick Helpline & Social Media Icons */}
            <div className="shrink-0 px-6 sm:px-8 py-4 border-t border-white/10 bg-black/25 flex flex-col gap-3">
              <div className="flex items-center justify-between text-[11px] sm:text-xs">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.14em] text-white/40 block">Hotline</span>
                  <a
                    href="tel:+8801900000000"
                    className="font-medium text-[#d0a65b] hover:underline"
                  >
                    +880 1900-000000
                  </a>
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase tracking-[0.14em] text-white/40 block">Inquiries</span>
                  <a
                    href="mailto:info@thepremiumhomes.com"
                    className="font-medium text-white/80 hover:text-white"
                  >
                    info@thepremiumhomes.com
                  </a>
                </div>
              </div>

              {/* Follow Us Social Icons */}
              <div className="pt-2 flex items-center justify-between border-t border-white/10">
                <span className="text-[10px] uppercase tracking-[0.14em] text-white/40 font-semibold">
                  Follow Us
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-7 h-7 rounded-full border border-white/15 hover:border-[#d0a65b] hover:text-[#d0a65b] text-white/70 flex items-center justify-center transition-all hover:scale-105"
                  >
                    <FacebookIcon className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-7 h-7 rounded-full border border-white/15 hover:border-[#d0a65b] hover:text-[#d0a65b] text-white/70 flex items-center justify-center transition-all hover:scale-105"
                  >
                    <InstagramIcon className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="w-7 h-7 rounded-full border border-white/15 hover:border-[#d0a65b] hover:text-[#d0a65b] text-white/70 flex items-center justify-center transition-all hover:scale-105"
                  >
                    <YoutubeIcon className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="w-7 h-7 rounded-full border border-white/15 hover:border-[#d0a65b] hover:text-[#d0a65b] text-white/70 flex items-center justify-center transition-all hover:scale-105"
                  >
                    <LinkedinIcon className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href="https://tiktok.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                    className="w-7 h-7 rounded-full border border-white/15 hover:border-[#d0a65b] hover:text-[#d0a65b] text-white/70 flex items-center justify-center transition-all hover:scale-105"
                  >
                    <TiktokIcon className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

export interface NavbarProps {
  theme?: "dark" | "light";
}

export function Navbar({ theme }: NavbarProps = {}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navContainerRef = useRef<HTMLDivElement>(null);

  // Determine if header at scroll 0 should use light theme (green logo & dark text)
  const isLightTop =
    !isScrolled && (theme === "light" || pathname === "/about");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
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
          ? "bg-[#031310]/95 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.4)] border-b border-white/10 py-2.5 sm:py-3.5"
          : "bg-transparent border-b border-transparent py-3.5 sm:py-4 md:py-5",
      )}
    >
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="group relative flex items-center transition-transform duration-300 hover:scale-[1.02]"
          aria-label="Premium Homes Home"
        >
          <div className="relative h-7 sm:h-8 md:h-9 w-32 sm:w-40 md:w-44">
            <Image
              src={
                isLightTop
                  ? "/image/logo/LOGO-GREEN.png"
                  : "/image/logo/LOGO-WHITE.png"
              }
              alt="Premium Homes"
              fill
              sizes="(max-width: 640px) 130px, 180px"
              priority
              className="object-contain object-left"
            />
          </div>
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/projects"
            className={cn(
              "group relative inline-flex items-center justify-center px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-normal tracking-[0.14em] uppercase transition-all duration-300 shadow-sm active:scale-95",
              isScrolled
                ? "bg-white/10 hover:bg-white/20 border border-white/20 text-white"
                : isLightTop
                  ? "border border-[#1f2723]/30 hover:border-[#1f2723]/60 hover:bg-black/[0.04] text-[#1f2723]"
                  : "bg-black/35 hover:bg-black/55 border border-white/25 backdrop-blur-md text-white",
            )}
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
              "group relative inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-normal tracking-[0.14em] uppercase border transition-all duration-300 shadow-sm cursor-pointer active:scale-95",
              isScrolled
                ? isOpen
                  ? "bg-white/25 border-white/40 text-white"
                  : "bg-white/10 hover:bg-white/20 border-white/20 text-white"
                : isLightTop
                  ? isOpen
                    ? "bg-[#1f2723]/10 border-[#1f2723]/60 text-[#1f2723]"
                    : "border-[#1f2723]/30 hover:border-[#1f2723]/60 hover:bg-black/[0.04] text-[#1f2723]"
                  : isOpen
                    ? "bg-black/60 border-white/40 text-white backdrop-blur-md"
                    : "bg-black/35 hover:bg-black/55 border-white/25 backdrop-blur-md text-white",
            )}
          >
            <span
              className="flex flex-col items-center justify-center gap-[4px] w-3.5"
              aria-hidden="true"
            >
              <span
                className={cn(
                  "block h-[1.5px] w-full rounded-full transition-transform duration-200",
                  isLightTop ? "bg-[#1f2723]" : "bg-white",
                  isOpen && "rotate-45 translate-y-[2.7px]",
                )}
              />
              <span
                className={cn(
                  "block h-[1.5px] w-full rounded-full transition-transform duration-200",
                  isLightTop ? "bg-[#1f2723]" : "bg-white",
                  isOpen && "-rotate-45 -translate-y-[2.7px]",
                )}
              />
            </span>
            <span>MENU</span>
          </button>
        </div>
      </div>

      {/* Off-Canvas Luxury Side Drawer attached to Navbar */}
      <NavDropdownMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </header>
  );
}

// Deprecated alias for backwards compatibility
export const LuxuryMenuModal = NavDropdownMenu;
