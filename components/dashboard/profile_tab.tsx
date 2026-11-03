"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Building, ShieldCheck, type LucideIcon } from "lucide-react";
import { ClientUser, ClientFlat } from "./types";

interface ProfileTabProps {
  user: ClientUser | null;
  isLoading?: boolean;
  myFlats?: ClientFlat[];
  onUpdateUser?: (updated: ClientUser) => void;
}

interface InfoField {
  icon: LucideIcon;
  label: string;
  value: string;
  wide?: boolean;
  breakAll?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const CARD = "bg-white rounded-[16px] p-[20px] sm:p-[32px] w-full";
const PULSE = "bg-stone-200 rounded animate-pulse";

function ProfileHeader() {
  return (
    <motion.div variants={itemVariants} className="flex flex-col gap-[12px] items-start">
      <h1 className="capitalize font-serif font-semibold leading-[1.1] text-[#054b3c] text-[28px] sm:text-[32px]">
        Profile Settings
      </h1>
      <p className="font-sans font-normal leading-[1.4] text-[#546360] text-[15px] sm:text-[16px]">
        Your verified account information and allotment details.
      </p>
    </motion.div>
  );
}

function InfoTile({ icon: Icon, label, value, wide, breakAll }: InfoField) {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className={`flex items-center gap-[14px] sm:gap-[16px] p-[16px] rounded-[12px] bg-[#f8f9fc] border border-[#eaecf0] hover:border-[#054b3c]/30 transition-colors min-w-0 ${
        wide ? "sm:col-span-2" : ""
      }`}
    >
      <div className="bg-white flex items-center justify-center rounded-full shrink-0 size-[44px]">
        <Icon className="size-[20px] text-[#054b3c] stroke-[1.75]" />
      </div>
      <div className="flex flex-col gap-[6px] min-w-0">
        <p className="font-sans font-normal leading-[18px] text-[#59657b] text-[13px] sm:text-[14px]">
          {label}
        </p>
        <p
          className={`font-sans font-semibold leading-[1.2] text-[#054b3c] text-[15px] sm:text-[16px] ${
            breakAll ? "break-all" : "break-words"
          }`}
        >
          {value || "—"}
        </p>
      </div>
    </motion.div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-[16px] sm:gap-[24px] max-w-[952px] mx-auto w-full" aria-busy="true">
      <div className="flex flex-col gap-[12px]">
        <div className={`h-[32px] w-56 ${PULSE}`} />
        <div className={`h-[16px] w-72 max-w-full ${PULSE}`} />
      </div>

      <div className={CARD}>
        <div className="flex items-center gap-[16px] sm:gap-[20px] pb-[24px] border-b border-[#f1f2f6]">
          <div className="size-[72px] sm:size-[88px] rounded-full bg-stone-200 animate-pulse shrink-0" />
          <div className="flex flex-col gap-[10px] flex-1 min-w-0">
            <div className={`h-[22px] w-48 max-w-full ${PULSE}`} />
            <div className={`h-[14px] w-60 max-w-full ${PULSE}`} />
            <div className="h-[24px] w-40 rounded-full bg-stone-200 animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[12px] sm:gap-[16px] pt-[24px]">
          {[1, 2, 3, 4, 5].map((n) => (
            <div
              key={n}
              className={`flex items-center gap-[16px] p-[16px] rounded-[12px] bg-[#f8f9fc] border border-[#eaecf0] ${
                n === 5 ? "sm:col-span-2" : ""
              }`}
            >
              <div className="size-[44px] rounded-full bg-stone-200 animate-pulse shrink-0" />
              <div className="flex flex-col gap-[8px] flex-1 min-w-0">
                <div className={`h-[12px] w-28 ${PULSE}`} />
                <div className={`h-[16px] w-40 max-w-full ${PULSE}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProfileTab({ user, isLoading = false, myFlats = [] }: ProfileTabProps) {
  if (isLoading || !user) return <ProfileSkeleton />;

  const name =
    user.name ||
    user.full_name ||
    [user.first_name, user.last_name].filter(Boolean).join(" ") ||
    "";
  const email = user.email || "";
  const flatNo = user.flat_no || (myFlats[0]?.flatNo ? `Unit ${myFlats[0].flatNo}` : "");
  const building = user.building_name || myFlats[0]?.title || "";

  // Initials for the avatar fallback when no image is provided
  const initials = (name || "Client")
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const fields: InfoField[] = [
    { icon: User, label: "Full Legal Name", value: name },
    { icon: Mail, label: "Registered Email", value: email, breakAll: true },
    { icon: Phone, label: "Primary Phone Number", value: user.phone || "" },
    { icon: Building, label: "Allotted Property Unit", value: flatNo },
    { icon: MapPin, label: "Assigned Development Project", value: building, wide: true },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-[16px] sm:gap-[24px] max-w-[952px] mx-auto w-full"
    >
      <ProfileHeader />

      <motion.div variants={itemVariants} className={CARD}>
        {/* Avatar and account header */}
        <div className="flex items-center gap-[16px] sm:gap-[20px] pb-[24px] border-b border-[#f1f2f6]">
          <motion.div
            initial={{ scale: 0.86, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative size-[72px] sm:size-[88px] rounded-full overflow-hidden bg-[#f1f2f6] ring-4 ring-[#054b3c]/10 shrink-0 flex items-center justify-center"
          >
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={name || "User"}
                fill
                sizes="88px"
                className="object-cover object-top"
              />
            ) : (
              <span className="font-serif font-semibold text-[24px] sm:text-[28px] text-[#054b3c]">
                {initials}
              </span>
            )}
          </motion.div>

          <div className="flex flex-col gap-[6px] items-start min-w-0">
            <h2 className="font-serif font-semibold leading-[1.1] text-[#054b3c] text-[22px] sm:text-[24px] break-words">
              {name || "—"}
            </h2>
            <p className="font-sans font-normal text-[#59657b] text-[14px] break-all">
              {email || "—"}
            </p>
            <span className="inline-flex items-center gap-[6px] mt-[4px] px-[10px] py-[4px] rounded-[40px] bg-[#054b3c]/5 text-[#054b3c] text-[12px] font-medium">
              <ShieldCheck className="size-[14px]" />
              Verified Onboard Client
            </span>
          </div>
        </div>

        {/* Read-only information tiles */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 sm:grid-cols-2 gap-[12px] sm:gap-[16px] pt-[24px]"
        >
          {fields.map((field) => (
            <InfoTile key={field.label} {...field} />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
