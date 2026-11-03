"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Building2, Check, Loader2, MapPin } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { parseAmount } from "@/lib/client-dashboard";
import {
  AUCTION_DURATIONS,
  DEFAULT_MIN_STARTING_BID,
  PLATFORM_FEE_PERCENT,
  formatAuctionAmount,
  lakhToTaka,
  saveAuctionListing,
  takaToLakh,
  todayInputValue,
} from "@/lib/client-auction";
import type { Auction, AuctionListingPayload, ClientFlat, ClientUser } from "./types";
import { DashboardModal, ModalFooter } from "./dashboard_modal";

interface AuctionSellFormProps {
  /** The flat being listed; the form is open while this is set. */
  flat: ClientFlat | null;
  /** The owner's pending listing for this flat, when editing. */
  existing?: Auction | null;
  user: ClientUser | null;
  userId: string | null;
  onClose: () => void;
  onSaved: () => void;
}

const INPUT_CLASS =
  "w-full h-[48px] px-[16px] rounded-[12px] bg-white border border-[#eaecf0] font-sans text-[15px] text-[#101828] placeholder:text-[#98a2b3] focus:outline-none focus:border-[#054b3c] focus:ring-2 focus:ring-[#054b3c]/10 transition-all";

const toLakhInput = (taka: number) => takaToLakh(taka).toFixed(2);

/** Flats with a handover-ready status are resales of finished units; everything else is pre-construction. */
function flatAuctionType(flat: ClientFlat): string {
  return /ready|complete|handover/i.test(flat.status || "") ? "Ready Flats" : "Pre Construction";
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-[8px]">
      <label className="font-sans text-[14px] font-medium text-[#3b3e40]">{label}</label>
      {children}
      {error ? (
        <p className="text-[12px] text-[#d92d20]">{error}</p>
      ) : (
        hint && <p className="text-[12px] text-[#59657b]">{hint}</p>
      )}
    </div>
  );
}

export function AuctionSellForm(props: AuctionSellFormProps) {
  const { flat, existing, onClose } = props;
  const [saving, setSaving] = useState(false);

  return (
    <DashboardModal
      open={flat !== null}
      onClose={saving ? () => {} : onClose}
      title={existing ? "Edit Auction" : "Sell via Auction"}
      description="Set your terms. Bidding opens on the start date you choose."
    >
      {/* Keyed so each flat (or listing) starts from a fresh form. */}
      {flat && (
        <SellFormBody
          key={`${flat.id}-${existing?.id ?? "new"}`}
          {...props}
          flat={flat}
          saving={saving}
          setSaving={setSaving}
        />
      )}
    </DashboardModal>
  );
}

function SellFormBody({
  flat,
  existing,
  user,
  userId,
  onSaved,
  saving,
  setSaving,
}: AuctionSellFormProps & { flat: ClientFlat; saving: boolean; setSaving: (v: boolean) => void }) {
  const paidAmount = parseAmount(flat.partial_payment);
  const minimumStartingBid = paidAmount > 0 ? paidAmount : DEFAULT_MIN_STARTING_BID;

  const [startingBid, setStartingBid] = useState(() =>
    toLakhInput(existing?.starting_bid || minimumStartingBid),
  );
  const [duration, setDuration] = useState<number>(existing?.duration_days || 7);
  const [startDate, setStartDate] = useState(existing?.start_date ? existing.start_date.slice(0, 10) : "");
  const [reservePrice, setReservePrice] = useState(
    existing?.reserve_price ? toLakhInput(existing.reserve_price) : "",
  );
  const [agreed, setAgreed] = useState(Boolean(existing));
  const [submitted, setSubmitted] = useState(false);

  const startingBidTaka = lakhToTaka(parseFloat(startingBid) || 0);
  const reserveTaka = reservePrice ? lakhToTaka(parseFloat(reservePrice) || 0) : null;
  const today = todayInputValue();

  const errors = {
    startingBid:
      startingBidTaka < minimumStartingBid
        ? `Must be at least ${formatAuctionAmount(minimumStartingBid)}.`
        : undefined,
    startDate: !startDate ? "Choose when bidding opens." : startDate < today ? "Start date can't be in the past." : undefined,
    reservePrice:
      reserveTaka !== null && reserveTaka < startingBidTaka
        ? "Reserve price can't be lower than the starting bid."
        : undefined,
    agreed: !agreed ? "Please agree to the auction terms." : undefined,
  };
  const hasErrors = Object.values(errors).some(Boolean);
  const shown = (key: keyof typeof errors) => (submitted ? errors[key] : undefined);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (hasErrors) return;
    if (!userId) {
      toast.error("Please log in again to list your flat.");
      return;
    }

    const size = parseInt(String(flat.flatSize || "").replace(/[^0-9]/g, ""), 10);
    const payload: AuctionListingPayload = {
      user_id: userId,
      user_email: user?.email || undefined,
      user_name: user?.name || user?.full_name || undefined,
      property_name: flat.title,
      property_slug: flat.slug,
      property_image: flat.image,
      location: flat.location || undefined,
      size: Number.isFinite(size) && size > 0 ? size : undefined,
      type: flatAuctionType(flat),
      flat_no: flat.flatNo || undefined,
      paid_amount: paidAmount,
      starting_bid: startingBidTaka,
      reserve_price: reserveTaka,
      duration_days: duration,
      start_date: startDate,
    };

    setSaving(true);
    const result = await saveAuctionListing(payload, existing?.id);
    setSaving(false);

    if (!result.success) {
      toast.error(result.message || "Could not save the auction.");
      return;
    }
    toast.success(existing ? "Auction updated." : "Your flat is listed for auction.");
    onSaved();
  };

  const youReceive = Math.round(startingBidTaka * (1 - PLATFORM_FEE_PERCENT / 100));

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[20px]" noValidate>
        {/* Flat summary */}
        <div className="flex gap-[12px] sm:gap-[16px] items-center p-[12px] rounded-[12px] bg-[#f1f6f5]">
          <div className="relative size-[64px] sm:size-[72px] rounded-[8px] overflow-hidden bg-stone-200 shrink-0 flex items-center justify-center">
            {flat.image ? (
              <Image src={flat.image} alt={flat.title} fill unoptimized sizes="72px" className="object-cover" />
            ) : (
              <Building2 className="w-6 h-6 text-stone-400" />
            )}
          </div>
          <div className="flex flex-col gap-[4px] min-w-0">
            <p className="text-[16px] font-semibold leading-[1.3] text-[#054b3c] line-clamp-2">
              {flat.title}
              {flat.flatNo && <span className="font-normal text-[#59657b]"> · Unit {flat.flatNo}</span>}
            </p>
            {flat.location && (
              <p className="flex items-center gap-1 text-[13px] text-[#59657b] min-w-0">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{flat.location}</span>
              </p>
            )}
            <p className="text-[13px] font-medium text-[#039855]">Paid so far: {formatAuctionAmount(paidAmount)}</p>
          </div>
        </div>

        <Field
          label="Starting Bid (৳ Lakh)"
          hint={`Minimum ${formatAuctionAmount(minimumStartingBid)}, based on what you've paid.`}
          error={shown("startingBid")}
        >
          <input
            type="number"
            inputMode="decimal"
            step="0.01"
            min={takaToLakh(minimumStartingBid)}
            value={startingBid}
            onChange={(e) => setStartingBid(e.target.value)}
            className={INPUT_CLASS}
          />
        </Field>

        <Field label="Auction Duration">
          <div className="grid grid-cols-4 gap-[8px]">
            {AUCTION_DURATIONS.map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => setDuration(days)}
                aria-pressed={duration === days}
                className={cn(
                  "h-[42px] rounded-full text-[13px] sm:text-[14px] font-medium transition-colors cursor-pointer whitespace-nowrap",
                  duration === days
                    ? "bg-[#054b3c] text-white"
                    : "bg-white border border-[#eaecf0] text-[#546360] hover:border-[#054b3c]/40",
                )}
              >
                {days} Days
              </button>
            ))}
          </div>
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px]">
          <Field label="Start Date" error={shown("startDate")}>
            <input
              type="date"
              value={startDate}
              min={today}
              onClick={(e) => e.currentTarget.showPicker?.()}
              onChange={(e) => setStartDate(e.target.value)}
              className={cn(INPUT_CLASS, "cursor-pointer")}
            />
          </Field>

          <Field
            label="Reserve Price (৳ Lakh, optional)"
            hint="The sale won't complete below this."
            error={shown("reservePrice")}
          >
            <input
              type="number"
              inputMode="decimal"
              step="0.01"
              placeholder="Minimum acceptable"
              value={reservePrice}
              onChange={(e) => setReservePrice(e.target.value)}
              className={INPUT_CLASS}
            />
          </Field>
        </div>

        {/* Fee structure */}
        <div className="rounded-[12px] border border-[#c7e6e0] bg-[#f1f6f5] p-[16px] flex flex-col gap-[10px]">
          <p className="font-sans text-[14px] font-semibold text-[#054b3c]">Fee Structure</p>
          <div className="flex justify-between gap-4 text-[14px]">
            <span className="text-[#546360]">Platform fee</span>
            <span className="font-medium text-[#101828] text-right">{PLATFORM_FEE_PERCENT}% of final sale</span>
          </div>
          <div className="flex justify-between gap-4 text-[13px] pb-[10px] border-b border-[#c7e6e0]">
            <span className="text-[#59657b]">Referral bonus (if applicable)</span>
            <span className="text-[#59657b] text-right">Rate set by TPHL</span>
          </div>
          <div className="flex justify-between gap-4 text-[14px]">
            <span className="font-medium text-[#101828]">You receive</span>
            <span className="font-semibold text-[#054b3c]">{100 - PLATFORM_FEE_PERCENT}% of winning bid</span>
          </div>
          {startingBidTaka > 0 && (
            <p className="text-[12px] italic text-[#59657b]">
              Sold at {formatAuctionAmount(startingBidTaka)} → you receive {formatAuctionAmount(youReceive)}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-[6px]">
          <label className="flex items-start gap-[12px] cursor-pointer select-none">
            <span className="relative flex items-center justify-center mt-[1px] shrink-0">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="peer size-[20px] appearance-none rounded-[6px] border border-[#d0d5dd] bg-white checked:bg-[#054b3c] checked:border-[#054b3c] transition-colors cursor-pointer"
              />
              <Check className="absolute size-[14px] text-white opacity-0 peer-checked:opacity-100 pointer-events-none" />
            </span>
            <span className="text-[14px] text-[#3b3e40] leading-[1.4]">
              I agree to the auction terms and conditions.
            </span>
          </label>
          {shown("agreed") && <p className="text-[12px] text-[#d92d20] pl-[32px]">{shown("agreed")}</p>}
        </div>

        <ModalFooter className="mt-0">
          <button
            type="submit"
            disabled={saving}
            className="w-full h-[48px] rounded-full bg-[#054b3c] hover:bg-[#043d30] text-white font-sans text-[16px] font-medium transition-colors cursor-pointer disabled:opacity-60 inline-flex items-center justify-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {existing ? "Update Auction" : "List Flat for Auction"}
          </button>
        </ModalFooter>
    </form>
  );
}
