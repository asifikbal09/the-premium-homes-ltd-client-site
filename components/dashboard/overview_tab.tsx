"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import { toast } from "sonner";
import { ClientUser, ClientFlat } from "./types";
import {
  fetchUserWishlist,
  addToUserWishlist,
  removeFromUserWishlist,
} from "@/lib/client-dashboard";
import { getClientUserId } from "@/lib/client-auth";
import { cn } from "@/lib/utils";

interface OverviewTabProps {
  user: ClientUser | null;
  myFlats?: ClientFlat[];
  isLoading?: boolean;
  onViewAllFlats?: () => void;
  onViewAllProjects?: () => void;
  onSelectProject?: (project: ClientFlat) => void;
}

interface OngoingProjectItem {
  id: number | string;
  name: string;
  slug?: string;
  location?: string;
  image: string;
  status?: string;
  price?: string;
  constructionPct?: number;
  handoverDate?: string;
}

const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

const sectionVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
       delay,
      ease: EASE_OUT_EXPO,
    },
  }),
};

const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const cardItemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: EASE_OUT_EXPO,
    },
  },
};

/**
 * Formats raw project price strings from the API into a clean, single-line
 * Figma-aligned label (e.g. "From ৳2.5 Cr" or "From ৳85 Lac") so it never
 * overflows or collides with "View Project" in the 4-column card grid.
 */
function formatOngoingProjectPrice(rawPrice?: unknown): string {
  if (rawPrice === null || rawPrice === undefined) return "From ৳2.5 Cr";
  const str = String(rawPrice).trim();
  if (!str) return "From ৳2.5 Cr";

  const lower = str.toLowerCase();
  if (lower.includes("contact") || lower.includes("request") || lower.includes("call")) {
    return "From ৳2.5 Cr";
  }

  // Take starting price if a range is provided (e.g. "1.5 Cr - 2.5 Cr" or "1,20,00,000 - 1,80,00,000")
  const firstPart = str.split(/\s*(?:-|–|—|\bto\b)\s*/i)[0]?.trim() || str;

  // Strip currency/prefix words
  const cleaned = firstPart
    .replace(/^(from|starting\s*from|starting)\s*/i, "")
    .replace(/(bdt|tk\.?|taka|৳)/gi, "")
    .trim();

  if (!cleaned) return "From ৳2.5 Cr";

  // If it already contains Cr / Lac / Lakh / K / M, normalize spacing
  if (/\b(cr|crore|lac|lakh|k|m)\b/i.test(cleaned)) {
    const normalized = cleaned
      .replace(/\bcrore\b/i, "Cr")
      .replace(/\bcr\b/i, "Cr")
      .replace(/\blakh\b/i, "Lac")
      .replace(/\blac\b/i, "Lac")
      .replace(/\s+/g, " ")
      .trim();
    return `From ৳${normalized}`;
  }

  // Parse numeric value (ignoring commas/spaces)
  const numericOnly = cleaned.replace(/,/g, "").trim();
  const num = Number(numericOnly);
  if (!Number.isNaN(num) && num > 0) {
    if (num >= 10000000) {
      const cr = +(num / 10000000).toFixed(2);
      return `From ৳${cr} Cr`;
    }
    if (num >= 100000) {
      const lac = +(num / 100000).toFixed(1);
      return `From ৳${lac} Lac`;
    }
    return `From ৳${num.toLocaleString("en-IN")}`;
  }

  return cleaned.length <= 14 ? `From ৳${cleaned}` : "From ৳2.5 Cr";
}

/* =========================================================
   FIGMA EXACT CUSTOM SVG ICONS (8313:22346)
   ========================================================= */
function TotalPaidIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M16 4V11M16 4L13 7M16 4L19 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 10.5C6.2 11.2 4 12.5 4 12.5V24.5C4 24.5 8.5 22 16 24.5C23.5 27 28 24.5 28 24.5V12.5C28 12.5 25.8 13.5 23 13"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2" />
      <circle cx="8.5" cy="18" r="1" fill="currentColor" />
      <circle cx="23.5" cy="19" r="1" fill="currentColor" />
    </svg>
  );
}

function OutstandingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M28 19V11C28 8.79086 26.2091 7 24 7H8C5.79086 7 4 8.79086 4 11V21C4 23.2091 5.79086 25 8 25H16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="16" r="3" stroke="currentColor" strokeWidth="2" />
      <path
        d="M21 23H27"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="8.5" cy="16" r="1" fill="currentColor" />
    </svg>
  );
}

function TotalExpenseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect
        x="4"
        y="7"
        width="24"
        height="18"
        rx="4"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="16" cy="16" r="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="8.5" cy="16" r="1.2" fill="currentColor" />
      <circle cx="23.5" cy="16" r="1.2" fill="currentColor" />
    </svg>
  );
}

function LocationPinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9 9.75C10.2426 9.75 11.25 8.74264 11.25 7.5C11.25 6.25736 10.2426 5.25 9 5.25C7.75736 5.25 6.75 6.25736 6.75 7.5C6.75 8.74264 7.75736 9.75 9 9.75Z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 15.75C12 12.75 14.625 10.2891 14.625 7.5C14.625 4.3934 12.1066 1.875 9 1.875C5.8934 1.875 3.375 4.3934 3.375 7.5C3.375 10.2891 6 12.75 9 15.75Z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6 4L10 8L6 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FavouriteHeartIcon({
  className,
  filled,
}: {
  className?: string;
  filled?: boolean;
}) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12.9751 2.66276C11.5875 1.56625 9.62695 1.87549 8.44267 3.04534C8.18181 3.30306 7.81819 3.30306 7.55733 3.04534C6.37305 1.87549 4.41251 1.56625 3.02491 2.66276C1.30756 4.01985 1.15836 6.59746 2.55979 8.18771C4.47775 10.364 6.37388 12.2302 7.45473 13.1753C7.76885 13.45 8.23115 13.45 8.54527 13.1753C9.62612 12.2302 11.5222 10.364 13.4402 8.18771C14.8416 6.59746 14.6924 4.01985 12.9751 2.66276Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function OverviewTab({
  user,
  myFlats,
  isLoading = false,
  onViewAllFlats,
  onViewAllProjects,
  onSelectProject,
}: OverviewTabProps) {
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [ongoingProjects, setOngoingProjects] = useState<OngoingProjectItem[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);

  // Fetch real ongoing projects from API
  useEffect(() => {
    let isMounted = true;
    async function loadOngoingProjects() {
      try {
        setIsLoadingProjects(true);
        const baseUrl = (
          process.env.NEXT_PUBLIC_API_BASE_URL ||
          "https://api.dpremiumhomes.com/api"
        ).replace(/\/+$/, "");

        const res = await fetch(`${baseUrl}/projects`, { cache: "no-store" });
        if (res.ok) {
          const json = await res.json();
          const list = Array.isArray(json)
            ? json
            : json?.projects || json?.data || [];

          if (isMounted && Array.isArray(list)) {
            const mapped = list.slice(0, 4).map((p: any) => ({
              id: p.id,
              name: p.name || p.title || "The Premium Green Valley",
              slug: p.slug || "projects",
              location:
                typeof p.location === "string" && p.location.trim()
                  ? p.location
                  : p.community?.name || "Gulshan 2, Dhaka",
              image:
                p.image ||
                p.featured_image ||
                "/image/progress/tph_green_valley.png",
              status: p.status || "Under Construction",
              price: formatOngoingProjectPrice(p.price || p.price_range),
              constructionPct:
                typeof p.construction_pct === "number"
                  ? p.construction_pct
                  : typeof p.progress === "number"
                  ? p.progress
                  : 72,
              handoverDate:
                p.handover_date || p.estimated_date || "Dec 2027",
            }));
            setOngoingProjects(mapped);
          }
        }
      } catch (err) {
        console.error("Error loading real ongoing projects:", err);
      } finally {
        if (isMounted) setIsLoadingProjects(false);
      }
    }

    loadOngoingProjects();
    return () => {
      isMounted = false;
    };
  }, []);

  // Load user's saved wishlist on mount to sync favourite hearts
  useEffect(() => {
    const uid = user?.id ? String(user.id) : getClientUserId();
    if (!uid) return;

    let cancelled = false;
    fetchUserWishlist(uid).then((items) => {
      if (cancelled) return;
      const favMap: Record<string, boolean> = {};
      items.forEach((item) => {
        favMap[String(item.propertyId)] = true;
        const cleanId = String(item.propertyId).replace(/^prop_/i, "");
        if (cleanId) favMap[cleanId] = true;
      });
      setFavorites(favMap);
    });

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const toggleFavorite = async (id: string | number) => {
    const uid = user?.id ? String(user.id) : getClientUserId();
    const key = String(id);
    const isCurrentlyFav = !!favorites[key];
    const nextFav = !isCurrentlyFav;

    setFavorites((prev) => ({
      ...prev,
      [key]: nextFav,
    }));

    if (!uid) return;

    const result = nextFav
      ? await addToUserWishlist(uid, key)
      : await removeFromUserWishlist(uid, key);

    if (!result.success) {
      setFavorites((prev) => ({
        ...prev,
        [key]: isCurrentlyFav,
      }));
      toast.error(result.message || "Could not update wishlist.");
      return;
    }

    toast.success(
      result.message ||
        (nextFav ? "Added to your wishlist." : "Removed from your wishlist.")
    );
  };

  const displayName =
    user?.name ||
    user?.full_name ||
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    "";

  // Financial figures strictly from user
  const totalPaid = user?.total_paid || "৳ 0";
  const outstanding = user?.outstanding || "৳ 0";
  const totalExpense = user?.total_expense || "৳ 0";

  // Dynamic completion percentage calculation
  const completionPct = user?.completion !== undefined ? user.completion : 0;

  // Flats strictly from user
  const displayedFlats = myFlats || [];

  // 68x68 Donut SVG circumference calculation (Figma node 8313:22380)
  const radius = 29;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference -
    (circumference * Math.min(100, Math.max(0, completionPct))) / 100;

  return (
    <div
      className="flex flex-col gap-[40px] w-full"
      style={{ fontFamily: "'Vazirmatn', sans-serif" }}
    >
      {/* ========================================================= */}
      {/* 1. HEADER + FOUR TOP METRIC CARDS (8313:22347)            */}
      {/* ========================================================= */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        custom={0}
        className="flex flex-col gap-[24px] items-start w-full"
      >
        {/* Welcome Header (8313:22348) */}
        <div className="flex flex-col gap-[12px] items-start w-full">
          <h1 className="capitalize font-serif font-semibold text-[24px] leading-[1.1] text-[#054b3c]">
            Overviews
          </h1>
          {isLoading ? (
            <div className="h-[16px] w-48 bg-stone-200/80 rounded animate-pulse" />
          ) : (
            <p className="text-[16px] font-normal leading-none text-[#3b3e40]">
              Welcome back{displayName ? `, ${displayName}!` : "!"}
            </p>
          )}
        </div>

        {/* 4 Metric Cards Container (8313:22351) */}
        <motion.div
          variants={gridContainerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[16px] w-full"
        >
          {/* Card 1: Total Paid (8313:22352) */}
          <motion.div
            variants={cardItemVariants}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="bg-white flex h-[148px] items-center px-[16px] py-[32px] rounded-[12px] w-full transition-shadow hover:shadow-[0_10px_28px_rgba(5,75,60,0.06)]"
          >
            <div className="flex flex-1 gap-[20px] items-start min-w-0">
              <div className="bg-[#005d4d] flex items-center justify-center p-[16px] rounded-full shrink-0 w-[64px] h-[64px] text-white">
                <TotalPaidIcon className="w-[32px] h-[32px]" />
              </div>
              <div className="flex flex-1 flex-col gap-[8px] items-start min-w-0">
                <p className="text-[16px] font-normal leading-[18px] text-[#59657b] w-full">
                  Total Paid
                </p>
                <div className="flex flex-col gap-[16px] items-start w-full">
                  {isLoading ? (
                    <div className="h-[24px] w-32 bg-stone-200 rounded animate-pulse" />
                  ) : (
                    <p className="text-[24px] font-semibold leading-none text-[#054b3c] w-full truncate">
                      {totalPaid}
                    </p>
                  )}
                  <p className="text-[14px] font-normal leading-[1.2] text-[#59657b] w-full">
                    Paid to date
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Outstanding (8313:22361) */}
          <motion.div
            variants={cardItemVariants}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="bg-white flex h-[148px] items-center px-[16px] py-[32px] rounded-[12px] w-full transition-shadow hover:shadow-[0_10px_28px_rgba(5,75,60,0.06)]"
          >
            <div className="flex flex-1 gap-[20px] items-start min-w-0">
              <div className="bg-[#bf2318] flex items-center justify-center p-[16px] rounded-full shrink-0 w-[64px] h-[64px] text-white">
                <OutstandingIcon className="w-[32px] h-[32px]" />
              </div>
              <div className="flex flex-1 flex-col gap-[12px] items-start min-w-0">
                <p className="text-[16px] font-normal leading-[18px] text-[#59657b] w-full">
                  Outstanding
                </p>
                <div className="flex flex-col gap-[16px] items-start w-full">
                  {isLoading ? (
                    <div className="h-[24px] w-32 bg-stone-200 rounded animate-pulse" />
                  ) : (
                    <p className="text-[24px] font-semibold leading-none text-[#054b3c] w-full truncate">
                      {outstanding}
                    </p>
                  )}
                  <p className="text-[14px] font-normal leading-[1.2] text-[#59657b] w-full">
                    Remaining Due
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Total Expense (8313:22370) */}
          <motion.div
            variants={cardItemVariants}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="bg-white flex h-[148px] items-center px-[16px] py-[32px] rounded-[12px] w-full transition-shadow hover:shadow-[0_10px_28px_rgba(5,75,60,0.06)]"
          >
            <div className="flex flex-1 gap-[20px] items-start min-w-0">
              <div className="bg-[#d8a44d] flex items-center justify-center p-[16px] rounded-full shrink-0 w-[64px] h-[64px] text-white">
                <TotalExpenseIcon className="w-[32px] h-[32px]" />
              </div>
              <div className="flex flex-1 flex-col gap-[16px] items-start min-w-0">
                <p className="text-[16px] font-normal leading-[18px] text-[#59657b] w-full">
                  Total Expense
                </p>
                <div className="flex flex-col gap-[16px] items-start w-full">
                  {isLoading ? (
                    <div className="h-[24px] w-32 bg-stone-200 rounded animate-pulse" />
                  ) : (
                    <p className="text-[24px] font-semibold leading-none text-[#054b3c] w-full truncate">
                      {totalExpense}
                    </p>
                  )}
                  <p className="text-[14px] font-normal leading-[1.2] text-[#59657b] w-full">
                    All Project Expense
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 4: Completion (8313:22379) */}
          <motion.div
            variants={cardItemVariants}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
            className="bg-white flex gap-[20px] h-[148px] items-center px-[16px] py-[32px] rounded-[12px] w-full transition-shadow hover:shadow-[0_10px_28px_rgba(5,75,60,0.06)]"
          >
            <div className="relative shrink-0 w-[68px] h-[68px] flex items-center justify-center">
              {isLoading ? (
                <div className="w-[68px] h-[68px] rounded-full bg-stone-200 animate-pulse" />
              ) : (
                <>
                  <svg className="w-[68px] h-[68px] -rotate-90" viewBox="0 0 68 68">
                    <circle
                      cx="34"
                      cy="34"
                      r={radius}
                      stroke="#e6efed"
                      strokeWidth="6"
                      fill="transparent"
                    />
                    <motion.circle
                      cx="34"
                      cy="34"
                      r={radius}
                      stroke="#005d4d"
                      strokeWidth="6"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset }}
                      transition={{ duration: 1.15, delay: 0.2, ease: EASE_OUT_EXPO }}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[18px] font-bold leading-[24px] text-[#232f43]">
                    {completionPct}%
                  </span>
                </>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-[16px] items-start min-w-0">
              <p className="text-[24px] font-semibold leading-none text-[#054b3c] w-full">
                Completion
              </p>
              <p className="text-[14px] font-normal leading-[1.2] text-[#59657b] w-full">
                Overall Progress
              </p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ========================================================= */}
      {/* 2. MY FLATS SECTION (8313:22388)                          */}
      {/* ========================================================= */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        custom={0.12}
        className="flex flex-col gap-[24px] w-full"
      >
        {/* Section Header (8313:22389) */}
        <div className="flex items-center justify-between w-full">
          <h2 className="capitalize font-serif font-semibold text-[24px] leading-[1.1] text-[#054b3c]">
            My Flats
          </h2>
          {displayedFlats.length > 0 && (
            <button
              type="button"
              onClick={onViewAllFlats}
              className="group/viewall bg-white hover:bg-[#f8fbfa] flex gap-[4px] h-[40px] items-center justify-center px-[24px] py-[16px] rounded-[40px] transition-all cursor-pointer shrink-0 hover:shadow-xs"
            >
              <span className="font-medium text-[14px] leading-[1.7] text-[#054b3c] tracking-[2px] uppercase whitespace-nowrap">
                View All
              </span>
              <ChevronRightIcon className="w-[16px] h-[16px] text-[#054b3c] transition-transform duration-300 group-hover/viewall:translate-x-1" />
            </button>
          )}
        </div>

        {/* Skeleton Loading for My Flats */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px] w-full">
            {[1, 2, 3].map((n) => (
              <div
                key={`my-flats-skeleton-${n}`}
                className="bg-white rounded-[16px] p-[16px] flex flex-col gap-[16px]"
              >
                <div className="h-[177.5px] w-full rounded-[8px] bg-stone-200 animate-pulse" />
                <div className="flex flex-col gap-[16px]">
                  <div className="space-y-2">
                    <div className="h-5 w-3/4 bg-stone-200 rounded animate-pulse" />
                    <div className="h-3.5 w-1/2 bg-stone-100 rounded animate-pulse" />
                  </div>
                  <div className="h-px w-full bg-[#f1f2f6]" />
                  <div className="space-y-2">
                    <div className="h-8 w-full bg-stone-100 rounded animate-pulse" />
                    <div className="h-[8px] w-full bg-stone-100 rounded-full animate-pulse" />
                  </div>
                  <div className="h-5 w-1/3 bg-stone-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : displayedFlats.length === 0 ? (
          /* Empty State when User has no Flats */
          <div className="bg-white rounded-[16px] p-10 sm:p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-[#f1f6f5] flex items-center justify-center text-[#054b3c] mb-4">
              <Building2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#054b3c]">
              No Registered Properties Found
            </h3>
            <p className="text-xs sm:text-sm text-[#59657b] mt-1.5 max-w-md leading-relaxed">
              You currently do not have any registered apartments or suites in your account.
              Explore our luxury residential & commercial developments to get started.
            </p>
            <div className="mt-5">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#054b3c] hover:bg-[#043d30] text-white text-xs font-semibold uppercase tracking-wider transition-all"
              >
                <span>EXPLORE DEVELOPMENTS</span>
                <ChevronRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <motion.div
            variants={gridContainerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px] w-full"
          >
            {displayedFlats.map((flat, idx) => {
              const progressPct = Math.min(
                100,
                Math.max(0, flat.construction_pct ?? 72)
              );

              return (
                <motion.div
                  key={`${flat.id}-${idx}`}
                  variants={cardItemVariants}
                  whileHover={{ y: -4, transition: { duration: 0.22 } }}
                  className="bg-white flex flex-col gap-[16px] items-start p-[16px] relative rounded-[16px] group transition-shadow hover:shadow-[0_12px_32px_rgba(5,75,60,0.08)]"
                >
                  {/* Project Image (8313:22400) */}
                  <div className="h-[177.5px] relative rounded-[8px] overflow-hidden shrink-0 w-full bg-stone-100">
                    <Image
                      src={flat.image || "/image/progress/tph_green_valley.png"}
                      alt={flat.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover object-center rounded-[8px] group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Top-Left Status Badge (8313:22423) */}
                  <div className="absolute left-[28px] top-[28px] z-10 flex items-center gap-1.5 flex-wrap">
                    <div className="bg-[#f9f0e2] border border-[#f5e5cc] flex items-center justify-center px-[8px] py-[5px] rounded-full">
                      <span className="text-[12px] font-normal leading-[14px] text-[#8a621e] whitespace-nowrap">
                        {flat.status || "Under Construction"}
                      </span>
                    </div>
                    {flat.flatNo && (
                      <div className="bg-white/95 border border-[#f1f2f6] flex items-center justify-center px-[8px] py-[5px] rounded-full">
                        <span className="text-[12px] font-medium leading-[14px] text-[#054b3c] whitespace-nowrap">
                          Unit {flat.flatNo}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Project Info Container (8313:22401) */}
                  <div className="flex flex-col gap-[16px] items-start w-full flex-1 justify-between">
                    {/* Title + Location (8313:22402) */}
                    <div className="flex flex-col gap-[5px] items-start w-full">
                      <h3 className="text-[18px] font-semibold leading-none text-[#054b3c] w-full truncate">
                        {flat.title}
                      </h3>
                      <div className="flex gap-[4px] items-center w-full">
                        <LocationPinIcon className="w-[18px] h-[18px] text-[#59657b] shrink-0" />
                        <p className="text-[14px] font-normal leading-[18px] text-[#59657b] truncate">
                          {flat.location || "Gulshan 2, Dhaka"}
                        </p>
                      </div>
                    </div>

                    {/* Divider (8313:22407) */}
                    <div className="bg-[#f1f2f6] h-px w-full" />

                    {/* Construction & Handover + Progress Bar (8313:22408) */}
                    <div className="flex flex-col gap-[8px] items-start w-full">
                      <div className="flex items-center justify-between leading-[18px] w-full">
                        <div className="flex flex-col gap-[2px] items-start">
                          <span className="text-[12px] font-normal text-[#59657b] uppercase">
                            Construction
                          </span>
                          <span className="text-[14px] font-medium text-[#232f43]">
                            {progressPct}% complete
                          </span>
                        </div>
                        <div className="flex flex-col gap-[2px] items-start">
                          <span className="text-[12px] font-normal text-[#59657b] uppercase">
                            Handover
                          </span>
                          <span className="text-[14px] font-medium text-[#232f43]">
                            {flat.handover_date || "Dec 2027"}
                          </span>
                        </div>
                      </div>

                      {/* 8px Gold Progress Bar (8313:22416) */}
                      <div className="bg-[#f1f2f6] h-[8px] rounded-[99px] w-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPct}%` }}
                          transition={{
                            duration: 1.0,
                            delay: 0.25 + idx * 0.1,
                            ease: EASE_OUT_EXPO,
                          }}
                          className="bg-[#d8a44d] h-[8px] rounded-[99px]"
                        />
                      </div>
                    </div>

                    {/* Bottom Price & View Project Row (8313:22418) */}
                    <div className="flex items-center justify-between gap-3 w-full">
                      <p className="text-[16px] font-bold leading-[20px] text-[#232f43] truncate min-w-0">
                        {flat.price || "From ৳2.5 Cr"}
                      </p>
                      <button
                        type="button"
                        onClick={() => onSelectProject?.(flat)}
                        className="group/btn inline-flex items-center gap-[4px] shrink-0 whitespace-nowrap text-[14px] font-medium leading-[20px] text-[#005d4d] hover:text-[#054b3c] transition-colors cursor-pointer"
                      >
                        <span>View Project</span>
                        <ChevronRightIcon className="w-[16px] h-[16px] text-[#005d4d] transition-transform duration-300 group-hover/btn:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.section>

      {/* ========================================================= */}
      {/* 3. ONGOING PROJECTS SECTION (8313:22479)                  */}
      {/* ========================================================= */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        custom={0.24}
        className="flex flex-col gap-[24px] items-start w-full"
      >
        {/* Section Header (8313:22480) */}
        <div className="flex items-center justify-between w-full">
          <h2 className="capitalize font-serif font-semibold text-[24px] leading-[1.1] text-[#054b3c]">
            Ongoing projects
          </h2>
          <Link
            href="/projects"
            onClick={(e) => {
              if (onViewAllProjects) {
                e.preventDefault();
                onViewAllProjects();
              }
            }}
            className="group/viewall bg-white hover:bg-[#f8fbfa] flex gap-[4px] h-[40px] items-center justify-center px-[24px] py-[16px] rounded-[40px] transition-all cursor-pointer shrink-0 hover:shadow-xs"
          >
            <span className="font-medium text-[14px] leading-[1.7] text-[#054b3c] tracking-[2px] uppercase whitespace-nowrap">
              View All
            </span>
            <ChevronRightIcon className="w-[16px] h-[16px] text-[#054b3c] transition-transform duration-300 group-hover/viewall:translate-x-1" />
          </Link>
        </div>

        {/* Skeleton Loading for Ongoing Projects */}
        {isLoadingProjects ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[12px] w-full">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={`ongoing-proj-skeleton-${n}`}
                className="bg-white rounded-[16px] pt-[12px] px-[12px] pb-[16px] flex flex-col gap-[12px]"
              >
                <div className="h-[142px] w-full rounded-[12px] bg-stone-200 animate-pulse" />
                <div className="px-[4px] flex flex-col gap-[12px]">
                  <div className="space-y-2">
                    <div className="h-4 w-3/4 bg-stone-200 rounded animate-pulse" />
                    <div className="h-3.5 w-1/2 bg-stone-100 rounded animate-pulse" />
                  </div>
                  <div className="h-px w-full bg-[#f1f2f6]" />
                  <div className="h-8 w-full bg-stone-100 rounded animate-pulse" />
                  <div className="h-px w-full bg-[#f1f2f6]" />
                  <div className="h-4 w-1/2 bg-stone-200 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : ongoingProjects.length === 0 ? (
          <div className="bg-white rounded-[16px] p-8 text-center text-[#59657b] w-full">
            <p className="text-sm font-medium">
              No ongoing projects available at the moment.
            </p>
          </div>
        ) : (
          <motion.div
            variants={gridContainerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[12px] w-full"
          >
            {ongoingProjects.map((project, idx) => {
              const isFav = !!favorites[project.id];

              return (
                <motion.div
                  key={`${project.id}-${idx}`}
                  variants={cardItemVariants}
                  whileHover={{ y: -4, transition: { duration: 0.22 } }}
                  className="bg-white flex flex-col gap-[12px] items-start pb-[16px] pt-[12px] px-[12px] relative rounded-[16px] h-full group transition-shadow hover:shadow-[0_12px_32px_rgba(5,75,60,0.08)]"
                >
                  {/* Project Image (8313:22488) */}
                  <div className="h-[142px] relative rounded-[12px] overflow-hidden shrink-0 w-full bg-stone-100">
                    <Image
                      src={project.image}
                      alt={project.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover object-center rounded-[12px] group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Top-Left Status Badge (8313:22511) */}
                  {project.status && (
                    <div className="absolute bg-[#f9f0e2] border border-[#f5e5cc] flex items-center justify-center left-[20px] top-[20px] px-[8px] py-[5px] rounded-full z-10">
                      <span className="text-[12px] font-normal leading-[14px] text-[#8a621e] whitespace-nowrap">
                        {project.status}
                      </span>
                    </div>
                  )}

                  {/* Top-Right Favourite Button (8313:22489) */}
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.85 }}
                    onClick={() => toggleFavorite(project.id)}
                    aria-label="Add to favorites"
                    className="absolute bg-white flex items-center justify-center p-[8px] right-[20px] top-[20px] rounded-full z-10 w-[32px] h-[32px] transition-transform hover:scale-105 shadow-xs cursor-pointer"
                  >
                    <FavouriteHeartIcon
                      filled={isFav}
                      className={cn(
                        "w-[16px] h-[16px] transition-colors",
                        isFav ? "text-[#f04438]" : "text-[#232f43]"
                      )}
                    />
                  </motion.button>

                  {/* Project Info Container (8313:22491) */}
                  <div className="flex flex-col gap-[12px] items-start justify-between px-[4px] w-full flex-1">
                    {/* Title + Location (8313:22492) */}
                    <div className="flex flex-col gap-[5px] items-start w-full">
                      <h3 className="text-[16px] font-medium leading-[20px] text-[#232f43] w-full truncate">
                        {project.name}
                      </h3>
                      <div className="flex gap-[4px] items-center w-full">
                        <LocationPinIcon className="w-[18px] h-[18px] text-[#59657b] shrink-0" />
                        <p className="text-[14px] font-normal leading-[18px] text-[#59657b] truncate">
                          {project.location}
                        </p>
                      </div>
                    </div>

                    {/* Divider Line 1 (8313:22497) */}
                    <div className="bg-[#f1f2f6] h-px w-full" />

                    {/* Construction & Handover Row (8313:22498) */}
                    <div className="flex items-center justify-between leading-[18px] w-full">
                      <div className="flex flex-col gap-[2px] items-start">
                        <span className="text-[12px] font-normal text-[#59657b]">
                          Construction
                        </span>
                        <span className="text-[14px] font-medium text-[#232f43]">
                          {project.constructionPct ?? 72}% complete
                        </span>
                      </div>
                      <div className="flex flex-col gap-[2px] items-start">
                        <span className="text-[12px] font-normal text-[#59657b]">
                          Handover
                        </span>
                        <span className="text-[14px] font-medium text-[#232f43]">
                          {project.handoverDate || "Dec 2027"}
                        </span>
                      </div>
                    </div>

                    {/* Divider Line 2 (8313:22505) */}
                    <div className="bg-[#f1f2f6] h-px w-full" />

                    {/* Price & View Project Row (8313:22506) */}
                    <div className="flex items-center justify-between gap-2 w-full">
                      <p className="text-[16px] font-semibold leading-[20px] text-[#232f43] truncate min-w-0">
                        {project.price}
                      </p>
                      <Link
                        href={`/projects/${project.slug}`}
                        className="group/link inline-flex items-center gap-[4px] shrink-0 whitespace-nowrap text-[14px] font-medium leading-[20px] text-[#044133] hover:text-[#054b3c] transition-colors cursor-pointer"
                      >
                        <span>View Project</span>
                        <ChevronRightIcon className="w-[16px] h-[16px] text-[#044133] transition-transform duration-300 group-hover/link:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </motion.section>
    </div>
  );
}
