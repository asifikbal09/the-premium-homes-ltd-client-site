"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Users,
  Award,
  Banknote,
  Copy,
  Check,
  Play,
  Calendar,
  X,
  Sparkles,
} from "lucide-react";
import { ClientUser, ReferralDetails, ReferralTransaction } from "./types";
import { fetchUserReferralDetails } from "@/lib/client-dashboard";
import { cn } from "@/lib/utils";

interface ReferTabProps {
  user?: ClientUser | null;
}

interface ReferralHistoryItem {
  id: string | number;
  date: string;
  name: string;
  reward: string;
  status: "Booked" | "In Progress" | "Not Qualified";
  contact: string;
}

const DEFAULT_HISTORY_DATA: ReferralHistoryItem[] = [
  {
    id: 1,
    date: "15 Aug 2026",
    name: "Albert Flores",
    reward: "৳ 5,00,000",
    status: "Booked",
    contact: "(684) 555-0102",
  },
  {
    id: 2,
    date: "15 Aug 2026",
    name: "Kristin Watson",
    reward: "৳ 5,00,000",
    status: "Booked",
    contact: "(808) 555-0111",
  },
  {
    id: 3,
    date: "15 Aug 2026",
    name: "Kathryn Murphy",
    reward: "-",
    status: "In Progress",
    contact: "(480) 555-0103",
  },
  {
    id: 4,
    date: "15 Aug 2026",
    name: "Eleanor Pena",
    reward: "৳ 5,00,000",
    status: "Booked",
    contact: "(671) 555-0110",
  },
  {
    id: 5,
    date: "15 Aug 2026",
    name: "Annette Black",
    reward: "-",
    status: "Not Qualified",
    contact: "(302) 555-0107",
  },
];

export function ReferTab({ user }: ReferTabProps) {
  const [data, setData] = useState<ReferralDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [filterStatus, setFilterStatus] = useState<"All" | "Booked" | "In Progress" | "Not Qualified">("All");

  // Resolve user id from prop or all localStorage variants
  const getUserId = useCallback((): string | number | null => {
    if (user?.id) return user.id;
    if (typeof window === "undefined") return null;

    try {
      const directId =
        localStorage.getItem("tphl_user_id") ||
        localStorage.getItem("user_id");
      if (directId) return directId;

      const storedUser =
        localStorage.getItem("tphl_user") ||
        localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed?.id || parsed?.user_id) return parsed.id || parsed.user_id;
      }

      const storedAuth =
        localStorage.getItem("tphl_auth_data") ||
        localStorage.getItem("auth_data");
      if (storedAuth) {
        const parsedAuth = JSON.parse(storedAuth);
        const resolved =
          parsedAuth?.user?.id ||
          parsedAuth?.data?.id ||
          parsedAuth?.id ||
          parsedAuth?.user_id;
        if (resolved) return resolved;
      }
    } catch {
      // ignore JSON errors
    }
    return null;
  }, [user]);

  const loadReferralDetails = useCallback(async () => {
    const uid = getUserId();
    console.log("[ReferTab] Resolved userId for referral API:", uid);
    if (!uid) {
      console.warn("[ReferTab] No userId found, skipping API call.");
      return;
    }

    try {
      setLoading(true);
      console.log(`[ReferTab] Fetching referral details for userId=${uid}...`);
      const res = await fetchUserReferralDetails(uid);
      console.log("[ReferTab] Received referral details:", res);
      if (res) {
        setData(res);
      }
    } catch (err) {
      console.error("[ReferTab] Error loading referral details:", err);
    } finally {
      setLoading(false);
    }
  }, [getUserId]);

  useEffect(() => {
    loadReferralDetails();
  }, [loadReferralDetails]);

  // Derived values strictly from API
  const referralCode = data?.referral_code || (loading ? "..." : "REF-TPHL");
  const referralLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/?ref=${referralCode}`
      : `https://thepremiumhomesltd.com/?ref=${referralCode}`;

  const totalReferrals =
    data !== null
      ? String(data.referred_clients_count ?? 0).padStart(2, "0")
      : loading
      ? "--"
      : "00";

  const successfulReferrals =
    data !== null
      ? String(
          (data.transactions || []).filter(
            (t) => (t.status || "").toLowerCase() === "approved"
          ).length
        ).padStart(2, "0")
      : loading
      ? "--"
      : "00";

  const totalEarnings =
    data !== null
      ? `৳ ${Number(data.wallet_balance || 0).toLocaleString("en-IN")}`
      : loading
      ? "৳ --"
      : "৳ 0";

  const transactionsList: ReferralTransaction[] = data?.transactions || [];

  const filteredRows = transactionsList.filter((tx) => {
    if (filterStatus === "All") return true;
    const s = (tx.status || "").toLowerCase();
    if (filterStatus === "Booked") return s === "approved" || s === "booked";
    if (filterStatus === "In Progress") return s === "pending" || s === "in progress";
    if (filterStatus === "Not Qualified") return s === "rejected" || s === "not qualified";
    return true;
  });

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShareLink = () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator
        .share({
          title: "The Premium Homes Ltd. - Referral Invitation",
          text: `Share the joy of a better home with The Premium Homes Ltd. Join via my link: ${referralLink}`,
          url: referralLink,
        })
        .catch(() => {
          handleCopyLink();
        });
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#044133] tracking-tight">
            Refer & Earn
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Share the joy of a better home and earn rewards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* How it work Button */}
          <button
            type="button"
            onClick={() => setShowHowItWorks(true)}
            className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white border border-stone-200/90 shadow-2xs hover:bg-stone-50 transition-all cursor-pointer"
          >
            <div className="w-6 h-6 rounded-full bg-[#044133] flex items-center justify-center text-white shrink-0">
              <Play className="w-3 h-3 fill-white ml-0.5" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-stone-900">
              How it work
            </span>
          </button>
        </div>
      </div>

      {/* Top 3 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Total Referrals */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 border border-stone-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-stone-100/90 text-stone-700 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5 text-stone-600" />
          </div>
          <div className="min-w-0">
            <span className="block text-xs text-stone-500 font-medium">
              Total Referrals
            </span>
            <div className="font-sans text-2xl sm:text-3xl font-bold text-[#044133] leading-tight my-0.5">
              {totalReferrals}
            </div>
            <span className="block text-xs text-stone-400">
              Friends invited
            </span>
          </div>
        </div>

        {/* Successful Referrals */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 border border-stone-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-stone-100/90 text-stone-700 flex items-center justify-center shrink-0">
            <Award className="w-5 h-5 text-stone-600" />
          </div>
          <div className="min-w-0">
            <span className="block text-xs text-stone-500 font-medium">
              Successful Referrals
            </span>
            <div className="font-sans text-2xl sm:text-3xl font-bold text-[#044133] leading-tight my-0.5">
              {successfulReferrals}
            </div>
            <span className="block text-xs text-stone-400">
              Friends Booked
            </span>
          </div>
        </div>

        {/* Total Earnings */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-6 border border-stone-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-stone-100/90 text-stone-700 flex items-center justify-center shrink-0">
            <Banknote className="w-5 h-5 text-stone-600" />
          </div>
          <div className="min-w-0">
            <span className="block text-xs text-stone-500 font-medium">
              Total Earnings
            </span>
            <div className="font-sans text-2xl sm:text-3xl font-bold text-[#044133] leading-tight my-0.5">
              {totalEarnings}
            </div>
            <span className="block text-xs text-stone-400">
              Rewards Earned
            </span>
          </div>
        </div>
      </div>

      {/* Middle: Your Referral Link Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#044133]">
            Your Referral Link
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Your will earn ৳100 when they use your code for their first booking.
          </p>
        </div>

        {/* Referral Link Box */}
        <div
          onClick={handleCopyLink}
          className="w-full bg-[#f4f5f8] rounded-xl sm:rounded-2xl px-4 py-3 sm:py-3.5 flex items-center justify-between text-xs sm:text-sm text-stone-700 cursor-pointer hover:bg-stone-200/60 transition-colors border border-stone-200/60"
        >
          <span className="font-mono text-stone-800 truncate mr-2 select-all">
            {referralLink}
          </span>
          <button
            type="button"
            className="text-stone-500 hover:text-stone-800 transition-colors shrink-0"
            aria-label="Copy referral link"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Share Button */}
        <button
          type="button"
          onClick={handleShareLink}
          className="w-full py-3.5 sm:py-4 rounded-full bg-[#044133] hover:bg-[#065442] text-white font-semibold text-xs sm:text-sm transition-all cursor-pointer shadow-xs active:scale-[0.99] text-center"
        >
          {copied ? "Link Copied to Clipboard!" : "Share invite link"}
        </button>
      </div>

      {/* Bottom: Referral History Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-stone-200/80 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#044133]">
              Referral History
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
              Track your referrals and rewards.
            </p>
          </div>

          {/* All Referrals Filter Button */}
          <div className="relative self-start sm:self-auto">
            <button
              type="button"
              onClick={() => {
                const next =
                  filterStatus === "All"
                    ? "Booked"
                    : filterStatus === "Booked"
                    ? "In Progress"
                    : filterStatus === "In Progress"
                    ? "Not Qualified"
                    : "All";
                setFilterStatus(next);
              }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100/80 hover:bg-stone-200/70 text-xs font-semibold text-stone-700 transition-colors cursor-pointer border border-stone-200/60"
            >
              <Calendar className="w-3.5 h-3.5 text-stone-500" />
              <span>{filterStatus === "All" ? "All Referrals" : filterStatus}</span>
            </button>
          </div>
        </div>

        {/* History Table */}
        <div className="overflow-x-auto -mx-6 sm:mx-0">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-stone-100 text-stone-400 text-[11px] sm:text-xs">
                <th className="pb-3 px-6 sm:px-4 font-normal">Date</th>
                <th className="pb-3 px-4 font-normal">Name</th>
                <th className="pb-3 px-4 font-normal">Reward</th>
                <th className="pb-3 px-4 font-normal">Status</th>
                <th className="pb-3 px-6 sm:px-4 font-normal">Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs sm:text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-stone-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-[#044133] border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs text-stone-500">Loading referral records...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-stone-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="w-8 h-8 text-stone-300 stroke-[1.5]" />
                      <span className="font-semibold text-stone-600 text-xs sm:text-sm">No referrals yet</span>
                      <span className="text-[11px] text-stone-400">
                        Share your invite link above to start earning rewards.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRows.map((row, idx) => {
                  const rawDate = row.created_at || row.date;
                  const formattedDate = rawDate
                    ? new Date(rawDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "Recent";

                  const statusStr = (row.status || "pending").toLowerCase();
                  const isApproved = statusStr === "approved" || statusStr === "booked";
                  const isRejected = statusStr === "rejected" || statusStr === "not qualified";

                  return (
                    <tr
                      key={row.id || idx}
                      className="hover:bg-stone-50/60 transition-colors"
                    >
                      <td className="py-4 px-6 sm:px-4 text-stone-700 whitespace-nowrap">
                        {formattedDate}
                      </td>
                      <td className="py-4 px-4 font-semibold text-stone-900 whitespace-nowrap">
                        {row.referred_friend || `Friend #${idx + 1}`}
                      </td>
                      <td className="py-4 px-4 text-stone-800 whitespace-nowrap">
                        {row.amount ? `৳ ${Number(row.amount).toLocaleString("en-IN")}` : "-"}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        {isApproved && (
                          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-medium bg-[#e6f4ea] text-[#137333]">
                            Booked
                          </span>
                        )}
                        {!isApproved && !isRejected && (
                          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-medium bg-[#fef7e0] text-[#b06000]">
                            In Progress
                          </span>
                        )}
                        {isRejected && (
                          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-medium bg-[#fce8e6] text-[#c5221f]">
                            Not Qualified
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 sm:px-4 text-stone-600 whitespace-nowrap">
                        {row.message || "-"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* How it work Modal */}
      {showHowItWorks && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowHowItWorks(false)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#044133]/10 text-[#044133] flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>

            <h3 className="font-serif text-2xl font-bold text-[#044133]">
              How it works
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 mb-5">
              Three simple steps to refer and earn rewards with The Premium Homes.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-[#044133] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Share your invite link</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">Send your personalized referral link to friends and family.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-[#044133] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Friend books a home</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">When they register and finalize their property booking.</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-6 h-6 rounded-full bg-[#044133] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900">Get your reward</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">Receive direct referral bonus credited to your wallet balance.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowHowItWorks(false)}
              className="mt-6 w-full py-2.5 rounded-full bg-[#044133] text-white text-xs font-semibold hover:bg-[#065442] transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


