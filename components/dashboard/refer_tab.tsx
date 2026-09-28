"use client";

import React, { useState } from "react";
import { Gift, Copy, Check, Users, Award, ShieldCheck } from "lucide-react";

export function ReferTab() {
  const [copied, setCopied] = useState(false);
  const referralCode = "TPHL-AFSAR-2026";

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-[32px] font-bold text-[#044133] tracking-tight">
          Client Referral Privilege Program
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Introduce friends and associates to The Premium Homes family and earn exclusive luxury benefits.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#044133]/10 text-[#044133] flex items-center justify-center">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-stone-900">
                Your Exclusive Referral Code
              </h2>
              <p className="text-xs text-stone-500">
                Share this with your friends or family during project booking inquiries.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="font-mono text-base font-bold text-stone-800 tracking-wider">
              {referralCode}
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-[#044133] hover:bg-[#065442] text-[#f7e7cb] text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>COPIED!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>COPY CODE</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-stone-100 bg-[#fdfbf7] space-y-1.5">
              <Award className="w-5 h-5 text-amber-600" />
              <h3 className="font-bold text-sm text-stone-900">৳ 2,00,000 Cash Credit</h3>
              <p className="text-xs text-stone-500">
                Credited towards your next installment upon successful booking contract execution.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-stone-100 bg-[#f7faf8] space-y-1.5">
              <Users className="w-5 h-5 text-emerald-700" />
              <h3 className="font-bold text-sm text-stone-900">Exclusive Club Membership</h3>
              <p className="text-xs text-stone-500">
                Complimentary 1-year premium lifestyle & golf club membership in Dhaka.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-4">
          <h3 className="font-serif text-base font-bold text-[#044133]">
            Referral Terms
          </h3>
          <ul className="text-xs text-stone-600 space-y-2.5 list-disc pl-4 leading-relaxed">
            <li>Applicable only for new unit bookings in ongoing and signature projects.</li>
            <li>Referee must present your code during the preliminary registration.</li>
            <li>No cap on the number of friends or family members you can refer.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
