import { API_BASE } from "@/lib/api";
import { getAuthHeaders, parseAmount } from "@/lib/client-dashboard";
import type {
  Auction,
  AuctionBid,
  AuctionFeed,
  AuctionListingPayload,
  CompletedAuction,
  CompletedAuctionBidder,
} from "@/components/dashboard/types";

/* ───────────────────────── Business rules ───────────────────────── */

export const LAKH = 100_000;
const CRORE = 100 * LAKH;

/** Platform fee kept from the winning bid, in percent. */
export const PLATFORM_FEE_PERCENT = 5;

/** Floor when the owner has no recorded payment, in taka (10 Lakh). */
export const DEFAULT_MIN_STARTING_BID = 10 * LAKH;

export const AUCTION_DURATIONS = [3, 7, 14, 30] as const;

export const AUCTION_TYPES = ["Pre Construction", "Ready Flats"] as const;

/** Bid step: 1% of the starting bid, never less than ৳10,000. */
export function bidIncrement(startingBid: number): number {
  return Math.max(Math.round(startingBid * 0.01), 10_000);
}

/** First bid must equal the starting bid; every later bid must beat the highest by one step. */
export function minimumNextBid(auction: Auction): number {
  if (auction.bids.length === 0 || !auction.highest_bid) return auction.starting_bid;
  return auction.highest_bid + bidIncrement(auction.starting_bid);
}

export const lakhToTaka = (lakh: number) => Math.round(lakh * LAKH);
export const takaToLakh = (taka: number) => taka / LAKH;

/** "৳ 1.25 Crore", "৳ 58.00 Lakh" or "৳ 45,000". Strings the API already formatted pass through. */
export function formatAuctionAmount(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "string" && /lakh|crore/i.test(value)) {
    return value.trim().startsWith("৳") ? value : `৳ ${value}`;
  }
  const taka = parseAmount(value);
  if (taka >= CRORE) return `৳ ${(taka / CRORE).toFixed(2)} Crore`;
  if (taka >= LAKH) return `৳ ${(taka / LAKH).toFixed(2)} Lakh`;
  return `৳ ${taka.toLocaleString("en-IN")}`;
}

/**
 * Parses "YYYY-MM-DD", "YYYY-MM-DD HH:MM:SS" or ISO strings as a local calendar day.
 * The old site appended "T00:00:00" to values that already had a time, producing Invalid Date
 * and showing upcoming auctions as live.
 */
export function parseAuctionDate(value?: string): Date | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value.trim());
  if (match) return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatAuctionDate(value?: string): string {
  const date = parseAuctionDate(value);
  if (!date) return value || "—";
  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

/** The value a date input expects ("YYYY-MM-DD") for today, in local time. */
export function todayInputValue(): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export type AuctionPhase = "live" | "upcoming" | "ended" | "cancelled";

export function getAuctionPhase(auction: Auction): AuctionPhase {
  const status = auction.status;
  if (status === "cancelled" || status === "canceled") return "cancelled";
  if (status === "completed" || status === "ended") return "ended";

  const start = parseAuctionDate(auction.start_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (status === "pending" || (start && start > today)) return "upcoming";
  return "live";
}

/** A listing the owner can still edit: approved for listing but not started yet. */
export const isEditableAuction = (auction: Auction) => auction.status === "pending";

/** A listing that still holds the flat (so the owner can't list it again). */
export function isOpenAuction(auction: Auction): boolean {
  const phase = getAuctionPhase(auction);
  return phase === "live" || phase === "upcoming";
}

/**
 * The owner's open listing for a flat. Flats in the same project can share a slug, so the unit
 * number must match too whenever both sides have one.
 */
export function findFlatAuction(
  flat: { slug?: string; flatNo?: string },
  auctions: Auction[],
): Auction | undefined {
  return auctions.find(
    (a) =>
      isOpenAuction(a) &&
      Boolean(flat.slug) &&
      a.property_slug === flat.slug &&
      (!a.flat_no || !flat.flatNo || a.flat_no === flat.flatNo),
  );
}

export function timeAgo(value?: string): string {
  if (!value) return "";
  const time = new Date(value.replace(" ", "T")).getTime();
  if (Number.isNaN(time)) return value;
  const seconds = Math.floor((Date.now() - time) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

export function getInitials(name?: string): string {
  if (!name) return "??";
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/* ───────────────────────── Normalisers ───────────────────────── */

type Raw = Record<string, unknown>;

const asRaw = (value: unknown): Raw => (value && typeof value === "object" ? (value as Raw) : {});

/** First value that is a non-empty string or a number, as a string. */
function text(...values: unknown[]): string | undefined {
  for (const v of values) {
    if (typeof v === "number" || (typeof v === "string" && v.trim())) return String(v);
  }
  return undefined;
}

const idOf = (value: unknown): string | number | undefined =>
  typeof value === "number" || (typeof value === "string" && value) ? value : undefined;

const optionalNumber = (value: unknown): number | null => {
  if (value === null || value === undefined || value === "") return null;
  const num = parseAmount(value);
  return num > 0 ? num : null;
};

function normalizeBid(value: unknown, idx: number): AuctionBid {
  const raw = asRaw(value);
  return {
    id: idOf(raw.id) ?? `bid-${idx}`,
    user_id: idOf(raw.user_id),
    user_name: text(raw.user_name) || "Anonymous",
    amount: parseAmount(raw.amount),
    created_at: text(raw.created_at),
    referral_code: text(raw.referral_code),
  };
}

export function normalizeAuction(value: unknown): Auction {
  const raw = asRaw(value);
  const bids = (Array.isArray(raw.bids) ? raw.bids : [])
    .map(normalizeBid)
    .sort((a, b) => b.amount - a.amount);

  return {
    id: idOf(raw.id) ?? "",
    user_id: idOf(raw.user_id),
    property_name: text(raw.property_name, raw.name) || "Untitled property",
    property_slug: text(raw.property_slug),
    property_image: text(raw.property_image, raw.image),
    location: text(raw.location),
    beds: optionalNumber(raw.beds) ?? undefined,
    size: text(raw.size),
    type: text(raw.type),
    flat_no: text(raw.flat_no),
    starting_bid: parseAmount(raw.starting_bid ?? raw.startingBid),
    reserve_price: optionalNumber(raw.reserve_price),
    highest_bid: bids[0]?.amount || optionalNumber(raw.highest_bid ?? raw.highestBid),
    total_bids: Number(raw.total_bids ?? raw.totalBids) || bids.length,
    duration_days: optionalNumber(raw.duration_days) ?? undefined,
    start_date: text(raw.start_date, raw.startDate),
    time_left: text(raw.time_left, raw.timeLeft),
    status: (text(raw.status) || "").toLowerCase(),
    bids,
  };
}

const normalizeList = (value: unknown): Auction[] =>
  Array.isArray(value) ? value.map(normalizeAuction) : [];

function normalizeBidder(value: unknown): CompletedAuctionBidder {
  const raw = asRaw(value);
  const amount = raw.amount;
  return {
    name: text(raw.name, raw.user_name) || "Anonymous",
    amount: typeof amount === "number" || typeof amount === "string" ? amount : "",
    time: text(raw.time),
  };
}

function normalizeCompleted(value: unknown): CompletedAuction {
  const raw = asRaw(value);
  return {
    id: idOf(raw.id) ?? "",
    name: text(raw.name, raw.property_name) || "Untitled property",
    image: text(raw.image, raw.property_image),
    location: text(raw.location),
    ended_at: text(raw.endedAt, raw.ended_at),
    winner: raw.winner ? normalizeBidder(raw.winner) : null,
    runners_up: (Array.isArray(raw.runnersUp) ? raw.runnersUp : []).map(normalizeBidder),
  };
}

/* ───────────────────────── API ───────────────────────── */

export interface AuctionResult {
  success: boolean;
  message?: string;
}

async function auctionRequest(path: string, init?: RequestInit): Promise<{ ok: boolean; data: Raw }> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      cache: "no-store",
      ...init,
      headers: getAuthHeaders(Boolean(init?.body)),
    });
    const data = asRaw(await res.json().catch(() => null));
    return { ok: res.ok && data.success !== false, data };
  } catch (err) {
    console.error(`[auctions] ${init?.method || "GET"} ${path} failed:`, err);
    return { ok: false, data: {} };
  }
}

async function auctionMutation(
  path: string,
  method: "POST" | "PUT",
  body: unknown,
  fallbackError: string,
): Promise<AuctionResult> {
  const { ok, data } = await auctionRequest(path, { method, body: JSON.stringify(body) });
  return ok
    ? { success: true, message: text(data.message) }
    : { success: false, message: text(data.message, data.error) || fallbackError };
}

/** GET /auctions — every open listing, grouped by the API. */
export async function fetchAuctionFeed(): Promise<AuctionFeed> {
  const { ok, data } = await auctionRequest("/auctions");
  if (!ok) return { hot: [], live: [], upcoming: [], completed: [] };
  return {
    hot: normalizeList(data.hot),
    live: normalizeList(data.live),
    upcoming: normalizeList(data.upcoming),
    completed: normalizeList(data.completed),
  };
}

/** GET /users/{id}/auctions — the signed-in owner's own listings. */
export async function fetchUserAuctions(userId: string | number): Promise<Auction[]> {
  const { ok, data } = await auctionRequest(`/users/${encodeURIComponent(String(userId))}/auctions`);
  return ok ? normalizeList(data.auctions) : [];
}

/** GET /auctions/{id} — one listing with its bids. */
export async function fetchAuction(auctionId: string | number): Promise<Auction | null> {
  const { ok, data } = await auctionRequest(`/auctions/${encodeURIComponent(String(auctionId))}`);
  return ok && data.auction ? normalizeAuction(data.auction) : null;
}

/** GET /auctions/history — recently completed auctions with winners. */
export async function fetchAuctionHistory(): Promise<CompletedAuction[]> {
  const { ok, data } = await auctionRequest("/auctions/history");
  return ok && Array.isArray(data.completedAuctions) ? data.completedAuctions.map(normalizeCompleted) : [];
}

/** POST /auctions, or PUT /auctions/{id} when editing a pending listing. */
export function saveAuctionListing(
  payload: AuctionListingPayload,
  existingId?: string | number,
): Promise<AuctionResult> {
  return existingId
    ? auctionMutation(`/auctions/${encodeURIComponent(String(existingId))}`, "PUT", payload, "Failed to update auction.")
    : auctionMutation("/auctions", "POST", payload, "Failed to list auction.");
}

/** POST /auctions/{id}/bids */
export function placeAuctionBid(
  auctionId: string | number,
  bid: {
    user_id: string | number;
    user_name?: string;
    user_email?: string;
    amount: number;
    referral_code?: string;
  },
): Promise<AuctionResult> {
  return auctionMutation(
    `/auctions/${encodeURIComponent(String(auctionId))}/bids`,
    "POST",
    { auction_id: auctionId, ...bid },
    "Failed to place bid.",
  );
}

/** PUT /auctions/{id}/cancel — owner stops their listing. */
export function cancelAuction(auctionId: string | number, userId: string | number): Promise<AuctionResult> {
  return auctionMutation(
    `/auctions/${encodeURIComponent(String(auctionId))}/cancel`,
    "PUT",
    { auction_id: auctionId, user_id: userId },
    "Failed to stop auction.",
  );
}
