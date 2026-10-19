"use client";

import React from "react";
import Image from "next/image";
import { useFormUserAuth } from "@/context/FormUserAuthContext";
import {
  FileSpreadsheet,
  LogOut,
  User,
  PlusCircle,
  Inbox,
  Clock,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export default function TphlFormsDashboardPage() {
  const { user, logout } = useFormUserAuth();

  return (
    <div className="min-h-screen bg-[#f8faf9] text-[#1f2723] flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-stone-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <div className="relative w-36 h-10">
            <Image
              src="/image/logo/LOGO-GREEN.png"
              alt="The Premium Homes Ltd."
              fill
              priority
              sizes="150px"
              className="object-contain"
            />
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-[#044133] rounded-full border border-emerald-200/60 text-xs font-medium">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>TPHL Forms</span>
          </div>
        </div>

        {/* User Info & Logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 bg-stone-50 border border-stone-200/80 rounded-full px-3 py-1.5">
            <div className="w-7 h-7 rounded-full bg-[#044133] text-white flex items-center justify-center text-xs font-medium uppercase">
              {user?.name ? user.name.charAt(0) : <User className="w-3.5 h-3.5" />}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-xs font-semibold text-stone-800 leading-tight">
                {user?.name || "Form Manager"}
              </span>
              <span className="text-[10px] text-stone-500 leading-tight">
                {user?.email || ""}
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 text-stone-600 hover:text-red-700 hover:border-red-200 hover:bg-red-50/60 text-xs font-medium transition-colors cursor-pointer"
            title="Sign out of TPHL Forms"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Dashboard Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 flex flex-col gap-6">
        {/* Welcome Banner */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-6 sm:p-8 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100/60 text-[#044133] text-[11px] font-semibold mb-2">
                <Sparkles className="w-3 h-3" />
                Active Session
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif text-[#1f2723]">
                Welcome back, {user?.name || "User"}
              </h1>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Your TPHL Form Portal dashboard is connected and authenticated.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-100 text-stone-400 text-xs font-medium cursor-not-allowed border border-stone-200"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create New Form</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stat Placeholders */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-stone-500">Active Forms</p>
              <h3 className="text-2xl font-bold text-[#1f2723] mt-1">0</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#044133] flex items-center justify-center">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-stone-500">Total Submissions</p>
              <h3 className="text-2xl font-bold text-[#1f2723] mt-1">0</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Inbox className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-stone-500">Pending Reviews</p>
              <h3 className="text-2xl font-bold text-[#1f2723] mt-1">0</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Empty State Content Card */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-12 text-center flex flex-col items-center justify-center min-h-[340px] shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#044133] flex items-center justify-center mb-4">
            <FileSpreadsheet className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h2 className="text-lg font-serif text-[#1f2723] mb-1">
            TPHL Form Dashboard Ready
          </h2>
          <p className="text-xs text-stone-500 max-w-md mx-auto mb-6">
            Authentication and user session management are successfully configured. You can now connect your specific forms, survey templates, and submission data tables.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-50 border border-stone-200 text-stone-600 text-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Session verified via Bearer token</span>
          </div>
        </div>
      </main>
    </div>
  );
}
