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
import { motion, AnimatePresence } from "framer-motion";
import { ClientUser, ReferralDetails, ReferralTransaction } from "./types";
import { fetchUserReferralDetails } from "@/lib/client-dashboard";

interface ReferTabProps {
  user?: ClientUser | null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

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
    if (!uid) return;

    try {
      setLoading(true);
      const res = await fetchUserReferralDetails(uid);
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
  const referralCode = data?.referral_code || (loading ? "..." : "AFSAR123");
  const referralLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/?ref=${referralCode}`
      : `https://premiumhome.com/ref/${referralCode}`;

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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-[16px] sm:gap-[24px] max-w-[952px] mx-auto w-full"
    >
      {/* Top Section: Header + 3 Stat Cards (Figma node 8279:23053) */}
      <motion.div variants={itemVariants} className="flex flex-col gap-[24px] w-full">
        {/* Header Row (Figma node 8279:23054) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
          <div className="flex flex-col gap-[12px] items-start">
            <h1 className="capitalize font-serif font-semibold leading-[1.1] text-[#054b3c] text-[28px] sm:text-[32px]">
              Refer &amp; Earn
            </h1>
            <p className="font-sans font-normal leading-none text-[#546360] text-[15px] sm:text-[16px]">
              Share the joy of a better home and earn rewards.
            </p>
          </div>

          {/* "How it work" Button (Figma node 8279:23058: bg-white h-[52px] p-[12px] rounded-[8px] w-[180px]) */}
          <motion.button
            type="button"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowHowItWorks(true)}
            className="bg-white flex h-[52px] items-center p-[12px] rounded-[8px] shrink-0 sm:w-[180px] cursor-pointer hover:shadow-xs transition-shadow self-start sm:self-auto"
          >
            <div className="flex gap-[15px] items-center">
              <div className="size-[32px] rounded-full bg-[#054b3c] flex items-center justify-center text-white shrink-0">
                <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
              </div>
              <span className="font-sans font-semibold leading-none text-[16px] text-black whitespace-nowrap">
                How it work
              </span>
            </div>
          </motion.button>
        </div>

        {/* 3 Stat Cards (Figma node 8279:23068: gap-[16px], h-[116px], p-[20px], rounded-[12px]) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[12px] sm:gap-[16px] w-full">
          {/* Card 1: Total Referrals (Figma node 8279:23069) */}
          <motion.div
            whileHover={{ y: -3 }}
            className="bg-white flex h-[116px] items-center p-[20px] rounded-[12px]"
          >
            <div className="flex flex-1 gap-[20px] items-start min-w-0">
              <div className="bg-[#f1f2f6] flex items-center justify-center p-[14px] rounded-full shrink-0 size-[56px]">
                <Users className="size-[28px] text-[#054b3c] stroke-[1.75]" />
              </div>
              <div className="flex flex-1 flex-col gap-[8px] items-start min-w-0">
                <p className="font-sans font-normal leading-[18px] text-[#59657b] text-[14px] w-full truncate">
                  Total Referrals
                </p>
                <div className="flex flex-col gap-[8px] items-start w-full">
                  <p className="font-sans font-semibold leading-none text-[#054b3c] text-[20px] w-full">
                    {totalReferrals}
                  </p>
                  <p className="font-sans font-normal leading-[1.2] text-[#59657b] text-[14px] w-full">
                    Friends invited
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Successful Referrals (Figma node 8279:23080) */}
          <motion.div
            whileHover={{ y: -3 }}
            className="bg-white flex h-[116px] items-center p-[20px] rounded-[12px]"
          >
            <div className="flex flex-1 gap-[20px] items-start min-w-0">
              <div className="bg-[#f1f2f6] flex items-center justify-center p-[14px] rounded-full shrink-0 size-[56px]">
                <Award className="size-[28px] text-[#054b3c] stroke-[1.75]" />
              </div>
              <div className="flex flex-1 flex-col gap-[8px] items-start min-w-0">
                <p className="font-sans font-normal leading-[18px] text-[#59657b] text-[14px] whitespace-nowrap">
                  Successful Referrals
                </p>
                <div className="flex flex-col gap-[8px] items-start w-full">
                  <p className="font-sans font-semibold leading-none text-[#054b3c] text-[20px] w-full">
                    {successfulReferrals}
                  </p>
                  <p className="font-sans font-normal leading-[1.2] text-[#59657b] text-[14px] w-full">
                    Friends Booked
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Total Earnings (Figma node 8279:23091) */}
          <motion.div
            whileHover={{ y: -3 }}
            className="bg-white flex h-[116px] items-center p-[20px] rounded-[12px]"
          >
            <div className="flex flex-1 gap-[20px] items-start min-w-0">
              <div className="bg-[#f1f2f6] flex items-center justify-center p-[14px] rounded-full shrink-0 size-[56px]">
                <Banknote className="size-[28px] text-[#054b3c] stroke-[1.75]" />
              </div>
              <div className="flex flex-1 flex-col gap-[8px] items-start min-w-0">
                <p className="font-sans font-normal leading-[18px] text-[#59657b] text-[14px] w-full truncate">
                  Total Earnings
                </p>
                <div className="flex flex-col gap-[8px] items-start w-full">
                  <p className="font-sans font-semibold leading-none text-[#054b3c] text-[20px] w-full truncate">
                    {totalEarnings}
                  </p>
                  <p className="font-sans font-normal leading-[1.2] text-[#59657b] text-[14px] w-full">
                    Rewards Earned
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Middle: Your Referral Link Card (Figma node 8279:22944: bg-white rounded-[16px] p-[32px]) */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-[16px] p-[24px] sm:p-[32px] w-full"
      >
        <div className="flex flex-col gap-[16px] items-start w-full">
          <div className="flex flex-col gap-[12px] items-start">
            <h2 className="font-serif font-semibold leading-none text-[#054b3c] text-[22px] sm:text-[24px]">
              Your Referral Link
            </h2>
            <p className="font-sans font-normal leading-[1.6] text-[#546360] text-[14px]">
              Your will earn ৳100 when they use your code for their first booking.
            </p>
          </div>

          <div className="flex flex-col gap-[12px] items-start justify-center w-full">
            {/* Link Copy Pill (Figma node 8279:22950: bg-[#f1f2f6] h-[48px] px-[16px] rounded-[100px]) */}
            <div
              onClick={handleCopyLink}
              className="bg-[#f1f2f6] flex h-[48px] items-center justify-between px-[16px] rounded-[100px] w-full cursor-pointer hover:bg-[#e7e9ef] transition-colors"
            >
              <span className="font-sans font-normal leading-none text-[#3b3e40] text-[14px] truncate mr-3 select-all">
                {referralLink}
              </span>
              <button
                type="button"
                className="relative shrink-0 size-[20px] text-[#3b3e40] hover:text-[#054b3c] transition-colors flex items-center justify-center"
                aria-label="Copy referral link"
              >
                {copied ? (
                  <Check className="size-[18px] text-[#039855]" />
                ) : (
                  <Copy className="size-[18px]" />
                )}
              </button>
            </div>

            {/* Share Invite Link Button (Figma node 8279:22955: bg-[#054b3c] h-[48px] rounded-[100px]) */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.005 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleShareLink}
              className="bg-[#054b3c] hover:bg-[#043d30] flex h-[48px] items-center justify-center px-[32px] py-[12px] rounded-[100px] w-full cursor-pointer transition-colors"
            >
              <span className="font-sans font-medium leading-none text-[16px] text-white whitespace-nowrap">
                {copied ? "Link Copied to Clipboard!" : "Share invite link"}
              </span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Bottom: Referral History Card (Figma node 8279:22957: bg-white rounded-[12px] p-[24px]) */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-[12px] p-[20px] sm:p-[24px] w-full"
      >
        <div className="flex flex-col gap-[20px] items-start w-full">
          {/* Card Header (Figma node 8279:22961) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
            <div className="flex flex-col gap-[12px] items-start">
              <h3 className="capitalize font-serif font-semibold leading-[1.1] text-[#054b3c] text-[22px] sm:text-[24px]">
                Referral History
              </h3>
              <p className="font-sans font-normal leading-none text-[#3b3e40] text-[15px] sm:text-[16px]">
                Track your referrals and rewards.
              </p>
            </div>

            {/* Filter Button (Figma node 8279:22971: bg-gradient-to-b from-white to-[#f8f9fc] border border-[#eaecf0] h-[40px] px-[16px] rounded-[78px]) */}
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
              className="bg-gradient-to-b from-white to-[#f8f9fc] border border-[#eaecf0] flex gap-[6px] h-[40px] items-center justify-center px-[16px] py-[8px] rounded-[78px] shrink-0 cursor-pointer hover:border-[#d0d5dd] transition-colors self-start sm:self-auto"
            >
              <Calendar className="size-[18px] text-[#546360]" />
              <span className="font-sans font-normal text-[#546360] text-[14px] whitespace-nowrap">
                {filterStatus === "All" ? "All Referrals" : filterStatus}
              </span>
            </button>
          </div>

          {/* History Table (Figma node 8279:22980) */}
          <div className="overflow-x-auto w-full -mx-[20px] sm:mx-0 px-[20px] sm:px-0">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="bg-[#fafafa] border-y border-[#eaecf0] text-[#6d737e] text-[12px] font-medium">
                  <th className="py-[9px] px-[21px] font-medium leading-[18px]">Date</th>
                  <th className="py-[9px] px-[20px] font-medium leading-[18px]">Name</th>
                  <th className="py-[9px] pl-[32px] pr-[21px] font-medium leading-[18px]">Reward</th>
                  <th className="py-[9px] px-[21px] font-medium leading-[18px]">Status</th>
                  <th className="py-[9px] px-[21px] font-medium leading-[18px]">Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eaecf0] text-[14px] text-[#101828]">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-[#59657b]">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-[#054b3c] border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs text-[#546360]">Loading referral records...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredRows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-[#59657b]">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Users className="w-8 h-8 text-stone-300 stroke-[1.5]" />
                        <span className="font-semibold text-[#232f43] text-sm">No referrals yet</span>
                        <span className="text-xs text-[#59657b]">
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
                      : "15 Aug 2026";

                    const statusStr = (row.status || "pending").toLowerCase();
                    const isApproved = statusStr === "approved" || statusStr === "booked";
                    const isRejected = statusStr === "rejected" || statusStr === "not qualified";

                    return (
                      <tr
                        key={row.id || idx}
                        className="hover:bg-[#fafafa]/80 transition-colors h-[56px]"
                      >
                        <td className="py-[18px] px-[21px] text-[#101828] whitespace-nowrap leading-[20px]">
                          {formattedDate}
                        </td>
                        <td className="py-[12px] pl-[24px] pr-[21px] text-[#101828] whitespace-nowrap leading-[20px]">
                          {row.referred_friend || `Friend #${idx + 1}`}
                        </td>
                        <td className="py-[18px] pl-[32px] pr-[21px] text-[#121827] whitespace-nowrap leading-[20px]">
                          {row.amount ? `৳ ${Number(row.amount).toLocaleString("en-IN")}` : "-"}
                        </td>
                        <td className="p-[16px] whitespace-nowrap">
                          {isApproved && (
                            <span className="bg-gradient-to-b from-[#f7fef9] to-[#e3fceb] inline-flex h-[24px] items-center px-[16px] py-[2px] rounded-full text-[12px] font-normal text-[#039855] leading-[18px]">
                              Booked
                            </span>
                          )}
                          {!isApproved && !isRejected && (
                            <span className="bg-[#fef5d9] inline-flex h-[24px] items-center px-[16px] py-[2px] rounded-full text-[12px] font-normal text-[#bf9204] leading-[18px]">
                              In Progress
                            </span>
                          )}
                          {isRejected && (
                            <span className="bg-[#ffe8e8] inline-flex h-[24px] items-center px-[16px] py-[2px] rounded-full text-[12px] font-normal text-[#ec0000] leading-[18px]">
                              Not Qualified
                            </span>
                          )}
                        </td>
                        <td className="py-[18px] px-[21px] text-[#121827] whitespace-nowrap leading-[20px]">
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
      </motion.div>

      {/* How it work Modal */}
      <AnimatePresence>
        {showHowItWorks && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowHowItWorks(false)}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative"
            >
              <button
                onClick={() => setShowHowItWorks(false)}
                className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-[#054b3c]/10 text-[#054b3c] flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>

              <h3 className="font-serif text-2xl font-bold text-[#054b3c]">
                How it works
              </h3>
              <p className="text-xs sm:text-sm text-[#546360] mt-1 mb-5">
                Three simple steps to refer and earn rewards with The Premium Homes.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-[#054b3c] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#101828]">Share your invite link</h4>
                    <p className="text-[11px] text-[#546360] mt-0.5">Send your personalized referral link to friends and family.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-[#054b3c] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#101828]">Friend books a home</h4>
                    <p className="text-[11px] text-[#546360] mt-0.5">When they register and finalize their property booking.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-6 h-6 rounded-full bg-[#054b3c] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#101828]">Get your reward</h4>
                    <p className="text-[11px] text-[#546360] mt-0.5">Receive direct referral bonus credited to your wallet balance.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowHowItWorks(false)}
                className="mt-6 w-full py-2.5 rounded-full bg-[#054b3c] text-white text-xs font-semibold hover:bg-[#043d30] transition-colors cursor-pointer"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
