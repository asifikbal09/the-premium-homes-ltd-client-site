"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { toast } from "sonner";
import {
  Save,
  Loader2,
  TrendingUp,
  ImageIcon,
  Users,
  Plus,
  Trash2,
  Upload,
  X,
  AlertTriangle,
  RotateCcw,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface PartnerItem {
  id: number;
  name?: string | null;
  image?: string;
  image_path?: string;
  order?: number;
}

export interface StatisticsData {
  happy_clients: string;
  average_rating: string;
  satisfaction_rate: string;
  ongoing_projects: string;
}

export function AboutPageTab() {
  const { authFetch } = useAdminAuth();

  // Loading state
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Hero image states
  const [currentHeroImage, setCurrentHeroImage] = useState<string>("");
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [heroImagePreview, setHeroImagePreview] = useState<string | null>(null);
  const heroFileInputRef = useRef<HTMLInputElement>(null);

  // Statistics form states
  const [statistics, setStatistics] = useState<StatisticsData>({
    happy_clients: "1200+",
    average_rating: "4.9/5",
    satisfaction_rate: "98%",
    ongoing_projects: "52+",
  });

  // Partners list
  const [partners, setPartners] = useState<PartnerItem[]>([]);

  // Add Partner Modal state
  const [isAddPartnerOpen, setIsAddPartnerOpen] = useState(false);
  const [newPartnerName, setNewPartnerName] = useState("");
  const [newPartnerFile, setNewPartnerFile] = useState<File | null>(null);
  const [newPartnerPreview, setNewPartnerPreview] = useState<string | null>(null);
  const [isAddingPartner, setIsAddingPartner] = useState(false);
  const partnerFileInputRef = useRef<HTMLInputElement>(null);

  // Delete Partner Modal state
  const [partnerToDelete, setPartnerToDelete] = useState<PartnerItem | null>(null);
  const [isDeletingPartner, setIsDeletingPartner] = useState(false);

  const getBaseUrl = () => {
    return (
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.API_BASE_URL ||
      "https://api.dpremiumhomes.com/api"
    ).replace(/\/+$/, "");
  };

  // 1. FETCH ABOUT CONFIGURATION
  const fetchAboutConfig = useCallback(async () => {
    try {
      setLoading(true);
      const baseUrl = getBaseUrl();

      // The backend route is /about-settings (or /admin/about-settings)
      let res = await authFetch(`${baseUrl}/about-settings`, {
        method: "GET",
      });

      if (!res.ok) {
        res = await authFetch(`${baseUrl}/admin/about-settings`, {
          method: "GET",
        });
      }

      if (res.ok) {
        const json = await res.json().catch(() => null);
        const settings = json?.settings || json?.data || json || {};

        // Hero Image
        if (settings.hero_image) {
          setCurrentHeroImage(settings.hero_image);
        }

        // Statistics
        setStatistics({
          happy_clients:
            settings.stats_clients ||
            settings.happy_clients ||
            "1200+",
          average_rating:
            settings.stats_rating ||
            settings.average_rating ||
            "4.9/5",
          satisfaction_rate:
            settings.stats_satisfaction ||
            settings.satisfaction_rate ||
            "98%",
          ongoing_projects:
            settings.stats_projects ||
            settings.ongoing_projects ||
            "52+",
        });

        // Partners
        const partnerList: PartnerItem[] = Array.isArray(json?.partners)
          ? json.partners
          : Array.isArray(settings?.partners)
          ? settings.partners
          : Array.isArray(json?.data?.partners)
          ? json.data.partners
          : [];
        setPartners(partnerList);
      } else {
        toast.error("Failed to load About page configuration");
      }
    } catch (err: any) {
      console.error("Error fetching about config:", err);
      toast.error(err?.message || "Network error loading configuration");
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    fetchAboutConfig();
  }, [fetchAboutConfig]);

  // Handle Hero Image selection
  const handleHeroImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size exceeds 10MB limit");
      return;
    }

    setHeroImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setHeroImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRevertHeroImage = () => {
    setHeroImageFile(null);
    setHeroImagePreview(null);
    if (heroFileInputRef.current) {
      heroFileInputRef.current.value = "";
    }
  };

  // 2. SAVE ALL CHANGES
  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      const baseUrl = getBaseUrl();

      const formData = new FormData();
      if (heroImageFile) {
        formData.append("hero_image", heroImageFile);
      }

      formData.append("stats_clients", statistics.happy_clients.trim());
      formData.append("stats_rating", statistics.average_rating.trim());
      formData.append("stats_satisfaction", statistics.satisfaction_rate.trim());
      formData.append("stats_projects", statistics.ongoing_projects.trim());

      let res = await authFetch(`${baseUrl}/admin/about-settings`, {
        method: "POST",
        body: formData,
      });

      const json = await res.json().catch(() => null);

      if (res.ok && json?.success !== false) {
        toast.success(
          json?.message || "About page configuration updated successfully"
        );
        if (json?.settings?.hero_image) {
          setCurrentHeroImage(json.settings.hero_image);
        } else if (heroImagePreview) {
          setCurrentHeroImage(heroImagePreview);
        }
        setHeroImageFile(null);
        setHeroImagePreview(null);
      } else {
        toast.error(json?.message || "Failed to update About configuration");
      }
    } catch (err: any) {
      console.error("Error saving about configuration:", err);
      toast.error(err?.message || "Network error saving configuration");
    } finally {
      setIsSaving(false);
    }
  };

  // 3. ADD NEW PARTNER LOGO
  const handlePartnerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Logo file size must be less than 5MB");
      return;
    }

    setNewPartnerFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewPartnerPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAddPartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartnerFile) {
      toast.error("Please choose a partner logo image");
      return;
    }

    try {
      setIsAddingPartner(true);
      const baseUrl = getBaseUrl();

      const formData = new FormData();
      formData.append("new_partners[]", newPartnerFile);

      const res = await authFetch(`${baseUrl}/admin/about-settings`, {
        method: "POST",
        body: formData,
      });

      const json = await res.json().catch(() => null);

      if (res.ok && json?.success !== false) {
        toast.success(json?.message || "Partner added successfully");
        if (json?.partners && Array.isArray(json.partners)) {
          setPartners(json.partners);
        } else {
          fetchAboutConfig();
        }
        // Reset modal state
        setIsAddPartnerOpen(false);
        setNewPartnerFile(null);
        setNewPartnerPreview(null);
        setNewPartnerName("");
      } else {
        toast.error(json?.message || "Failed to add partner");
      }
    } catch (err: any) {
      console.error("Error adding partner:", err);
      toast.error(err?.message || "Network error adding partner");
    } finally {
      setIsAddingPartner(false);
    }
  };

  // 4. DELETE PARTNER LOGO
  const handleConfirmDeletePartner = async () => {
    if (!partnerToDelete) return;

    try {
      setIsDeletingPartner(true);
      const baseUrl = getBaseUrl();

      const formData = new FormData();
      formData.append("partners_delete", JSON.stringify([partnerToDelete.id]));

      const res = await authFetch(
        `${baseUrl}/admin/about-settings`,
        {
          method: "POST",
          body: formData,
        }
      );

      const json = await res.json().catch(() => null);

      if (res.ok && json?.success !== false) {
        toast.success(json?.message || "Partner removed successfully");
        if (json?.partners && Array.isArray(json.partners)) {
          setPartners(json.partners);
        } else {
          setPartners((prev) => prev.filter((p) => p.id !== partnerToDelete.id));
        }
        setPartnerToDelete(null);
      } else {
        toast.error(json?.message || "Failed to remove partner");
      }
    } catch (err: any) {
      console.error("Error deleting partner:", err);
      toast.error(err?.message || "Network error removing partner");
    } finally {
      setIsDeletingPartner(false);
    }
  };

  const displayedHeroImage = heroImagePreview || currentHeroImage;

  return (
    <div className="w-full space-y-6 font-sans font-normal animate-in fade-in duration-200">
      {/* Top Header with Save Changes Button (Matches Screenshot) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
            About Page Configuration
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-normal mt-0.5">
            Manage the Hero Image, Statistics, and Partners
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveChanges}
          disabled={isSaving || loading}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#044133] hover:bg-[#033328] text-white text-xs sm:text-sm font-medium transition-colors cursor-pointer shadow-xs disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      {loading ? (
        <div className="py-24 text-center text-stone-400 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#044133]" />
          <span className="text-xs font-normal">Loading About configuration...</span>
        </div>
      ) : (
        /* Main Grid Layout: Left Panel (Hero + Stats) | Right Panel (Partners) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Hero Image + Statistics Cards */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Hero Image Card */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
                  <ImageIcon className="w-4 h-4 text-emerald-700" />
                  <span>Hero Image</span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    ref={heroFileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    onChange={handleHeroImageChange}
                    className="hidden"
                    id="hero-image-file-input"
                  />
                  <label
                    htmlFor="hero-image-file-input"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-normal cursor-pointer transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-stone-500" />
                    <span>Change Image</span>
                  </label>

                  {heroImagePreview && (
                    <button
                      type="button"
                      onClick={handleRevertHeroImage}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-stone-200 text-stone-600 hover:text-stone-900 text-xs font-normal hover:bg-stone-50 transition-colors cursor-pointer"
                      title="Revert to current image"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Revert</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Hero Image Container */}
              <div className="relative w-full h-[280px] sm:h-[340px] md:h-[380px] rounded-xl overflow-hidden border border-stone-200 bg-stone-100 group">
                {displayedHeroImage ? (
                  <Image
                    src={displayedHeroImage}
                    alt="About Hero Image"
                    fill
                    className="object-cover"
                    unoptimized
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 gap-2">
                    <ImageIcon className="w-10 h-10 text-stone-300" />
                    <span className="text-xs">No hero image uploaded</span>
                  </div>
                )}

                {/* Hover overlay allowing click to upload */}
                <label
                  htmlFor="hero-image-file-input"
                  className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100"
                >
                  <span className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-black/75 text-white text-xs font-normal backdrop-blur-2xs shadow-md">
                    <Upload className="w-3.5 h-3.5" />
                    Click to select new image
                  </span>
                </label>

                {heroImagePreview && (
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-amber-500/90 text-white text-[11px] font-medium backdrop-blur-2xs">
                    Pending Save
                  </div>
                )}
              </div>

              {/* Subtext matching screenshot */}
              <p className="text-[11px] text-stone-400 font-normal">
                Recommended resolution: 1920x1080px
              </p>
            </div>

            {/* 2. Statistics Cards */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
                <TrendingUp className="w-4 h-4 text-emerald-700" />
                <span>Statistics Cards</span>
              </div>

              {/* 2x2 Grid of Stat Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Happy Clients */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-normal text-stone-700">
                    Happy Clients
                  </label>
                  <input
                    type="text"
                    value={statistics.happy_clients}
                    onChange={(e) =>
                      setStatistics((prev) => ({
                        ...prev,
                        happy_clients: e.target.value,
                      }))
                    }
                    placeholder="e.g. 1200+"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#044133] focus:ring-1 focus:ring-[#044133] font-normal"
                  />
                </div>

                {/* Average Rating */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-normal text-stone-700">
                    Average Rating
                  </label>
                  <input
                    type="text"
                    value={statistics.average_rating}
                    onChange={(e) =>
                      setStatistics((prev) => ({
                        ...prev,
                        average_rating: e.target.value,
                      }))
                    }
                    placeholder="e.g. 4.9/5"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#044133] focus:ring-1 focus:ring-[#044133] font-normal"
                  />
                </div>

                {/* Satisfaction Rate */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-normal text-stone-700">
                    Satisfaction Rate
                  </label>
                  <input
                    type="text"
                    value={statistics.satisfaction_rate}
                    onChange={(e) =>
                      setStatistics((prev) => ({
                        ...prev,
                        satisfaction_rate: e.target.value,
                      }))
                    }
                    placeholder="e.g. 98%"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#044133] focus:ring-1 focus:ring-[#044133] font-normal"
                  />
                </div>

                {/* Ongoing Projects */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-normal text-stone-700">
                    Ongoing Projects
                  </label>
                  <input
                    type="text"
                    value={statistics.ongoing_projects}
                    onChange={(e) =>
                      setStatistics((prev) => ({
                        ...prev,
                        ongoing_projects: e.target.value,
                      }))
                    }
                    placeholder="e.g. 52+"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#044133] focus:ring-1 focus:ring-[#044133] font-normal"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Partners / Suppliers Card */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-4">
              {/* Header with + Add Image button (Matches Screenshot) */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
                  <Users className="w-4 h-4 text-emerald-700" />
                  <span>Partners / Suppliers</span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddPartnerOpen(true)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200/70 text-stone-700 text-xs font-normal transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-stone-500" />
                  <span>Add Image</span>
                </button>
              </div>

              {/* Partners list container (scrollable) */}
              <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
                {partners.length === 0 ? (
                  <div className="py-16 text-center text-stone-400 flex flex-col items-center justify-center gap-2">
                    <Users className="w-8 h-8 text-stone-300" />
                    <span className="text-xs font-normal">
                      No partners added yet
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAddPartnerOpen(true)}
                      className="mt-2 text-xs text-[#044133] hover:underline cursor-pointer"
                    >
                      + Add first partner logo
                    </button>
                  </div>
                ) : (
                  partners.map((partner) => (
                    <div
                      key={partner.id}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-stone-200 bg-white hover:border-stone-300 hover:shadow-2xs transition-all"
                    >
                      {/* Logo container */}
                      <div className="relative w-36 h-14 flex items-center justify-center overflow-hidden">
                        <Image
                          src={partner.image_path || partner.image || ""}
                          alt={partner.name || `Partner ${partner.id}`}
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>

                      {/* Delete icon button (Matches Screenshot) */}
                      <button
                        type="button"
                        onClick={() => setPartnerToDelete(partner)}
                        className="p-2 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Remove partner logo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD PARTNER LOGO */}
      {isAddPartnerOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-stone-200 shadow-xl space-y-4 font-normal">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="text-base text-stone-900 font-semibold">
                Add Partner / Supplier Logo
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsAddPartnerOpen(false);
                  setNewPartnerFile(null);
                  setNewPartnerPreview(null);
                  setNewPartnerName("");
                }}
                className="p-1 text-stone-400 hover:text-stone-700 rounded-md cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPartnerSubmit} className="space-y-4">
              {/* Partner Name (Optional) */}
              <div>
                <label className="block text-xs text-stone-600 font-normal mb-1.5">
                  Partner / Company Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. BSRM, Shah Cement"
                  value={newPartnerName}
                  onChange={(e) => setNewPartnerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#044133] focus:ring-1 focus:ring-[#044133] font-normal"
                />
              </div>

              {/* Logo Image File Upload */}
              <div>
                <label className="block text-xs text-stone-600 font-normal mb-1.5">
                  Logo Image <span className="text-rose-500">*</span>
                </label>
                <input
                  ref={partnerFileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp"
                  onChange={handlePartnerImageChange}
                  className="hidden"
                  id="new-partner-image-input"
                />

                {!newPartnerPreview ? (
                  <label
                    htmlFor="new-partner-image-input"
                    className="flex flex-col items-center justify-center p-6 border border-dashed border-stone-300 rounded-xl bg-stone-50/50 hover:bg-stone-50 cursor-pointer transition-colors text-center group"
                  >
                    <Upload className="w-6 h-6 text-stone-400 group-hover:text-[#044133] transition-colors mb-1.5" />
                    <span className="text-xs text-stone-700 font-normal">
                      Click to choose partner logo
                    </span>
                    <span className="text-[10px] text-stone-400 mt-0.5">
                      PNG, JPG, SVG, WebP up to 5MB
                    </span>
                  </label>
                ) : (
                  <div className="relative p-3 rounded-xl border border-stone-200 bg-[#fcfbf9] flex items-center justify-between">
                    <div className="relative w-28 h-12 bg-white rounded-lg border border-stone-200 overflow-hidden flex items-center justify-center">
                      <Image
                        src={newPartnerPreview}
                        alt="Preview"
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setNewPartnerFile(null);
                        setNewPartnerPreview(null);
                        if (partnerFileInputRef.current) {
                          partnerFileInputRef.current.value = "";
                        }
                      }}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddPartnerOpen(false);
                    setNewPartnerFile(null);
                    setNewPartnerPreview(null);
                    setNewPartnerName("");
                  }}
                  disabled={isAddingPartner}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-700 hover:bg-stone-50 transition-colors font-normal cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAddingPartner || !newPartnerFile}
                  className="flex-1 py-2.5 rounded-xl bg-[#044133] hover:bg-[#033328] text-white text-xs font-normal transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isAddingPartner ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Add Partner</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DELETE CONFIRMATION */}
      {partnerToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-stone-200 shadow-xl space-y-4 font-normal">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base text-stone-900 font-semibold">
                Remove Partner Logo?
              </h3>
              <p className="text-xs text-stone-500 font-normal">
                Are you sure you want to remove &quot;
                {partnerToDelete.name || "this partner"}&quot; from the suppliers
                list?
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setPartnerToDelete(null)}
                disabled={isDeletingPartner}
                className="flex-1 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-700 hover:bg-stone-50 transition-colors font-normal cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeletePartner}
                disabled={isDeletingPartner}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-normal transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isDeletingPartner ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
