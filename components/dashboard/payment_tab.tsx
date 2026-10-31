"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Calendar,
  CalendarCheck,
  CalendarClock,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  CreditCard,
  CheckCircle2,
  Clock,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";
import { ClientPayment, ClientUser, ClientFlat } from "./types";
import { parseAmount, formatTaka } from "@/lib/client-dashboard";

interface PaymentTabProps {
  payments?: ClientPayment[];
  stats?: {
    totalPrice?: number;
    totalPaid?: number;
    totalDue?: number;
    formattedPrice?: string;
    formattedPaid?: string;
    formattedDue?: string;
  };
  user?: ClientUser | null;
  myFlats?: ClientFlat[];
  isLoading?: boolean;
}

type SubTab = "history" | "upcoming" | "plan";

const ITEMS_PER_PAGE = 7;

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

export function PaymentTab({
  payments,
  stats,
  user,
  myFlats,
  isLoading = false,
}: PaymentTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("history");
  const [selectedFlatIndex, setSelectedFlatIndex] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionFilter, setTransactionFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Determine active project flat info strictly from user's flats
  const availableFlats = myFlats || [];
  const currentFlat = availableFlats[selectedFlatIndex] || availableFlats[0] || null;

  // Payments for the selected flat (filter strictly by unique flat_id, flat_no, or invoice suffix)
  const flatPayments = React.useMemo(() => {
    if (!payments || payments.length === 0) return [];
    if (!currentFlat) return payments;

    const matched = payments.filter((p) => {
      if (p.flat_id && currentFlat.id && String(p.flat_id) === String(currentFlat.id)) {
        return true;
      }
      if (
        p.flat_no &&
        currentFlat.flatNo &&
        String(p.flat_no).trim().toLowerCase() === String(currentFlat.flatNo).trim().toLowerCase()
      ) {
        return true;
      }
      if (p.invoice_no && p.invoice_no.endsWith(`-${selectedFlatIndex + 1}`)) {
        return true;
      }
      if (currentFlat.flatNo && p.project && p.project.includes(`Unit ${currentFlat.flatNo}`)) {
        return true;
      }
      return false;
    });

    return matched;
  }, [payments, currentFlat, selectedFlatIndex]);

  // Compute flat-wise monetary values strictly for the currently selected flat
  const flatPrice = React.useMemo(() => {
    if (currentFlat?.price) {
      const p = parseAmount(currentFlat.price);
      if (p > 0) return p;
    }
    return stats?.totalPrice || 0;
  }, [currentFlat, stats]);

  const flatPaid = React.useMemo(() => {
    if (currentFlat?.partial_payment) {
      const p = parseAmount(currentFlat.partial_payment);
      if (p > 0) return p;
    }
    const sum = flatPayments
      .filter((p) => p.status === "paid")
      .reduce((acc, p) => acc + parseAmount(p.amount), 0);
    if (sum > 0) return sum;
    return stats?.totalPaid || 0;
  }, [currentFlat, flatPayments, stats]);

  const flatDue = React.useMemo(() => {
    if (currentFlat?.due_payment) {
      const d = parseAmount(currentFlat.due_payment);
      if (d > 0) return d;
    }
    const sum = flatPayments
      .filter((p) => p.status === "due")
      .reduce((acc, p) => acc + parseAmount(p.amount), 0);
    if (sum > 0) return sum;
    if (flatPrice > 0 && flatPaid > 0) return Math.max(0, flatPrice - flatPaid);
    return stats?.totalDue || 0;
  }, [currentFlat, flatPayments, flatPrice, flatPaid, stats]);

  const completionPct = React.useMemo(() => {
    if (flatPrice > 0) {
      return Math.min(100, Math.round((flatPaid / flatPrice) * 100));
    }
    return user?.completion !== undefined ? user.completion : 0;
  }, [flatPrice, flatPaid, user]);

  const totalPaid = currentFlat ? formatTaka(flatPaid) : (stats?.formattedPaid || user?.total_paid || "৳ 0");
  const outstanding = currentFlat ? formatTaka(flatDue) : (stats?.formattedDue || user?.outstanding || "৳ 0");
  const totalExpense = currentFlat ? formatTaka(flatPrice) : (stats?.formattedPrice || user?.total_expense || "৳ 0");

  // Circular SVG progress (68x68 matching Figma 8261:21227)
  const radius = 29;
  const circumference = 2 * Math.PI * radius;
  const clampedCompletion = Math.min(100, Math.max(0, completionPct));
  const strokeDashoffset =
    circumference - (circumference * clampedCompletion) / 100;

  // Payments to show in history table
  const historyPayments = React.useMemo(
    () =>
      flatPayments && flatPayments.length > 0
        ? flatPayments.filter((p) =>
            transactionFilter === "all" ? true : p.status === transactionFilter
          )
        : [],
    [flatPayments, transactionFilter]
  );

  // Actual dynamic pagination calculations
  const totalPages = Math.max(1, Math.ceil(historyPayments.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedPayments = React.useMemo(
    () =>
      historyPayments.slice(
        (safePage - 1) * ITEMS_PER_PAGE,
        safePage * ITEMS_PER_PAGE
      ),
    [historyPayments, safePage]
  );

  const pageNumbers = React.useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (safePage <= 3) {
      return [1, 2, 3, 4, "...", totalPages - 1, totalPages] as (number | string)[];
    }
    if (safePage >= totalPages - 2) {
      return [
        1,
        2,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ] as (number | string)[];
    }
    return [
      1,
      "...",
      safePage - 1,
      safePage,
      safePage + 1,
      "...",
      totalPages,
    ] as (number | string)[];
  }, [totalPages, safePage]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-[32px] lg:gap-[48px] w-full"
    >
      {/* ========================================================= */}
      {/* 1. TOP SECTION: HEADER + 4 METRIC CARDS (8261:21185)      */}
      {/* ========================================================= */}
      <motion.div variants={itemVariants} className="flex flex-col gap-[24px] w-full">
        {/* Top Header Row (Figma node 8261:21186) */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 w-full">
          <div className="flex flex-col gap-[12px] items-start">
            <h1 className="capitalize font-serif font-semibold leading-[1.1] text-[#054b3c] text-[28px]">
              Payment
            </h1>
            <p className="font-sans font-normal leading-none text-[#546360] text-[15px] sm:text-[16px]">
              Manage your payments, view history and upcoming dues.
            </p>
          </div>

          {/* Property Selector Card (Figma node 8261:21190: bg-white p-[12px] rounded-[8px]) */}
          <div className="relative self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="bg-white flex items-center justify-between gap-[24px] sm:gap-[56px] p-[12px] rounded-[8px] cursor-pointer text-left hover:shadow-xs transition-shadow"
            >
              <div className="flex gap-[15px] items-center min-w-0">
                <div className="relative rounded-[6px] shrink-0 size-[56px] overflow-hidden bg-[#f1f2f6]">
                  <Image
                    src={currentFlat?.image || "/image/progress/tph_green_valley.png"}
                    alt={currentFlat?.title || "Property"}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-[9px] items-start leading-none min-w-0 sm:w-[192px]">
                  <p className="font-sans font-semibold text-[16px] text-black truncate w-full">
                    {currentFlat ? currentFlat.title : "The Premium Green Valley"}
                  </p>
                  <p className="font-sans font-normal text-[14px] text-[#667085] truncate w-full">
                    {currentFlat
                      ? `${currentFlat.location}${currentFlat.flatNo ? ` • Unit ${currentFlat.flatNo}` : ""}`
                      : "Gulshan 2, Dhaka"}
                  </p>
                </div>
              </div>

              <div
                className={`flex items-center justify-center shrink-0 size-[16px] text-[#3b3e40] transition-transform duration-200 ${
                  isDropdownOpen ? "-rotate-90" : "rotate-90"
                }`}
              >
                <ChevronRight className="size-[16px]" />
              </div>
            </button>

            {/* Property Dropdown Menu */}
            {isDropdownOpen && availableFlats.length > 0 && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-full min-w-[280px] bg-white rounded-[12px] border border-[#eaecf0] shadow-xl z-30 overflow-hidden py-1.5">
                  <div className="px-3.5 py-2 border-b border-stone-100 text-[11px] font-bold text-[#6d737e] uppercase tracking-wider">
                    Select Property
                  </div>
                  {availableFlats.map((flat, idx) => (
                    <button
                      key={flat.id || idx}
                      type="button"
                      onClick={() => {
                        setSelectedFlatIndex(idx);
                        setCurrentPage(1);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left hover:bg-[#f1f6f5] transition-colors cursor-pointer ${
                        selectedFlatIndex === idx ? "bg-[#054b3c]/5 text-[#054b3c]" : "text-[#101828]"
                      }`}
                    >
                      <div className="relative w-10 h-10 rounded-[6px] overflow-hidden shrink-0 bg-stone-100">
                        <Image
                          src={flat.image || "/image/progress/tph_green_valley.png"}
                          alt={flat.title}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate">
                          {flat.title}
                          {flat.flatNo ? ` — Unit ${flat.flatNo}` : ""}
                        </p>
                        <p className="text-[11px] text-[#667085] truncate mt-0.5">
                          {flat.location}
                        </p>
                      </div>
                      {selectedFlatIndex === idx && (
                        <Check className="w-4 h-4 text-[#054b3c] shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* 4 Metric Cards (Figma node 8261:21198: h-[148px] px-[16px] py-[32px] rounded-[12px] gap-[16px]) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[12px] sm:gap-[16px] w-full">
          {/* Card 1: Total Paid (8261:21199) */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-[12px] h-[148px] px-[16px] py-[32px] flex items-center"
          >
            <div className="flex flex-1 gap-[20px] items-start min-w-0">
              <div className="w-[64px] h-[64px] rounded-full bg-[#005d4d] p-[16px] flex items-center justify-center shrink-0">
                <svg className="w-[32px] h-[32px] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="6" width="20" height="12" rx="2" />
                  <circle cx="12" cy="12" r="2" />
                  <path d="M6 12h.01M18 12h.01" />
                </svg>
              </div>
              <div className="flex flex-1 flex-col gap-[8px] items-start min-w-0">
                <span className="text-[16px] font-normal leading-[18px] text-[#59657b] w-full truncate">
                  Total Paid
                </span>
                {isLoading ? (
                  <div className="h-[24px] w-28 bg-stone-200 rounded animate-pulse" />
                ) : (
                  <span className="text-[22px] xl:text-[24px] font-semibold leading-none text-[#054b3c] w-full truncate">
                    {totalPaid}
                  </span>
                )}
                <span className="text-[14px] font-normal leading-[1.2] text-[#59657b] w-full truncate">
                  Paid to date
                </span>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Outstanding (8261:21208) */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-[12px] h-[148px] px-[16px] py-[32px] flex items-center"
          >
            <div className="flex flex-1 gap-[20px] items-start min-w-0">
              <div className="w-[64px] h-[64px] rounded-full bg-[#bf2318] p-[16px] flex items-center justify-center shrink-0">
                <svg className="w-[32px] h-[32px] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <line x1="2" y1="10" x2="22" y2="10" />
                </svg>
              </div>
              <div className="flex flex-1 flex-col gap-[8px] items-start min-w-0">
                <span className="text-[16px] font-normal leading-[18px] text-[#59657b] w-full truncate">
                  Outstanding
                </span>
                {isLoading ? (
                  <div className="h-[24px] w-28 bg-stone-200 rounded animate-pulse" />
                ) : (
                  <span className="text-[22px] xl:text-[24px] font-semibold leading-none text-[#054b3c] w-full truncate">
                    {outstanding}
                  </span>
                )}
                <span className="text-[14px] font-normal leading-[1.2] text-[#59657b] w-full truncate">
                  Remaining Due
                </span>
              </div>
            </div>
          </motion.div>

          {/* Card 3: Total Expense (8261:21217) */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-[12px] h-[148px] px-[16px] py-[32px] flex items-center"
          >
            <div className="flex flex-1 gap-[20px] items-start min-w-0">
              <div className="w-[64px] h-[64px] rounded-full bg-[#d8a44d] p-[16px] flex items-center justify-center shrink-0">
                <svg className="w-[32px] h-[32px] text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <div className="flex flex-1 flex-col gap-[8px] items-start min-w-0">
                <span className="text-[16px] font-normal leading-[18px] text-[#59657b] w-full truncate">
                  Total Expense
                </span>
                {isLoading ? (
                  <div className="h-[24px] w-28 bg-stone-200 rounded animate-pulse" />
                ) : (
                  <span className="text-[22px] xl:text-[24px] font-semibold leading-none text-[#054b3c] w-full truncate">
                    {totalExpense}
                  </span>
                )}
                <span className="text-[14px] font-normal leading-[1.2] text-[#59657b] w-full truncate">
                  All Project Expense
                </span>
              </div>
            </div>
          </motion.div>

          {/* Card 4: Completion (8261:21226) */}
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-[12px] h-[148px] px-[16px] py-[32px] flex items-center gap-[20px]"
          >
            <div className="relative w-[68px] h-[68px] shrink-0 flex items-center justify-center">
              {isLoading ? (
                <div className="w-[68px] h-[68px] rounded-full bg-stone-200 animate-pulse" />
              ) : (
                <>
                  <svg className="w-[68px] h-[68px] -rotate-90" viewBox="0 0 68 68">
                    <circle
                      cx="34"
                      cy="34"
                      r={radius}
                      className="stroke-[#eaf0ef]"
                      strokeWidth="6"
                      fill="transparent"
                    />
                    <motion.circle
                      cx="34"
                      cy="34"
                      r={radius}
                      className="stroke-[#054b3c]"
                      strokeWidth="6"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset }}
                      transition={{ duration: 1.1, ease: "easeOut", delay: 0.2 }}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[18px] font-bold leading-[24px] text-[#232f43]">
                    {clampedCompletion}%
                  </span>
                </>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-[12px] items-start min-w-0">
              <span className="text-[22px] xl:text-[24px] font-semibold leading-none text-[#054b3c] w-full truncate">
                Completion
              </span>
              <span className="text-[14px] font-normal leading-[1.2] text-[#59657b] w-full truncate">
                Overall Progress
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* ========================================================= */}
      {/* 2. BOTTOM SECTION: SUB-TABS + 2-COLUMN CONTENT (8261:21235) */}
      {/* ========================================================= */}
      <motion.div variants={itemVariants} className="flex flex-col gap-[24px] w-full">
        {/* Sub-tabs Navigation Pills (Figma node 8261:21236: gap-[12px] h-[44px] px-[24px] rounded-[40px]) */}
        <div className="flex flex-wrap items-center gap-[12px] w-full">
          {(
            [
              { id: "history", label: "Payment history" },
              { id: "upcoming", label: "Upcoming payments" },
              { id: "plan", label: "payment plan" },
            ] as { id: SubTab; label: string }[]
          ).map((tab) => {
            const isActive = activeSubTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                type="button"
                whileTap={{ scale: 0.97 }}
                onClick={() => setActiveSubTab(tab.id)}
                className={`h-[44px] px-[24px] rounded-[40px] flex items-center justify-center font-sans font-medium text-[14px] tracking-[1px] uppercase whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[#054b3c] text-white"
                    : "bg-white text-[#054b3c] hover:bg-[#054b3c]/5"
                }`}
              >
                {tab.label}
              </motion.button>
            );
          })}
        </div>

        {/* Main 2-Column Content Area (Figma node 8261:21253: gap-[24px]) */}
        <div className="flex flex-col lg:flex-row gap-[24px] items-start w-full">
          {/* LEFT COLUMN (924px in Figma, flex-1 min-w-0) */}
          <div className="w-full lg:flex-1 min-w-0">
            {/* TAB 1: PAYMENT HISTORY TABLE (Figma node 8261:21255) */}
            {activeSubTab === "history" && (
              <div className="bg-white rounded-[12px] p-[20px] sm:p-[24px] flex flex-col justify-between min-h-[600px] gap-[24px]">
                <div className="flex flex-col gap-[20px] w-full">
                  {/* Card Header (8261:21258) */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
                    <div className="flex flex-col gap-[12px] items-start">
                      <h2 className="capitalize font-serif font-semibold leading-[1.1] text-[#054b3c] text-[24px] sm:text-[28px]">
                        Payment History
                      </h2>
                      <p className="font-sans font-normal leading-none text-[#3b3e40] text-[14px] sm:text-[16px]">
                        A Complete record of your payments for{" "}
                        {currentFlat
                          ? `${currentFlat.title}${currentFlat.flatNo ? ` (Unit ${currentFlat.flatNo})` : ""}`
                          : "the Premium Green Valley"}
                        .
                      </p>
                    </div>

                    {/* Filter Dropdown Button (Figma node 8261:21268) */}
                    <div className="relative self-start sm:self-auto shrink-0">
                      <button
                        type="button"
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="bg-gradient-to-b from-white to-[#f8f9fc] border border-[#eaecf0] flex gap-[6px] h-[40px] items-center justify-center px-[14px] py-[8px] rounded-[78px] cursor-pointer hover:border-[#d0d5dd] transition-colors"
                      >
                        <Calendar className="size-[18px] text-[#546360]" />
                        <span className="font-sans font-normal text-[#546360] text-[14px] whitespace-nowrap">
                          {transactionFilter === "all"
                            ? "All Transactions"
                            : transactionFilter === "paid"
                            ? "Paid Only"
                            : "Due Payments"}
                        </span>
                      </button>

                      {isFilterOpen && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsFilterOpen(false)}
                          />
                          <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-[12px] border border-[#eaecf0] shadow-lg py-1 z-20 text-xs">
                            <button
                              type="button"
                              onClick={() => {
                                setTransactionFilter("all");
                                setCurrentPage(1);
                                setIsFilterOpen(false);
                              }}
                              className="w-full text-left px-3.5 py-2 hover:bg-[#f1f6f5] font-medium text-[#101828] cursor-pointer"
                            >
                              All Transactions
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setTransactionFilter("paid");
                                setCurrentPage(1);
                                setIsFilterOpen(false);
                              }}
                              className="w-full text-left px-3.5 py-2 hover:bg-[#f1f6f5] font-medium text-[#101828] cursor-pointer"
                            >
                              Paid Cleared
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Transactions Table (Figma node 8261:21277) */}
                  <div className="overflow-x-auto -mx-[20px] sm:mx-0 px-[20px] sm:px-0">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead>
                        <tr className="bg-[#fafafa] border-y border-[#eaecf0] text-[12px] font-medium text-[#6d737e]">
                          <th className="py-[9px] px-[21px] font-medium leading-[18px]">Date</th>
                          <th className="py-[9px] px-[20px] font-medium leading-[18px]">Transaction ID</th>
                          <th className="py-[9px] px-[21px] font-medium leading-[18px]">Purpose</th>
                          <th className="py-[9px] pl-[32px] pr-[21px] font-medium leading-[18px]">Amount</th>
                          <th className="py-[9px] px-[21px] font-medium leading-[18px]">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#eaecf0] text-[14px] text-[#101828]">
                        {isLoading ? (
                          [1, 2, 3, 4, 5].map((n) => (
                            <tr key={`payment-skeleton-${n}`} className="h-[56px]">
                              <td className="py-[18px] px-[21px]">
                                <div className="h-4 w-20 bg-stone-200 rounded animate-pulse" />
                              </td>
                              <td className="py-[12px] px-[20px]">
                                <div className="h-4 w-28 bg-stone-100 rounded animate-pulse" />
                              </td>
                              <td className="py-[18px] px-[21px]">
                                <div className="h-4 w-32 bg-stone-200 rounded animate-pulse" />
                              </td>
                              <td className="py-[18px] pl-[32px] pr-[21px]">
                                <div className="h-4 w-20 bg-stone-200 rounded animate-pulse" />
                              </td>
                              <td className="py-[17px] px-[21px]">
                                <div className="h-5 w-14 bg-stone-100 rounded-full animate-pulse" />
                              </td>
                            </tr>
                          ))
                        ) : paginatedPayments.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-16 text-center text-[#59657b]">
                              <CreditCard className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                              <p className="text-sm font-medium text-[#232f43]">
                                No payment transactions recorded yet.
                              </p>
                              <p className="text-xs text-[#59657b] mt-0.5">
                                Your installment records will appear here.
                              </p>
                            </td>
                          </tr>
                        ) : (
                          paginatedPayments.map((item, idx) => (
                            <tr
                              key={item.id || idx}
                              className="hover:bg-[#fafafa]/80 transition-colors h-[56px]"
                            >
                              <td className="py-[18px] px-[21px] text-[#101828] font-normal whitespace-nowrap leading-[20px]">
                                {item.payment_date || item.due_date || "15 Aug 2026"}
                              </td>
                              <td className="py-[12px] pl-[24px] pr-[21px] text-[#101828] font-normal whitespace-nowrap leading-[20px]">
                                {item.invoice_no || `PH-20260815-00${idx + 1}`}
                              </td>
                              <td className="py-[18px] px-[21px] text-[#121827] whitespace-nowrap leading-[20px]">
                                <div className="flex items-center gap-2">
                                  <span>{item.installment_title || "Installment Payment"}</span>
                                  {item.stage === "land_share" && (
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60">
                                      Land Share
                                    </span>
                                  )}
                                  {item.stage === "development" && (
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                                      Development
                                    </span>
                                  )}
                                  {item.stage === "emi" && (
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-[#054b3c] border border-emerald-200/60">
                                      EMI
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-[18px] pl-[32px] pr-[21px] text-[#121827] font-normal whitespace-nowrap leading-[20px]">
                                {item.amount}
                              </td>
                              <td className="py-[17px] px-[21px] whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center justify-center px-[16px] py-[2px] rounded-full text-[12px] font-medium leading-[18px] ${
                                    item.status === "paid"
                                      ? "bg-gradient-to-b from-[#f7fef9] to-[#e3fceb] text-[#039855] border border-[#f0fcf3]"
                                      : item.status === "due"
                                      ? "bg-[#ffe8e8] text-[#ec0000]"
                                      : "bg-[#fef5d9] text-[#bf9204]"
                                  }`}
                                >
                                  {item.status === "paid" ? "Paid" : item.status === "due" ? "Due" : "Upcoming"}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Table Pagination (Figma node 8261:21405: h-[36px] justify-between) */}
                {historyPayments.length > 0 && (
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                    {/* Previous Button (8261:21407) */}
                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={safePage <= 1}
                      className="bg-gradient-to-b from-white to-[#f8f9fc] border border-[#eaecf0] flex gap-[6px] h-[36px] items-center justify-center px-[12px] py-[8px] rounded-[78px] text-[14px] font-medium text-[#6d737e] hover:bg-stone-50 cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed transition-colors"
                    >
                      <ArrowLeft className="size-[16px]" />
                      <span>Previous</span>
                    </button>

                    {/* Actual Page Numbers (8261:21408) */}
                    <div className="flex items-center gap-[2px] h-[36px]">
                      {pageNumbers.map((page, i) =>
                        page === "..." ? (
                          <span
                            key={`ellipsis-${i}`}
                            className="size-[36px] flex items-center justify-center text-[14px] font-medium text-[#546360]"
                          >
                            ...
                          </span>
                        ) : (
                          <button
                            key={page}
                            type="button"
                            onClick={() => setCurrentPage(Number(page))}
                            className={`size-[36px] rounded-full flex items-center justify-center text-[14px] transition-colors cursor-pointer ${
                              safePage === page
                                ? "bg-[#f1f2f6] font-bold text-[#121827]"
                                : "font-medium text-[#546360] hover:bg-[#f1f2f6]/60"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}
                    </div>

                    {/* Next Button (8261:21425) */}
                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={safePage >= totalPages}
                      className="border border-[#546360] flex gap-[6px] h-[36px] items-center justify-center px-[12px] py-[8px] rounded-[78px] text-[14px] font-medium text-[#1f1f1e] hover:bg-stone-50 cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed transition-colors"
                    >
                      <span>Next</span>
                      <ArrowRight className="size-[16px]" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: UPCOMING PAYMENTS SCHEDULE */}
            {activeSubTab === "upcoming" && (
              <div className="bg-white rounded-[12px] p-[24px] space-y-5">
                <div className="flex flex-col gap-[8px]">
                  <h2 className="font-serif text-[24px] sm:text-[28px] font-semibold text-[#054b3c] leading-[1.1]">
                    Upcoming Payment Schedule
                  </h2>
                  <p className="text-[14px] sm:text-[16px] text-[#3b3e40]">
                    Milestone installments mapped directly to structural construction progress.
                  </p>
                </div>

                {historyPayments.filter((p) => p.status === "due" || p.status === "upcoming").length === 0 ? (
                  <div className="py-12 text-center text-[#59657b]">
                    <CalendarClock className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                    <p className="text-sm font-medium text-[#232f43]">No scheduled upcoming dues.</p>
                    <p className="text-xs text-[#59657b] mt-0.5">All current installments for your property are cleared.</p>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {historyPayments.filter((p) => p.status === "due" || p.status === "upcoming").map((item) => (
                      <div
                        key={item.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-[12px] border border-[#eaecf0] hover:border-[#054b3c]/30 bg-[#fafafa]/60 hover:bg-white transition-all gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-[#101828]">
                              {item.installment_title}
                            </span>
                            <span className={`text-[11px] font-medium px-3 py-0.5 rounded-full ${
                              item.status === "due"
                                ? "bg-[#ffe8e8] text-[#ec0000]"
                                : "bg-[#fef5d9] text-[#bf9204]"
                            }`}>
                              {item.status === "due" ? "Immediate Due" : "Upcoming Milestone"}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-[#59657b]">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-[#546360]" />
                              Due: {item.due_date}
                            </span>
                            <span>•</span>
                            <span className="font-semibold text-[#101828]">
                              Amount: {item.amount}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-auto">
                          <button
                            type="button"
                            disabled
                            className="px-5 py-2 rounded-full text-xs font-medium bg-[#054b3c] text-white opacity-50 cursor-not-allowed"
                          >
                            Pay Now
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: PAYMENT PLAN & MILESTONES */}
            {activeSubTab === "plan" && (
              <div className="bg-white rounded-[12px] p-[24px] space-y-6">
                <div className="flex flex-col gap-[8px]">
                  <h2 className="font-serif text-[24px] sm:text-[28px] font-semibold text-[#054b3c] leading-[1.1]">
                    Comprehensive Payment Plan
                  </h2>
                  <p className="text-[14px] sm:text-[16px] text-[#3b3e40]">
                    Complete breakdown of total valuation, installments cleared, and remaining stages.
                  </p>
                </div>

                <div className="p-4 rounded-[12px] bg-[#054b3c]/5 border border-[#054b3c]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-semibold text-[#054b3c] uppercase tracking-wider block">
                      Overall Payment Progress
                    </span>
                    <p className="text-xl font-bold text-[#101828] mt-0.5">
                      {totalPaid} Cleared of {totalExpense}
                    </p>
                  </div>
                  <div className="w-full sm:w-48 bg-[#eaf0ef] h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#054b3c] h-full rounded-full transition-all duration-500"
                      style={{ width: `${clampedCompletion}%` }}
                    />
                  </div>
                </div>

                {historyPayments.length === 0 ? (
                  <div className="py-8 text-center text-[#59657b]">
                    <p className="text-sm font-medium text-[#232f43]">No payment milestones recorded yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {historyPayments.map((item, i) => (
                      <div
                        key={item.id || i}
                        className="flex items-center justify-between p-3.5 rounded-[12px] border border-[#eaecf0] hover:bg-[#fafafa] text-xs sm:text-sm"
                      >
                        <div className="flex items-center gap-3">
                          {item.status === "paid" ? (
                            <CheckCircle2 className="w-5 h-5 text-[#039855] shrink-0" />
                          ) : (
                            <Clock className="w-5 h-5 text-[#ec0000] shrink-0" />
                          )}
                          <div>
                            <p className="font-semibold text-[#101828]">{item.installment_title}</p>
                            <p className="text-[11px] text-[#59657b] capitalize">
                              Status: {item.status} • {item.project}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-[#101828]">{item.amount}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: NEXT PAYMENT & AUTO PAYMENT CARDS (Figma node 8261:21426: w-[308px] gap-[16px]) */}
          <div className="w-full lg:w-[308px] shrink-0 flex flex-col gap-[16px]">
            {/* Card 1: Next Payment (Figma node 8261:21427: bg-white px-[16px] py-[24px] rounded-[12px]) */}
            <div className="bg-white rounded-[12px] px-[16px] py-[24px] flex flex-col gap-[24px] w-full">
              <h3 className="capitalize font-serif font-semibold leading-[1.1] text-[#054b3c] text-[28px]">
                Next Payment
              </h3>

              {(() => {
                const rawLandDue = currentFlat?.land_share_due !== undefined ? parseAmount(currentFlat.land_share_due) : 0;
                const dueLandPayment = historyPayments.find((p) => p.stage === "land_share" && p.status === "due");
                const isLandDue = rawLandDue > 0 || !!dueLandPayment;

                const rawDevDue = currentFlat?.development_charges_due !== undefined ? parseAmount(currentFlat.development_charges_due) : 0;
                const dueDevPayment = historyPayments.find((p) => p.stage === "development" && p.status === "due");
                const isDevDue = !isLandDue && (rawDevDue > 0 || !!dueDevPayment);

                const perEmi = parseAmount(currentFlat?.per_emi_amount);
                const totalEmi = parseInt(String(currentFlat?.total_emi || 0), 10);
                const paidEmi = currentFlat?.paid_emi !== undefined
                  ? parseInt(String(currentFlat.paid_emi), 10)
                  : historyPayments.filter((p) => p.stage === "emi" && p.status === "paid").length;
                const remainingEmi = Math.max(0, totalEmi - paidEmi);
                const isEmiActive = !isLandDue && !isDevDue && totalEmi > 0 && perEmi > 0;

                const genericDue = historyPayments.find((p) => p.status === "due");

                // Resolve display due date & amount for Figma layout
                let displayDueDate = "15 Oct 2026";
                let displayAmount = "৳ 5,00,000";
                let stageBadge: string | null = null;

                if (isLandDue) {
                  displayAmount = dueLandPayment?.amount || formatTaka(rawLandDue);
                  displayDueDate = dueLandPayment?.due_date || (currentFlat?.handover_date ? `15 ${currentFlat.handover_date}` : "15 May 2025");
                  stageBadge = "Land Share Stage";
                } else if (isDevDue) {
                  displayAmount = dueDevPayment?.amount || formatTaka(rawDevDue);
                  displayDueDate = dueDevPayment?.due_date || (currentFlat?.handover_date ? `15 ${currentFlat.handover_date}` : "15 Aug 2025");
                  stageBadge = "Development Charge";
                } else if (isEmiActive && remainingEmi > 0) {
                  const dueEmiPayment = historyPayments.find((p) => p.stage === "emi" && p.status === "due");
                  displayDueDate = dueEmiPayment?.due_date || "15 Next Month";
                  displayAmount = formatTaka(perEmi);
                  stageBadge = `EMI #${Math.min(totalEmi, paidEmi + 1)} of ${totalEmi}`;
                } else if (genericDue) {
                  displayDueDate = genericDue.due_date || "15 Oct 2026";
                  displayAmount = genericDue.amount;
                } else if (historyPayments.length > 0 && flatDue === 0) {
                  return (
                    <div className="py-4 text-center">
                      <CheckCircle2 className="w-10 h-10 text-[#039855] mx-auto mb-2" />
                      <p className="font-semibold text-[#101828] text-sm">All Dues Cleared</p>
                      <p className="text-xs text-[#59657b] mt-0.5">No immediate installments due for this property.</p>
                    </div>
                  );
                }

                return (
                  <div className="flex flex-col gap-[32px] items-start w-full">
                    <div className="flex gap-[20px] items-start w-full">
                      {/* 64x64 rgba(171,229,219,0.28) circle (Figma node 8261:21432) */}
                      <div className="bg-[rgba(171,229,219,0.28)] flex items-center justify-center p-[16px] rounded-full shrink-0 size-[64px]">
                        <svg className="size-[32px] text-[#054b3c]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="6" width="20" height="12" rx="2" />
                          <circle cx="12" cy="12" r="2" />
                          <path d="M6 12h.01M18 12h.01" />
                        </svg>
                      </div>

                      <div className="flex flex-1 flex-col gap-[16px] items-start min-w-0">
                        {stageBadge && (
                          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#054b3c]/10 text-[#054b3c]">
                            {stageBadge}
                          </span>
                        )}
                        <div className="flex flex-col gap-[8px] items-start w-full">
                          <p className="font-sans font-normal leading-[18px] text-[#59657b] text-[16px]">
                            Due Date
                          </p>
                          <p className="font-sans font-semibold leading-none text-[#054b3c] text-[22px] sm:text-[24px] truncate w-full">
                            {displayDueDate}
                          </p>
                        </div>

                        <div className="flex flex-col gap-[8px] items-start w-full">
                          <p className="font-sans font-normal leading-[1.2] text-[#59657b] text-[14px]">
                            Amount
                          </p>
                          <p className="font-sans font-semibold leading-none text-[#054b3c] text-[22px] sm:text-[24px] truncate w-full">
                            {displayAmount}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Disabled Pay Now Button (Figma node 8261:21442: bg-[#054b3c] h-[40px] rounded-[100px] w-full) */}
                    <button
                      type="button"
                      disabled
                      className="bg-[#054b3c] flex h-[40px] items-center justify-center px-[24px] py-[14px] rounded-[100px] w-full opacity-50 cursor-not-allowed transition-colors"
                    >
                      <span className="font-sans font-normal leading-none text-[16px] text-white whitespace-nowrap">
                        Pay Now
                      </span>
                    </button>
                  </div>
                );
              })()}
            </div>

            {/* Card 2: Auto Payment (Figma node 8261:21448: bg-white px-[16px] py-[24px] rounded-[12px]) */}
            <div className="bg-white rounded-[12px] px-[16px] py-[24px] flex items-start gap-[20px] w-full">
              {/* 56x56 #f1f2f6 circle (Figma node 8261:21452) */}
              <div className="bg-[#f1f2f6] flex items-center justify-center p-[16px] rounded-full shrink-0 size-[56px]">
                <CalendarCheck className="size-[24px] text-[#054b3c]" />
              </div>

              <div className="flex flex-1 flex-col gap-[16px] items-start min-w-0">
                <div className="flex flex-col gap-[8px] items-start w-full">
                  <h4 className="capitalize font-serif font-semibold leading-[1.1] text-[#054b3c] text-[24px]">
                    Auto Payment
                  </h4>
                  <p className="font-sans font-normal leading-[18px] text-[#546360] text-[14px]">
                    Set up automatic payments to never miss a due date.
                  </p>
                </div>

                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#054b3c]/10 text-[#054b3c] font-sans font-semibold leading-none text-[13px]">
                  Coming Soon
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
