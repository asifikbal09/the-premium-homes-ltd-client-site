"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ArrowLeft,
  UploadCloud,
  Save,
  Loader2,
  RefreshCw,
  ImageIcon,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface SliderItem {
  id: number;
  title: string;
  subtitle?: string;
  image: string;
  type: string; // 'Image' | 'Video'
  link?: string;
  order?: number;
  status?: string;
}

const EMPTY_FORM: Omit<SliderItem, "id"> = {
  title: "",
  subtitle: "",
  image: "",
  type: "Image",
  link: "",
  order: 1,
};

export function SlidersTab() {
  const { authFetch } = useAdminAuth();

  // View state: 'list' | 'create' | 'edit'
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [sliders, setSliders] = useState<SliderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState<Omit<SliderItem, "id">>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Delete modal state
  const [sliderToDelete, setSliderToDelete] = useState<SliderItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const getBaseUrl = () => {
    return (
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://api.dpremiumhomes.com/api"
    ).replace(/\/+$/, "");
  };

  // 1. FETCH SLIDERS LIST
  const fetchSliders = useCallback(async () => {
    try {
      setLoading(true);
      const baseUrl = getBaseUrl();
      const res = await authFetch(`${baseUrl}/sliders`, { method: "GET" });
      if (res.ok) {
        const data = await res.json().catch(() => null);
        const list: SliderItem[] = Array.isArray(data)
          ? data
          : data?.slides || data?.sliders || data?.data || [];
        setSliders(list);
      } else {
        toast.error("Failed to fetch sliders list");
      }
    } catch (err: any) {
      console.error("Error fetching sliders:", err);
      toast.error(err?.message || "Network error loading sliders");
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    fetchSliders();
  }, [fetchSliders]);

  // 2. IMAGE UPLOAD HANDLER
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const baseUrl = getBaseUrl();
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      uploadFormData.append("folder", "premium-homes-assets");

      const res = await authFetch(`${baseUrl}/upload`, {
        method: "POST",
        body: uploadFormData,
      });

      const data = await res.json().catch(() => null);
      if (res.ok && data?.url) {
        setFormData((prev) => ({ ...prev, image: data.url }));
        toast.success("Media uploaded successfully!");
      } else {
        toast.error(data?.message || "Failed to upload media");
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error(err?.message || "Network error during media upload");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Open Create Mode
  const handleOpenCreate = () => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setView("create");
  };

  // Open Edit Mode
  const handleOpenEdit = (slider: SliderItem) => {
    setFormData({
      title: slider.title || "",
      subtitle: slider.subtitle || "",
      image: slider.image || "",
      type: slider.type || "Image",
      link: slider.link || "",
      order: slider.order || 1,
    });
    setEditingId(slider.id);
    setView("edit");
  };

  // 3. CREATE & UPDATE SUBMISSION
  const handleSubmitSlider = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image.trim()) {
      toast.error("Please upload or enter a slider image");
      return;
    }

    try {
      setIsSubmitting(true);
      const baseUrl = getBaseUrl();

      const url =
        view === "edit" && editingId
          ? `${baseUrl}/sliders/${editingId}`
          : `${baseUrl}/sliders`;

      const method = view === "edit" ? "PUT" : "POST";

      const res = await authFetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => null);

      if (res.ok) {
        toast.success(
          data?.message ||
            (view === "edit"
              ? "Slider updated successfully!"
              : "Slider created successfully!")
        );
        setView("list");
        fetchSliders();
      } else {
        toast.error(data?.message || "Failed to save slider");
      }
    } catch (err: any) {
      console.error("Submit slider error:", err);
      toast.error(err?.message || "Network error while saving slider");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. DELETE SLIDER
  const handleConfirmDelete = async () => {
    if (!sliderToDelete) return;
    try {
      setIsDeleting(true);
      const baseUrl = getBaseUrl();
      const res = await authFetch(`${baseUrl}/sliders/${sliderToDelete.id}`, {
        method: "DELETE",
      });

      const data = await res.json().catch(() => null);
      if (res.ok) {
        toast.success(data?.message || "Slider deleted successfully");
        setSliders((prev) => prev.filter((s) => s.id !== sliderToDelete.id));
        setSliderToDelete(null);
      } else {
        toast.error(data?.message || "Failed to delete slider");
      }
    } catch (err: any) {
      console.error("Delete slider error:", err);
      toast.error(err?.message || "Network error deleting slider");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered sliders
  const filteredSliders = sliders.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      (s.title && s.title.toLowerCase().includes(q)) ||
      (s.subtitle && s.subtitle.toLowerCase().includes(q)) ||
      (s.type && s.type.toLowerCase().includes(q)) ||
      String(s.id).includes(q)
    );
  });

  return (
    <div className="w-full space-y-6 font-sans font-normal animate-in fade-in duration-200">
      {/* ========================================================= */}
      {/* 1. LIST VIEW (Matches Screenshot 1)                       */}
      {/* ========================================================= */}
      {view === "list" && (
        <div className="w-full space-y-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl text-stone-900 tracking-tight font-normal">
                Sliders
              </h1>
              <p className="text-xs text-stone-500 mt-1 font-normal">
                {sliders.length} total slides
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={fetchSliders}
                disabled={loading}
                className="p-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                title="Refresh sliders"
              >
                <RefreshCw
                  className={cn("w-4 h-4", loading && "animate-spin text-[#044133]")}
                />
              </button>

              <button
                type="button"
                onClick={handleOpenCreate}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#044133] hover:bg-[#033026] text-white text-xs font-normal transition-colors cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Slider</span>
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="w-full max-w-sm relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search sliders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#044133] focus:ring-1 focus:ring-[#044133] shadow-2xs font-normal"
            />
          </div>

          {/* Table Container */}
          <div className="w-full bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-[#fcfbf9] border-b border-stone-200 text-[11px] uppercase tracking-wider text-stone-500 font-normal">
                  <tr>
                    <th scope="col" className="py-3.5 px-5 font-normal w-32">
                      Media
                    </th>
                    <th scope="col" className="py-3.5 px-5 font-normal">
                      Title
                    </th>
                    <th scope="col" className="py-3.5 px-5 font-normal w-36">
                      Type
                    </th>
                    <th scope="col" className="py-3.5 px-5 font-normal text-right w-28">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-stone-100 font-normal">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-stone-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Loader2 className="w-6 h-6 animate-spin text-[#044133]" />
                          <span>Loading slides...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredSliders.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-stone-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <ImageIcon className="w-8 h-8 text-stone-300" />
                          <span>No sliders found</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredSliders.map((slider) => (
                      <tr
                        key={slider.id}
                        className="hover:bg-[#fbfcfb] transition-colors"
                      >
                        {/* Media Thumbnail */}
                        <td className="py-3 px-5">
                          <div className="relative w-16 h-10 rounded-lg overflow-hidden border border-stone-200 bg-stone-100 shrink-0">
                            {slider.image ? (
                              <Image
                                src={slider.image}
                                alt={slider.title || "Slider media"}
                                fill
                                sizes="64px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-stone-400">
                                <ImageIcon className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Title */}
                        <td className="py-4 px-5 text-stone-900 font-normal">
                          <p className="line-clamp-1 leading-relaxed">
                            {slider.title || "—"}
                          </p>
                          {slider.subtitle && (
                            <p className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">
                              {slider.subtitle}
                            </p>
                          )}
                        </td>

                        {/* Type */}
                        <td className="py-4 px-5 text-stone-600 font-normal">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-normal bg-stone-100 text-stone-700 border border-stone-200/60">
                            {slider.type || "Image"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(slider)}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-[#044133] hover:bg-stone-100 transition-colors cursor-pointer"
                              title="Edit Slider"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setSliderToDelete(slider)}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Delete Slider"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. CREATE / EDIT FORM VIEW (Matches Screenshot 2)         */}
      {/* ========================================================= */}
      {(view === "create" || view === "edit") && (
        <form onSubmit={handleSubmitSlider} className="w-full space-y-6">
          {/* Top Form Header with Back Arrow */}
          <div className="flex items-center gap-3 pb-2 border-b border-stone-200">
            <button
              type="button"
              onClick={() => setView("list")}
              className="p-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 transition-colors cursor-pointer"
              title="Return to list"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl text-stone-900 tracking-tight font-normal">
                {view === "edit" ? "Edit Slider" : "Create New Slider"}
              </h1>
              <p className="text-xs text-stone-500 mt-0.5 font-normal">
                Configure slider content and upload media
              </p>
            </div>
          </div>

          {/* Two-Column Grid: Left (Form fields), Right (Preview) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: Input Fields Card */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs text-stone-700 font-normal mb-1.5">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="e.g. The Premium Lumina"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-[#fbfcfb] text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#044133] focus:bg-white font-normal"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-xs text-stone-700 font-normal mb-1.5">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) =>
                    setFormData({ ...formData, subtitle: e.target.value })
                  }
                  placeholder="e.g. Modern Architecture with Vision"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-[#fbfcfb] text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#044133] focus:bg-white font-normal"
                />
              </div>

              {/* Button Link (URL) */}
              <div>
                <label className="block text-xs text-stone-700 font-normal mb-1.5">
                  Button Link (URL)
                </label>
                <input
                  type="text"
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                  placeholder="/projects/lumina"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-[#fbfcfb] text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#044133] focus:bg-white font-normal font-mono"
                />
              </div>

              {/* Media Type: Radio buttons */}
              <div>
                <label className="block text-xs text-stone-700 font-normal mb-2">
                  Media Type
                </label>
                <div className="flex items-center gap-6">
                  <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-stone-800 font-normal select-none">
                    <input
                      type="radio"
                      name="mediaType"
                      value="Image"
                      checked={formData.type === "Image"}
                      onChange={() =>
                        setFormData({ ...formData, type: "Image" })
                      }
                      className="w-4 h-4 text-[#044133] focus:ring-[#044133] accent-[#044133] cursor-pointer"
                    />
                    <span>Image</span>
                  </label>

                  <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-stone-800 font-normal select-none">
                    <input
                      type="radio"
                      name="mediaType"
                      value="Video"
                      checked={formData.type === "Video"}
                      onChange={() =>
                        setFormData({ ...formData, type: "Video" })
                      }
                      className="w-4 h-4 text-[#044133] focus:ring-[#044133] accent-[#044133] cursor-pointer"
                    />
                    <span>Video</span>
                  </label>
                </div>
              </div>

              {/* Upload Image Dropzone */}
              <div>
                <label className="block text-xs text-stone-700 font-normal mb-1.5">
                  Upload Image
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-32 rounded-xl border-2 border-dashed border-stone-200 hover:border-[#044133] bg-[#fbfcfb] hover:bg-stone-50 transition-colors flex flex-col items-center justify-center cursor-pointer p-4 text-center"
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-[#044133]" />
                      <span className="text-xs text-stone-500 font-normal">
                        Uploading media...
                      </span>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="w-6 h-6 text-stone-400 mb-1" />
                      <span className="text-xs text-stone-600 font-normal">
                        Click to upload image
                      </span>
                      <span className="text-[10px] text-stone-400 font-normal mt-0.5">
                        PNG, JPG, WEBP up to 5MB
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3 border-t border-stone-100">
                <button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#044133] hover:bg-[#033026] text-white text-xs font-normal transition-colors cursor-pointer shadow-sm disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save Slider</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setView("list")}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-xs text-stone-600 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: Live Preview Card (Matches Screenshot 2) */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
                <span className="text-xs text-stone-800 font-normal">
                  Preview
                </span>
                {formData.image && (
                  <span className="text-[11px] text-[#044133] font-normal">
                    Live Viewport
                  </span>
                )}
              </div>

              <div className="w-full min-h-[380px] rounded-xl border border-stone-200/80 bg-[#f7f8f7] overflow-hidden flex items-center justify-center relative p-3">
                {formData.image ? (
                  <div className="relative w-full h-[360px] rounded-lg overflow-hidden group">
                    {/* Media Image (Fully visible with object-contain) */}
                    <Image
                      src={formData.image}
                      alt={formData.title || "Slider preview"}
                      fill
                      sizes="(max-width: 1024px) 100vw, 700px"
                      className="object-contain"
                    />

                    {/* Subtle Overlay Preview if Title or Subtitle provided */}
                    {(formData.title || formData.subtitle || formData.link) && (
                      <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white flex flex-col justify-end">
                        {formData.title && (
                          <h3 className="text-base sm:text-lg font-normal tracking-wide text-white">
                            {formData.title}
                          </h3>
                        )}
                        {formData.subtitle && (
                          <p className="text-xs text-stone-200 font-normal mt-0.5">
                            {formData.subtitle}
                          </p>
                        )}
                        {formData.link && (
                          <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-[#c69a5a] font-normal">
                            <span>Link: {formData.link}</span>
                            <ExternalLink className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 p-8 text-center text-stone-400">
                    <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-stone-300" />
                    </div>
                    <span className="text-xs font-normal text-stone-400">
                      Upload media to see preview
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      )}

      {/* ========================================================= */}
      {/* 3. DELETE CONFIRMATION MODAL                              */}
      {/* ========================================================= */}
      {sliderToDelete && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm text-stone-900 font-normal">
                  Delete Slider
                </h3>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed font-normal">
                  Are you sure you want to delete this slider? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setSliderToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-xs text-stone-600 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-normal transition-colors cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
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
