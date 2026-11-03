"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Building2, Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Auction } from "./types";
import { formatAuctionAmount, formatAuctionDate, getAuctionPhase, type AuctionPhase } from "@/lib/client-auction";

/* ───────────────────────── Badge ───────────────────────── */

export type AuctionBadgeTone = "live" | "upcoming" | "ended" | "cancelled" | "gold" | "neutral";

const BADGE_TONES: Record<AuctionBadgeTone, string> = {
  live: "bg-[#ffe8e8] text-[#ec0000]",
  upcoming: "bg-[#fef5d9] text-[#bf9204]",
  ended: "bg-gradient-to-b from-[#f7fef9] to-[#e3fceb] text-[#039855]",
  cancelled: "bg-[#f1f2f6] text-[#59657b]",
  gold: "bg-[#f9f0e2] border border-[#f5e5cc] text-[#8a621e]",
  neutral: "bg-white/95 border border-[#f1f2f6] text-[#054b3c]",
};

export const PHASE_LABELS: Record<AuctionPhase, string> = {
  live: "Live Auction",
  upcoming: "Upcoming",
  ended: "Completed",
  cancelled: "Stopped",
};

export function AuctionBadge({
  tone,
  children,
  pulse = false,
}: {
  tone: AuctionBadgeTone;
  children: React.ReactNode;
  /** Blinking dot for live auctions. */
  pulse?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-[24px] items-center gap-1.5 px-[10px] rounded-full text-[12px] font-medium leading-none whitespace-nowrap",
        BADGE_TONES[tone],
      )}
    >
      {pulse && (
        <span className="relative flex size-[6px]">
          <span className="absolute inline-flex h-full w-full rounded-full bg-current opacity-60 animate-ping" />
          <span className="relative inline-flex size-[6px] rounded-full bg-current" />
        </span>
      )}
      {children}
    </span>
  );
}

export function PhaseBadge({ auction }: { auction: Auction }) {
  const phase = getAuctionPhase(auction);
  return (
    <AuctionBadge tone={phase} pulse={phase === "live"}>
      {PHASE_LABELS[phase]}
    </AuctionBadge>
  );
}

/* ───────────────────────── Card shell ───────────────────────── */

interface AuctionCardShellProps {
  image?: string;
  title: string;
  location?: string;
  /** Pinned over the image's top-left corner. */
  badges?: React.ReactNode;
  /** Pinned over the image's top-right corner; wraps under the badges when the card is too narrow. */
  corner?: React.ReactNode;
  children?: React.ReactNode;
  /** Makes the whole card a button. Leave unset when the card holds its own buttons. */
  onClick?: () => void;
  className?: string;
}

/** White property card shared by every auction list: image, badges, title, location, then a body. */
export function AuctionCardShell({
  image,
  title,
  location,
  badges,
  corner,
  children,
  onClick,
  className,
}: AuctionCardShellProps) {
  const content = (
    <>
      <div className="relative h-[168px] sm:h-[177.5px] w-full rounded-[8px] overflow-hidden bg-stone-100 flex items-center justify-center shrink-0">
        {image ? (
          <Image
            src={image}
            alt={title}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <Building2 className="w-10 h-10 text-stone-300" />
        )}
        {(badges || corner) && (
          <div className="absolute inset-x-[12px] top-[12px] z-10 flex flex-wrap items-start justify-between gap-1.5">
            {badges && <div className="flex flex-wrap items-center gap-1.5">{badges}</div>}
            {corner && <div className="ml-auto">{corner}</div>}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-[5px] w-full min-w-0">
        <h3 className="text-[18px] font-semibold leading-[1.2] text-[#054b3c] truncate">{title}</h3>
        {location && (
          <div className="flex gap-[4px] items-center min-w-0">
            <MapPin className="w-[16px] h-[16px] text-[#59657b] shrink-0 stroke-[1.6]" />
            <p className="text-[14px] leading-[18px] text-[#59657b] truncate">{location}</p>
          </div>
        )}
      </div>

      {children}
    </>
  );

  const shellClass = cn(
    "group bg-white flex flex-col gap-[16px] items-stretch p-[16px] rounded-[16px] w-full text-left transition-shadow hover:shadow-[0_12px_32px_rgba(5,75,60,0.08)]",
    className,
  );

  if (onClick) {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        whileHover={{ y: -4, transition: { duration: 0.22 } }}
        whileTap={{ scale: 0.99 }}
        className={cn(shellClass, "cursor-pointer focus-visible:outline-2 focus-visible:outline-[#054b3c]")}
      >
        {content}
      </motion.button>
    );
  }

  return (
    <motion.div whileHover={{ y: -4, transition: { duration: 0.22 } }} className={shellClass}>
      {content}
    </motion.div>
  );
}

/** Label-over-value pair used in card footers and stat grids. */
export function AuctionStat({
  label,
  value,
  accent = false,
  align = "left",
}: {
  label: string;
  value: React.ReactNode;
  accent?: boolean;
  align?: "left" | "right";
}) {
  return (
    <div className={cn("flex flex-col gap-[4px] min-w-0", align === "right" && "items-end text-right")}>
      <span className="text-[12px] font-normal leading-[16px] text-[#59657b] uppercase">{label}</span>
      <span
        className={cn(
          "text-[14px] sm:text-[15px] font-semibold leading-[1.2] truncate max-w-full",
          accent ? "text-[#054b3c]" : "text-[#232f43]",
        )}
      >
        {value}
      </span>
    </div>
  );
}

/** Specs line: "3 Bed • 1,250 sft • Unit 7A", skipping anything the API didn't send. */
export function auctionSpecs(auction: Pick<Auction, "beds" | "size" | "flat_no">): string {
  const sizeNum = Number(auction.size);
  const size = Number.isFinite(sizeNum) && sizeNum > 0 ? sizeNum.toLocaleString("en-IN") : auction.size;
  return [
    auction.beds ? `${auction.beds} Bed` : null,
    size ? `${size} sft` : null,
    auction.flat_no ? `Unit ${auction.flat_no}` : null,
  ]
    .filter(Boolean)
    .join(" • ");
}

/* ───────────────────────── Browse card ───────────────────────── */

export function AuctionCard({ auction, onOpen }: { auction: Auction; onOpen: (auction: Auction) => void }) {
  const phase = getAuctionPhase(auction);
  const hasBids = auction.total_bids > 0 && Boolean(auction.highest_bid);
  const specs = auctionSpecs(auction);

  const corner =
    phase === "upcoming" ? (
      <AuctionBadge tone="neutral">Opens {formatAuctionDate(auction.start_date)}</AuctionBadge>
    ) : auction.time_left ? (
      <span className="inline-flex h-[24px] items-center gap-1 px-[10px] rounded-full bg-black/60 backdrop-blur-md text-white text-[12px] font-medium whitespace-nowrap">
        <Clock className="w-3 h-3" />
        {auction.time_left}
      </span>
    ) : null;

  return (
    <AuctionCardShell
      image={auction.property_image}
      title={auction.property_name}
      location={auction.location}
      badges={<PhaseBadge auction={auction} />}
      corner={corner}
      onClick={() => onOpen(auction)}
    >
      {(specs || auction.type) && (
        <div className="flex flex-wrap items-center gap-2 -mt-[6px]">
          {auction.type && <AuctionBadge tone="gold">{auction.type}</AuctionBadge>}
          {specs && <span className="text-[13px] text-[#59657b]">{specs}</span>}
        </div>
      )}
      <div className="bg-[#f1f2f6] h-px w-full" />
      <div className="flex items-end justify-between gap-3">
        <AuctionStat
          label={hasBids ? "Current Highest" : "Starting Bid"}
          value={formatAuctionAmount(hasBids ? auction.highest_bid : auction.starting_bid)}
          accent
        />
        <AuctionStat label="Total Bids" value={`${auction.total_bids} Bids`} align="right" />
      </div>
    </AuctionCardShell>
  );
}

/** Grey placeholder matching the card's footprint. */
export function AuctionCardSkeleton() {
  return (
    <div className="bg-white rounded-[16px] p-[16px] flex flex-col gap-[16px]">
      <div className="h-[168px] sm:h-[177.5px] w-full rounded-[8px] bg-stone-200 animate-pulse" />
      <div className="space-y-2">
        <div className="h-5 w-3/4 bg-stone-200 rounded animate-pulse" />
        <div className="h-4 w-1/2 bg-stone-100 rounded animate-pulse" />
      </div>
      <div className="h-px w-full bg-[#f1f2f6]" />
      <div className="h-10 w-full bg-stone-100 rounded animate-pulse" />
    </div>
  );
}
