"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  IconCard,
  type IconCardItem,
} from "@/components/section/shared/icon_card";
import { Appear, Shutter } from "@/components/ui/motion";
import { Eyebrow, GreenPill, Heading } from "@/components/ui/primitives";
import { API_BASE } from "@/lib/api";
import {
  getClientToken,
  getClientUserId,
  hasClientSession,
} from "@/lib/client-auth";
import type { ProjectDetail } from "@/lib/projects";
import { cn, fluid } from "@/lib/utils";

interface ProjectOverviewProps {
  project: ProjectDetail;
}

const ICONS = "/image/career/icons";

const HIGHLIGHTS: IconCardItem[] = [
  { icon: `${ICONS}/benefit-waterfront.svg`, title: "Waterfront Setting" },
  { icon: `${ICONS}/benefit-retail.svg`, title: "Retail & dining close" },
  { icon: `${ICONS}/benefit-city.svg`, title: "Easy city access" },
  { icon: `${ICONS}/benefit-amenities.svg`, title: "Lifestyle amenities Nearby" },
];

const WISHLIST_STORAGE_KEY = "tphl_wishlist_ids";

function readStoredWishlist(userId: string): string[] {
  try {
    const raw = localStorage.getItem(`${WISHLIST_STORAGE_KEY}_${userId}`);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function writeStoredWishlist(userId: string, ids: string[]) {
  try {
    localStorage.setItem(
      `${WISHLIST_STORAGE_KEY}_${userId}`,
      JSON.stringify(Array.from(new Set(ids))),
    );
  } catch {
    // ignore storage errors
  }
}

export function ProjectOverviewSection({ project }: ProjectOverviewProps) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const propertyIdStr = String(project.id);

  // Sync login session and initial saved state on mount
  useEffect(() => {
    const isLogged = hasClientSession();
    const uid = getClientUserId();
    setLoggedIn(isLogged);
    setUserId(uid);

    if (!isLogged || !uid) return;

    // Check locally stored wishlist first for instant feedback
    const localIds = readStoredWishlist(uid);
    if (localIds.includes(propertyIdStr)) {
      setSaved(true);
    }

    // Also check user profile / wishlist from API if available
    let cancelled = false;
    (async () => {
      try {
        const token = getClientToken();
        const headers: Record<string, string> = { Accept: "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetch(`${API_BASE}/users/${uid}`, {
          method: "GET",
          headers,
          cache: "no-store",
        });
        if (!res.ok || cancelled) return;
        const json = await res.json();
        const userPayload =
          json?.user ||
          (Array.isArray(json?.data) ? json.data[0] : json?.data) ||
          null;
        const list: unknown[] =
          userPayload?.wishlist ||
          userPayload?.wishlistProperties ||
          userPayload?.saved_wishlist ||
          [];
        if (Array.isArray(list) && list.length > 0 && !cancelled) {
          const matched = list.some((item: any) => {
            const itemId =
              typeof item === "object" && item !== null
                ? (item.propertyId ?? item.property_id ?? item.id)
                : item;
            return String(itemId) === propertyIdStr;
          });
          if (matched) {
            setSaved(true);
            writeStoredWishlist(uid, [...localIds, propertyIdStr]);
          }
        }
      } catch {
        // ignore background check error
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [propertyIdStr]);

  const handleToggleSave = async () => {
    const uid = userId || getClientUserId();
    if (!loggedIn || !uid) return;
    if (saving) return;

    const nextSaved = !saved;
    setSaving(true);
    setSaved(nextSaved);

    try {
      const token = getClientToken();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      if (token) headers.Authorization = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/users/${uid}/wishlist`, {
        method: "POST",
        headers,
        body: JSON.stringify({ propertyId: propertyIdStr }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || data?.success === false) {
        setSaved(!nextSaved);
        toast.error(
          data?.message ||
            data?.error ||
            "Could not update saved property. Please try again.",
        );
        return;
      }

      const currentIds = readStoredWishlist(uid);
      if (nextSaved) {
        writeStoredWishlist(uid, [...currentIds, propertyIdStr]);
        toast.success(data?.message || "Property saved to your wishlist.");
      } else {
        writeStoredWishlist(
          uid,
          currentIds.filter((id) => id !== propertyIdStr),
        );
        toast.success(data?.message || "Property removed from your wishlist.");
      }
    } catch {
      setSaved(!nextSaved);
      toast.error("Network error while saving property. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const projectStatus =
    project.project_sale_status ||
    (project.status === "Ongoing" ? "Under Development" : project.status) ||
    "Under Development";

  const startingPrice =
    project.price_range || project.price || "80lac - 2cr BDT";

  const rawParagraphs = (project.description || "")
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const paragraphs =
    rawParagraphs.length > 0
      ? rawParagraphs
      : [
          `${project.name} is a premium residential project that blends modern architecture with luxury and comfort.`,
          "Designed with spacious layouts, quality finishes, and contemporary amenities, it offers an elevated living experience. Its prime location provides convenient access to essential services, making it an ideal choice for families and investors alike.",
        ];

  return (
    <section
      aria-label="Project Overview"
      className="bg-white py-[clamp(56px,6.25vw,100px)]"
    >
      <div className="shell flex flex-col gap-10">
        {/* Figma Section Header Row (1440 × 99) */}
        <div className="flex flex-col justify-between gap-6 border-b border-sage pb-9 lg:flex-row lg:items-end">
          <div className="flex flex-col gap-4">
            <Eyebrow>PROJECT INFO</Eyebrow>
            <Heading size={64} min={36} leading={1.1} mask>
              Project Overview
            </Heading>
          </div>

          <Appear
            preset="lift"
            delay={0.2}
            className="flex flex-wrap items-center gap-10 sm:gap-16 lg:gap-24"
          >
            <div className="flex flex-col gap-2">
              <span className="trim text-[14px] capitalize leading-[1.5] text-ink sm:text-[16px]">
                project status
              </span>
              <span
                className="trim font-display font-medium capitalize text-green"
                style={{ fontSize: fluid(28, 20), lineHeight: 1.1 }}
              >
                {projectStatus}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <span className="trim text-[14px] capitalize leading-[1.5] text-ink sm:text-[16px]">
                starting from
              </span>
              <span
                className="trim font-display font-medium text-green"
                style={{ fontSize: fluid(28, 20), lineHeight: 1.1 }}
              >
                {startingPrice}
              </span>
            </div>
          </Appear>
        </div>

        {/* Two-Column Content Row (716px image on left, 610px copy & actions on right) */}
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[716fr_610fr] lg:gap-[clamp(40px,7.1vw,114px)]">
          <Shutter className="relative aspect-[716/509] w-full bg-warm">
            <div className="zoom-frame relative size-full">
              <Image
                src={
                  project.images[0] ||
                  project.image ||
                  "/image/projects/projectsHero.png"
                }
                alt={project.name}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-center"
              />
            </div>
          </Shutter>

          <div className="flex max-w-[610px] flex-col gap-9">
            <Appear
              preset="lift"
              delay={0.25}
              className="flex flex-col gap-5 text-[clamp(16px,1.125vw,18px)] leading-[1.5] text-sage"
            >
              {paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </Appear>

            <Appear
              preset="lift"
              delay={0.4}
              className="flex flex-wrap items-center gap-4"
            >
              <GreenPill href="#contact" arrow>
                contact agent
              </GreenPill>

              {loggedIn ? (
                <button
                  type="button"
                  onClick={handleToggleSave}
                  disabled={saving}
                  aria-pressed={saved}
                  className={cn(
                    "press inline-flex h-[42px] shrink-0 items-center justify-center rounded-full border px-6 text-[14px] font-medium uppercase tracking-[2px] transition-colors duration-300 disabled:opacity-60",
                    saved
                      ? "border-gold bg-gold text-green"
                      : "border-sage bg-white text-green hover:border-green hover:bg-warm",
                  )}
                >
                  <span className="trim leading-[1.7]">
                    {saved ? "Saved property" : "Save property"}
                  </span>
                </button>
              ) : (
                <Link
                  href="/login"
                  className="press inline-flex h-[42px] shrink-0 items-center justify-center rounded-full border border-sage bg-white px-6 text-[14px] font-medium uppercase tracking-[2px] text-green transition-colors duration-300 hover:border-green hover:bg-warm"
                >
                  <span className="trim leading-[1.7]">
                    log in to save property
                  </span>
                </Link>
              )}
            </Appear>
          </div>
        </div>

        {/* 4 Highlight Cards Row (354 × 187 each) */}
        <div className="relative grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {HIGHLIGHTS.map((item, i) => (
            <IconCard key={item.title} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
