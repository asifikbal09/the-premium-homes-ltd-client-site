"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarClock, Flame, Gavel, Medal, Radio, Tag, Trophy } from "lucide-react";
import { toast } from "sonner";
import { FilterChips } from "@/components/ui/filter_chips";
import { SearchField } from "@/components/ui/search_field";
import { getClientUserId } from "@/lib/client-auth";
import { parseAmount } from "@/lib/client-dashboard";
import {
  AUCTION_TYPES,
  cancelAuction,
  fetchAuctionFeed,
  fetchAuctionHistory,
  fetchUserAuctions,
  findFlatAuction,
  formatAuctionAmount,
  getAuctionPhase,
  isEditableAuction,
  isOpenAuction,
} from "@/lib/client-auction";
import type { Auction, AuctionFeed, ClientFlat, ClientUser, CompletedAuction } from "./types";
import {
  AuctionBadge,
  AuctionCard,
  AuctionCardShell,
  AuctionCardSkeleton,
  AuctionStat,
  PhaseBadge,
} from "./auction_card";
import { AuctionBidPanel } from "./auction_bid_panel";
import { AuctionSellForm } from "./auction_sell_form";
import { ConfirmDialog } from "./dashboard_modal";

interface AuctionTabProps {
  user: ClientUser | null;
  myFlats: ClientFlat[];
  /** True while the dashboard is still loading the owner's flats. */
  isLoading: boolean;
}

const VIEWS = ["Browse", "My Flats", "History"] as const;
type AuctionView = (typeof VIEWS)[number];

const TYPE_OPTIONS = ["All", ...AUCTION_TYPES];
const BED_OPTIONS = ["All Beds", "1 Bed", "2 Bed", "3 Bed", "4+ Bed"];

const EMPTY_FEED: AuctionFeed = { hot: [], live: [], upcoming: [], completed: [] };

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
};

const CARD_GRID = "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-[16px] w-full";

/* ───────────────────────── Small building blocks ───────────────────────── */

function StatCard({
  icon: Icon,
  label,
  value,
  caption,
  className,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  caption: string;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      className={`bg-white flex min-h-[116px] items-center p-[16px] sm:p-[20px] rounded-[12px] ${className || ""}`}
    >
      <div className="flex flex-1 gap-[14px] sm:gap-[20px] items-start min-w-0">
        <div className="bg-[#f1f2f6] flex items-center justify-center rounded-full shrink-0 size-[56px]">
          <Icon className="size-[26px] text-[#054b3c] stroke-[1.75]" />
        </div>
        <div className="flex flex-1 flex-col gap-[8px] items-start min-w-0">
          <p className="font-sans text-[14px] leading-[18px] text-[#59657b] truncate w-full">{label}</p>
          <p className="font-sans font-semibold leading-none text-[#054b3c] text-[20px]">{value}</p>
          <p className="font-sans text-[14px] leading-[1.2] text-[#59657b]">{caption}</p>
        </div>
      </div>
    </motion.div>
  );
}

function SectionTitle({ icon: Icon, title, count }: { icon: React.ElementType; title: string; count?: number }) {
  return (
    <div className="flex items-center gap-[10px]">
      <Icon className="size-[22px] text-[#054b3c] stroke-[1.75] shrink-0" />
      <h2 className="font-serif font-semibold leading-[1.1] text-[#054b3c] text-[20px] sm:text-[22px]">{title}</h2>
      {count !== undefined && (
        <span className="inline-flex items-center justify-center min-w-[28px] h-[24px] px-2 rounded-full bg-white text-[#054b3c] text-[12px] font-semibold">
          {count}
        </span>
      )}
    </div>
  );
}

function EmptyPanel({ icon: Icon, title, copy }: { icon: React.ElementType; title: string; copy: string }) {
  return (
    <div className="bg-white rounded-[16px] p-8 sm:p-12 text-center flex flex-col items-center justify-center">
      <div className="w-14 h-14 rounded-2xl bg-[#f1f6f5] flex items-center justify-center text-[#054b3c] mb-4">
        <Icon className="w-7 h-7 stroke-[1.6]" />
      </div>
      <h3 className="font-serif text-lg sm:text-xl font-bold text-[#054b3c]">{title}</h3>
      <p className="text-xs sm:text-sm text-[#59657b] mt-1.5 max-w-md leading-relaxed">{copy}</p>
    </div>
  );
}

function SkeletonGrid({ count = 3 }: { count?: number }) {
  return (
    <div className={CARD_GRID}>
      {Array.from({ length: count }, (_, i) => (
        <AuctionCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** Horizontal scroller on phones so chip rows never wrap into a wall of pills. */
function ChipRow(props: React.ComponentProps<typeof FilterChips>) {
  return (
    <div className="-mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto no-scrollbar">
      <FilterChips {...props} className="w-max" />
    </div>
  );
}

const PRIMARY_BTN =
  "flex-1 h-[42px] px-4 rounded-full bg-[#054b3c] hover:bg-[#043d30] text-white text-[14px] font-medium transition-colors cursor-pointer whitespace-nowrap";
const SECONDARY_BTN =
  "flex-1 h-[42px] px-4 rounded-full bg-[#f1f6f5] hover:bg-[#e3ecea] text-[#054b3c] text-[14px] font-medium transition-colors cursor-pointer whitespace-nowrap";
const DANGER_BTN =
  "flex-1 h-[42px] px-4 rounded-full border border-[#fda29b] bg-[#fef3f2] hover:bg-[#fee4e2] text-[#d92d20] text-[14px] font-medium transition-colors cursor-pointer whitespace-nowrap";

/* ───────────────────────── Tab ───────────────────────── */

export function AuctionTab({ user, myFlats, isLoading }: AuctionTabProps) {
  const userId = useMemo(() => getClientUserId() || (user?.id ? String(user.id) : null), [user]);

  const [view, setView] = useState<AuctionView>("Browse");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [bedFilter, setBedFilter] = useState(BED_OPTIONS[0]);

  const [feed, setFeed] = useState<AuctionFeed>(EMPTY_FEED);
  const [feedLoading, setFeedLoading] = useState(true);
  const [myAuctions, setMyAuctions] = useState<Auction[]>([]);
  const [history, setHistory] = useState<CompletedAuction[] | null>(null);

  const [openAuctionId, setOpenAuctionId] = useState<string | number | null>(null);
  const [sellFlat, setSellFlat] = useState<ClientFlat | null>(null);
  const [stopTarget, setStopTarget] = useState<Auction | null>(null);
  const [stopping, setStopping] = useState(false);

  const requestAll = useCallback(
    () => Promise.all([fetchAuctionFeed(), userId ? fetchUserAuctions(userId) : Promise.resolve([])]),
    [userId],
  );

  const applyResults = useCallback(([nextFeed, nextMine]: [AuctionFeed, Auction[]]) => {
    setFeed(nextFeed);
    setMyAuctions(nextMine);
    setFeedLoading(false);
  }, []);

  // Refreshes keep the current cards on screen; the skeleton only shows on first load.
  const refreshAll = useCallback(() => {
    requestAll().then(applyResults);
  }, [requestAll, applyResults]);

  useEffect(() => {
    let alive = true;
    requestAll().then((results) => alive && applyResults(results));
    return () => {
      alive = false;
    };
  }, [requestAll, applyResults]);

  // History is only fetched the first time its view is opened.
  useEffect(() => {
    if (view !== "History" || history !== null) return;
    fetchAuctionHistory().then(setHistory);
  }, [view, history]);

  const matchesFilters = useCallback(
    (a: Auction) => {
      const q = search.trim().toLowerCase();
      if (q && !`${a.property_name} ${a.location || ""}`.toLowerCase().includes(q)) return false;
      if (typeFilter !== "All" && a.type !== typeFilter) return false;
      if (bedFilter !== BED_OPTIONS[0]) {
        if (!a.beds) return false;
        if (bedFilter === "4+ Bed" ? a.beds < 4 : a.beds !== parseInt(bedFilter, 10)) return false;
      }
      return true;
    },
    [search, typeFilter, bedFilter],
  );

  const hot = useMemo(() => feed.hot.filter(matchesFilters), [feed.hot, matchesFilters]);
  const live = useMemo(() => feed.live.filter(matchesFilters), [feed.live, matchesFilters]);
  const upcoming = useMemo(() => feed.upcoming.filter(matchesFilters), [feed.upcoming, matchesFilters]);
  const myOpenCount = myAuctions.filter(isOpenAuction).length;
  const filtersActive = Boolean(search.trim()) || typeFilter !== "All" || bedFilter !== BED_OPTIONS[0];

  const sellExisting = sellFlat ? findFlatAuction(sellFlat, myAuctions) : undefined;

  const handleConfirmStop = async () => {
    if (!stopTarget || !userId) return;
    setStopping(true);
    const result = await cancelAuction(stopTarget.id, userId);
    setStopping(false);
    if (!result.success) {
      toast.error(result.message || "Could not stop the auction.");
      return;
    }
    toast.success("Auction stopped.");
    setStopTarget(null);
    setOpenAuctionId(null);
    refreshAll();
  };

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("All");
    setBedFilter(BED_OPTIONS[0]);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-[24px] sm:gap-[32px] w-full"
    >
      {/* Header + stats */}
      <motion.div variants={itemVariants} className="flex flex-col gap-[24px] w-full">
        <div className="flex flex-col gap-[12px] items-start">
          <h1 className="capitalize font-serif font-semibold leading-[1.1] text-[#054b3c] text-[28px] sm:text-[32px]">
            Auctions
          </h1>
          <p className="font-sans text-[#546360] text-[15px] sm:text-[16px] leading-[1.4]">
            Resell your flat to the highest bidder, or bid on flats listed by other owners.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-[12px] sm:gap-[16px] w-full">
          <StatCard
            icon={Radio}
            label="Live Auctions"
            value={feedLoading ? "--" : String(feed.live.length).padStart(2, "0")}
            caption="Open for bidding now"
          />
          <StatCard
            icon={CalendarClock}
            label="Upcoming"
            value={feedLoading ? "--" : String(feed.upcoming.length).padStart(2, "0")}
            caption="Opening soon"
          />
          <StatCard
            icon={Tag}
            label="My Listings"
            value={String(myOpenCount).padStart(2, "0")}
            caption="Your flats in auction"
            className="sm:col-span-2 xl:col-span-1"
          />
        </div>
      </motion.div>

      {/* View switcher */}
      <motion.div variants={itemVariants}>
        <ChipRow options={[...VIEWS]} value={view} onChange={(v) => setView(v as AuctionView)} delay={0.1} />
      </motion.div>

      {/* ── Browse ── */}
      {view === "Browse" && (
        <motion.div variants={itemVariants} className="flex flex-col gap-[24px] sm:gap-[32px]">
          <div className="bg-white rounded-[16px] p-[16px] sm:p-[20px] flex flex-col gap-[16px]">
            <SearchField value={search} onChange={setSearch} placeholder="Search auctions" className="w-full" />
            <div className="flex flex-col lg:flex-row lg:items-center gap-[12px] lg:gap-[24px]">
              <ChipRow options={TYPE_OPTIONS} value={typeFilter} onChange={setTypeFilter} delay={0.15} />
              <ChipRow options={BED_OPTIONS} value={bedFilter} onChange={setBedFilter} delay={0.2} />
            </div>
          </div>

          {feedLoading ? (
            <SkeletonGrid />
          ) : hot.length + live.length + upcoming.length === 0 ? (
            <div className="flex flex-col items-center gap-4">
              <EmptyPanel
                icon={Gavel}
                title={filtersActive ? "No auctions match your filters" : "No auctions right now"}
                copy={
                  filtersActive
                    ? "Try a different search, type or bed count."
                    : "New listings appear here as soon as owners put their flats up for auction."
                }
              />
              {filtersActive && (
                <button type="button" onClick={clearFilters} className={`${SECONDARY_BTN} flex-none`}>
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <>
              {hot.length > 0 && (
                <section className="flex flex-col gap-[16px]">
                  <SectionTitle icon={Flame} title="Hot Auctions" />
                  <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex gap-[16px] overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2">
                    {hot.map((a) => (
                      <div key={a.id} className="snap-start shrink-0 w-[280px] sm:w-[320px]">
                        <AuctionCard auction={a} onOpen={(x) => setOpenAuctionId(x.id)} />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {live.length > 0 && (
                <section className="flex flex-col gap-[16px]">
                  <SectionTitle icon={Radio} title="Live Now" count={live.length} />
                  <div className={CARD_GRID}>
                    {live.map((a) => (
                      <AuctionCard key={a.id} auction={a} onOpen={(x) => setOpenAuctionId(x.id)} />
                    ))}
                  </div>
                </section>
              )}

              <section className="flex flex-col gap-[16px]">
                <SectionTitle icon={CalendarClock} title="Upcoming Auctions" count={upcoming.length} />
                {upcoming.length > 0 ? (
                  <div className={CARD_GRID}>
                    {upcoming.map((a) => (
                      <AuctionCard key={a.id} auction={a} onOpen={(x) => setOpenAuctionId(x.id)} />
                    ))}
                  </div>
                ) : (
                  <p className="bg-white rounded-[16px] border border-dashed border-[#c7e6e0] p-6 text-center text-[14px] text-[#59657b]">
                    No upcoming auctions. Listings with a future start date show here.
                  </p>
                )}
              </section>
            </>
          )}
        </motion.div>
      )}

      {/* ── My Flats ── */}
      {view === "My Flats" && (
        <motion.div variants={itemVariants} className="flex flex-col gap-[16px]">
          <SectionTitle icon={Tag} title="Sell Your Flat" />
          {isLoading ? (
            <SkeletonGrid />
          ) : myFlats.length === 0 ? (
            <EmptyPanel
              icon={Tag}
              title="No flats to list yet"
              copy="Flats you've booked with The Premium Homes appear here, ready to list for auction."
            />
          ) : (
            <div className={CARD_GRID}>
              {myFlats.map((flat) => {
                const listing = findFlatAuction(flat, myAuctions);
                const phase = listing ? getAuctionPhase(listing) : null;
                return (
                  <AuctionCardShell
                    key={flat.id}
                    image={flat.image}
                    title={flat.title}
                    location={flat.location}
                    badges={
                      <>
                        {listing ? <PhaseBadge auction={listing} /> : <AuctionBadge tone="gold">Not listed</AuctionBadge>}
                        {flat.flatNo && <AuctionBadge tone="neutral">Unit {flat.flatNo}</AuctionBadge>}
                      </>
                    }
                  >
                    <div className="bg-[#f1f2f6] h-px w-full" />
                    <div className="flex items-end justify-between gap-3">
                      {listing ? (
                        <>
                          <AuctionStat
                            label={listing.highest_bid ? "Highest Bid" : "Starting Bid"}
                            value={formatAuctionAmount(listing.highest_bid || listing.starting_bid)}
                            accent
                          />
                          <AuctionStat label="Bids" value={`${listing.total_bids}`} align="right" />
                        </>
                      ) : (
                        <>
                          <AuctionStat label="Paid" value={formatAuctionAmount(parseAmount(flat.partial_payment))} accent />
                          {flat.flatSize && <AuctionStat label="Size" value={flat.flatSize} align="right" />}
                        </>
                      )}
                    </div>

                    <div className="flex gap-[8px] mt-auto">
                      {!listing && (
                        <button type="button" onClick={() => setSellFlat(flat)} className={PRIMARY_BTN}>
                          Sell via Auction
                        </button>
                      )}
                      {listing && isEditableAuction(listing) && (
                        <button type="button" onClick={() => setSellFlat(flat)} className={SECONDARY_BTN}>
                          Edit
                        </button>
                      )}
                      {listing && phase === "live" && (
                        <button type="button" onClick={() => setOpenAuctionId(listing.id)} className={PRIMARY_BTN}>
                          View Live
                        </button>
                      )}
                      {listing && (
                        <button type="button" onClick={() => setStopTarget(listing)} className={DANGER_BTN}>
                          Stop
                        </button>
                      )}
                    </div>
                  </AuctionCardShell>
                );
              })}
            </div>
          )}
        </motion.div>
      )}

      {/* ── History ── */}
      {view === "History" && (
        <motion.div variants={itemVariants} className="flex flex-col gap-[16px]">
          <SectionTitle icon={Trophy} title="Completed Auctions" />
          {history === null ? (
            <SkeletonGrid count={2} />
          ) : history.length === 0 ? (
            <EmptyPanel icon={Trophy} title="No completed auctions yet" copy="Ended auctions and their winning bids show here." />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px]">
              {history.map((h) => (
                <AuctionCardShell
                  key={h.id}
                  image={h.image}
                  title={h.name}
                  location={h.location}
                  badges={<AuctionBadge tone="ended">Ended{h.ended_at ? ` ${h.ended_at}` : ""}</AuctionBadge>}
                >
                  {h.winner && (
                    <div className="rounded-[12px] bg-[#f9f0e2] border border-[#f5e5cc] p-[14px] flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[1px] text-[#8a621e]">
                          <Trophy className="w-4 h-4" /> Winner
                        </p>
                        <p className="text-[16px] font-semibold text-[#101828] truncate mt-1">{h.winner.name}</p>
                        {h.winner.time && <p className="text-[12px] text-[#8a621e]">Bid placed {h.winner.time}</p>}
                      </div>
                      <p className="font-serif font-semibold text-[20px] sm:text-[22px] text-[#8a621e] shrink-0">
                        {formatAuctionAmount(h.winner.amount)}
                      </p>
                    </div>
                  )}
                  {h.runners_up.length > 0 && (
                    <div className="flex flex-col gap-[8px]">
                      <p className="flex items-center gap-1.5 text-[13px] font-medium text-[#546360]">
                        <Medal className="w-4 h-4" /> Top Bidders
                      </p>
                      <ul className="divide-y divide-[#eaecf0] rounded-[12px] border border-[#eaecf0]">
                        {h.runners_up.map((r, i) => (
                          <li key={`${r.name}-${i}`} className="flex items-center justify-between gap-3 px-[12px] py-[10px]">
                            <span className="flex items-center gap-2 min-w-0 text-[14px] text-[#101828]">
                              <span className="text-[12px] font-semibold text-[#98a2b3] w-4">{i + 2}.</span>
                              <span className="truncate">{r.name}</span>
                            </span>
                            <span className="text-[14px] font-semibold text-[#546360] shrink-0">
                              {formatAuctionAmount(r.amount)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </AuctionCardShell>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Dialogs */}
      <AuctionBidPanel
        auctionId={openAuctionId}
        user={user}
        userId={userId}
        onClose={() => setOpenAuctionId(null)}
        onBidPlaced={refreshAll}
        onRequestStop={(a) => setStopTarget(a)}
      />

      <AuctionSellForm
        flat={sellFlat}
        existing={sellExisting}
        user={user}
        userId={userId}
        onClose={() => setSellFlat(null)}
        onSaved={() => {
          setSellFlat(null);
          refreshAll();
        }}
      />

      <ConfirmDialog
        open={stopTarget !== null}
        onClose={() => setStopTarget(null)}
        onConfirm={handleConfirmStop}
        busy={stopping}
        title="Stop this auction?"
        description={`${stopTarget?.property_name || "This listing"} will be taken off auction and all bids closed. This can't be undone.`}
        confirmLabel="Stop Auction"
      />
    </motion.div>
  );
}
