"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Download,
  Calendar,
  CalendarCheck,
  CalendarClock,
  ChevronDown,
  ArrowRight,
  CreditCard,
  Layers,
  Landmark,
  CheckCircle2,
  Clock,
  Printer,
  X,
  ShieldCheck,
  Check,
  SlidersHorizontal,
} from "lucide-react";
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

type SubTab = "history" | "upcoming" | "plan" | "receipts";

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

  // Modals state
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isAutoPayModalOpen, setIsAutoPayModalOpen] = useState(false);
  const [activeReceiptModal, setActiveReceiptModal] = useState<ClientPayment | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [autoPaySaved, setAutoPaySaved] = useState(false);
  const [selectedPayMethod, setSelectedPayMethod] = useState("bank");

  // Determine active project flat info strictly from user's flats
  const availableFlats = myFlats || [];
  const currentFlat = availableFlats[selectedFlatIndex] || availableFlats[0] || null;

  // Payments for the selected flat (filter strictly by unique flat_id, flat_no, or invoice suffix)
  const flatPayments = React.useMemo(() => {
    if (!payments || payments.length === 0) return [];
    if (!currentFlat) return payments;

    const matched = payments.filter((p) => {
      // 1. Strict match by unique flat_id
      if (p.flat_id && currentFlat.id && String(p.flat_id) === String(currentFlat.id)) {
        return true;
      }
      // 2. Strict match by flat_no (when both specify flat_no)
      if (
        p.flat_no &&
        currentFlat.flatNo &&
        String(p.flat_no).trim().toLowerCase() === String(currentFlat.flatNo).trim().toLowerCase()
      ) {
        return true;
      }
      // 3. Match by invoice number suffix (e.g. -58-1 for index 0, -58-2 for index 1)
      if (p.invoice_no && p.invoice_no.endsWith(`-${selectedFlatIndex + 1}`)) {
        return true;
      }
      // 4. Match unit text in project string
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

  // Circular SVG progress
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (circumference * Math.min(100, Math.max(0, completionPct))) / 100;

  // Payments to show in history table (strictly real flat payments filtered by transactionFilter)
  const historyPayments =
    flatPayments && flatPayments.length > 0
      ? flatPayments.filter((p) => (transactionFilter === "all" ? true : p.status === transactionFilter))
      : [];

  const handleDownloadReceipt = (payment: ClientPayment) => {
    setActiveReceiptModal(payment);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handlePayNowSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentSuccess(true);
    setTimeout(() => {
      setPaymentSuccess(false);
      setIsPayModalOpen(false);
    }, 2000);
  };

  const handleAutoPaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAutoPaySaved(true);
    setTimeout(() => {
      setAutoPaySaved(false);
      setIsAutoPayModalOpen(false);
    }, 1800);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* ========================================================= */}
      {/* 1. TOP HEADER WITH TITLE & PROPERTY SELECTOR              */}
      {/* ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-[32px] font-bold text-[#044133] tracking-tight">
            Payment
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Manage your payments, view history and upcoming dues.
          </p>
        </div>

        {/* Property Selector Card */}
        <div className="relative self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-white rounded-2xl p-2 sm:p-2.5 pr-4 border border-stone-200/80 shadow-xs hover:border-stone-300 transition-all flex items-center gap-3 cursor-pointer text-left group"
          >
            {currentFlat ? (
              <>
                <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200/60">
                  <Image
                    src={currentFlat.image || "/image/progress/tph_green_valley.png"}
                    alt={currentFlat.title}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-bold text-stone-900 block leading-tight group-hover:text-[#044133] transition-colors">
                    {currentFlat.title}
                    {currentFlat.flatNo ? ` — Unit ${currentFlat.flatNo}` : ""}
                  </span>
                  <span className="text-[11px] text-stone-400 block mt-0.5">
                    {currentFlat.location}
                    {currentFlat.flatSize ? ` • ${currentFlat.flatSize}` : ""}
                  </span>
                </div>
              </>
            ) : (
              <span className="text-xs sm:text-sm font-bold text-stone-700">
                All Registered Properties
              </span>
            )}
            <ChevronDown
              className={`w-4 h-4 text-[#044133] ml-1 transition-transform duration-200 shrink-0 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Property Dropdown Menu */}
          {isDropdownOpen && availableFlats.length > 0 && (
            <>
              <div
                className="fixed inset-0 z-20"
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl border border-stone-200 shadow-xl z-30 overflow-hidden py-1.5 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3.5 py-2 border-b border-stone-100 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                  Select Property
                </div>
                {availableFlats.map((flat, idx) => (
                  <button
                    key={flat.id || idx}
                    type="button"
                    onClick={() => {
                      setSelectedFlatIndex(idx);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-left hover:bg-stone-50 transition-colors cursor-pointer ${
                      selectedFlatIndex === idx ? "bg-[#044133]/5 text-[#044133]" : "text-stone-700"
                    }`}
                  >
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-stone-100">
                      <Image
                        src={flat.image || "/image/progress/tph_green_valley.png"}
                        alt={flat.title}
                        fill
                        sizes="32px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold truncate">
                        {flat.title}
                        {flat.flatNo ? ` — Unit ${flat.flatNo}` : ""}
                      </p>
                      <p className="text-[10px] text-stone-400 truncate">
                        {flat.location}
                        {flat.flatSize ? ` • ${flat.flatSize}` : ""}
                      </p>
                    </div>
                    {selectedFlatIndex === idx && (
                      <Check className="w-4 h-4 text-[#044133] shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. FOUR METRIC SUMMARY CARDS                               */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Total Paid */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/70 shadow-xs flex items-center gap-4 hover:shadow-sm transition-shadow">
          <div className="w-12 h-12 rounded-full bg-[#054B3C] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Landmark className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <span className="text-xs text-[#054B3C]/80 font-semibold block">
              Total Paid
            </span>
            {isLoading ? (
              <div className="h-6 w-24 bg-stone-200 rounded animate-pulse mt-1" />
            ) : (
              <span className="text-lg sm:text-xl font-bold text-[#054B3C] block mt-0.5">
                {totalPaid}
              </span>
            )}
            <span className="text-[11px] text-stone-400 block mt-0.5">
              Paid to date
            </span>
          </div>
        </div>

        {/* Card 2: Outstanding */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/70 shadow-xs flex items-center gap-4 hover:shadow-sm transition-shadow">
          <div className="w-12 h-12 rounded-full bg-[#b91c1c] text-white flex items-center justify-center shrink-0 shadow-xs">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <span className="text-xs text-[#054B3C]/80 font-semibold block">
              Outstanding
            </span>
            {isLoading ? (
              <div className="h-6 w-24 bg-stone-200 rounded animate-pulse mt-1" />
            ) : (
              <span className="text-lg sm:text-xl font-bold text-[#054B3C] block mt-0.5">
                {outstanding}
              </span>
            )}
            <span className="text-[11px] text-stone-400 block mt-0.5">
              Remaining Due
            </span>
          </div>
        </div>

        {/* Card 3: Total Expense */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/70 shadow-xs flex items-center gap-4 hover:shadow-sm transition-shadow">
          <div className="w-12 h-12 rounded-full bg-[#d97706] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <span className="text-xs text-[#054B3C]/80 font-semibold block">
              Total Expense
            </span>
            {isLoading ? (
              <div className="h-6 w-24 bg-stone-200 rounded animate-pulse mt-1" />
            ) : (
              <span className="text-lg sm:text-xl font-bold text-[#054B3C] block mt-0.5">
                {totalExpense}
              </span>
            )}
            <span className="text-[11px] text-stone-400 block mt-0.5">
              {currentFlat ? "Flat Total Price" : "All Project Expense"}
            </span>
          </div>
        </div>

        {/* Card 4: Completion */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/70 shadow-xs flex items-center gap-4 hover:shadow-sm transition-shadow">
          <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
            {isLoading ? (
              <div className="w-12 h-12 rounded-full bg-stone-200 animate-pulse" />
            ) : (
              <>
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 52 52">
                  <circle
                    cx="26"
                    cy="26"
                    r={radius}
                    className="stroke-stone-100"
                    strokeWidth="4.5"
                    fill="transparent"
                  />
                  <circle
                    cx="26"
                    cy="26"
                    r={radius}
                    className="stroke-[#054B3C]"
                    strokeWidth="4.5"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-[#054B3C]">
                  {completionPct}%
                </span>
              </>
            )}
          </div>
          <div className="flex-1">
            <span className="text-lg sm:text-xl font-bold text-[#054B3C] block leading-tight">
              Payment Completion
            </span>
            <span className="text-[11px] text-stone-400 block mt-0.5">
              Total Price Cleared
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. SUB-TABS NAVIGATION PILLS                              */}
      {/* ========================================================= */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
        <button
          type="button"
          onClick={() => setActiveSubTab("history")}
          className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
            activeSubTab === "history"
              ? "bg-[#044133] text-white shadow-xs"
              : "bg-white text-stone-700 hover:text-stone-900 hover:bg-stone-50 border border-stone-200/80 shadow-xs"
          }`}
        >
          PAYMENT HISTORY
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("upcoming")}
          className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
            activeSubTab === "upcoming"
              ? "bg-[#044133] text-white shadow-xs"
              : "bg-white text-stone-700 hover:text-stone-900 hover:bg-stone-50 border border-stone-200/80 shadow-xs"
          }`}
        >
          UPCOMING PAYMENTS
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("plan")}
          className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
            activeSubTab === "plan"
              ? "bg-[#044133] text-white shadow-xs"
              : "bg-white text-stone-700 hover:text-stone-900 hover:bg-stone-50 border border-stone-200/80 shadow-xs"
          }`}
        >
          PAYMENT PLAN
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("receipts")}
          className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all cursor-pointer ${
            activeSubTab === "receipts"
              ? "bg-[#044133] text-white shadow-xs"
              : "bg-white text-stone-700 hover:text-stone-900 hover:bg-stone-50 border border-stone-200/80 shadow-xs"
          }`}
        >
          DOWNLOAD RECEIPTS
        </button>
      </div>

      {/* ========================================================= */}
      {/* 4. MAIN CONTENT AREA (TWO COLUMNS)                        */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ======================================================= */}
        {/* LEFT COLUMN: HISTORY / UPCOMING / PLAN / RECEIPTS       */}
        {/* ======================================================= */}
        <div className="lg:col-span-8">
          {/* TAB 1: PAYMENT HISTORY TABLE */}
          {activeSubTab === "history" && (
            <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs p-5 sm:p-6 space-y-5">
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#044133] tracking-tight">
                    Payment History
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                    A Complete record of your payments for {currentFlat ? `${currentFlat.title}${currentFlat.flatNo ? ` (Unit ${currentFlat.flatNo})` : ""}` : "your property"}.
                  </p>
                </div>

                {/* Filter Dropdown */}
                <div className="relative self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer shadow-xs transition-colors"
                  >
                    <Calendar className="w-3.5 h-3.5 text-stone-500" />
                    <span>
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
                      <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl border border-stone-200 shadow-lg py-1 z-20 text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            setTransactionFilter("all");
                            setIsFilterOpen(false);
                          }}
                          className="w-full text-left px-3.5 py-2 hover:bg-stone-50 font-medium text-stone-700"
                        >
                          All Transactions
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setTransactionFilter("paid");
                            setIsFilterOpen(false);
                          }}
                          className="w-full text-left px-3.5 py-2 hover:bg-stone-50 font-medium text-stone-700"
                        >
                          Paid Cleared
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Transactions Table */}
              <div className="overflow-x-auto -mx-5 sm:mx-0 px-5 sm:px-0">
                <table className="w-full text-left border-collapse min-w-[620px]">
                  <thead>
                    <tr className="border-b border-stone-100 text-[11.5px] font-normal text-stone-400 tracking-wide">
                      <th className="py-3 px-3 text-left font-normal">Date</th>
                      <th className="py-3 px-3 text-left font-normal">Transaction ID</th>
                      <th className="py-3 px-3 text-left font-normal">Purpose</th>
                      <th className="py-3 px-3 text-left font-normal">Amount</th>
                      <th className="py-3 px-3 text-center font-normal">Status</th>
                      <th className="py-3 px-3 text-right font-normal">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100/80 text-[13px] text-stone-700">
                    {isLoading ? (
                      [1, 2, 3, 4].map((n) => (
                        <tr key={`payment-skeleton-${n}`}>
                          <td className="py-3.5 px-3">
                            <div className="h-4 w-20 bg-stone-200 rounded animate-pulse" />
                          </td>
                          <td className="py-3.5 px-3">
                            <div className="h-4 w-28 bg-stone-100 rounded animate-pulse" />
                          </td>
                          <td className="py-3.5 px-3">
                            <div className="h-4 w-32 bg-stone-200 rounded animate-pulse" />
                          </td>
                          <td className="py-3.5 px-3">
                            <div className="h-4 w-20 bg-stone-200 rounded animate-pulse" />
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <div className="h-5 w-14 bg-stone-100 rounded-full animate-pulse mx-auto" />
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <div className="h-4 w-4 bg-stone-200 rounded animate-pulse ml-auto" />
                          </td>
                        </tr>
                      ))
                    ) : historyPayments.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-stone-400">
                          <CreditCard className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                          <p className="text-sm font-medium text-stone-600">
                            No payment transactions recorded yet.
                          </p>
                          <p className="text-xs text-stone-400 mt-0.5">
                            Your installment receipts and payment records will appear here.
                          </p>
                        </td>
                      </tr>
                    ) : (
                      historyPayments.map((item, idx) => (
                        <tr
                          key={item.id || idx}
                          className="hover:bg-stone-50/70 transition-colors"
                        >
                          <td className="py-3.5 px-3 text-stone-800 font-medium whitespace-nowrap">
                            {item.payment_date || item.due_date || "—"}
                          </td>
                          <td className="py-3.5 px-3 font-mono text-stone-600 text-xs whitespace-nowrap">
                            {item.invoice_no || `TPHL-${idx + 1}`}
                          </td>
                          <td className="py-3.5 px-3 text-stone-700 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span>{item.installment_title || "Payment"}</span>
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
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-[#054B3C] border border-emerald-200/60">
                                  EMI
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-3 font-semibold text-stone-900 whitespace-nowrap">
                            {item.amount}
                          </td>
                          <td className="py-3.5 px-3 text-center whitespace-nowrap">
                            <span
                              className={`inline-flex items-center justify-center px-3 py-0.5 rounded-full text-[11px] font-semibold ${
                                item.status === "paid"
                                  ? "bg-emerald-50 text-emerald-600 border border-emerald-100/80"
                                  : item.status === "due"
                                  ? "bg-red-50 text-red-600 border border-red-100/80"
                                  : "bg-stone-100 text-stone-600 border border-stone-200/80"
                              }`}
                            >
                              {item.status === "paid" ? "Paid" : item.status === "due" ? "Due" : "Upcoming"}
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-right whitespace-nowrap">
                            {item.status === "paid" ? (
                              <button
                                type="button"
                                onClick={() => handleDownloadReceipt(item)}
                                title="Download Receipt"
                                className="p-1 text-stone-500 hover:text-[#044133] hover:scale-110 active:scale-95 transition-all cursor-pointer inline-flex items-center justify-center"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            ) : (
                              <span className="text-stone-300 text-xs">—</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Pagination */}
              <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                {/* Previous Button */}
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-stone-200 font-medium text-stone-600 hover:bg-stone-50 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <span>&larr;</span>
                  <span>Previous</span>
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setCurrentPage(1)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors cursor-pointer ${
                      currentPage === 1
                        ? "bg-stone-100 text-stone-900"
                        : "text-stone-600 hover:bg-stone-100"
                    }`}
                  >
                    1
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(2)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors cursor-pointer ${
                      currentPage === 2
                        ? "bg-stone-100 text-stone-900 font-bold"
                        : "text-stone-600 hover:bg-stone-100"
                    }`}
                  >
                    2
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(3)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors cursor-pointer ${
                      currentPage === 3
                        ? "bg-stone-100 text-stone-900 font-bold"
                        : "text-stone-600 hover:bg-stone-100"
                    }`}
                  >
                    3
                  </button>
                  <span className="w-5 text-center text-stone-400">..</span>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(8)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                  >
                    8
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(9)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                  >
                    9
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(10)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                  >
                    10
                  </button>
                </div>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(10, p + 1))}
                  disabled={currentPage === 10}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-stone-200 font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <span>Next</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: UPCOMING PAYMENTS SCHEDULE */}
          {activeSubTab === "upcoming" && (
            <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs p-5 sm:p-6 space-y-5">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#044133] tracking-tight">
                  Upcoming Payment Schedule
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                  Milestone installments mapped directly to structural construction progress.
                </p>
              </div>

              {historyPayments.filter((p) => p.status === "due" || p.status === "upcoming").length === 0 ? (
                <div className="py-12 text-center text-stone-400">
                  <CalendarClock className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                  <p className="text-sm font-medium text-stone-600">No scheduled upcoming dues.</p>
                  <p className="text-xs text-stone-400 mt-0.5">All current installments for your property are cleared.</p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {historyPayments.filter((p) => p.status === "due" || p.status === "upcoming").map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-stone-200/70 hover:border-stone-300 bg-stone-50/40 hover:bg-white transition-all gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-stone-900">
                            {item.installment_title}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            item.status === "due"
                              ? "bg-red-50 text-red-600 border border-red-200"
                              : "bg-blue-50 text-blue-600 border border-blue-200"
                          }`}>
                            {item.status === "due" ? "Immediate Due" : "Upcoming Milestone"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-stone-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-stone-400" />
                            Due: {item.due_date}
                          </span>
                          <span>•</span>
                          <span className="font-bold text-stone-900">
                            Amount: {item.amount}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        <button
                          type="button"
                          onClick={() => setIsPayModalOpen(true)}
                          className="px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer bg-[#044133] text-white hover:bg-[#065442] shadow-xs"
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
            <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs p-5 sm:p-6 space-y-6">
              <div>
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#044133] tracking-tight">
                  Comprehensive Payment Plan
                </h2>
                <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                  Complete breakdown of total valuation, installments cleared, and remaining stages.
                </p>
              </div>

              {/* Progress Summary */}
              <div className="p-4 rounded-xl bg-[#044133]/5 border border-[#044133]/15 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-semibold text-[#044133] uppercase tracking-wider block">
                    Overall Payment Progress
                  </span>
                  <p className="text-xl font-bold text-stone-900 mt-0.5">
                    {totalPaid} Cleared of {totalExpense}
                  </p>
                </div>
                <div className="w-full sm:w-48 bg-stone-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#044133] h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, completionPct))}%` }}
                  />
                </div>
              </div>

              {/* Milestones List */}
              {historyPayments.length === 0 ? (
                <div className="py-8 text-center text-stone-400">
                  <p className="text-sm font-medium text-stone-600">No payment milestones recorded yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {historyPayments.map((item, i) => (
                    <div
                      key={item.id || i}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-stone-100 hover:bg-stone-50/50 text-xs sm:text-sm"
                    >
                      <div className="flex items-center gap-3">
                        {item.status === "paid" ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        ) : (
                          <Clock className="w-5 h-5 text-red-500 shrink-0" />
                        )}
                        <div>
                          <p className="font-semibold text-stone-900">{item.installment_title}</p>
                          <p className="text-[11px] text-stone-400 capitalize">
                            Status: {item.status} • {item.project}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-stone-900">{item.amount}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DOWNLOAD RECEIPTS */}
          {activeSubTab === "receipts" && (
            <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs p-5 sm:p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#044133] tracking-tight">
                    Official Receipts & Invoices
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                    Download authentic, verified payment statements stamped by The Premium Homes Ltd.
                  </p>
                </div>
                {historyPayments.filter((p) => p.status === "paid").length > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      handleDownloadReceipt(
                        historyPayments.filter((p) => p.status === "paid")[0]
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#044133] text-white text-xs font-semibold hover:bg-[#065442] cursor-pointer shadow-xs transition-colors self-start sm:self-auto"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Full Statement</span>
                  </button>
                )}
              </div>

              {historyPayments.filter((p) => p.status === "paid").length === 0 ? (
                <div className="py-12 text-center text-stone-400">
                  <CreditCard className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                  <p className="text-sm font-medium text-stone-600">No payment receipts available yet.</p>
                  <p className="text-xs text-stone-400 mt-0.5">Receipts will be generated upon transaction clearance.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {historyPayments
                    .filter((p) => p.status === "paid")
                    .map((pay, idx) => (
                      <div
                        key={pay.id || idx}
                        className="flex items-center justify-between p-4 rounded-xl border border-stone-200/70 hover:border-stone-300 bg-stone-50/30 hover:bg-stone-50 transition-colors"
                      >
                        <div>
                          <span className="font-mono text-xs text-stone-500 block">
                            {pay.invoice_no}
                          </span>
                          <p className="font-semibold text-sm text-stone-900 mt-0.5">
                            {pay.installment_title} — {pay.amount}
                          </p>
                          <span className="text-[11px] text-stone-400 mt-0.5 block">
                            Cleared on {pay.payment_date || pay.due_date} via {pay.method || "Bank Transfer"}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDownloadReceipt(pay)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-100 cursor-pointer transition-colors"
                        >
                          <Download className="w-3.5 h-3.5 text-stone-500" />
                          <span>PDF Receipt</span>
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ======================================================= */}
        {/* RIGHT COLUMN: NEXT PAYMENT & AUTO PAYMENT CARDS         */}
        {/* ======================================================= */}
        <div className="lg:col-span-4 space-y-5">
          {/* Card 1: Next Payment */}
          <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs p-6 space-y-5">
            <h3 className="font-serif text-2xl font-bold text-[#044133] tracking-tight">
              Next Payment
            </h3>

            {(() => {
              // 1. Resolve flat lifecycle metrics
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

              // Priority 1: Land Share is due
              if (isLandDue) {
                const amount = dueLandPayment?.amount || formatTaka(rawLandDue);
                const dueDate = dueLandPayment?.due_date || (currentFlat?.handover_date ? `15 ${currentFlat.handover_date}` : "15 May 2025");
                return (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/80">
                        Land Share Stage
                      </span>
                      <span className="text-xs text-stone-400 font-medium">Stage 1 of 3</span>
                    </div>

                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                        <CalendarClock className="w-5 h-5 text-amber-700" />
                      </div>
                      <div>
                        <span className="text-xs text-stone-400 font-medium block">
                          Due Date
                        </span>
                        <span className="text-base sm:text-lg font-bold text-stone-900 block mt-0.5">
                          {dueDate}
                        </span>
                      </div>
                    </div>

                    <div className="pt-1">
                      <span className="text-xs text-stone-400 font-medium block">
                        Land Share Due Amount
                      </span>
                      <span className="text-2xl sm:text-3xl font-bold text-[#054B3C] block mt-0.5 tracking-tight">
                        {amount}
                      </span>
                      <span className="text-[11px] text-stone-400 block mt-1">
                        Covers booking & land registration money
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsPayModalOpen(true)}
                      className="w-full py-3.5 rounded-full bg-[#044133] hover:bg-[#065442] active:scale-[0.99] text-white text-sm font-semibold tracking-wide shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Pay Now</span>
                    </button>
                  </>
                );
              }

              // Priority 2: Development Charge is due (Land Share is cleared)
              if (isDevDue) {
                const amount = dueDevPayment?.amount || formatTaka(rawDevDue);
                const dueDate = dueDevPayment?.due_date || (currentFlat?.handover_date ? `15 ${currentFlat.handover_date}` : "15 Aug 2025");
                return (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200/80">
                        Development Charge Stage
                      </span>
                      <span className="text-xs text-stone-400 font-medium">Stage 2 of 3</span>
                    </div>

                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 border border-blue-200">
                        <CalendarClock className="w-5 h-5 text-blue-700" />
                      </div>
                      <div>
                        <span className="text-xs text-stone-400 font-medium block">
                          Due Date
                        </span>
                        <span className="text-base sm:text-lg font-bold text-stone-900 block mt-0.5">
                          {dueDate}
                        </span>
                      </div>
                    </div>

                    <div className="pt-1">
                      <span className="text-xs text-stone-400 font-medium block">
                        Development Charge Due
                      </span>
                      <span className="text-2xl sm:text-3xl font-bold text-[#054B3C] block mt-0.5 tracking-tight">
                        {amount}
                      </span>
                      <span className="text-[11px] text-stone-400 block mt-1">
                        Structural & architectural construction charges
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsPayModalOpen(true)}
                      className="w-full py-3.5 rounded-full bg-[#044133] hover:bg-[#065442] active:scale-[0.99] text-white text-sm font-semibold tracking-wide shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Pay Now</span>
                    </button>
                  </>
                );
              }

              // Priority 3: EMI Stage (Land Share & Development Charge are cleared)
              if (isEmiActive && remainingEmi > 0) {
                const nextEmiNumber = Math.min(totalEmi, paidEmi + 1);
                const dueEmiPayment = historyPayments.find((p) => p.stage === "emi" && p.status === "due");
                const dueDate = dueEmiPayment?.due_date || "15 Next Month";
                const emiProgressPct = Math.min(100, Math.round((paidEmi / totalEmi) * 100));

                return (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-[#054B3C] border border-emerald-200/80">
                        Monthly EMI Stage
                      </span>
                      <span className="text-xs text-stone-400 font-medium">Stage 3 of 3</span>
                    </div>

                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-full bg-[#e8f4ef] text-[#044133] flex items-center justify-center shrink-0 border border-[#b8dfce]">
                        <CalendarClock className="w-5 h-5 text-[#044133]" />
                      </div>
                      <div>
                        <span className="text-xs text-stone-400 font-medium block">
                          Installment #{nextEmiNumber} Due Date
                        </span>
                        <span className="text-base sm:text-lg font-bold text-stone-900 block mt-0.5">
                          {dueDate}
                        </span>
                      </div>
                    </div>

                    <div className="pt-1">
                      <span className="text-xs text-stone-400 font-medium block">
                        Per EMI Amount
                      </span>
                      <span className="text-2xl sm:text-3xl font-bold text-[#054B3C] block mt-0.5 tracking-tight">
                        {formatTaka(perEmi)}
                      </span>
                    </div>

                    {/* EMI Breakdown Card: কত দিয়েছে, কত বাকি আছে */}
                    <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/70 space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-stone-700">EMI Progress</span>
                        <span className="font-bold text-[#054B3C]">{paidEmi} of {totalEmi} Completed ({emiProgressPct}%)</span>
                      </div>

                      {/* Mini Progress Bar */}
                      <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#054B3C] h-full rounded-full transition-all duration-500"
                          style={{ width: `${emiProgressPct}%` }}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1 border-t border-stone-200/60 text-xs">
                        <div>
                          <span className="text-[11px] text-stone-400 block">কত কিস্তি দিয়েছে</span>
                          <span className="font-bold text-emerald-700 block mt-0.5">
                            {paidEmi} কিস্তি ({formatTaka(paidEmi * perEmi)})
                          </span>
                        </div>
                        <div>
                          <span className="text-[11px] text-stone-400 block">কত বাকি আছে</span>
                          <span className="font-bold text-red-600 block mt-0.5">
                            {remainingEmi} কিস্তি ({formatTaka(remainingEmi * perEmi)})
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsPayModalOpen(true)}
                      className="w-full py-3.5 rounded-full bg-[#044133] hover:bg-[#065442] active:scale-[0.99] text-white text-sm font-semibold tracking-wide shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Pay EMI Now</span>
                    </button>
                  </>
                );
              }

              // Fallback: Generic Due Item if present
              const genericDue = historyPayments.find((p) => p.status === "due");
              if (genericDue) {
                return (
                  <>
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-full bg-[#e8f4ef] text-[#044133] flex items-center justify-center shrink-0 border border-[#b8dfce]">
                        <CalendarClock className="w-5 h-5 text-[#044133]" />
                      </div>
                      <div>
                        <span className="text-xs text-stone-400 font-medium block">
                          Due Date
                        </span>
                        <span className="text-base sm:text-lg font-bold text-stone-900 block mt-0.5">
                          {genericDue.due_date}
                        </span>
                      </div>
                    </div>

                    <div className="pt-1">
                      <span className="text-xs text-stone-400 font-medium block">
                        {genericDue.installment_title}
                      </span>
                      <span className="text-2xl sm:text-3xl font-bold text-[#054B3C] block mt-0.5 tracking-tight">
                        {genericDue.amount}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsPayModalOpen(true)}
                      className="w-full py-3.5 rounded-full bg-[#044133] hover:bg-[#065442] active:scale-[0.99] text-white text-sm font-semibold tracking-wide shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Pay Now</span>
                    </button>
                  </>
                );
              }

              // All Dues Cleared
              return (
                <div className="py-4 text-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                  <p className="font-semibold text-stone-900 text-sm">All Dues Cleared</p>
                  <p className="text-xs text-stone-400 mt-0.5">No immediate installments due for this property.</p>
                </div>
              );
            })()}
          </div>

          {/* Card 2: Auto Payment */}
          <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs p-6 flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-stone-100 text-stone-600 flex items-center justify-center shrink-0 border border-stone-200/70">
              <CalendarCheck className="w-5 h-5 text-stone-600" />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-serif text-lg font-bold text-[#044133] leading-snug">
                Auto Payment
              </h4>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                Set up automatic payments to never miss a due date.
              </p>
              <button
                type="button"
                onClick={() => setIsAutoPayModalOpen(true)}
                className="text-xs font-bold text-[#044133] hover:underline mt-2.5 inline-flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Set Up Now</span>
                <span>&rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5. MODAL: MAKE PAYMENT DIALOG                             */}
      {/* ========================================================= */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-100 relative space-y-6">
            <button
              type="button"
              onClick={() => {
                setIsPayModalOpen(false);
                setPaymentSuccess(false);
              }}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1 rounded-full hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {paymentSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#044133]">
                  Payment Successful!
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Your payment of $5,00,000 for {currentFlat.title} has been received and verified.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePayNowSubmit} className="space-y-5">
                <div>
                  <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
                    Make Installment Payment
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#044133] mt-1">
                    {currentFlat.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Due Date: 15 Oct 2026 • Milestone: 11th Floor Masonry Works
                  </p>
                </div>

                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80">
                  <span className="text-xs text-stone-500 block">Total Payable</span>
                  <span className="text-3xl font-bold text-[#044133] block mt-0.5">
                    $ 5,00,000
                  </span>
                </div>

                {/* Method selector */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-stone-700 block">
                    Select Payment Gateway / Method:
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setSelectedPayMethod("bank")}
                      className={`p-3 rounded-xl border text-center text-xs font-semibold cursor-pointer transition-all ${
                        selectedPayMethod === "bank"
                          ? "border-[#044133] bg-[#044133]/5 text-[#044133] font-bold"
                          : "border-stone-200 text-stone-600 hover:bg-stone-50"
                      }`}
                    >
                      <Landmark className="w-4 h-4 mx-auto mb-1 text-stone-600" />
                      Bank Wire
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPayMethod("card")}
                      className={`p-3 rounded-xl border text-center text-xs font-semibold cursor-pointer transition-all ${
                        selectedPayMethod === "card"
                          ? "border-[#044133] bg-[#044133]/5 text-[#044133] font-bold"
                          : "border-stone-200 text-stone-600 hover:bg-stone-50"
                      }`}
                    >
                      <CreditCard className="w-4 h-4 mx-auto mb-1 text-stone-600" />
                      Cards
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedPayMethod("mfs")}
                      className={`p-3 rounded-xl border text-center text-xs font-semibold cursor-pointer transition-all ${
                        selectedPayMethod === "mfs"
                          ? "border-[#044133] bg-[#044133]/5 text-[#044133] font-bold"
                          : "border-stone-200 text-stone-600 hover:bg-stone-50"
                      }`}
                    >
                      <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-stone-600" />
                      bKash / Nagad
                    </button>
                  </div>
                </div>

                <div className="text-[11px] text-stone-500 bg-emerald-50/60 p-3 rounded-xl border border-emerald-100 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>
                    Transactions are 256-bit encrypted and routed directly to The Premium Homes official escrow accounts.
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-full bg-[#044133] hover:bg-[#065442] text-white font-semibold text-sm shadow-md transition-all cursor-pointer"
                >
                  Proceed to Payment ($ 5,00,000)
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. MODAL: AUTO PAYMENT CONFIG DIALOG                      */}
      {/* ========================================================= */}
      {isAutoPayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-100 relative space-y-5">
            <button
              type="button"
              onClick={() => {
                setIsAutoPayModalOpen(false);
                setAutoPaySaved(false);
              }}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1 rounded-full hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {autoPaySaved ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-[#044133]">
                  Auto Payment Enabled
                </h3>
                <p className="text-xs text-stone-500">
                  Recurring instructions saved. You will receive an SMS and email notification 3 days prior to each debit.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAutoPaySubmit} className="space-y-4">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#044133]">
                    Auto Payment Setup
                  </h3>
                  <p className="text-xs text-stone-500 mt-1">
                    Automate your property installments with scheduled standing instructions.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">
                      Bank Name / Payment Channel
                    </label>
                    <input
                      type="text"
                      defaultValue="City Bank PLC (Priority Banking)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-900 bg-stone-50/50 focus:outline-none focus:border-[#044133]"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">
                      Account / Card Number
                    </label>
                    <input
                      type="text"
                      defaultValue="**** **** **** 8829"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-900 bg-stone-50/50 focus:outline-none focus:border-[#044133]"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">
                      Debit Trigger Date
                    </label>
                    <select className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-900 bg-stone-50/50 focus:outline-none focus:border-[#044133]">
                      <option>On due date (15th of month)</option>
                      <option>3 days before due date (12th of month)</option>
                      <option>1 day before due date (14th of month)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#044133] hover:bg-[#065442] text-white font-semibold text-xs shadow-xs transition-all cursor-pointer mt-2"
                >
                  Confirm & Enable Auto Debit
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. MODAL: OFFICIAL PAYMENT RECEIPT VIEWER                 */}
      {/* ========================================================= */}
      {activeReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-100 relative space-y-6">
            <button
              type="button"
              onClick={() => setActiveReceiptModal(null)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-700 p-1 rounded-full hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Official Receipt Paper Slip */}
            <div className="border border-stone-200 rounded-2xl p-6 bg-stone-50/30 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200/80 pb-4">
                <div>
                  <h4 className="font-serif text-lg font-bold text-[#044133]">
                    The Premium Homes Ltd.
                  </h4>
                  <span className="text-[11px] text-stone-400 block">
                    Official Money Receipt
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono font-semibold text-stone-600 block">
                    {activeReceiptModal.invoice_no}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 mt-1">
                    VERIFIED & CLEARED
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-stone-400 block text-[11px]">Client Name</span>
                  <span className="font-semibold text-stone-800">
                    {user?.name || user?.full_name || "Afsar Hossain"}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Property</span>
                  <span className="font-semibold text-stone-800 truncate block">
                    {currentFlat.title}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Date of Payment</span>
                  <span className="font-semibold text-stone-800">
                    {activeReceiptModal.payment_date || "15 Aug 2026"}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Payment Mode</span>
                  <span className="font-semibold text-stone-800">
                    Bank Transfer (Escrow)
                  </span>
                </div>
              </div>

              <div className="border-t border-b border-stone-200/80 py-3 flex items-center justify-between">
                <span className="font-medium text-xs text-stone-600">
                  {activeReceiptModal.installment_title}
                </span>
                <span className="font-bold text-base text-stone-900">
                  {activeReceiptModal.amount}
                </span>
              </div>

              <div className="text-[10px] text-stone-400 text-center pt-1">
                Computer-generated receipt authorized by Accounts & Finance, The Premium Homes Ltd.
              </div>
            </div>

            {/* Receipt Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handlePrintReceipt}
                className="px-4 py-2 rounded-full border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  window.alert("Downloading official PDF statement...");
                  setActiveReceiptModal(null);
                }}
                className="px-5 py-2 rounded-full bg-[#044133] hover:bg-[#065442] text-white text-xs font-semibold shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
