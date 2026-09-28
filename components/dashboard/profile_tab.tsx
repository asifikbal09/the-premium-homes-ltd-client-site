"use client";

import React, { useState } from "react";
import Image from "next/image";
import { User, Mail, Phone, MapPin, Building, ShieldCheck, Check } from "lucide-react";
import { ClientUser } from "./types";

interface ProfileTabProps {
  user: ClientUser | null;
  onUpdateUser: (updated: ClientUser) => void;
}

export function ProfileTab({ user, onUpdateUser }: ProfileTabProps) {
  const [name, setName] = useState(
    user?.name ||
      user?.full_name ||
      [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
      "Afsar Hossain"
  );
  const [email, setEmail] = useState(user?.email || "afsar.hossain@example.com");
  const [phone, setPhone] = useState(user?.phone || "+880 1711-234567");
  const [flatNo, setFlatNo] = useState(user?.flat_no || "Unit 8B, 8th Floor");
  const [building, setBuilding] = useState(user?.building_name || "The Premium Green Valley");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ClientUser = {
      ...user,
      name,
      full_name: name,
      email,
      phone,
      flat_no: flatNo,
      building_name: building,
    };
    onUpdateUser(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-[32px] font-bold text-[#044133] tracking-tight">
          Client Profile Settings
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Manage your onboard account details, authorized contacts, and communication preferences.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-xs max-w-3xl space-y-6">
        {/* Avatar and Account Header */}
        <div className="flex items-center gap-5 pb-6 border-b border-stone-100">
          <div className="relative w-20 h-20 rounded-full overflow-hidden bg-stone-100 ring-4 ring-[#044133]/10 shrink-0">
            <Image
              src={user?.avatar || "/image/team/AlfaaniShuvo.png"}
              alt={name}
              fill
              sizes="80px"
              className="object-cover object-top"
            />
          </div>
          <div>
            <h2 className="font-bold text-lg sm:text-xl text-stone-900 leading-tight">
              {name}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">{email}</p>
            <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified Onboard Client
            </span>
          </div>
        </div>

        {saved && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Profile settings updated and saved successfully!</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Full Legal Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-lg border border-stone-200 focus:outline-none focus:border-[#044133] focus:ring-2 focus:ring-[#044133]/10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Registered Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-lg border border-stone-200 focus:outline-none focus:border-[#044133] focus:ring-2 focus:ring-[#044133]/10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Primary Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-lg border border-stone-200 focus:outline-none focus:border-[#044133] focus:ring-2 focus:ring-[#044133]/10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Allotted Property Unit
              </label>
              <div className="relative">
                <Building className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={flatNo}
                  onChange={(e) => setFlatNo(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-lg border border-stone-200 focus:outline-none focus:border-[#044133] focus:ring-2 focus:ring-[#044133]/10"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Assigned Development Project
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-lg border border-stone-200 focus:outline-none focus:border-[#044133] focus:ring-2 focus:ring-[#044133]/10"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#044133] hover:bg-[#065442] text-[#f7e7cb] text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-xs"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
