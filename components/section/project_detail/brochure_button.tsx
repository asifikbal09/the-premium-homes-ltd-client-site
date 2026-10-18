"use client";

import React, { useActionState, useRef, useSyncExternalStore } from "react";
import { toast } from "sonner";
import { Download, Loader2, X } from "lucide-react";
import {
  submitBrochureLeadAction,
  type BrochureLeadState,
} from "@/app/actions/brochure";

const STORAGE_KEY = "brochure_lead_capture";
const TTL_MS = 60 * 60 * 1000; // 1 hour per project
type LeadMap = Record<string, number>; // property_id -> expiresAt

// Reads the per-project lead map and drops expired entries (auto-remove).
function readLeads(now = Date.now()): LeadMap {
  let all: LeadMap = {};
  try {
    all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch {}
  const live = Object.fromEntries(
    Object.entries(all).filter(([, exp]) => exp > now),
  );
  if (Object.keys(live).length) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(live));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
  return live;
}

const hasLead = (propertyId: number) => propertyId in readLeads();

// Same-tab change notification (the native "storage" event only fires in other tabs).
const LEAD_EVENT = "brochure-lead-change";
const notifyLeadChange = () => window.dispatchEvent(new Event(LEAD_EVENT));

function subscribeLeads(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(LEAD_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(LEAD_EVENT, onChange);
  };
}

function saveLead(propertyId: number) {
  const leads = readLeads();
  leads[propertyId] = Date.now() + TTL_MS;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  notifyLeadChange();
}

const BUTTON_CLASS =
  "inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#044133] hover:bg-[#065e49] text-[#d0a65b] text-xs font-normal tracking-wider uppercase transition-colors cursor-pointer shrink-0 self-start sm:self-auto";

const INPUT_CLASS =
  "w-full px-4 py-3 bg-white border border-[#ede7dc] focus:border-[#044133] focus:outline-none text-sm text-gray-800 transition-colors";

const initialState: BrochureLeadState = { success: false };

interface BrochureButtonProps {
  propertyId: number;
  brochureLink: string;
  projectName: string;
}

export function BrochureButton({
  propertyId,
  brochureLink,
  projectName,
}: BrochureButtonProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  // localStorage is client-only: server render always shows "GET BROCHURE".
  const captured = useSyncExternalStore(
    subscribeLeads,
    () => hasLead(propertyId),
    () => false,
  );

  const [, formAction, isPending] = useActionState(
    async (prev: BrochureLeadState, formData: FormData) => {
      const result = await submitBrochureLeadAction(prev, formData);
      if (result.success) {
        saveLead(propertyId);
        dialogRef.current?.close();
        toast.success(result.message);
        // May be blocked as a popup; the button is now "Download Brochure" as a fallback.
        window.open(brochureLink, "_blank", "noopener,noreferrer");
      } else if (result.error) {
        toast.error(result.error);
      }
      return result;
    },
    initialState,
  );

  const openForm = () => {
    // Re-check on click: the lead may have expired while the page was open.
    if (hasLead(propertyId)) {
      window.open(brochureLink, "_blank", "noopener,noreferrer");
      return;
    }
    notifyLeadChange(); // expired entry was just pruned -> flip button back
    dialogRef.current?.showModal();
  };

  return (
    <>
      {captured ? (
        <a
          href={brochureLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            if (!hasLead(propertyId)) {
              e.preventDefault();
              openForm();
            }
          }}
          className={BUTTON_CLASS}
        >
          <Download className="w-4 h-4 text-[#d0a65b]" />
          <span>DOWNLOAD BROCHURE</span>
        </a>
      ) : (
        <button type="button" onClick={openForm} className={BUTTON_CLASS}>
          <Download className="w-4 h-4 text-[#d0a65b]" />
          <span>GET BROCHURE</span>
        </button>
      )}

      <dialog
        ref={dialogRef}
        aria-labelledby="brochure-form-title"
        onClick={(e) => {
          // Close when clicking the backdrop (outside the panel).
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
        className="m-auto w-[calc(100%-2rem)] max-w-md bg-white p-0 shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      >
        <div className="relative p-6 sm:p-8">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            aria-label="Close brochure form"
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#d0a65b] block">
            BROCHURE
          </span>
          <h3
            id="brochure-form-title"
            className="font-heading text-2xl sm:text-3xl font-normal text-[#044133] mt-1"
          >
            Download Brochure
          </h3>
          <p className="text-xs text-gray-500 font-light mt-1 mb-6">
            Share your details to get the {projectName} brochure.
          </p>

          <form action={formAction} className="space-y-4">
            <input type="hidden" name="property_id" value={propertyId} />

            <div>
              <label
                htmlFor="brochure-name"
                className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1"
              >
                Name
              </label>
              <input
                id="brochure-name"
                name="name"
                type="text"
                required
                autoComplete="name"
                placeholder="Enter your full name"
                className={INPUT_CLASS}
              />
            </div>

            <div>
              <label
                htmlFor="brochure-email"
                className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1"
              >
                Email
              </label>
              <input
                id="brochure-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="name@example.com"
                className={INPUT_CLASS}
              />
            </div>

            <div>
              <label
                htmlFor="brochure-phone"
                className="block text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-1"
              >
                Phone
              </label>
              <input
                id="brochure-phone"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                placeholder="01XXXXXXXXX"
                className={INPUT_CLASS}
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#044133] hover:bg-[#065e49] disabled:opacity-60 text-[#d0a65b] text-xs font-normal tracking-wider uppercase transition-colors cursor-pointer"
            >
              {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{isPending ? "Submitting..." : "Download Now"}</span>
            </button>
          </form>
        </div>
      </dialog>
    </>
  );
}
