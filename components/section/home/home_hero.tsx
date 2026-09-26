"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ChevronDown,
  Send,
  MoreVertical,
  Check,
  Building2,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NavDropdownMenu } from "@/components/navbar";

// --- Types & Constants ---
interface ChatMessage {
  id: string;
  sender: "advisor" | "user";
  text: string;
  time: string;
}

const STATUS_OPTIONS = [
  { id: "all", label: "All Status" },
  { id: "ready", label: "Ready to Move" },
  { id: "under-construction", label: "Under Construction" },
  { id: "upcoming", label: "Upcoming Projects" },
];

const LOCATION_OPTIONS = [
  { id: "all", label: "All Locations" },
  { id: "uttara", label: "Uttara, Dhaka" },
  { id: "gulshan", label: "Gulshan, Dhaka" },
  { id: "banani", label: "Banani, Dhaka" },
  { id: "dhanmondi", label: "Dhanmondi, Dhaka" },
  { id: "bashundhara", label: "Bashundhara R/A" },
  { id: "mirpur-dohs", label: "Mirpur DOHS" },
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    sender: "advisor",
    text: "Hi there! I can help you find the perfect apartment or house. What kind of property are you looking for?",
    time: "14:20 PM",
  },
  {
    id: "msg-2",
    sender: "user",
    text: "I'm looking for a 3-bedroom apartment in Uttara, budget around 85 lakh.",
    time: "14:21 PM",
  },
];

// --- Search Filter Capsule Component ---
function HeroSearchFilter() {
  const [selectedStatus, setSelectedStatus] = useState("STATUS");
  const [selectedLocation, setSelectedLocation] = useState("LOCATION");
  const [statusOpen, setStatusOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);

  const statusRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        statusRef.current &&
        !statusRef.current.contains(event.target as Node)
      ) {
        setStatusOpen(false);
      }
      if (
        locationRef.current &&
        !locationRef.current.contains(event.target as Node)
      ) {
        setLocationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    const statusParam = selectedStatus !== "STATUS" ? selectedStatus : "all";
    const locParam = selectedLocation !== "LOCATION" ? selectedLocation : "all";
    console.log("Searching properties with:", { statusParam, locParam });
  };

  return (
    <div className="relative inline-flex items-center rounded-full bg-[#16221c]/90 hover:bg-[#16221c] backdrop-blur-md border border-white/20 shadow-[0_12px_36px_rgba(0,0,0,0.55)] p-0.5 sm:p-1 md:p-1.5 transition-all select-none">
      {/* STATUS Dropdown */}
      <div className="relative" ref={statusRef}>
        <button
          type="button"
          onClick={() => {
            setStatusOpen((prev) => !prev);
            setLocationOpen(false);
          }}
          className={cn(
            "flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 md:px-5 py-1 sm:py-1.5 md:py-2 rounded-full text-[9px] sm:text-[11px] md:text-xs font-semibold tracking-[0.14em] uppercase transition-all cursor-pointer",
            statusOpen || selectedStatus !== "STATUS"
              ? "text-white bg-white/15"
              : "text-white/90 hover:text-white hover:bg-white/10",
          )}
          aria-expanded={statusOpen}
          aria-haspopup="listbox"
        >
          <span className="truncate max-w-[65px] sm:max-w-[100px] md:max-w-[120px]">
            {selectedStatus}
          </span>
          <ChevronDown
            className={cn(
              "w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-white/80 transition-transform duration-200 shrink-0",
              statusOpen && "rotate-180 text-white",
            )}
          />
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {statusOpen && (
            <motion.ul
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.96 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="absolute bottom-full mb-3 left-0 min-w-[170px] sm:min-w-[200px] bg-[#091d17]/95 backdrop-blur-2xl border border-white/20 rounded-2xl p-2 shadow-2xl z-50 overflow-hidden"
              role="listbox"
            >
              <div className="px-3 py-1.5 text-[9px] sm:text-[10px] font-bold tracking-widest text-[#d0a65b] uppercase border-b border-white/10 mb-1 flex items-center gap-1.5">
                <Building2 className="w-3 h-3" /> Property Status
              </div>
              {STATUS_OPTIONS.map((item) => {
                const isSelected = selectedStatus === item.label;
                return (
                  <li
                    key={item.id}
                    onClick={() => {
                      setSelectedStatus(
                        item.id === "all" ? "STATUS" : item.label,
                      );
                      setStatusOpen(false);
                    }}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer",
                      isSelected
                        ? "bg-[#044133] text-white"
                        : "text-white/80 hover:bg-white/10 hover:text-white",
                    )}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <span>{item.label}</span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-[#d0a65b]" />
                    )}
                  </li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* Subtle Divider */}
      <div className="h-3 sm:h-4 w-[1px] bg-white/20 mx-0.5 sm:mx-1" />

      {/* LOCATION Dropdown */}
      <div className="relative" ref={locationRef}>
        <button
          type="button"
          onClick={() => {
            setLocationOpen((prev) => !prev);
            setStatusOpen(false);
          }}
          className={cn(
            "flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 md:px-5 py-1 sm:py-1.5 md:py-2 rounded-full text-[9px] sm:text-[11px] md:text-xs font-semibold tracking-[0.14em] uppercase transition-all cursor-pointer",
            locationOpen || selectedLocation !== "LOCATION"
              ? "text-white bg-white/15"
              : "text-white/90 hover:text-white hover:bg-white/10",
          )}
          aria-expanded={locationOpen}
          aria-haspopup="listbox"
        >
          <span className="truncate max-w-[65px] sm:max-w-[100px] md:max-w-[120px]">
            {selectedLocation}
          </span>
          <ChevronDown
            className={cn(
              "w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-white/80 transition-transform duration-200 shrink-0",
              locationOpen && "rotate-180 text-white",
            )}
          />
        </button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {locationOpen && (
            <motion.ul
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.96 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="absolute bottom-full mb-3 left-0 min-w-[180px] sm:min-w-[210px] bg-[#091d17]/95 backdrop-blur-2xl border border-white/20 rounded-2xl p-2 shadow-2xl z-50 overflow-hidden"
              role="listbox"
            >
              <div className="px-3 py-1.5 text-[9px] sm:text-[10px] font-bold tracking-widest text-[#d0a65b] uppercase border-b border-white/10 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3 h-3" /> Select Location
              </div>
              {LOCATION_OPTIONS.map((item) => {
                const isSelected = selectedLocation === item.label;
                return (
                  <li
                    key={item.id}
                    onClick={() => {
                      setSelectedLocation(
                        item.id === "all" ? "LOCATION" : item.label,
                      );
                      setLocationOpen(false);
                    }}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer",
                      isSelected
                        ? "bg-[#044133] text-white"
                        : "text-white/80 hover:bg-white/10 hover:text-white",
                    )}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <span>{item.label}</span>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-[#d0a65b]" />
                    )}
                  </li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* SEARCH Button */}
      <button
        type="button"
        onClick={handleSearch}
        aria-label="Search Properties"
        className="group relative inline-flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 px-2.5 sm:px-4 md:px-6 py-1 sm:py-1.5 md:py-2 rounded-full text-[9px] sm:text-[11px] md:text-xs font-semibold tracking-[0.14em] uppercase text-white bg-[#6b5e4f] hover:bg-[#7b6d5c] border border-white/25 shadow-md transition-all duration-200 cursor-pointer active:scale-95 ml-0.5 sm:ml-1"
      >
        <Search className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-white/95 group-hover:scale-110 transition-transform duration-200" />
        <span className="relative z-10">SEARCH</span>
      </button>
    </div>
  );
}

// --- Advisor Chat Component ---
function HeroAdvisorChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: inputText.trim(),
      time: "Just now",
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `advisor-${Date.now()}`,
          sender: "advisor",
          text: "Excellent choice! We have exclusive luxury 3-bedroom projects in Sector 3 and Sector 11 Uttara. Let me share the floor plans with you.",
          time: "Just now",
        },
      ]);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="w-[270px] sm:w-[300px] md:w-[320px] bg-white rounded-lg sm:rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-black/10 overflow-hidden flex flex-col transition-all"
    >
      {/* Header Bar */}
      <div className="bg-[#ece6dc] border-b border-[#ded7cc] px-3.5 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 ring-1 ring-black/10 bg-[#e0d6c7]">
            <Image
              src="/image/advisor_bornali.png"
              alt="Bornali Haque"
              fill
              sizes="32px"
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-xs sm:text-[13px] font-bold text-[#1a231f] leading-tight">
              Bornali Haque
            </h2>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
              <span className="text-[10px] font-medium text-[#047857]">
                Online
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          aria-label="Chat options"
          className="text-gray-500 hover:text-gray-800 p-1 transition-colors cursor-pointer"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Feed */}
      <div
        ref={chatScrollRef}
        className="p-3 space-y-2.5 max-h-[160px] sm:max-h-[175px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200 bg-white"
      >
        {/* Advisor Message 1 */}
        <div className="flex items-start gap-2">
          <div className="relative w-5 h-5 rounded-full overflow-hidden shrink-0 mt-0.5 ring-1 ring-black/5 bg-[#e0d6c7]">
            <Image
              src="/image/advisor_bornali.png"
              alt="Bornali Haque"
              fill
              sizes="20px"
              className="object-cover"
            />
          </div>
          <div>
            <div className="bg-[#f0ece5] text-[#1c2621] p-2.5 rounded-2xl rounded-tl-xs text-[11px] sm:text-xs leading-relaxed max-w-[210px] shadow-xs">
              Hi there! I can help you find the perfect apartment or house. What
              kind of property are you looking for?
            </div>
            <span className="text-[9px] text-gray-400 block mt-1">
              14:20 PM
            </span>
          </div>
        </div>

        {/* User Message 2 */}
        <div className="flex flex-col items-end">
          <div className="bg-[#054b3c] text-white p-2.5 rounded-2xl rounded-tr-xs text-[11px] sm:text-xs leading-relaxed max-w-[210px] shadow-xs">
            I&apos;m looking for a 3-bedroom apartment in Uttara, budget around
            85 lakh.
          </div>
          <span className="text-[9px] text-gray-400 mt-1">14:21 PM</span>
        </div>

        {/* Typing Indicator Message 3 */}
        <div className="flex items-start gap-2">
          <div className="relative w-5 h-5 rounded-full overflow-hidden shrink-0 mt-0.5 ring-1 ring-black/5 bg-[#e0d6c7]">
            <Image
              src="/image/advisor_bornali.png"
              alt="Bornali Haque"
              fill
              sizes="20px"
              className="object-cover"
            />
          </div>
          <div className="bg-[#f0ece5] px-3 py-2 rounded-2xl rounded-tl-xs flex items-center gap-1.5 shadow-xs">
            <span className="w-1.5 h-1.5 bg-[#055b4b] rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1.5 h-1.5 bg-[#055b4b] rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1.5 h-1.5 bg-[#055b4b] rounded-full animate-bounce" />
          </div>
        </div>
      </div>

      {/* Chat Input Field */}
      <form
        onSubmit={handleSendMessage}
        className="p-2 bg-white border-t border-gray-100 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask Question..."
          aria-label="Ask property question"
          className="w-full bg-[#f2f4f5] text-xs px-3.5 py-1.5 rounded-full text-gray-800 placeholder:text-gray-400 focus:outline-none"
        />
        <button
          type="submit"
          aria-label="Send message"
          disabled={!inputText.trim()}
          className="w-7 h-7 rounded-full bg-[#11241d] hover:bg-[#1a382d] text-white flex items-center justify-center shrink-0 shadow-sm cursor-pointer transition-all active:scale-95 disabled:opacity-40"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </motion.div>
  );
}

// --- Main Hero Section Export ---
export function HomeHero() {
  const [menuOpen, setMenuOpen] = useState(false);
  const heroNavRef = useRef<HTMLDivElement>(null);

  // Close hero dropdown on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  // Close hero dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        heroNavRef.current &&
        !heroNavRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <>
      <section
        id="home"
        aria-label="Hero Section"
        className="w-full md:h-screen lg:h-max-[900px]  "
      >
        {/* Exact 16:9 Contained Card matching user reference on Desktop & Mobile */}
        <div className="relative w-full md:aspect-[16/9] md:h-screen lg:h-max-[900px] xl:h-6xl overflow-hidden border border-black/5 bg-[#031310] flex flex-col justify-between p-3 sm:p-6 md:p-8 lg:p-10 transition-all">
          {/* Background Image Layer */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            <Image
              src="/image/home_hero_bg.png"
              alt="Premium luxury modern architectural high-rise apartments at night"
              fill
              priority
              quality={92}
              sizes=""
              className="object-cover object-center transform scale-100 transition-transform duration-1000 ease-out"
            />
            

            {/* Exact Linear Gradient Overlay matching Figma */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, #000000 0%, rgba(11, 11, 11, 0) 100%)",
              }}
            />
          </div>

          {/* TOP BAR: Logo & Navigation Controls (Directly inside 16:9 Hero Frame) */}
          <div ref={heroNavRef} className="relative z-30 w-full">
            <div className="flex items-center justify-between">
              {/* Brand Logo */}
              <Link
                href="/"
                className="group relative flex items-center transition-transform duration-300 hover:scale-[1.02]"
                aria-label="Premium Homes Home"
              >
                <div className="relative h-4 sm:h-7 md:h-8 lg:h-9 w-20 sm:w-36 md:w-44 lg:w-48">
                  <Image
                    src="/image/logo/LOGO-WHITE.png"
                    alt="Premium Homes"
                    fill
                    sizes="(max-width: 640px) 100px, (max-width: 768px) 180px, 200px"
                    priority
                    className="object-contain object-left"
                  />
                </div>
              </Link>

              {/* Top Right Action Pills */}
              <div className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3">
                {/* ALL PROJECT Button */}
                <Link
                  href="/projects"
                  className="group relative inline-flex items-center justify-center px-2 sm:px-4 md:px-5 py-0.5 sm:py-1.5 md:py-2 rounded-full text-[8px] sm:text-[11px] md:text-xs font-semibold tracking-[0.12em] uppercase text-white bg-black/35 hover:bg-black/55 border border-white/20 hover:border-white/35 backdrop-blur-md transition-all duration-200 shadow-sm active:scale-95"
                >
                  <span>ALL PROJECT</span>
                </Link>

                {/* MENU Toggle Button */}
                <button
                  type="button"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  aria-label={
                    menuOpen ? "Close Navigation Menu" : "Open Navigation Menu"
                  }
                  aria-expanded={menuOpen}
                  className={cn(
                    "group relative inline-flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 md:px-5 py-0.5 sm:py-1.5 md:py-2 rounded-full text-[8px] sm:text-[11px] md:text-xs font-semibold tracking-[0.12em] uppercase text-white border backdrop-blur-md transition-all duration-200 shadow-sm cursor-pointer active:scale-95",
                    menuOpen
                      ? "bg-black/60 border-white/40"
                      : "bg-black/35 hover:bg-black/55 border-white/20 hover:border-white/35",
                  )}
                >
                  <span
                    className="flex flex-col justify-center gap-[3px] sm:gap-[4px] w-2.5 sm:w-3.5"
                    aria-hidden="true"
                  >
                    <span
                      className={cn(
                        "block h-[1px] sm:h-[1.5px] w-full bg-white rounded-full transition-transform duration-200",
                        menuOpen &&
                          "rotate-45 translate-y-[2px] sm:translate-y-[2.5px]",
                      )}
                    />
                    <span
                      className={cn(
                        "block h-[1px] sm:h-[1.5px] w-full bg-white rounded-full transition-transform duration-200",
                        menuOpen &&
                          "-rotate-45 -translate-y-[2px] sm:-translate-y-[2.5px]",
                      )}
                    />
                  </span>
                  <span>MENU</span>
                </button>
              </div>
            </div>

            {/* Dropdown Menu attached directly beneath hero top bar */}
            <NavDropdownMenu
              isOpen={menuOpen}
              onClose={() => setMenuOpen(false)}
              className="mt-2 sm:mt-3 rounded-xl sm:rounded-2xl border border-white/20 shadow-2xl"
            />
          </div>

          {/* MIDDLE AREA: Left Headline & Right Floating Contact / Chat */}
          <div className="relative w-full flex flex-col lg:flex-row justify-between my-1 sm:my-4 md:my-6 gap-2 sm:gap-6">
            {/* Left Column: Tagline & Display Headline */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col justify-end max-w-2xl pb-1 sm:pb-2 lg:pb-6"
            >
              {/* Tagline */}
              <div className="flex items-center gap-2 mb-0.5 sm:mb-2 md:mb-3">
                <span className="text-[7px] sm:text-[10px] md:text-xs font-semibold tracking-[0.16em] uppercase text-white/90 drop-shadow-sm">
                  REAL ESTATE DEVELOPMENT AGENCY
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-heading text-xl sm:text-4xl md:text-6xl xl:text-[80px] 2xl:text-[90px] text-white leading-[100%] tracking-normal drop-shadow-lg select-none">
                Shaping
                <br />
                Tomorrow&apos;s
                <br />
                Lifestyle.
              </h1>
            </motion.div>

            {/* Right Column: WhatsApp Button + Bornali Haque Chat Card */}
          </div>

          {/* BOTTOM AREA: Centered Search Capsule Filter */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-30 w-full flex justify-center mt-0.5 sm:mt-2"
          >
            <HeroSearchFilter />
          </motion.div>
        </div>
      </section>
    </>
  );
}
