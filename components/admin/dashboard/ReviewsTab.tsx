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
  Star,
  Video,
  AlertTriangle,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 20;

export interface ReviewItem {
  id: number;
  name: string;
  role?: string;
  rating?: number;
  review?: string;
  image?: string;
  videoUrl?: string;
  created_at?: string;
}

const EMPTY_FORM: Omit<ReviewItem, "id"> = {
  name: "",
  role: "",
  rating: 5,
  review: "",
  image: "",
  videoUrl: "",
};

export function ReviewsTab() {
  const { authFetch } = useAdminAuth();

  // View state: 'list' | 'create' | 'edit'
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState<Omit<ReviewItem, "id">>(EMPTY_FORM);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Delete modal state
  const [reviewToDelete, setReviewToDelete] = useState<ReviewItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const getBaseUrl = () => {
    return (
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://api.dpremiumhomes.com/api"
    ).replace(/\/+$/, "");
  };

  // 1. FETCH REVIEWS LIST
  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      const baseUrl = getBaseUrl();
      const res = await authFetch(`${baseUrl}/reviews`, { method: "GET" });
      if (res.ok) {
        const data = await res.json().catch(() => null);
        const list: ReviewItem[] = Array.isArray(data)
          ? data
          : data?.reviews || data?.data || [];
        setReviews(list);
      } else {
        toast.error("Failed to fetch reviews");
      }
    } catch (err: any) {
      console.error("Error fetching reviews:", err);
      toast.error(err?.message || "Network error loading reviews");
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Handle local file selection or direct upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    const localUrl = URL.createObjectURL(file);
    setFilePreview(localUrl);

    // Also attempt immediate upload to asset server to have a permanent URL
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
      }
    } catch (err) {
      console.warn("Asset upload helper fallback; file retained for multipart form submission", err);
    } finally {
      setIsUploading(false);
    }
  };

  // Open Create Mode
  const handleOpenCreate = () => {
    setFormData(EMPTY_FORM);
    setSelectedFile(null);
    setFilePreview("");
    setEditingId(null);
    setView("create");
  };

  // Open Edit Mode
  const handleOpenEdit = (rev: ReviewItem) => {
    setFormData({
      name: rev.name || "",
      role: rev.role || "",
      rating: rev.rating ?? 5,
      review: rev.review || "",
      image: rev.image || "",
      videoUrl: rev.videoUrl || "",
    });
    setSelectedFile(null);
    setFilePreview(rev.image || "");
    setEditingId(rev.id);
    setView("edit");
  };

  // 2. CREATE & UPDATE SUBMISSION
  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Please enter the client's name");
      return;
    }

    try {
      setIsSubmitting(true);
      const baseUrl = getBaseUrl();

      // We support multipart/form-data with _method=PUT for Laravel Admin endpoints
      const submissionData = new FormData();
      submissionData.append("name", formData.name.trim());
      if (formData.role) submissionData.append("role", formData.role.trim());
      submissionData.append("rating", String(formData.rating || 5));
      if (formData.review) submissionData.append("review", formData.review.trim());
      if (formData.videoUrl) submissionData.append("videoUrl", formData.videoUrl.trim());

      if (selectedFile) {
        submissionData.append("image", selectedFile);
      } else if (formData.image) {
        submissionData.append("image", formData.image);
      }

      let url = `${baseUrl}/reviews`;
      let method = "POST";

      if (view === "edit" && editingId) {
        url = `${baseUrl}/reviews/${editingId}`;
        submissionData.append("_method", "PUT");
      }

      const res = await authFetch(url, {
        method,
        body: submissionData,
      });

      const data = await res.json().catch(() => null);

      if (res.ok) {
        toast.success(
          data?.message ||
            (view === "edit"
              ? "Review updated successfully!"
              : "Review created successfully!")
        );
        setView("list");
        fetchReviews();
      } else {
        toast.error(data?.message || "Failed to save review");
      }
    } catch (err: any) {
      console.error("Submit review error:", err);
      toast.error(err?.message || "Network error while saving review");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. DELETE REVIEW
  const handleConfirmDelete = async () => {
    if (!reviewToDelete) return;
    try {
      setIsDeleting(true);
      const baseUrl = getBaseUrl();
      const res = await authFetch(`${baseUrl}/reviews/${reviewToDelete.id}`, {
        method: "DELETE",
      });

      const data = await res.json().catch(() => null);
      if (res.ok) {
        toast.success(data?.message || "Review deleted successfully");
        setReviews((prev) => prev.filter((r) => r.id !== reviewToDelete.id));
        setReviewToDelete(null);
      } else {
        toast.error(data?.message || "Failed to delete review");
      }
    } catch (err: any) {
      console.error("Delete review error:", err);
      toast.error(err?.message || "Network error deleting review");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered reviews
  const filteredReviews = reviews.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      (r.name && r.name.toLowerCase().includes(q)) ||
      (r.role && r.role.toLowerCase().includes(q)) ||
      (r.review && r.review.toLowerCase().includes(q)) ||
      String(r.id).includes(q)
    );
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE) || 1;
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="w-full space-y-6 font-sans font-normal animate-in fade-in duration-200">
      {/* ========================================================= */}
      {/* 1. LIST VIEW (Matches Screenshot 3)                       */}
      {/* ========================================================= */}
      {view === "list" && (
        <div className="w-full space-y-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl text-stone-900 tracking-tight font-normal">
                Reviews
              </h1>
              <p className="text-xs text-stone-500 mt-1 font-normal">
                Manage all review content
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={fetchReviews}
                disabled={loading}
                className="p-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                title="Refresh reviews"
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
              placeholder="Search Reviews..."
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
                    <th scope="col" className="py-3.5 px-5 font-normal w-14">
                      SL
                    </th>
                    <th scope="col" className="py-3.5 px-5 font-normal">
                      NAME
                    </th>
                    <th scope="col" className="py-3.5 px-5 font-normal">
                      ROLE
                    </th>
                    <th scope="col" className="py-3.5 px-5 font-normal w-28">
                      RATING
                    </th>
                    <th scope="col" className="py-3.5 px-5 font-normal text-right w-28">
                      ACTIONS
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-stone-100 font-normal">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-stone-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Loader2 className="w-6 h-6 animate-spin text-[#044133]" />
                          <span>Loading reviews...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredReviews.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-stone-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Eye className="w-8 h-8 text-stone-300" />
                          <span>No reviews found</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedReviews.map((rev, idx) => {
                      const serialNumber = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                      return (
                        <tr
                          key={rev.id}
                          className="hover:bg-[#fbfcfb] transition-colors"
                        >
                          <td className="py-4 px-5 text-stone-400 font-normal">
                            {serialNumber}
                          </td>

                          <td className="py-4 px-5 text-stone-900 font-normal">
                            <div className="flex items-center gap-3">
                              {rev.image ? (
                                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-stone-200 shrink-0 bg-stone-100">
                                  <Image
                                    src={rev.image}
                                    alt={rev.name || "Client"}
                                    fill
                                    sizes="32px"
                                    className="object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-500 font-normal text-xs shrink-0">
                                  {rev.name ? rev.name.charAt(0).toUpperCase() : "-"}
                                </div>
                              )}
                              <div>
                                <p className="line-clamp-1 leading-relaxed">
                                  {rev.name || "-"}
                                </p>
                                {rev.videoUrl && (
                                  <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                                    <Video className="w-2.5 h-2.5" />
                                    Video Review
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-5 text-stone-600 font-normal">
                            {rev.role || "-"}
                          </td>

                          <td className="py-4 px-5 text-stone-700 font-normal">
                            <div className="flex items-center gap-1">
                              <span className="font-normal">{rev.rating ?? 5}</span>
                              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            </div>
                          </td>

                          <td className="py-4 px-5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(rev)}
                                className="p-1.5 rounded-lg text-stone-400 hover:text-[#044133] hover:bg-stone-100 transition-colors cursor-pointer"
                                title="Edit Review"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setReviewToDelete(rev)}
                                className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                title="Delete Review"
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
            {filteredReviews.length > 0 && (
              <div className="px-5 py-4 border-t border-stone-200 bg-[#fcfbf9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-500 font-normal">
                <div>
                  Showing{" "}
                  <span className="text-stone-800 font-normal">
                    {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                  </span>{" "}
                  to{" "}
                  <span className="text-stone-800 font-normal">
                    {Math.min(currentPage * ITEMS_PER_PAGE, filteredReviews.length)}
                  </span>{" "}
                  of{" "}
                  <span className="text-stone-800 font-normal">
                    {filteredReviews.length}
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
      {/* 2. CREATE / EDIT FORM VIEW (Matches Screenshot 4)         */}
      {/* ========================================================= */}
      {(view === "create" || view === "edit") && (
        <form onSubmit={handleSubmitReview} className="w-full max-w-3xl space-y-6">
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
                {view === "edit" ? "Edit Review" : "Add Review"}
              </h1>
              <p className="text-xs text-stone-500 mt-0.5 font-normal">
                Manage client testimonial, rating, and video feedback
              </p>
            </div>
          </div>

          {/* Clean White Card matching Screenshot 4 */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-stone-200 shadow-xs space-y-5">
            {/* Name */}
            <div>
              <label className="block text-xs text-stone-700 font-normal mb-1.5">
                Name
              </label>
              <input
                type="text"
                required
                placeholder="Client Name (e.g. Dr. Rafiqul Islam)"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs text-stone-800 focus:outline-none focus:border-[#044133] focus:ring-1 focus:ring-[#044133] font-normal"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-xs text-stone-700 font-normal mb-1.5">
                Role
              </label>
              <input
                type="text"
                placeholder="e.g. Flat Owner, Business Owner, Property Investor"
                value={formData.role}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, role: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs text-stone-800 focus:outline-none focus:border-[#044133] focus:ring-1 focus:ring-[#044133] font-normal"
              />
            </div>

            {/* Rating (1-5) */}
            <div>
              <label className="block text-xs text-stone-700 font-normal mb-1.5">
                Rating (1-5)
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  max={5}
                  step={1}
                  value={formData.rating ?? 5}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      rating: Math.min(5, Math.max(1, parseInt(e.target.value) || 1)),
                    }))
                  }
                  className="w-28 px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs text-stone-800 focus:outline-none focus:border-[#044133] focus:ring-1 focus:ring-[#044133] font-normal"
                />
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((starVal) => (
                    <button
                      key={starVal}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, rating: starVal }))
                      }
                      className="p-1 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={cn(
                          "w-4 h-4",
                          starVal <= (formData.rating ?? 5)
                            ? "fill-amber-400 text-amber-400"
                            : "text-stone-300"
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Review Text */}
            <div>
              <label className="block text-xs text-stone-700 font-normal mb-1.5">
                Review Text
              </label>
              <textarea
                rows={4}
                placeholder="Client feedback and comments..."
                value={formData.review}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, review: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs text-stone-800 focus:outline-none focus:border-[#044133] focus:ring-1 focus:ring-[#044133] font-normal resize-y"
              />
            </div>

            {/* Thumbnail Image Upload Dropzone */}
            <div>
              <label className="block text-xs text-stone-700 font-normal mb-1.5">
                Thumbnail Image
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {filePreview || formData.image ? (
                <div className="space-y-3">
                  <div className="relative w-full max-w-xs h-40 rounded-xl overflow-hidden border border-stone-200 bg-stone-50 flex items-center justify-center p-2">
                    <Image
                      src={filePreview || formData.image || ""}
                      alt="Thumbnail Preview"
                      fill
                      sizes="320px"
                      className="object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setFilePreview("");
                        setFormData((prev) => ({ ...prev, image: "" }));
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white transition-colors cursor-pointer"
                      title="Remove image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-[#044133] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Change Image</span>
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-stone-200 hover:border-stone-300 rounded-xl p-8 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-[#fdfdfc] hover:bg-[#fafaf9]"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-7 h-7 text-[#044133] animate-spin" />
                      <p className="text-xs text-stone-500 font-normal">
                        Uploading image...
                      </p>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-8 h-8 text-stone-400 stroke-1" />
                      <p className="text-xs text-stone-600 font-normal">
                        Click to upload image
                      </p>
                      <span className="text-[11px] text-stone-400">
                        PNG, JPG, WEBP up to 5MB
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Video URL */}
            <div>
              <label className="block text-xs text-stone-700 font-normal mb-1.5">
                Video URL
              </label>
              <input
                type="text"
                placeholder="https://www.youtube.com/embed/..."
                value={formData.videoUrl}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, videoUrl: e.target.value }))
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs text-stone-800 focus:outline-none focus:border-[#044133] focus:ring-1 focus:ring-[#044133] font-normal"
              />
            </div>

            {/* Bottom Actions: Save Changes and Cancel */}
            <div className="flex items-center gap-3 pt-3 border-t border-stone-100">
              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#044133] hover:bg-[#033026] text-white text-xs font-normal transition-colors cursor-pointer shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? (
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

              <button
                type="button"
                onClick={() => setView("list")}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-normal transition-colors cursor-pointer"
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
      {reviewToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-2xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 border border-stone-200 shadow-xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-base text-stone-900 font-normal">
                Delete Review?
              </h3>
              <p className="text-xs text-stone-500 mt-1 font-normal leading-relaxed">
                Are you sure you want to delete the review by{" "}
                <span className="text-stone-800">
                  {reviewToDelete.name || "this client"}
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setReviewToDelete(null)}
                disabled={isDeleting}
                className="px-3.5 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-normal cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-normal cursor-pointer disabled:opacity-50"
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
