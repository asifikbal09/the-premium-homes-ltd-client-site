"use client";

import React, { useState } from "react";
import { ArrowUpRight, MessageCircleMore, X, Sparkles, Phone } from "lucide-react";

export function SupportTab() {
  const [showAiModal, setShowAiModal] = useState(false);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl sm:text-[32px] font-bold text-[#044133] tracking-tight">
          Support
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          We&apos;re here to help. Get the support you need, Whenever you need it.
        </p>
      </div>

      {/* Support Options Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden divide-y divide-stone-100">
        {/* Call Option */}
        <a
          href="tel:+8801958253300"
          className="group flex items-center justify-between p-5 sm:p-6 hover:bg-stone-50/70 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-4 sm:gap-5 min-w-0">
            {/* WhatsApp / Call Green Circle */}
            <div className="w-12 h-12 rounded-full bg-[#044133] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <svg
                className="w-6 h-6 text-white fill-white"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#044133] group-hover:text-[#065442] transition-colors leading-tight">
                Call
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Talk to an expert and get your questions answered.
              </p>
            </div>
          </div>

          <div className="text-stone-400 group-hover:text-[#044133] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all pl-2 shrink-0">
            <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </a>

        {/* Chat With AI Option */}
        <button
          type="button"
          onClick={() => setShowAiModal(true)}
          className="w-full text-left group flex items-center justify-between p-5 sm:p-6 hover:bg-stone-50/70 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-4 sm:gap-5 min-w-0">
            {/* Lavender Circle with Speech Bubble Icon */}
            <div className="w-12 h-12 rounded-full bg-[#c4b5fd] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
              <MessageCircleMore className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#044133] group-hover:text-[#065442] transition-colors leading-tight">
                Chat With AI
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-1">
                Get instant answers about properties
              </p>
            </div>
          </div>

          <div className="text-stone-400 group-hover:text-[#044133] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all pl-2 shrink-0">
            <ArrowUpRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </button>
      </div>

      {/* AI Assistant Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowAiModal(false)}
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-[#c4b5fd]/25 text-[#7c3aed] flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>

            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#044133]">
              TPHL AI Property Assistant
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 mt-2.5 leading-relaxed">
              Our AI Concierge is currently being integrated to assist you 24/7 with real-time property details, installment updates, and site visit schedules.
            </p>

            <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#044133] bg-[#044133]/10 px-3 py-1 rounded-full uppercase tracking-wider">
                Coming Soon
              </span>
              <a
                href="tel:+8801958253300"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#044133] hover:underline"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Us Direct</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
