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
  Eye,
  AlertTriangle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 20;

export interface VirtualTourItem {
  id: number;
  title: string;
  tag?: string;
  description?: string;
  image?: string;
  link?: string;
  status?: number | boolean;
  created_at?: string;
}

const EMPTY_FORM: Omit<VirtualTourItem, "id"> = {
  title: "",
  tag: "Virtual Tour",
  description: "",
  image: "",
  link: "",
  status: 1,
};

export function VirtualToursTab() {
  const { authFetch } = useAdminAuth();

  // View state: 'list' | 'create' | 'edit'
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [tours, setTours] = useState<VirtualTourItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState<Omit<VirtualTourItem, "id">>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Delete modal state
  const [tourToDelete, setTourToDelete] = useState<VirtualTourItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const getBaseUrl = () => {
    return (
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://api.dpremiumhomes.com/api"
    ).replace(/\/+$/, "");
  };

  // 1. FETCH VIRTUAL TOURS LIST
  const fetchTours = useCallback(async () => {
    try {
      setLoading(true);
      const baseUrl = getBaseUrl();
      const res = await authFetch(`${baseUrl}/virtual-tours`, { method: "GET" });
      if (res.ok) {
        const data = await res.json().catch(() => null);
        const list: VirtualTourItem[] = Array.isArray(data)
          ? data
          : data?.tours || data?.virtualTours || data?.data || [];
        setTours(list);
      } else {
        toast.error("Failed to fetch virtual tours");
      }
    } catch (err: any) {
      console.error("Error fetching tours:", err);
      toast.error(err?.message || "Network error loading virtual tours");
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    fetchTours();
  }, [fetchTours]);

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
        toast.success("Tour thumbnail uploaded successfully!");
      } else {
        toast.error(data?.message || "Failed to upload image");
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error(err?.message || "Network error during upload");
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
  const handleOpenEdit = (tour: VirtualTourItem) => {
    setFormData({
      title: tour.title || "",
      tag: tour.tag || "Virtual Tour",
      description: tour.description || "",
      image: tour.image || "",
      link: tour.link || "",
      status: tour.status ? 1 : 0,
    });
    setEditingId(tour.id);
    setView("edit");
  };

  // 3. CREATE & UPDATE SUBMISSION
  const handleSubmitTour = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Please enter a title for the virtual tour");
      return;
    }

    try {
      setIsSubmitting(true);
      const baseUrl = getBaseUrl();

      // Prepare payload (supports JSON or multipart URL)
      const payload = {
        title: formData.title,
        tag: formData.tag || "Virtual Tour",
        description: formData.description || "",
        image: formData.image || "",
        link: formData.link || "",
        status: formData.status ? 1 : 0,
      };

      const url =
        view === "edit" && editingId
          ? `${baseUrl}/virtual-tours/${editingId}`
          : `${baseUrl}/virtual-tours`;

      const method = view === "edit" ? "PUT" : "POST";

      const res = await authFetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (res.ok) {
        toast.success(
          data?.message ||
            (view === "edit"
              ? "Virtual tour updated successfully!"
              : "Virtual tour created successfully!")
        );
        setView("list");
        fetchTours();
      } else {
        toast.error(data?.message || "Failed to save virtual tour");
      }
    } catch (err: any) {
      console.error("Submit tour error:", err);
      toast.error(err?.message || "Network error while saving tour");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. DELETE VIRTUAL TOUR
  const handleConfirmDelete = async () => {
    if (!tourToDelete) return;
    try {
      setIsDeleting(true);
      const baseUrl = getBaseUrl();
      const res = await authFetch(`${baseUrl}/virtual-tours/${tourToDelete.id}`, {
        method: "DELETE",
      });

      const data = await res.json().catch(() => null);
      if (res.ok) {
        toast.success(data?.message || "Virtual tour deleted successfully");
        setTours((prev) => prev.filter((t) => t.id !== tourToDelete.id));
        setTourToDelete(null);
      } else {
        toast.error(data?.message || "Failed to delete virtual tour");
      }
    } catch (err: any) {
      console.error("Delete tour error:", err);
      toast.error(err?.message || "Network error deleting virtual tour");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered tours
  const filteredTours = tours.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      (t.title && t.title.toLowerCase().includes(q)) ||
      (t.tag && t.tag.toLowerCase().includes(q)) ||
      String(t.id).includes(q)
    );
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredTours.length / ITEMS_PER_PAGE) || 1;
  const paginatedTours = filteredTours.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

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
                Virtual Tours
              </h1>
              <p className="text-xs text-stone-500 mt-1 font-normal">
                Manage all virtual tour content
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={fetchTours}
                disabled={loading}
                className="p-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                title="Refresh virtual tours"
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
                <span>Add New</span>
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="w-full max-w-sm relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search Virtual Tours..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#044133] focus:ring-1 focus:ring-[#044133] shadow-2xs font-normal"
            />
          </div>

          {/* Table Container */}
          <div className="w-full bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-[#fcfbf9] border-b border-stone-200 text-[11px] uppercase tracking-wider text-stone-500 font-normal">
                  <tr>
                    <th scope="col" className="py-3.5 px-5 font-normal w-14">
                      SL
                    </th>
                    <th scope="col" className="py-3.5 px-5 font-normal">
                      TITLE
                    </th>
                    <th scope="col" className="py-3.5 px-5 font-normal w-48">
                      TAG
                    </th>
                    <th scope="col" className="py-3.5 px-5 font-normal text-right w-28">
                      ACTIONS
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-stone-100 font-normal">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-stone-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Loader2 className="w-6 h-6 animate-spin text-[#044133]" />
                          <span>Loading virtual tours...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredTours.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-stone-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Eye className="w-8 h-8 text-stone-300" />
                          <span>No virtual tours found</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedTours.map((tour, idx) => {
                      const serialNumber = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                      return (
                        <tr
                          key={tour.id}
                          className="hover:bg-[#fbfcfb] transition-colors"
                        >
                          <td className="py-4 px-5 text-stone-400 font-normal">
                            {serialNumber}
                          </td>

                          <td className="py-4 px-5 text-stone-900 font-normal">
                            <div className="flex items-center gap-3">
                              {tour.image && (
                                <div className="relative w-12 h-8 rounded-md overflow-hidden border border-stone-200 shrink-0 bg-stone-100">
                                  <Image
                                    src={tour.image}
                                    alt={tour.title}
                                    fill
                                    sizes="48px"
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              <div>
                                <p className="line-clamp-1 leading-relaxed">
                                  {tour.title}
                                </p>
                                {tour.link && (
                                  <a
                                    href={tour.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-[11px] text-[#044133] hover:underline mt-0.5"
                                  >
                                    <span>Open Tour Viewport</span>
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-5 text-stone-500 font-normal">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-normal bg-stone-100 text-stone-700 border border-stone-200/60">
                              {tour.tag || "Virtual Tour"}
                            </span>
                          </td>

                          <td className="py-4 px-5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(tour)}
                                className="p-1.5 rounded-lg text-stone-400 hover:text-[#044133] hover:bg-stone-100 transition-colors cursor-pointer"
                                title="Edit Tour"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setTourToDelete(tour)}
                                className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                title="Delete Tour"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* 20 items Pagination Footer */}
            {filteredTours.length > 0 && (
              <div className="px-5 py-4 border-t border-stone-200 bg-[#fcfbf9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-500 font-normal">
                <div>
                  Showing{" "}
                  <span className="text-stone-800 font-normal">
                    {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                  </span>{" "}
                  to{" "}
                  <span className="text-stone-800 font-normal">
                    {Math.min(currentPage * ITEMS_PER_PAGE, filteredTours.length)}
                  </span>{" "}
                  of{" "}
                  <span className="text-stone-800 font-normal">
                    {filteredTours.length}
                  </span>{" "}
                  entries
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center gap-1 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                      title="Previous Page"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                        if (
                          pageNum === 1 ||
                          pageNum === totalPages ||
                          (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNum}
                              type="button"
                              onClick={() => setCurrentPage(pageNum)}
                              className={cn(
                                "w-7 h-7 rounded-lg text-xs font-normal transition-colors cursor-pointer",
                                currentPage === pageNum
                                  ? "bg-[#044133] text-white"
                                  : "bg-white border border-stone-200 text-stone-700 hover:bg-stone-50"
                              )}
                            >
                              {pageNum}
                            </button>
                          );
                        }
                        if (
                          pageNum === currentPage - 2 ||
                          pageNum === currentPage + 2
                        ) {
                          return (
                            <span key={pageNum} className="px-1 text-stone-400">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                      title="Next Page"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. CREATE / EDIT FORM VIEW (Matches Screenshot 2)         */}
      {/* ========================================================= */}
      {(view === "create" || view === "edit") && (
        <form onSubmit={handleSubmitTour} className="w-full max-w-3xl space-y-6">
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
                {view === "edit" ? "Edit Virtual Tour" : "Add Virtual Tour"}
              </h1>
              <p className="text-xs text-stone-500 mt-0.5 font-normal">
                Configure 360 virtual tour viewport and details
              </p>
            </div>
          </div>

          {/* Clean White Card matching Screenshot 2 */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200 shadow-xs space-y-5">
            {/* Title */}
            <div>
              <label className="block text-xs text-stone-700 font-normal mb-1.5">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g. Condominium Project - The Premium Smart City"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-[#fbfcfb] text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#044133] focus:bg-white font-normal"
              />
            </div>

            {/* Tag */}
            <div>
              <label className="block text-xs text-stone-700 font-normal mb-1.5">
                Tag
              </label>
              <input
                type="text"
                value={formData.tag}
                onChange={(e) =>
                  setFormData({ ...formData, tag: e.target.value })
                }
                placeholder="e.g. Virtual Tour / Residential"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-[#fbfcfb] text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#044133] focus:bg-white font-normal"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs text-stone-700 font-normal mb-1.5">
                Description
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Complete 360 degree panoramic view details..."
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-[#fbfcfb] text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#044133] focus:bg-white font-normal resize-y"
              />
            </div>

            {/* Image Upload Dropzone */}
            <div>
              <label className="block text-xs text-stone-700 font-normal mb-1.5">
                Image Upload
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />

              {formData.image ? (
                <div className="relative w-full rounded-xl overflow-hidden border border-stone-200 group bg-[#f7f8f7] flex items-center justify-center p-2 min-h-[180px]">
                  <div className="relative w-full h-[200px] sm:h-[220px]">
                    <Image
                      src={formData.image}
                      alt="Tour thumbnail"
                      fill
                      sizes="(max-width: 768px) 100vw, 600px"
                      className="object-contain"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-1.5 bg-white hover:bg-stone-100 text-stone-800 rounded-lg text-xs font-normal shadow-sm cursor-pointer"
                    >
                      Change Image
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: "" })}
                      className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-normal shadow-sm cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-36 rounded-xl border-2 border-dashed border-stone-200 hover:border-[#044133] bg-[#fbfcfb] hover:bg-stone-50 transition-colors flex flex-col items-center justify-center cursor-pointer p-4 text-center"
                >
                  {isUploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-[#044133]" />
                      <span className="text-xs text-stone-500 font-normal">
                        Uploading thumbnail...
                      </span>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="w-7 h-7 text-stone-400 mb-1.5" />
                      <span className="text-xs text-stone-600 font-normal">
                        Click to upload image
                      </span>
                      <span className="text-[10px] text-stone-400 font-normal mt-0.5">
                        PNG, JPG up to 5MB
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Tour URL (iframe) */}
            <div>
              <label className="block text-xs text-stone-700 font-normal mb-1.5">
                Tour URL (iframe)
              </label>
              <input
                type="text"
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
                placeholder="https://my.matterport.com/show/?m=example"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-[#fbfcfb] text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#044133] focus:bg-white font-mono font-normal"
              />
            </div>

            {/* Active Checkbox */}
            <div className="pt-1">
              <label className="block text-xs text-stone-700 font-normal mb-1.5">
                Active
              </label>
              <label
                htmlFor="tourEnableCheckbox"
                className="inline-flex items-center gap-2 cursor-pointer select-none text-xs text-stone-700 font-normal"
              >
                <input
                  id="tourEnableCheckbox"
                  type="checkbox"
                  checked={Boolean(formData.status)}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.checked ? 1 : 0 })
                  }
                  className="w-4 h-4 rounded border-stone-300 text-[#044133] focus:ring-[#044133] accent-[#044133] cursor-pointer"
                />
                <span>Enable</span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-3 border-t border-stone-100">
              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#044133] hover:bg-[#033026] text-white text-xs font-normal transition-colors cursor-pointer shadow-sm disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setView("list")}
                className="px-5 py-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-xs text-stone-600 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ========================================================= */}
      {/* 3. DELETE CONFIRMATION MODAL                              */}
      {/* ========================================================= */}
      {tourToDelete && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm text-stone-900 font-normal">
                  Delete Virtual Tour
                </h3>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed font-normal">
                  Are you sure you want to delete &ldquo;{tourToDelete.title}&rdquo;? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setTourToDelete(null)}
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
