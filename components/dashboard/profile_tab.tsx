"use client";

import React from "react";
import Image from "next/image";
import { User, Mail, Phone, MapPin, Building, ShieldCheck, Loader2 } from "lucide-react";
import { ClientUser, ClientFlat } from "./types";

interface ProfileTabProps {
  user: ClientUser | null;
  isLoading?: boolean;
  myFlats?: ClientFlat[];
  onUpdateUser?: (updated: ClientUser) => void;
}

export function ProfileTab({
  user,
  isLoading = false,
  myFlats = [],
}: ProfileTabProps) {
  if (isLoading || !user) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-[32px] font-bold text-[#044133] tracking-tight">
            Client Profile
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Your verified onboard account information and allotment details.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-16 border border-stone-200/80 flex flex-col items-center justify-center text-stone-500 shadow-xs max-w-3xl">
          <Loader2 className="w-8 h-8 animate-spin text-[#044133] mb-3" />
          <p className="text-sm font-medium text-stone-700">Loading profile details...</p>
        </div>
      </div>
    );
  }

  const name =
    user.name ||
    user.full_name ||
    [user.first_name, user.last_name].filter(Boolean).join(" ") ||
    "";
  const email = user.email || "";
  const phone = user.phone || "";
  const flatNo = user.flat_no || (myFlats[0]?.flatNo ? `Unit ${myFlats[0].flatNo}` : "");
  const building = user.building_name || myFlats[0]?.title || "";

  // Get user initials for avatar fallback if no image provided
  const initials = (name || "Client")
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-[32px] font-bold text-[#044133] tracking-tight">
          Client Profile
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Your verified onboard account information and allotment details.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-xs max-w-3xl space-y-6">
        {/* Avatar and Account Header */}
        <div className="flex items-center gap-5 pb-6 border-b border-stone-100">
          <div className="relative w-20 h-20 rounded-full overflow-hidden bg-[#044133]/10 ring-4 ring-[#044133]/10 shrink-0 flex items-center justify-center">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={name || "User"}
                fill
                sizes="80px"
                className="object-cover object-top"
              />
            ) : (
              <span className="font-bold text-xl text-[#044133]">{initials}</span>
            )}
          </div>
          <div>
            <h2 className="font-bold text-lg sm:text-xl text-stone-900 leading-tight">
              {name || "—"}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">{email || "—"}</p>
            <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Verified Onboard Client
            </span>
          </div>
        </div>

        {/* Read-only Information Tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-stone-50/70 rounded-xl p-4 border border-stone-200/60">
            <div className="flex items-center gap-2 text-stone-500 text-xs font-medium mb-1">
              <User className="w-3.5 h-3.5 text-stone-400" />
              <span>Full Legal Name</span>
            </div>
            <p className="text-sm sm:text-base font-semibold text-stone-900">
              {name || "—"}
            </p>
          </div>

          <div className="bg-stone-50/70 rounded-xl p-4 border border-stone-200/60">
            <div className="flex items-center gap-2 text-stone-500 text-xs font-medium mb-1">
              <Mail className="w-3.5 h-3.5 text-stone-400" />
              <span>Registered Email</span>
            </div>
            <p className="text-sm sm:text-base font-semibold text-stone-900 break-all">
              {email || "—"}
            </p>
          </div>

          <div className="bg-stone-50/70 rounded-xl p-4 border border-stone-200/60">
            <div className="flex items-center gap-2 text-stone-500 text-xs font-medium mb-1">
              <Phone className="w-3.5 h-3.5 text-stone-400" />
              <span>Primary Phone Number</span>
            </div>
            <p className="text-sm sm:text-base font-semibold text-stone-900">
              {phone || "—"}
            </p>
          </div>

          <div className="bg-stone-50/70 rounded-xl p-4 border border-stone-200/60">
            <div className="flex items-center gap-2 text-stone-500 text-xs font-medium mb-1">
              <Building className="w-3.5 h-3.5 text-stone-400" />
              <span>Allotted Property Unit</span>
            </div>
            <p className="text-sm sm:text-base font-semibold text-stone-900">
              {flatNo || "—"}
            </p>
          </div>

          <div className="bg-stone-50/70 rounded-xl p-4 border border-stone-200/60 sm:col-span-2">
            <div className="flex items-center gap-2 text-stone-500 text-xs font-medium mb-1">
              <MapPin className="w-3.5 h-3.5 text-stone-400" />
              <span>Assigned Development Project</span>
            </div>
            <p className="text-sm sm:text-base font-semibold text-stone-900">
              {building || "—"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
