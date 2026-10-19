"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { toast } from "sonner";
import {
  Gavel,
  Search,
  RefreshCw,
  Loader2,
  ChevronDown,
  ChevronUp,
  Building,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface BidItem {
  id?: number | string;
  bidder_name?: string;
  user_name?: string;
  name?: string;
  user?: {
    name?: string;
  };
  amount?: number | string;
  bid_amount?: number | string;
  created_at?: string;
  date?: string;
}

export interface AuctionItem {
  id: number;
  property_name?: string;
  property_title?: string;
  title?: string;
  property?: {
    title?: string;
    image?: string;
    location?: string;
  };
  image?: string;
  property_image?: string;
  seller_name?: string;
  seller?: string | { name?: string };
  winner_name?: string;
  winner?: string | { name?: string } | null;
  winning_bid?: number | string;
  highest_bid?: number | string;
  current_bid?: number | string;
  base_price?: number | string;
  status: string;
  created_at?: string;
  date?: string;
  start_date?: string;
  bids?: BidItem[];
  bid_history?: BidItem[];
  referral_processed?: boolean;
}

export function AuctionsTab() {
  const { authFetch } = useAdminAuth();

  const [auctions, setAuctions] = useState<AuctionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Active" | "Completed">("All");
  const [expandedAuctionIds, setExpandedAuctionIds] = useState<number[]>([]);

  // Referral Settings state
  const [referralPercentage, setReferralPercentage] = useState<string>("1.0");
  const [isSavingRule, setIsSavingRule] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(false);

  const getBaseUrl = () => {
    return (
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://api.dpremiumhomes.com/api"
    ).replace(/\/+$/, "");
  };

  // 1. FETCH AUCTIONS (Attempts /admin/get-all-auctions then /admin/auctions)
  const fetchAuctions = useCallback(async () => {
    try {
      setLoading(true);
      const baseUrl = getBaseUrl();

      // Try primary endpoint from spec
      let res = await authFetch(`${baseUrl}/admin/get-all-auctions`, { method: "GET" });
      
      // Fallback if not found
      if (!res.ok && res.status === 404) {
        res = await authFetch(`${baseUrl}/admin/auctions`, { method: "GET" });
      }

      if (res.ok) {
        const data = await res.json().catch(() => null);
        const list: AuctionItem[] = Array.isArray(data)
          ? data
          : data?.auctions || data?.data || [];
        setAuctions(list);

        // Auto-expand the first auction if available (like screenshot row 1)
        if (list.length > 0 && expandedAuctionIds.length === 0) {
          setExpandedAuctionIds([list[0].id]);
        }
      } else {
        toast.error("Failed to fetch auctions");
      }
    } catch (err: any) {
      console.error("Error fetching auctions:", err);
      toast.error(err?.message || "Network error loading auctions");
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  // 2. FETCH REFERRAL SETTINGS
  const fetchSettings = useCallback(async () => {
    try {
      setLoadingSettings(true);
      const baseUrl = getBaseUrl();
      const res = await authFetch(`${baseUrl}/admin/settings`, { method: "GET" });
      if (res.ok) {
        const data = await res.json().catch(() => null);
        const pct =
          data?.referral_percentage ??
          data?.settings?.referral_percentage ??
          data?.data?.referral_percentage;
        if (pct !== undefined && pct !== null) {
          setReferralPercentage(String(pct));
        }
      }
    } catch (err) {
      console.warn("Could not fetch referral settings, using default", err);
    } finally {
      setLoadingSettings(false);
    }
  }, [authFetch]);

  useEffect(() => {
    fetchAuctions();
    fetchSettings();
  }, [fetchAuctions, fetchSettings]);

  // 3. SAVE REFERRAL RULE
  const handleSaveRule = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(referralPercentage);
    if (isNaN(val) || val < 0) {
      toast.error("Please enter a valid percentage");
      return;
    }

    try {
      setIsSavingRule(true);
      const baseUrl = getBaseUrl();
      const res = await authFetch(`${baseUrl}/admin/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referral_percentage: val,
        }),
      });

      const data = await res.json().catch(() => null);
      if (res.ok) {
        toast.success(data?.message || "Referral earning rule updated successfully!");
      } else {
        toast.error(data?.message || "Failed to update referral rule");
      }
    } catch (err: any) {
      console.error("Save rule error:", err);
      toast.error(err?.message || "Network error updating referral rule");
    } finally {
      setIsSavingRule(false);
    }
  };

  // Toggle Accordion Expansion
  const toggleRow = (id: number) => {
    setExpandedAuctionIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Helpers to format fields
  const getPropertyTitle = (item: AuctionItem): string => {
    return (
      item.property_name ||
      item.property_title ||
      item.title ||
      item.property?.title ||
      "Untitled Property"
    );
  };

  const getPropertyImage = (item: AuctionItem): string => {
    return (
      item.property_image ||
      item.image ||
      item.property?.image ||
      "/image/placeholder.png"
    );
  };

  const getSellerName = (item: AuctionItem): string => {
    if (typeof item.seller === "string") return item.seller;
    if (item.seller && typeof item.seller === "object" && item.seller.name) {
      return item.seller.name;
    }
    return item.seller_name || "Demo Seller";
  };

  const getWinnerName = (item: AuctionItem): string => {
    if (typeof item.winner === "string") return item.winner;
    if (item.winner && typeof item.winner === "object" && item.winner.name) {
      return item.winner.name;
    }
    return item.winner_name || "-";
  };

  const formatBid = (amount: any): string => {
    if (!amount && amount !== 0) return "-";
    const str = String(amount).trim();
    if (str.includes("Lakh") || str.includes("৳")) {
      return str.startsWith("৳") ? str : `৳ ${str}`;
    }
    const num = Number(amount);
    if (isNaN(num) || num === 0) return "-";
    if (num >= 100000) {
      const lakh = (num / 100000).toFixed(2);
      return `৳ ${lakh} Lakh`;
    }
    return `৳ ${num.toLocaleString("en-BD")}`;
  };

  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return "-";
    if (dateStr.includes("T")) {
      return dateStr.split("T")[0];
    }
    return dateStr.split(" ")[0] || dateStr;
  };

  const formatBidTimestamp = (dateStr?: string): string => {
    if (!dateStr) return "";
    if (dateStr.includes("T")) {
      return dateStr.replace("T", " ").substring(0, 19);
    }
    return dateStr;
  };

  // Status Badge styling
  const renderStatusBadge = (status: string) => {
    const s = (status || "").toLowerCase();
    if (s === "active") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-normal bg-emerald-50 text-emerald-700 border border-emerald-200/80 capitalize">
          Active
        </span>
      );
    }
    if (s === "pending") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-normal bg-amber-50 text-amber-700 border border-amber-200/80 capitalize">
          pending
        </span>
      );
    }
    if (s === "cancelled" || s === "canceled") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-normal bg-stone-100 text-stone-600 border border-stone-200 capitalize">
          cancelled
        </span>
      );
    }
    if (s === "completed") {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-normal bg-blue-50 text-blue-700 border border-blue-200/80 capitalize">
          completed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-normal bg-stone-100 text-stone-700 border border-stone-200 capitalize">
        {status || "unknown"}
      </span>
    );
  };

  // Filtered auctions
  const filteredAuctions = auctions.filter((item) => {
    const propTitle = getPropertyTitle(item).toLowerCase();
    const seller = getSellerName(item).toLowerCase();
    const winner = getWinnerName(item).toLowerCase();
    const q = searchQuery.toLowerCase().trim();

    const matchesSearch =
      !q ||
      propTitle.includes(q) ||
      seller.includes(q) ||
      winner.includes(q) ||
      String(item.id).includes(q);

    if (!matchesSearch) return false;

    if (statusFilter === "Active") {
      return (item.status || "").toLowerCase() === "active";
    }
    if (statusFilter === "Completed") {
      return (item.status || "").toLowerCase() === "completed";
    }

    return true;
  });

  return (
    <div className="w-full space-y-6 font-sans font-normal animate-in fade-in duration-200">
      {/* ========================================================= */}
      {/* 1. TOP HEADER (Auctions count matching screenshot)         */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Gavel className="w-5 h-5 text-[#044133]" />
            <h1 className="text-xl sm:text-2xl text-stone-900 tracking-tight font-normal">
              Auctions
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-1 font-normal">
            {auctions.length} total auctions
          </p>
        </div>

        <button
          type="button"
          onClick={fetchAuctions}
          disabled={loading}
          className="self-start sm:self-auto p-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
          title="Refresh auctions"
        >
          <RefreshCw
            className={cn("w-4 h-4", loading && "animate-spin text-[#044133]")}
          />
        </button>
      </div>

      {/* ========================================================= */}
      {/* 2. REFERRAL EARNING CONFIGURATION CARD                    */}
      {/* ========================================================= */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm text-stone-900 font-normal">
            Referral Earning Configuration
          </h2>
          <p className="text-xs text-stone-500 mt-1 font-normal leading-relaxed">
            Define the global commission percentage paid to the referrer upon a referred bidder winning.
          </p>
        </div>

        <form onSubmit={handleSaveRule} className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center">
            <input
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={referralPercentage}
              onChange={(e) => setReferralPercentage(e.target.value)}
              disabled={loadingSettings || isSavingRule}
              className="w-16 px-2.5 py-1.5 rounded-l-lg border border-stone-200 bg-white text-xs text-stone-800 text-center font-normal focus:outline-none focus:border-[#044133] disabled:bg-stone-50"
            />
            <span className="px-2.5 py-1.5 rounded-r-lg border-y border-r border-stone-200 bg-stone-100 text-xs text-stone-600 font-normal select-none">
              %
            </span>
          </div>

          <button
            type="submit"
            disabled={isSavingRule || loadingSettings}
            className="px-4 py-1.5 rounded-lg bg-[#044133] hover:bg-[#033026] text-white text-xs font-normal transition-colors cursor-pointer shadow-xs disabled:opacity-50 inline-flex items-center gap-1.5"
          >
            {isSavingRule ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Rule</span>
            )}
          </button>
        </form>
      </div>

      {/* ========================================================= */}
      {/* 3. SEARCH & STATUS FILTER PILLS                           */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search input matching screenshot */}
        <div className="w-full max-w-sm relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by property, seller, or winner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#044133] focus:ring-1 focus:ring-[#044133] shadow-2xs font-normal"
          />
        </div>

        {/* Filter Pills matching screenshot */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-white p-1 rounded-xl border border-stone-200">
          {(["All", "Active", "Completed"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-normal transition-colors cursor-pointer",
                statusFilter === tab
                  ? "bg-[#044133] text-white shadow-2xs"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. AUCTIONS LIST / TABLE WITH ACCORDION                   */}
      {/* ========================================================= */}
      <div className="w-full bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-[#fcfbf9] border-b border-stone-200 text-[11px] uppercase tracking-wider text-stone-500 font-normal">
              <tr>
                <th scope="col" className="py-3.5 px-5 font-normal min-w-[200px]">
                  PROPERTY
                </th>
                <th scope="col" className="py-3.5 px-5 font-normal min-w-[130px]">
                  SELLER
                </th>
                <th scope="col" className="py-3.5 px-5 font-normal min-w-[120px]">
                  WINNER
                </th>
                <th scope="col" className="py-3.5 px-5 font-normal min-w-[130px]">
                  WINNING BID
                </th>
                <th scope="col" className="py-3.5 px-5 font-normal min-w-[100px]">
                  STATUS
                </th>
                <th scope="col" className="py-3.5 px-5 font-normal min-w-[100px]">
                  DATE
                </th>
                <th scope="col" className="py-3.5 px-4 font-normal text-right w-12">
                  {/* Expand icon header */}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100 font-normal">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-[#044133]" />
                      <span>Loading auctions...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredAuctions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Building className="w-8 h-8 text-stone-300" />
                      <span>No auctions found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAuctions.map((auction) => {
                  const isExpanded = expandedAuctionIds.includes(auction.id);
                  const bidsList = auction.bids || auction.bid_history || [];
                  const winningBidStr = formatBid(
                    auction.winning_bid || auction.highest_bid || auction.current_bid
                  );

                  return (
                    <React.Fragment key={auction.id}>
                      {/* Main Auction Row */}
                      <tr
                        onClick={() => toggleRow(auction.id)}
                        className={cn(
                          "hover:bg-[#fbfcfb] transition-colors cursor-pointer select-none",
                          isExpanded && "bg-[#fafbfa]"
                        )}
                      >
                        {/* Property with Thumbnail */}
                        <td className="py-4 px-5 text-stone-900 font-normal">
                          <div className="flex items-center gap-3">
                            <div className="relative w-8 h-8 rounded-md overflow-hidden border border-stone-200 shrink-0 bg-stone-100">
                              <Image
                                src={getPropertyImage(auction)}
                                alt={getPropertyTitle(auction)}
                                fill
                                sizes="32px"
                                className="object-cover"
                              />
                            </div>
                            <span className="line-clamp-1">
                              {getPropertyTitle(auction)}
                            </span>
                          </div>
                        </td>

                        {/* Seller */}
                        <td className="py-4 px-5 text-stone-600 font-normal">
                          {getSellerName(auction)}
                        </td>

                        {/* Winner */}
                        <td className="py-4 px-5 text-stone-500 font-normal">
                          {getWinnerName(auction)}
                        </td>

                        {/* Winning Bid */}
                        <td className="py-4 px-5 font-normal">
                          {winningBidStr === "-" ? (
                            <span className="text-stone-400">-</span>
                          ) : (
                            <span className="text-emerald-700 font-normal">
                              {winningBidStr}
                            </span>
                          )}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-5">
                          {renderStatusBadge(auction.status)}
                        </td>

                        {/* Date */}
                        <td className="py-4 px-5 text-stone-500 font-normal whitespace-nowrap">
                          {formatDate(auction.created_at || auction.date || auction.start_date)}
                        </td>

                        {/* Chevron */}
                        <td className="py-4 px-4 text-right text-stone-400">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 ml-auto" />
                          ) : (
                            <ChevronDown className="w-4 h-4 ml-auto" />
                          )}
                        </td>
                      </tr>

                      {/* Accordion Bid History Details (Matches Screenshot) */}
                      {isExpanded && (
                        <tr className="bg-[#fcfdfc] border-b border-stone-100">
                          <td colSpan={7} className="px-6 py-4">
                            <div className="space-y-3">
                              <h3 className="text-xs text-stone-700 font-normal tracking-wide">
                                Bid History
                              </h3>

                              {bidsList.length === 0 ? (
                                <p className="text-xs text-stone-400 font-normal italic py-1">
                                  No bids recorded for this auction.
                                </p>
                              ) : (
                                <div className="space-y-1.5 divide-y divide-stone-100">
                                  {bidsList.map((bid, idx) => {
                                    const bidderName =
                                      bid.bidder_name ||
                                      bid.user_name ||
                                      bid.name ||
                                      bid.user?.name ||
                                      "Bidder";
                                    const bidTime = formatBidTimestamp(
                                      bid.created_at || bid.date
                                    );
                                    const bidAmount = formatBid(
                                      bid.amount || bid.bid_amount
                                    );

                                    return (
                                      <div
                                        key={bid.id || idx}
                                        className="flex items-center justify-between text-xs py-2 px-1"
                                      >
                                        <div className="flex items-center gap-3">
                                          <span className="text-stone-400 font-normal w-4">
                                            {idx + 1}.
                                          </span>
                                          <span className="text-stone-800 font-normal">
                                            {bidderName}
                                          </span>
                                          {bidTime && (
                                            <span className="text-stone-400 text-[11px] font-normal">
                                              {bidTime}
                                            </span>
                                          )}
                                        </div>

                                        <span className="text-emerald-700 font-normal">
                                          {bidAmount}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
