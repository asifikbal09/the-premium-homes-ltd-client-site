"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href: string;
  number: string;
  description?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    name: "Home",
    href: "#home",
    number: "01",
    description: "Return to the main experience",
  },
  {
    name: "Team",
    href: "#team",
    number: "02",
    description: "Meet our architects & visionary leaders",
  },
  {
    name: "Blogs",
    href: "#blogs",
    number: "03",
    description: "Insights, architecture trends & lifestyle",
  },
  {
    name: "Reviews",
    href: "#reviews",
    number: "04",
    description: "Testimonials from esteemed homeowners",
  },
  {
    name: "FAQ",
    href: "#faq",
    number: "05",
    description: "Frequently asked questions & inquiries",
  },
  {
    name: "Contact",
    href: "#contact",
    number: "06",
    description: "Consult with our property advisors",
  },
  {
    name: "About",
    href: "#about",
    number: "07",
    description: "Our heritage, philosophy and mission",
  },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Floating Scrolled Header (Slides down only when scrolling down page) */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-400",
          isScrolled
            ? "translate-y-0 opacity-100 bg-[#031310]/95 backdrop-blur-md shadow-xl border-b border-white/10 py-3 sm:py-3.5"
            : "-translate-y-full opacity-0 pointer-events-none py-3",
        )}
      >
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
                href="#projects"
                className="group relative inline-flex items-center justify-center px-4 sm:px-5 py-2 rounded-full text-[11px] sm:text-xs font-semibold tracking-[0.14em] uppercase text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300 shadow-sm"
              >
                <span>ALL PROJECT</span>
              </Link>

              <button
                type="button"
                onClick={() => setIsOpen(true)}
                aria-label="Open Navigation Menu"
                className="group relative inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2 rounded-full text-[11px] sm:text-xs font-semibold tracking-[0.14em] uppercase text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300 shadow-sm cursor-pointer active:scale-95"
              >
                <span
                  className="flex flex-col justify-center gap-[4.5px] w-3.5"
                  aria-hidden="true"
                >
                  <span className="block h-[1.5px] w-full bg-white rounded-full" />
                  <span className="block h-[1.5px] w-full bg-white rounded-full" />
                </span>
                <span>MENU</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <LuxuryMenuModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

export function LuxuryMenuModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  // Handle ESC key to close menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col bg-[#031713]/95 backdrop-blur-2xl text-[#fdfdf8] overflow-y-auto"
        >
          {/* Subtle luxury background elements */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30">
            <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-[#055b4b]/20 blur-[130px]" />
            <div className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-[#d0a65b]/10 blur-[150px]" />
          </div>

          {/* Menu Header Bar */}
          <div className="sticky top-0 z-20 w-full bg-[#031713]/70 backdrop-blur-md border-b border-white/[0.06]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-between">
              <Link
                href="/"
                onClick={onClose}
                className="relative h-8 sm:h-9 md:h-10 w-40 sm:w-48 md:w-56"
              >
                <Image
                  src="/image/logo.png"
                  alt="Premium Homes"
                  fill
                  sizes="(max-width: 640px) 160px, (max-width: 768px) 192px, 224px"
                  className="object-contain object-left"
                />
              </Link>

              {/* CLOSE Pill Button */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close Navigation Menu"
                className="group inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-semibold tracking-[0.14em] uppercase text-[#fdfdf8] bg-white/[0.08] hover:bg-white/[0.18] border border-white/25 hover:border-white/40 transition-all duration-300 shadow-sm cursor-pointer active:scale-95"
              >
                <span className="text-sm leading-none transition-transform duration-300 group-hover:rotate-90">
                  ✕
                </span>
                <span>CLOSE</span>
              </button>
            </div>
          </div>

          {/* Menu Content Body */}
          <div className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16 flex flex-col justify-between">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
              {/* Left / Main Navigation Links */}
              <nav
                aria-label="Main Navigation Links"
                className="lg:col-span-7 flex flex-col divide-y divide-white/[0.08]"
              >
                {NAV_ITEMS.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.08 + index * 0.05,
                      duration: 0.5,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="group flex items-baseline justify-between py-3.5 sm:py-4 md:py-5 transition-all duration-300"
                    >
                      <div className="flex items-baseline gap-4 sm:gap-6">
                        <span className="font-mono text-xs sm:text-sm text-[#d0a65b] tracking-wider transition-colors duration-300 group-hover:text-white">
                          {item.number}
                        </span>
                        <span className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-[#fdfdf8] transition-all duration-300 group-hover:text-[#d0a65b] group-hover:translate-x-2">
                          {item.name}
                        </span>
                      </div>
                      <span className="hidden sm:block text-xs uppercase tracking-widest text-white/40 group-hover:text-white/80 transition-colors">
                        Explore →
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Right Editorial / Contact & Brand Panel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.35,
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="lg:col-span-5 flex flex-col justify-between gap-8 sm:gap-12 bg-white/[0.03] border border-white/[0.08] p-6 sm:p-8 md:p-10 rounded-2xl backdrop-blur-md"
              >
                {/* Brand Statement */}
                <div>
                  <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d0a65b] mb-3">
                    TPH Properties
                  </span>
                  <h3 className="font-heading text-xl sm:text-2xl font-normal leading-snug text-[#fdfdf8] mb-3">
                    Building Luxury Communities With Vision, Precision, And
                    Purpose.
                  </h3>
                  <p className="text-sm text-[#fdfdf8]/70 leading-relaxed font-light">
                    From prime residential landmarks to visionary commercial
                    estates, we craft timeless architecture designed for
                    generations.
                  </p>
                </div>

                {/* Direct Contact Details */}
                <div className="space-y-4 pt-4 border-t border-white/[0.08]">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-[#d0a65b] mb-1">
                      Inquiries & Appointments
                    </p>
                    <a
                      href="mailto:hello@premiumhomes.com.bd"
                      className="font-heading text-lg sm:text-xl text-[#fdfdf8] hover:text-[#d0a65b] transition-colors block"
                    >
                      hello@premiumhomes.com.bd
                    </a>
                    <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 mt-1 text-sm text-white/80 font-mono">
                      <a
                        href="tel:+8801794621487"
                        className="hover:text-[#d0a65b] transition-colors"
                      >
                        +8801794 - 621 487
                      </a>
                      <span className="hidden sm:inline text-white/30">•</span>
                      <a
                        href="tel:+971543086000"
                        className="hover:text-[#d0a65b] transition-colors"
                      >
                        +971 54 308 6000
                      </a>
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-[#d0a65b] mb-1">
                      Principal Office
                    </p>
                    <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                      House 15, Road 7, Block B, Bashundhara R/A, Dhaka 1229
                    </p>
                  </div>
                </div>

                {/* Social Channels inside Menu */}
                <div className="pt-4 border-t border-white/[0.08]">
                  <p className="text-[11px] uppercase tracking-wider text-[#d0a65b] mb-2.5">
                    Follow Us
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    {[
                      "Facebook",
                      "Instagram",
                      "X (Twitter)",
                      "TikTok",
                      "Youtube",
                    ].map((social) => (
                      <a
                        key={social}
                        href="#"
                        className="text-xs px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-[#d0a65b]/20 hover:text-[#d0a65b] border border-white/10 transition-colors"
                      >
                        {social}
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Menu Bottom Bar */}
            <div className="pt-8 sm:pt-12 mt-8 sm:mt-12 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
              <p>© 2026 TPH. All right reserved</p>
              <div className="flex items-center gap-6">
                <a
                  href="#projects"
                  onClick={onClose}
                  className="hover:text-white transition-colors"
                >
                  Explore Projects
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
