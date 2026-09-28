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
import { DEFAULT_PAYMENTS, DEFAULT_FLATS } from "./dashboard_data";

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
}

type SubTab = "history" | "upcoming" | "plan" | "receipts";

// Mock official transactions matching the provided design screenshot
const SCREENSHOT_PAYMENTS: ClientPayment[] = [
  {
    id: "tx-1",
    invoice_no: "PH-20260815-001",
    project: "The Premium Green Valley",
    installment_title: "Installment Payment",
    due_date: "15 Aug 2026",
    payment_date: "15 Aug 2026",
    amount: "$ 5,00,000",
    status: "paid",
    method: "Bank Transfer",
  },
  {
    id: "tx-2",
    invoice_no: "PH-20260815-001",
    project: "The Premium Green Valley",
    installment_title: "Installment Payment",
    due_date: "15 Aug 2026",
    payment_date: "15 Aug 2026",
    amount: "$ 5,00,000",
    status: "paid",
    method: "Bank Transfer",
  },
  {
    id: "tx-3",
    invoice_no: "PH-20260815-001",
    project: "The Premium Green Valley",
    installment_title: "Installment Payment",
    due_date: "15 Aug 2026",
    payment_date: "15 Aug 2026",
    amount: "$ 5,00,000",
    status: "paid",
    method: "Bank Transfer",
  },
  {
    id: "tx-4",
    invoice_no: "PH-20260815-001",
    project: "The Premium Green Valley",
    installment_title: "Installment Payment",
    due_date: "15 Aug 2026",
    payment_date: "15 Aug 2026",
    amount: "$ 5,00,000",
    status: "paid",
    method: "Bank Transfer",
  },
  {
    id: "tx-5",
    invoice_no: "PH-20260815-001",
    project: "The Premium Green Valley",
    installment_title: "Installment Payment",
    due_date: "15 Aug 2026",
    payment_date: "15 Aug 2026",
    amount: "$ 5,00,000",
    status: "paid",
    method: "Bank Transfer",
  },
  {
    id: "tx-6",
    invoice_no: "PH-20260815-001",
    project: "The Premium Green Valley",
    installment_title: "Installment Payment",
    due_date: "15 Aug 2026",
    payment_date: "15 Aug 2026",
    amount: "$ 5,00,000",
    status: "paid",
    method: "Bank Transfer",
  },
  {
    id: "tx-7",
    invoice_no: "PH-20260815-001",
    project: "The Premium Green Valley",
    installment_title: "Installment Payment",
    due_date: "15 Aug 2026",
    payment_date: "15 Aug 2026",
    amount: "$ 5,00,000",
    status: "paid",
    method: "Bank Transfer",
  },
];

// Upcoming payments schedule
const UPCOMING_SCHEDULE = [
  {
    id: "up-1",
    title: "11th Floor Masonry & Partition Works",
    due_date: "15 Oct 2026",
    amount: "$ 5,00,000",
    status: "due",
    tag: "Immediate Due",
  },
  {
    id: "up-2",
    title: "Sanitary & Electrical Conduit Rough-in",
    due_date: "15 Dec 2026",
    amount: "$ 5,00,000",
    status: "upcoming",
    tag: "Scheduled Milestone",
  },
  {
    id: "up-3",
    title: "Floor Tiles & Interior Plastering",
    due_date: "15 Feb 2027",
    amount: "$ 5,00,000",
    status: "upcoming",
    tag: "Scheduled Milestone",
  },
  {
    id: "up-4",
    title: "Exterior Painting & Window Glazing",
    due_date: "15 Apr 2027",
    amount: "$ 5,00,000",
    status: "upcoming",
    tag: "Scheduled Milestone",
  },
  {
    id: "up-5",
    title: "Key Handover & Deed Registration",
    due_date: "15 Jun 2027",
    amount: "$ 5,00,000",
    status: "upcoming",
    tag: "Final Handover",
  },
];

// Payment plan milestones
const PAYMENT_PLAN_MILESTONES = [
  { name: "Booking Money", amount: "৳ 5,00,000", status: "cleared", pct: 100 },
  { name: "Down Payment / Land Share", amount: "৳ 15,00,000", status: "cleared", pct: 100 },
  { name: "Basement & Piling Work", amount: "৳ 7,50,000", status: "cleared", pct: 100 },
  { name: "1st - 5th Floor Slab Castings", amount: "৳ 7,50,000", status: "cleared", pct: 100 },
  { name: "6th - 10th Floor Slab Castings", amount: "৳ 7,20,000", status: "cleared", pct: 100 },
  { name: "11th Floor Masonry Works", amount: "৳ 3,56,000", status: "due", pct: 0 },
  { name: "Electrical, Plumbing & Finishing", amount: "৳ 5,00,000", status: "pending", pct: 0 },
];

export function PaymentTab({ payments, stats, user, myFlats }: PaymentTabProps) {
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

  // Determine active project flat info
  const availableFlats = myFlats && myFlats.length > 0 ? myFlats : DEFAULT_FLATS;
  const currentFlat = availableFlats[selectedFlatIndex] || {
    title: "The Premium Green Valley",
    location: "Gulshan 2, Dhaka",
    image: "/image/progress/tph_green_valley.png",
  };

  // Determine monetary values matching design
  const totalPaid = stats?.formattedPaid || user?.total_paid || "৳ 42,20,000";
  const outstanding = stats?.formattedDue || user?.outstanding || "৳ 3,56,000";
  const totalExpense = stats?.formattedPrice || user?.total_expense || "৳ 50,78,000";
  const completionPct = 70; // Static 70% per design & specification

  // Circular SVG progress for 70%
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * completionPct) / 100;

  // Payments to show in history table
  const historyPayments =
    payments && payments.length > 0 && payments.some((p) => p.status === "paid")
      ? payments.filter((p) => (transactionFilter === "all" ? true : p.status === transactionFilter))
      : SCREENSHOT_PAYMENTS;

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
              </span>
              <span className="text-[11px] text-stone-400 block mt-0.5">
                {currentFlat.location}
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-[#044133] ml-1 transition-transform duration-200 shrink-0 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Property Dropdown Menu */}
          {isDropdownOpen && (
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
                      <p className="text-xs font-bold truncate">{flat.title}</p>
                      <p className="text-[10px] text-stone-400 truncate">{flat.location}</p>
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
          <div className="w-12 h-12 rounded-full bg-[#044133] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Landmark className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xs text-stone-500 font-medium block">
              Total Paid
            </span>
            <span className="text-lg sm:text-xl font-bold text-stone-900 block mt-0.5">
              {totalPaid}
            </span>
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
          <div>
            <span className="text-xs text-stone-500 font-medium block">
              Outstanding
            </span>
            <span className="text-lg sm:text-xl font-bold text-stone-900 block mt-0.5">
              {outstanding}
            </span>
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
          <div>
            <span className="text-xs text-stone-500 font-medium block">
              Total Expense
            </span>
            <span className="text-lg sm:text-xl font-bold text-stone-900 block mt-0.5">
              {totalExpense}
            </span>
            <span className="text-[11px] text-stone-400 block mt-0.5">
              All Project Expense
            </span>
          </div>
        </div>

        {/* Card 4: Completion (Static 70%) */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/70 shadow-xs flex items-center gap-4 hover:shadow-sm transition-shadow">
          <div className="relative w-12 h-12 shrink-0 flex items-center justify-center">
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
                className="stroke-[#044133]"
                strokeWidth="4.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-stone-900">
              {completionPct}%
            </span>
          </div>
          <div>
            <span className="text-lg sm:text-xl font-bold text-stone-900 block leading-tight">
              Completion
            </span>
            <span className="text-[11px] text-stone-400 block mt-0.5">
              Overall Progress
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
                    A Complete record of your payments for the {currentFlat.title}.
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
                    {historyPayments.map((item, idx) => (
                      <tr
                        key={item.id || idx}
                        className="hover:bg-stone-50/70 transition-colors"
                      >
                        <td className="py-3.5 px-3 text-stone-800 font-medium whitespace-nowrap">
                          {item.payment_date || item.due_date || "15 Aug 2026"}
                        </td>
                        <td className="py-3.5 px-3 font-mono text-stone-600 text-xs whitespace-nowrap">
                          {item.invoice_no || `PH-20260815-00${idx + 1}`}
                        </td>
                        <td className="py-3.5 px-3 text-stone-700 whitespace-nowrap">
                          {item.installment_title || "Installment Payment"}
                        </td>
                        <td className="py-3.5 px-3 font-semibold text-stone-900 whitespace-nowrap">
                          {item.amount || "$ 5,00,000"}
                        </td>
                        <td className="py-3.5 px-3 text-center whitespace-nowrap">
                          <span className="inline-flex items-center justify-center px-3 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100/80">
                            Paid
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleDownloadReceipt(item)}
                            title="Download Receipt"
                            className="p-1 text-stone-500 hover:text-[#044133] hover:scale-110 active:scale-95 transition-all cursor-pointer inline-flex items-center justify-center"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
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

              <div className="space-y-3.5">
                {UPCOMING_SCHEDULE.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-stone-200/70 hover:border-stone-300 bg-stone-50/40 hover:bg-white transition-all gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-stone-900">
                          {item.title}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            item.status === "due"
                              ? "bg-red-50 text-red-600 border border-red-200"
                              : "bg-stone-100 text-stone-600"
                          }`}
                        >
                          {item.tag}
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
                        className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                          item.status === "due"
                            ? "bg-[#044133] text-white hover:bg-[#065442] shadow-xs"
                            : "bg-white text-stone-700 border border-stone-200 hover:bg-stone-100"
                        }`}
                      >
                        {item.status === "due" ? "Pay Now" : "Pre-Pay"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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
                    ৳ 42,20,000 Cleared of ৳ 50,78,000
                  </p>
                </div>
                <div className="w-full sm:w-48 bg-stone-200 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-[#044133] h-full rounded-full w-[83%]" />
                </div>
              </div>

              {/* Milestones List */}
              <div className="space-y-3">
                {PAYMENT_PLAN_MILESTONES.map((mile, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-stone-100 hover:bg-stone-50/50 text-xs sm:text-sm"
                  >
                    <div className="flex items-center gap-3">
                      {mile.status === "cleared" ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : mile.status === "due" ? (
                        <Clock className="w-5 h-5 text-red-500 shrink-0" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-stone-300 shrink-0" />
                      )}
                      <div>
                        <p className="font-semibold text-stone-900">{mile.name}</p>
                        <p className="text-[11px] text-stone-400 capitalize">
                          Status: {mile.status}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-stone-900">{mile.amount}</span>
                  </div>
                ))}
              </div>
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
                <button
                  type="button"
                  onClick={() => handleDownloadReceipt(SCREENSHOT_PAYMENTS[0])}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#044133] text-white text-xs font-semibold hover:bg-[#065442] cursor-pointer shadow-xs transition-colors self-start sm:self-auto"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Full Statement</span>
                </button>
              </div>

              <div className="space-y-3">
                {SCREENSHOT_PAYMENTS.slice(0, 5).map((pay, idx) => (
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
                        Cleared on {pay.payment_date} via Bank Transfer
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

            {/* Due Date Info with Icon */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#e8f4ef] text-[#044133] flex items-center justify-center shrink-0 border border-[#b8dfce]">
                <CalendarClock className="w-5 h-5 text-[#044133]" />
              </div>
              <div>
                <span className="text-xs text-stone-400 font-medium block">
                  Due Date
                </span>
                <span className="text-base sm:text-lg font-bold text-stone-900 block mt-0.5">
                  15 Oct 2026
                </span>
              </div>
            </div>

            {/* Amount */}
            <div className="pt-1">
              <span className="text-xs text-stone-400 font-medium block">
                Amount
              </span>
              <span className="text-2xl sm:text-3xl font-bold text-[#044133] block mt-0.5 tracking-tight">
                $5,00,000
              </span>
            </div>

            {/* Pay Now Button */}
            <button
              type="button"
              onClick={() => setIsPayModalOpen(true)}
              className="w-full py-3.5 rounded-full bg-[#044133] hover:bg-[#065442] active:scale-[0.99] text-white text-sm font-semibold tracking-wide shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Pay Now</span>
            </button>
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
