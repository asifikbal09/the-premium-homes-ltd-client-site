"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Building2, Gavel, Loader2, MapPin, Minus, Plus, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  bidIncrement,
  fetchAuction,
  formatAuctionAmount,
  formatAuctionDate,
  getAuctionPhase,
  getInitials,
  minimumNextBid,
  placeAuctionBid,
  timeAgo,
} from "@/lib/client-auction";
import type { Auction, ClientUser } from "./types";
import { DashboardModal, ModalFooter } from "./dashboard_modal";
import { AuctionBadge, AuctionStat, PhaseBadge, auctionSpecs } from "./auction_card";

interface AuctionBidPanelProps {
  /** The auction to show; the panel is open while this is set. */
  auctionId: string | number | null;
  user: ClientUser | null;
  userId: string | null;
  onClose: () => void;
  /** After a successful bid, so lists can refresh. */
  onBidPlaced: () => void;
  /** Owner pressed "Stop Auction"; the parent confirms and cancels. */
  onRequestStop: (auction: Auction) => void;
}

const BIDS_PREVIEW = 5;

function Notice({ tone, title, copy }: { tone: "info" | "warn" | "muted"; title: string; copy?: string }) {
  return (
    <div
      className={cn(
        "rounded-[12px] border px-[16px] py-[12px] text-center",
        tone === "info" && "bg-[#eff8ff] border-[#b2ddff] text-[#175cd3]",
        tone === "warn" && "bg-[#fef5d9] border-[#f5e5cc] text-[#8a621e]",
        tone === "muted" && "bg-[#f1f2f6] border-[#eaecf0] text-[#546360]",
      )}
    >
      <p className="text-[14px] font-semibold">{title}</p>
      {copy && <p className="text-[12px] mt-[2px] opacity-80">{copy}</p>}
    </div>
  );
}

export function AuctionBidPanel(props: AuctionBidPanelProps) {
  const { auctionId, onClose } = props;
  const [placing, setPlacing] = useState(false);

  return (
    <DashboardModal
      open={auctionId !== null}
      onClose={placing ? () => {} : onClose}
      title="Auction Details"
      className="sm:max-w-[640px]"
    >
      {/* Keyed so switching auctions starts from a clean slate. */}
      {auctionId !== null && (
        <BidPanelBody key={String(auctionId)} {...props} auctionId={auctionId} placing={placing} setPlacing={setPlacing} />
      )}
    </DashboardModal>
  );
}

function BidPanelBody({
  auctionId,
  user,
  userId,
  onBidPlaced,
  onRequestStop,
  placing,
  setPlacing,
}: AuctionBidPanelProps & { auctionId: string | number; placing: boolean; setPlacing: (v: boolean) => void }) {
  const [auction, setAuction] = useState<Auction | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [bidAmount, setBidAmount] = useState(0);
  const [referralCode, setReferralCode] = useState("");
  const [showAllBids, setShowAllBids] = useState(false);

  useEffect(() => {
    let alive = true;
    fetchAuction(auctionId).then((result) => {
      if (!alive) return;
      setAuction(result);
      if (result) setBidAmount(minimumNextBid(result));
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [auctionId, reloadKey]);

  if (loading) {
    return (
      <div className="py-16 flex flex-col items-center gap-3 text-[#546360]">
        <Loader2 className="w-6 h-6 animate-spin text-[#054b3c]" />
        <span className="text-[13px]">Loading auction…</span>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="py-16 flex flex-col items-center gap-2 text-center">
        <Gavel className="w-8 h-8 text-stone-300" />
        <p className="font-semibold text-[#232f43]">Auction not found</p>
        <p className="text-[13px] text-[#59657b]">It may have ended or been removed.</p>
      </div>
    );
  }

  const phase = getAuctionPhase(auction);
  const increment = bidIncrement(auction.starting_bid);
  const minimum = minimumNextBid(auction);
  const isOwner = Boolean(userId && String(auction.user_id) === String(userId));
  const hasAlreadyBid = Boolean(userId && auction.bids.some((b) => String(b.user_id) === String(userId)));
  const canBid = phase === "live" && !isOwner && !hasAlreadyBid;
  const bids = showAllBids ? auction.bids : auction.bids.slice(0, BIDS_PREVIEW);
  const specs = auctionSpecs(auction);

  const handlePlaceBid = async () => {
    if (!canBid) return;
    if (!userId) {
      toast.error("Please log in again to place a bid.");
      return;
    }
    if (bidAmount < minimum) {
      toast.error(`Your bid must be at least ${formatAuctionAmount(minimum)}.`);
      return;
    }

    setPlacing(true);
    const result = await placeAuctionBid(auction.id, {
      user_id: userId,
      user_name: user?.name || user?.full_name || undefined,
      user_email: user?.email || undefined,
      amount: bidAmount,
      referral_code: referralCode.trim() || undefined,
    });
    setPlacing(false);

    if (!result.success) {
      toast.error(result.message || "Could not place your bid.");
      return;
    }
    toast.success(`Bid of ${formatAuctionAmount(bidAmount)} placed.`);
    onBidPlaced();
    setReloadKey((k) => k + 1);
  };

  return (
    <div className="flex flex-col gap-[20px]">
      {/* Property */}
      <div className="flex flex-col sm:flex-row gap-[16px]">
        <div className="relative h-[160px] sm:h-[120px] sm:w-[180px] rounded-[12px] overflow-hidden bg-stone-100 shrink-0 flex items-center justify-center">
          {auction.property_image ? (
            <Image
              src={auction.property_image}
              alt={auction.property_name}
              fill
              unoptimized
              sizes="(max-width: 640px) 100vw, 180px"
              className="object-cover"
            />
          ) : (
            <Building2 className="w-8 h-8 text-stone-300" />
          )}
        </div>
        <div className="flex flex-col gap-[8px] min-w-0">
          <div className="flex flex-wrap gap-1.5">
            <PhaseBadge auction={auction} />
            {auction.type && <AuctionBadge tone="gold">{auction.type}</AuctionBadge>}
          </div>
          <h4 className="text-[20px] font-semibold leading-[1.2] text-[#054b3c]">{auction.property_name}</h4>
          {auction.location && (
            <p className="flex items-center gap-1 text-[14px] text-[#59657b] min-w-0">
              <MapPin className="w-4 h-4 shrink-0 stroke-[1.6]" />
              <span className="truncate">{auction.location}</span>
            </p>
          )}
          {specs && <p className="text-[13px] text-[#59657b]">{specs}</p>}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-[12px] rounded-[12px] border border-[#eaecf0] p-[16px]">
        <AuctionStat label="Starting Bid" value={formatAuctionAmount(auction.starting_bid)} />
        <AuctionStat
          label="Highest Bid"
          value={auction.highest_bid ? formatAuctionAmount(auction.highest_bid) : "No bids"}
          accent
        />
        <AuctionStat label="Total Bids" value={`${auction.total_bids} Bids`} />
        <AuctionStat label="Increment" value={formatAuctionAmount(increment)} />
      </div>

      {/* Bid history */}
      <div className="flex flex-col gap-[12px]">
        <div className="flex items-center justify-between">
          <h5 className="font-serif font-semibold text-[18px] text-[#054b3c]">Bid History</h5>
          {auction.bids.length > BIDS_PREVIEW && (
            <button
              type="button"
              onClick={() => setShowAllBids((v) => !v)}
              className="text-[13px] font-medium text-[#054b3c] hover:underline cursor-pointer"
            >
              {showAllBids ? "Show less" : `View all ${auction.bids.length}`}
            </button>
          )}
        </div>

        {auction.bids.length === 0 ? (
          <p className="py-6 text-center text-[14px] text-[#59657b] rounded-[12px] bg-[#fafafa]">
            No bids yet. Be the first!
          </p>
        ) : (
          <ul className="divide-y divide-[#eaecf0] rounded-[12px] border border-[#eaecf0]">
            {bids.map((bid, idx) => (
              <li key={bid.id} className="flex items-center justify-between gap-3 px-[14px] py-[12px]">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="size-[36px] rounded-full bg-[#f1f6f5] text-[#054b3c] text-[13px] font-semibold flex items-center justify-center shrink-0">
                    {getInitials(bid.user_name)}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[14px] font-medium text-[#101828] truncate">{bid.user_name}</p>
                    <p className="text-[12px] text-[#59657b]">{timeAgo(bid.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[14px] font-semibold text-[#101828]">{formatAuctionAmount(bid.amount)}</span>
                  {idx === 0 && <AuctionBadge tone="live">Highest</AuctionBadge>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Actions */}
      <ModalFooter className="mt-0">
        <div className="flex flex-col gap-[12px]">
          {phase === "upcoming" && (
            <Notice tone="warn" title={`Bidding opens on ${formatAuctionDate(auction.start_date)}`} />
          )}
          {(phase === "ended" || phase === "cancelled") && (
            <Notice tone="muted" title={phase === "ended" ? "This auction has ended" : "This auction was stopped"} />
          )}
          {phase === "live" && hasAlreadyBid && !isOwner && (
            <Notice
              tone="info"
              title="✓ Your bid has been placed"
              copy="Each bidder can place one bid per auction. Good luck!"
            />
          )}

          {canBid && (
            <>
              <div className="rounded-[12px] bg-[#f1f6f5] p-[12px] flex flex-col items-center gap-[6px]">
                <p className="text-[12px] font-medium text-[#59657b]">Your Bid Amount</p>
                <div className="flex items-center justify-between w-full gap-3">
                  <button
                    type="button"
                    onClick={() => setBidAmount((v) => Math.max(minimum, v - increment))}
                    disabled={bidAmount <= minimum}
                    aria-label="Lower bid"
                    className="size-[40px] rounded-full border border-[#c7e6e0] bg-white text-[#054b3c] flex items-center justify-center transition-colors hover:bg-[#e3ecea] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-serif font-semibold text-[22px] sm:text-[26px] text-[#054b3c] text-center leading-none">
                    {formatAuctionAmount(bidAmount)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setBidAmount((v) => v + increment)}
                    aria-label="Raise bid"
                    className="size-[40px] rounded-full border border-[#c7e6e0] bg-white text-[#054b3c] flex items-center justify-center transition-colors hover:bg-[#e3ecea] cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-[11px] text-[#59657b]">Minimum next bid: {formatAuctionAmount(minimum)}</p>
              </div>

              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                placeholder="Referral code (optional)"
                aria-label="Referral code (optional)"
                className="w-full h-[44px] px-[16px] rounded-full bg-white border border-[#eaecf0] text-[14px] font-medium uppercase tracking-[1px] text-[#101828] placeholder:normal-case placeholder:tracking-normal placeholder:font-normal placeholder:text-[#98a2b3] focus:outline-none focus:border-[#054b3c] transition-colors"
              />
            </>
          )}

          {isOwner ? (
            (phase === "live" || phase === "upcoming") && (
              <button
                type="button"
                onClick={() => onRequestStop(auction)}
                className="w-full h-[48px] rounded-full border border-[#fda29b] bg-[#fef3f2] text-[#d92d20] hover:bg-[#fee4e2] font-sans text-[15px] font-medium transition-colors cursor-pointer"
              >
                Stop Auction
              </button>
            )
          ) : (
            <button
              type="button"
              onClick={handlePlaceBid}
              disabled={!canBid || placing}
              className="w-full h-[48px] rounded-full bg-[#054b3c] hover:bg-[#043d30] text-white font-sans text-[16px] font-medium transition-colors cursor-pointer disabled:bg-[#98a2b3] disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              {placing && <Loader2 className="w-4 h-4 animate-spin" />}
              {canBid ? "Confirm & Place Bid" : hasAlreadyBid ? "You Have Already Bid" : "Bidding Closed"}
            </button>
          )}

          <p className="flex items-center justify-center gap-1.5 text-[12px] text-[#59657b]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#039855]" />
            {isOwner ? "You own this auction" : "Secure bidding by The Premium Homes"}
          </p>
        </div>
      </ModalFooter>
    </div>
  );
}
