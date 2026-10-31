"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  ChevronRight,
  Plus,
  X,
  Building2,
  Loader2,
  Check,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { ClientUser, WishlistPropertyItem } from "./types";
import {
  fetchUserWishlist,
  addToUserWishlist,
  removeFromUserWishlist,
  formatDashboardProjectPrice,
  parseAmount,
} from "@/lib/client-dashboard";
import { getClientUserId } from "@/lib/client-auth";
import { cn } from "@/lib/utils";

interface WishlistTabProps {
  user?: ClientUser | null;
}

interface CatalogProjectOption {
  id: string;
  propertyId: string;
  name: string;
  slug?: string;
  location?: string;
  image?: string;
  status?: string;
  price?: string;
  flatSize?: string;
  buildingType?: string;
  propertyType?: string;
  beds?: number | string;
  constructionPct?: number;
  handoverDate?: string;
}

const WISHLIST_STORAGE_KEY = "tphl_wishlist_ids";
const EASE_OUT_EXPO: [number, number, number, number] = [0.22, 1, 0.36, 1];

function syncStoredWishlistIds(userId: string, ids: string[]) {
  try {
    localStorage.setItem(
      `${WISHLIST_STORAGE_KEY}_${userId}`,
      JSON.stringify(Array.from(new Set(ids.map(String))))
    );
  } catch {
    // ignore storage errors
  }
}

function LocationPinIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 9.75C10.2426 9.75 11.25 8.74264 11.25 7.5C11.25 6.25736 10.2426 5.25 9 5.25C7.75736 5.25 6.75 6.25736 6.75 7.5C6.75 8.74264 7.75736 9.75 9 9.75Z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 15.75C12 12.75 14.625 10.2891 14.625 7.5C14.625 4.3934 12.1066 1.875 9 1.875C5.8934 1.875 3.375 4.3934 3.375 7.5C3.375 10.2891 6 12.75 9 15.75Z"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FavouriteHeartIcon({
  className,
  filled,
}: {
  className?: string;
  filled?: boolean;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.9751 2.66276C11.5875 1.56625 9.62695 1.87549 8.44267 3.04534C8.18181 3.30306 7.81819 3.30306 7.55733 3.04534C6.37305 1.87549 4.41251 1.56625 3.02491 2.66276C1.30756 4.01985 1.15836 6.59746 2.55979 8.18771C4.47775 10.364 6.37388 12.2302 7.45473 13.1753C7.76885 13.45 8.23115 13.45 8.54527 13.1753C9.62612 12.2302 11.5222 10.364 13.4402 8.18771C14.8416 6.59746 14.6924 4.01985 12.9751 2.66276Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: EASE_OUT_EXPO,
    },
  },
};

export function WishlistTab({ user }: WishlistTabProps) {
  const [wishlist, setWishlist] = useState<WishlistPropertyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Add property modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [catalogProjects, setCatalogProjects] = useState<CatalogProjectOption[]>([]);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [modalSearch, setModalSearch] = useState("");
  const [modalFilter, setModalFilter] = useState<"all" | "ongoing" | "sold">("all");

  const effectiveUserId = useMemo(() => {
    if (user?.id) return String(user.id);
    return getClientUserId();
  }, [user?.id]);

  const loadWishlist = useCallback(
    async (showLoader = true) => {
      if (!effectiveUserId) {
        setIsLoading(false);
        return;
      }

      try {
        if (showLoader) setIsLoading(true);
        const items = await fetchUserWishlist(effectiveUserId);
        setWishlist(items);
        syncStoredWishlistIds(
          effectiveUserId,
          items.map((item) => item.propertyId)
        );
      } catch (err) {
        console.error("Error loading user wishlist:", err);
      } finally {
        if (showLoader) setIsLoading(false);
      }
    },
    [effectiveUserId]
  );

  useEffect(() => {
    loadWishlist(true);
  }, [loadWishlist]);

  const loadCatalogProjects = useCallback(async () => {
    if (catalogProjects.length > 0) return;
    try {
      setIsLoadingCatalog(true);
      const baseUrl = (
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "https://api.dpremiumhomes.com/api"
      ).replace(/\/+$/, "");

      const res = await fetch(`${baseUrl}/projects`, {
        method: "GET",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (!res.ok) return;
      const json = await res.json();
      const list = Array.isArray(json)
        ? json
        : json?.projects || json?.data || [];

      if (Array.isArray(list)) {
        const mapped: CatalogProjectOption[] = list
          .filter((p: any) => Boolean(p?.name || p?.title))
          .map((p: any) => {
            let img: string | undefined = p.image || p.featured_image || undefined;
            if (img && !img.startsWith("http") && !img.startsWith("/")) {
              img = `https://thepremiumhomesltd.com/TPHL-ERP/public/uploads/projects/${img.replace(/^\/+/, "")}`;
            }

            const rawLocation =
              (typeof p.location === "string" && p.location.trim()) ||
              (typeof p.project_map_location === "string" && p.project_map_location.trim()) ||
              (typeof p.community?.name === "string" && p.community.name.trim()) ||
              undefined;

            const rawPct = p.construction_pct ?? p.progress ?? undefined;
            const parsedPct =
              rawPct !== undefined && rawPct !== null && String(rawPct).trim() !== ""
                ? parseAmount(rawPct)
                : undefined;

            const rawHandover =
              p.handover_date || p.handover || p.delivery || p.estimated_date || undefined;

            const formattedPrice = formatDashboardProjectPrice(
              p.price || p.price_range
            );

            return {
              id: String(p.id),
              propertyId: String(p.propertyId || p.id),
              name: p.name || p.title,
              slug: p.slug || undefined,
              location: rawLocation,
              image: img,
              status: p.status || p.project_sale_status || undefined,
              price: formattedPrice || undefined,
              flatSize: p.size || p.flatSize || undefined,
              buildingType: p.building_type || undefined,
              propertyType: p.type || p.types || undefined,
              beds: p.beds || undefined,
              constructionPct: parsedPct,
              handoverDate: rawHandover ? String(rawHandover).trim() : undefined,
            };
          });
        setCatalogProjects(mapped);
      }
    } catch (err) {
      console.error("Error loading catalog projects for wishlist:", err);
    } finally {
      setIsLoadingCatalog(false);
    }
  }, [catalogProjects.length]);

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
    loadCatalogProjects();
  };

  const isPropertyInWishlist = useCallback(
    (propId: string) => {
      const cleanTarget = String(propId).replace(/^prop_/i, "").trim();
      return wishlist.some((w) => {
        const cleanW = String(w.propertyId).replace(/^prop_/i, "").trim();
        return (
          String(w.propertyId) === String(propId) || cleanW === cleanTarget
        );
      });
    },
    [wishlist]
  );

  // DELETE /users/{userId}/wishlist/{propertyId}
  const handleRemoveFromWishlist = async (propertyIdToDelete: string) => {
    if (!effectiveUserId || removingId) return;

    setRemovingId(propertyIdToDelete);
    const cleanTarget = String(propertyIdToDelete).replace(/^prop_/i, "").trim();

    try {
      const result = await removeFromUserWishlist(
        effectiveUserId,
        propertyIdToDelete
      );
      if (!result.success) {
        toast.error(
          result.message || "Could not remove property from wishlist."
        );
        return;
      }

      setWishlist((prev) => {
        const updated = prev.filter((w) => {
          const cleanW = String(w.propertyId).replace(/^prop_/i, "").trim();
          return (
            String(w.propertyId) !== String(propertyIdToDelete) &&
            cleanW !== cleanTarget
          );
        });
        syncStoredWishlistIds(
          effectiveUserId,
          updated.map((w) => w.propertyId)
        );
        return updated;
      });
      toast.success(result.message || "Removed from your wishlist.");
    } finally {
      setRemovingId(null);
    }
  };

  // Toggle Save / Remove inside the Add Property Modal
  const handleToggleCatalogProperty = async (project: CatalogProjectOption) => {
    if (!effectiveUserId || addingId || removingId) return;

    const propId = project.propertyId;
    const alreadySaved = isPropertyInWishlist(propId);

    if (alreadySaved) {
      await handleRemoveFromWishlist(propId);
      return;
    }

    setAddingId(propId);
    try {
      const result = await addToUserWishlist(effectiveUserId, propId);
      if (!result.success) {
        toast.error(result.message || "Could not add property to wishlist.");
        return;
      }

      // Immediately add the item to wishlist state with real project fields only
      const newItem: WishlistPropertyItem = {
        id: `wish-${propId}`,
        propertyId: propId,
        title: project.name,
        slug: project.slug,
        location: project.location,
        image: project.image,
        status: project.status,
        price: project.price,
        flatSize: project.flatSize,
        buildingType: project.buildingType,
        propertyType: project.propertyType,
        beds: project.beds,
        constructionPct: project.constructionPct,
        handoverDate: project.handoverDate,
      };

      setWishlist((prev) => {
        const exists = prev.some(
          (w) =>
            String(w.propertyId).replace(/^prop_/i, "") ===
            String(propId).replace(/^prop_/i, "")
        );
        const nextList = exists ? prev : [newItem, ...prev];
        syncStoredWishlistIds(
          effectiveUserId,
          nextList.map((w) => w.propertyId)
        );
        return nextList;
      });

      toast.success(result.message || "Added to your wishlist.");
      loadWishlist(false);
    } finally {
      setAddingId(null);
    }
  };

  const filteredCatalog = useMemo(() => {
    return catalogProjects.filter((proj) => {
      const matchesSearch =
        !modalSearch.trim() ||
        proj.name.toLowerCase().includes(modalSearch.toLowerCase()) ||
        (proj.location &&
          proj.location.toLowerCase().includes(modalSearch.toLowerCase()));

      if (!matchesSearch) return false;

      const st = (proj.status || "").toLowerCase();
      if (modalFilter === "ongoing") {
        return st.includes("ongoing") || st.includes("construction");
      }
      if (modalFilter === "sold") {
        return st.includes("sold") || st.includes("ready");
      }
      return true;
    });
  }, [catalogProjects, modalSearch, modalFilter]);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-[32px] w-full"
      style={{ fontFamily: "'Vazirmatn', sans-serif" }}
    >
      {/* ========================================================= */}
      {/* 1. HEADER SECTION                                         */}
      {/* ========================================================= */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full"
      >
        <div className="flex flex-col gap-[12px] items-start">
          <div className="flex items-center gap-3">
            <h1 className="capitalize font-serif font-semibold leading-[1.1] text-[#054b3c] text-[24px] sm:text-[28px]">
              Wishlist
            </h1>
            {!isLoading && (
              <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-white text-[#054b3c] text-xs font-semibold shadow-2xs">
                {wishlist.length} {wishlist.length === 1 ? "Property" : "Properties"}
              </span>
            )}
          </div>
          <p className="text-[16px] font-normal leading-none text-[#3b3e40]">
            Your saved luxury flats and residential developments.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 h-[42px] px-[24px] rounded-[40px] bg-[#054b3c] hover:bg-[#043d30] text-white text-[13px] font-medium tracking-[1px] uppercase transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Property</span>
        </button>
      </motion.div>

      {/* ========================================================= */}
      {/* 2. WISHLIST CARDS GRID (Strictly Real API Data Only)      */}
      {/* ========================================================= */}
      <motion.div variants={itemVariants} className="w-full">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px] w-full">
            {[1, 2, 3].map((n) => (
              <div
                key={`wishlist-skeleton-${n}`}
                className="bg-white rounded-[16px] p-[16px] flex flex-col gap-[16px]"
              >
                <div className="h-[177.5px] w-full rounded-[8px] bg-stone-200 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-5 w-3/4 bg-stone-200 rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-stone-100 rounded animate-pulse" />
                </div>
                <div className="h-px w-full bg-[#f1f2f6]" />
                <div className="h-10 w-full bg-stone-100 rounded animate-pulse" />
                <div className="h-5 w-1/3 bg-stone-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : wishlist.length === 0 ? (
          <div className="bg-white rounded-[16px] p-10 sm:p-14 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-[#f1f6f5] flex items-center justify-center text-[#054b3c] mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#054b3c]">
              No Saved Properties in Wishlist
            </h3>
            <p className="text-xs sm:text-sm text-[#59657b] mt-1.5 max-w-md leading-relaxed">
              You haven&apos;t added any flats or developments to your wishlist yet.
              Save your favorite properties from any project page or add them here.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#054b3c] hover:bg-[#043d30] text-white text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>ADD PROPERTY</span>
              </button>
              <Link
                href="/projects"
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#f1f6f5] hover:bg-[#e3ecea] text-[#054b3c] text-xs font-semibold uppercase tracking-wider transition-all"
              >
                <span>EXPLORE ALL PROJECTS</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px] w-full">
            <AnimatePresence mode="popLayout">
              {wishlist.map((item, idx) => {
                const isRemoving = removingId === item.propertyId;
                const hasConstructionPct =
                  item.constructionPct !== undefined && item.constructionPct !== null;
                const progressPct = hasConstructionPct
                  ? Math.min(100, Math.max(0, Number(item.constructionPct)))
                  : null;

                // Collect real API specs to show when construction/handover are not present
                const specPairs: { label: string; value: string }[] = [];
                if (progressPct !== null) {
                  specPairs.push({
                    label: "Construction",
                    value: `${progressPct}% complete`,
                  });
                }
                if (item.handoverDate) {
                  specPairs.push({
                    label: "Handover",
                    value: item.handoverDate,
                  });
                }
                if (specPairs.length < 2 && item.flatSize) {
                  specPairs.push({
                    label: "Size",
                    value: item.flatSize,
                  });
                }
                if (specPairs.length < 2 && item.buildingType) {
                  specPairs.push({
                    label: "Building",
                    value: item.buildingType,
                  });
                }
                if (specPairs.length < 2 && item.propertyType) {
                  specPairs.push({
                    label: "Type",
                    value: item.propertyType,
                  });
                }

                return (
                  <motion.div
                    key={item.id || item.propertyId}
                    layout
                    initial={{ opacity: 0, y: 16, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    whileHover={{ y: -4, transition: { duration: 0.22 } }}
                    className="bg-white flex flex-col gap-[16px] items-start p-[16px] relative rounded-[16px] group transition-shadow hover:shadow-[0_12px_32px_rgba(5,75,60,0.08)]"
                  >
                    {/* Project Image */}
                    <div className="h-[177.5px] relative rounded-[8px] overflow-hidden shrink-0 w-full bg-stone-100 flex items-center justify-center">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover object-center rounded-[8px] group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <Building2 className="w-10 h-10 text-stone-300" />
                      )}
                    </div>

                    {/* Top-Left Status Badge (Only if status exists in API) */}
                    {(item.status || item.flatNo) && (
                      <div className="absolute left-[28px] top-[28px] z-10 flex items-center gap-1.5 flex-wrap">
                        {item.status && (
                          <div className="bg-[#f9f0e2] border border-[#f5e5cc] flex items-center justify-center px-[8px] py-[5px] rounded-full">
                            <span className="text-[12px] font-normal leading-[14px] text-[#8a621e] whitespace-nowrap">
                              {item.status}
                            </span>
                          </div>
                        )}
                        {item.flatNo && (
                          <div className="bg-white/95 border border-[#f1f2f6] flex items-center justify-center px-[8px] py-[5px] rounded-full">
                            <span className="text-[12px] font-medium leading-[14px] text-[#054b3c] whitespace-nowrap">
                              Unit {item.flatNo}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Top-Right Favourite Heart Button (DELETE /users/{userId}/wishlist/{propertyId}) */}
                    <motion.button
                      type="button"
                      whileTap={{ scale: 0.85 }}
                      onClick={() => handleRemoveFromWishlist(item.propertyId)}
                      disabled={isRemoving}
                      title="Remove from Wishlist"
                      aria-label="Remove from Wishlist"
                      className="absolute bg-white flex items-center justify-center p-[8px] right-[28px] top-[28px] rounded-full z-10 w-[32px] h-[32px] transition-transform hover:scale-105 shadow-xs cursor-pointer disabled:opacity-60"
                    >
                      {isRemoving ? (
                        <Loader2 className="w-[15px] h-[15px] animate-spin text-[#f04438]" />
                      ) : (
                        <FavouriteHeartIcon
                          filled
                          className="w-[16px] h-[16px] text-[#f04438]"
                        />
                      )}
                    </motion.button>

                    {/* Project Info Container */}
                    <div className="flex flex-col gap-[16px] items-start w-full flex-1 justify-between">
                      {/* Title + Location */}
                      <div className="flex flex-col gap-[5px] items-start w-full">
                        <h3 className="text-[18px] font-semibold leading-none text-[#054b3c] w-full truncate">
                          {item.title}
                        </h3>
                        {item.location && (
                          <div className="flex gap-[4px] items-center w-full">
                            <LocationPinIcon className="w-[18px] h-[18px] text-[#59657b] shrink-0" />
                            <p className="text-[14px] font-normal leading-[18px] text-[#59657b] truncate">
                              {item.location}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Real API Specs / Progress Section (Only if present) */}
                      {specPairs.length > 0 && (
                        <>
                          <div className="bg-[#f1f2f6] h-px w-full" />

                          <div className="flex flex-col gap-[8px] items-start w-full">
                            <div className="flex items-center justify-between leading-[18px] w-full">
                              {specPairs.slice(0, 2).map((spec) => (
                                <div
                                  key={spec.label}
                                  className="flex flex-col gap-[2px] items-start"
                                >
                                  <span className="text-[12px] font-normal text-[#59657b] uppercase">
                                    {spec.label}
                                  </span>
                                  <span className="text-[14px] font-medium text-[#232f43]">
                                    {spec.value}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {progressPct !== null && (
                              <div className="bg-[#f1f2f6] h-[8px] rounded-[99px] w-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${progressPct}%` }}
                                  transition={{
                                    duration: 0.9,
                                    delay: 0.1 + idx * 0.06,
                                    ease: EASE_OUT_EXPO,
                                  }}
                                  className="bg-[#d8a44d] h-[8px] rounded-[99px]"
                                />
                              </div>
                            )}
                          </div>
                        </>
                      )}

                      {/* Bottom Price & View Project Row */}
                      {(item.price || item.slug) && (
                        <>
                          {specPairs.length === 0 && (
                            <div className="bg-[#f1f2f6] h-px w-full" />
                          )}
                          <div className="flex items-center justify-between gap-3 w-full">
                            <p className="text-[16px] font-bold leading-[20px] text-[#232f43] truncate min-w-0">
                              {item.price || ""}
                            </p>
                            {item.slug && (
                              <Link
                                href={`/projects/${item.slug}`}
                                className="group/btn inline-flex items-center gap-[4px] shrink-0 whitespace-nowrap text-[14px] font-medium leading-[20px] text-[#005d4d] hover:text-[#054b3c] transition-colors ml-auto"
                              >
                                <span>View Project</span>
                                <ChevronRight className="w-[16px] h-[16px] text-[#005d4d] transition-transform duration-300 group-hover/btn:translate-x-1" />
                              </Link>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* ========================================================= */}
      {/* 3. MODAL: ADD PROPERTY TO WISHLIST (Dashboard Pattern)    */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isAddModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsAddModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#f1f6f5] rounded-[24px] max-w-4xl w-full p-5 sm:p-8 shadow-2xl border border-white flex flex-col gap-6 max-h-[88vh]"
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-[2px] text-[#054b3c]">
                    EXPLORE DEVELOPMENTS
                  </span>
                  <h3 className="font-serif text-[24px] sm:text-[28px] font-semibold leading-[1.1] text-[#054b3c]">
                    Add Property to Wishlist
                  </h3>
                  <p className="text-[14px] text-[#546360]">
                    Select any development below to save or remove from your wishlist.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  aria-label="Close modal"
                  className="size-[40px] rounded-full bg-white text-[#054b3c] hover:bg-[#054b3c] hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-2xs"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search & Status Filter Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#59657b] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={modalSearch}
                    onChange={(e) => setModalSearch(e.target.value)}
                    placeholder="Search by project name or location..."
                    className="w-full h-[42px] pl-10 pr-4 rounded-full bg-white border border-[#eaecf0] text-[14px] text-[#101828] placeholder:text-[#667085] focus:outline-none focus:border-[#054b3c] transition-colors"
                  />
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                  {(
                    [
                      { id: "all", label: "All Projects" },
                      { id: "ongoing", label: "Ongoing" },
                      { id: "sold", label: "Sold Out" },
                    ] as const
                  ).map((tab) => {
                    const active = modalFilter === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setModalFilter(tab.id)}
                        className={cn(
                          "h-[40px] px-[18px] rounded-[40px] text-[12px] font-medium uppercase tracking-[1px] whitespace-nowrap transition-colors cursor-pointer",
                          active
                            ? "bg-[#054b3c] text-white"
                            : "bg-white text-[#054b3c] hover:bg-[#054b3c]/5"
                        )}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2-Column Property Card Grid */}
              <div className="overflow-y-auto flex-1 pr-1 -mr-1">
                {isLoadingCatalog ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
                    {[1, 2, 3, 4].map((n) => (
                      <div
                        key={`modal-skeleton-${n}`}
                        className="bg-white rounded-[16px] p-[14px] flex flex-col gap-[12px]"
                      >
                        <div className="h-[148px] w-full rounded-[10px] bg-stone-200 animate-pulse" />
                        <div className="h-4 w-2/3 bg-stone-200 rounded animate-pulse" />
                        <div className="h-3.5 w-1/2 bg-stone-100 rounded animate-pulse" />
                        <div className="h-px w-full bg-[#f1f2f6]" />
                        <div className="h-8 w-full bg-stone-100 rounded-full animate-pulse" />
                      </div>
                    ))}
                  </div>
                ) : filteredCatalog.length === 0 ? (
                  <div className="bg-white rounded-[16px] py-12 px-6 text-center text-[#59657b]">
                    <Building2 className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                    <p className="text-sm font-medium text-[#232f43]">
                      No matching properties found.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
                    {filteredCatalog.map((proj) => {
                      const alreadySaved = isPropertyInWishlist(proj.propertyId);
                      const isBusy =
                        addingId === proj.propertyId ||
                        removingId === proj.propertyId;

                      return (
                        <div
                          key={proj.id}
                          className="bg-white rounded-[16px] p-[14px] flex flex-col gap-[12px] relative group transition-shadow hover:shadow-[0_10px_28px_rgba(5,75,60,0.08)]"
                        >
                          {/* Image */}
                          <div className="h-[148px] relative rounded-[10px] overflow-hidden w-full bg-stone-100 shrink-0 flex items-center justify-center">
                            {proj.image ? (
                              <Image
                                src={proj.image}
                                alt={proj.name}
                                fill
                                sizes="(max-width: 640px) 100vw, 50vw"
                                className="object-cover object-center rounded-[10px] group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <Building2 className="w-8 h-8 text-stone-300" />
                            )}
                          </div>

                          {/* Status Badge */}
                          {proj.status && (
                            <div className="absolute left-[24px] top-[24px] z-10">
                              <div className="bg-[#f9f0e2] border border-[#f5e5cc] flex items-center justify-center px-[8px] py-[4px] rounded-full">
                                <span className="text-[11px] font-normal leading-[14px] text-[#8a621e] whitespace-nowrap">
                                  {proj.status}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Top-Right Quick Heart */}
                          <button
                            type="button"
                            onClick={() => handleToggleCatalogProperty(proj)}
                            disabled={isBusy}
                            aria-label={
                              alreadySaved
                                ? "Remove from Wishlist"
                                : "Add to Wishlist"
                            }
                            className="absolute right-[24px] top-[24px] z-10 size-[32px] rounded-full bg-white flex items-center justify-center shadow-xs transition-transform hover:scale-105 cursor-pointer disabled:opacity-60"
                          >
                            {isBusy ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-[#054b3c]" />
                            ) : (
                              <FavouriteHeartIcon
                                filled={alreadySaved}
                                className={cn(
                                  "w-[16px] h-[16px] transition-colors",
                                  alreadySaved
                                    ? "text-[#f04438]"
                                    : "text-[#232f43]"
                                )}
                              />
                            )}
                          </button>

                          {/* Title & Location */}
                          <div className="flex flex-col gap-[4px] items-start w-full">
                            <h4 className="text-[16px] font-semibold leading-[20px] text-[#054b3c] w-full truncate">
                              {proj.name}
                            </h4>
                            {proj.location && (
                              <div className="flex gap-[4px] items-center w-full">
                                <LocationPinIcon className="w-[16px] h-[16px] text-[#59657b] shrink-0" />
                                <p className="text-[13px] font-normal leading-[18px] text-[#59657b] truncate">
                                  {proj.location}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="bg-[#f1f2f6] h-px w-full" />

                          {/* Price & Action Button */}
                          <div className="flex items-center justify-between gap-2 w-full">
                            <p className="text-[15px] font-bold leading-[20px] text-[#232f43] truncate min-w-0">
                              {proj.price || ""}
                            </p>

                            <button
                              type="button"
                              onClick={() => handleToggleCatalogProperty(proj)}
                              disabled={isBusy}
                              className={cn(
                                "inline-flex items-center gap-1.5 h-[36px] px-4 rounded-full text-[12px] font-medium transition-all cursor-pointer shrink-0 disabled:opacity-60 ml-auto",
                                alreadySaved
                                  ? "bg-[#eaf0ef] text-[#054b3c] hover:bg-[#ffe8e8] hover:text-[#bf2318]"
                                  : "bg-[#054b3c] hover:bg-[#043d30] text-white"
                              )}
                            >
                              {isBusy ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : alreadySaved ? (
                                <Check className="w-3.5 h-3.5" />
                              ) : (
                                <Plus className="w-3.5 h-3.5" />
                              )}
                              <span>{alreadySaved ? "Saved" : "Add to Wishlist"}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
