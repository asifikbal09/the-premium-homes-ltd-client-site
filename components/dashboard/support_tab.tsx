"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Phone, Mail, Clock, Send, CheckCircle2, MessageSquare } from "lucide-react";

export function SupportTab() {
  const [submitted, setSubmitted] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSubject("");
      setMessage("");
    }, 4000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-[32px] font-bold text-[#044133] tracking-tight">
          Client Care & Dedicated Relationship Manager
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Direct concierge assistance for your property inquiries, documentation, and technical support.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dedicated Manager Card */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-5">
          <span className="text-[11px] font-bold tracking-wider uppercase text-[#044133] bg-[#044133]/10 px-2.5 py-0.5 rounded-full">
            YOUR ASSIGNED MANAGER
          </span>

          <div className="flex items-center gap-4 pt-1">
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-stone-100 ring-2 ring-[#044133]/20 shrink-0">
              <Image
                src="/image/team/AlfaaniShuvo.png"
                alt="Relationship Manager"
                fill
                sizes="64px"
                className="object-cover object-top"
              />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900">
                Md. Rayhan Bhuiyan
              </h3>
              <p className="text-xs text-stone-500">
                Senior Relationship Manager
              </p>
              <p className="text-[11px] text-[#044133] font-medium mt-0.5">
                Client Service Dept.
              </p>
            </div>
          </div>

          <div className="space-y-2.5 pt-2 border-t border-stone-100 text-xs text-stone-600">
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#044133] shrink-0" />
              <a href="tel:+8801794621487" className="hover:text-[#044133] font-mono">
                +880 1794-621487
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#044133] shrink-0" />
              <a href="mailto:care@thepremiumhomesltd.com" className="hover:text-[#044133]">
                care@thepremiumhomesltd.com
              </a>
            </div>
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-[#044133] shrink-0" />
              <span>Saturday – Thursday (9:30 AM – 6:30 PM)</span>
            </div>
          </div>
        </div>

        {/* Send Ticket / Query Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-[#044133]">
            <MessageSquare className="w-5 h-5" />
            <h2 className="font-serif text-lg font-bold text-stone-900">
              Submit a Concierge Request
            </h2>
          </div>

          {submitted ? (
            <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-sm text-emerald-900">
                Request Dispatched Successfully
              </h4>
              <p className="text-xs text-emerald-700">
                Your relationship manager has been notified and will reach out to you within 2 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Subject / Topic
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Request for updated deed copy, site visit booking..."
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-lg border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-[#044133] focus:ring-2 focus:ring-[#044133]/10"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Message Details
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please describe your query or assistance request in detail..."
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-lg border border-stone-200 bg-stone-50/50 focus:bg-white focus:outline-none focus:border-[#044133] focus:ring-2 focus:ring-[#044133]/10"
                />
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#044133] hover:bg-[#065442] text-[#f7e7cb] text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Request</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
