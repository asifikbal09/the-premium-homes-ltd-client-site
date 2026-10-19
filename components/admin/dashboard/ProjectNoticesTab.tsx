"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { toast } from "sonner";
import {
  Bell,
  RefreshCw,
  Loader2,
  Send,
  Building2,
  Trash2,
  Upload,
  X,
  AlertTriangle,
  FileText,
  Calendar,
  Eye,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProjectOption {
  id: number;
  name: string;
  slug?: string;
  location?: string;
  status?: string;
}

export interface ProjectNotice {
  id: number;
  project_id: number;
  title?: string | null;
  description: string;
  image?: string | null;
  created_at?: string;
}

export function ProjectNoticesTab() {
  const { authFetch } = useAdminAuth();

  // Projects list
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | "">("");
  const [loadingProjects, setLoadingProjects] = useState<boolean>(true);

  // Notices list
  const [notices, setNotices] = useState<ProjectNotice[]>([]);
  const [loadingNotices, setLoadingNotices] = useState<boolean>(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal states
  const [noticeToDelete, setNoticeToDelete] = useState<ProjectNotice | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const getBaseUrl = () => {
    return (
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://api.dpremiumhomes.com/api"
    ).replace(/\/+$/, "");
  };

  // 1. Fetch All Projects for dropdown
  const fetchProjects = useCallback(async () => {
    try {
      setLoadingProjects(true);
      const baseUrl = getBaseUrl();
      const res = await authFetch(`${baseUrl}/projects`, {
        method: "GET",
      });

      if (res.ok) {
        const data = await res.json().catch(() => null);
        const list: ProjectOption[] = Array.isArray(data)
          ? data
          : data?.projects || data?.data || [];
        setProjects(list);
      } else {
        toast.error("Failed to load projects list");
      }
    } catch (err: any) {
      console.error("Error fetching projects:", err);
      toast.error(err?.message || "Network error loading projects");
    } finally {
      setLoadingProjects(false);
    }
  }, [authFetch]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // 2. Fetch Project Notices for selected project
  const fetchNotices = useCallback(
    async (projectId: number) => {
      try {
        setLoadingNotices(true);
        const baseUrl = getBaseUrl();
        const res = await authFetch(`${baseUrl}/projects/${projectId}/notices`, {
          method: "GET",
        });

        if (res.ok) {
          const data = await res.json().catch(() => null);
          const list: ProjectNotice[] =
            data?.notices || (Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []));
          setNotices(list);
        } else {
          toast.error("Failed to load notices for this project");
          setNotices([]);
        }
      } catch (err: any) {
        console.error("Error fetching notices:", err);
        toast.error(err?.message || "Network error loading notices");
        setNotices([]);
      } finally {
        setLoadingNotices(false);
      }
    },
    [authFetch]
  );

  // Trigger notice fetching whenever selectedProjectId changes
  useEffect(() => {
    if (typeof selectedProjectId === "number") {
      fetchNotices(selectedProjectId);
    } else {
      setNotices([]);
    }
  }, [selectedProjectId, fetchNotices]);

  // Handle Image Selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 3. Post New Notice
  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProjectId) {
      toast.error("Please select a project first");
      return;
    }

    if (!description.trim()) {
      toast.error("Please enter the notice description");
      return;
    }

    try {
      setIsSubmitting(true);
      const baseUrl = getBaseUrl();

      const formData = new FormData();
      formData.append("project_id", String(selectedProjectId));
      if (title.trim()) {
        formData.append("title", title.trim());
      }
      formData.append("description", description.trim());
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await authFetch(`${baseUrl}/project-notices`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success !== false) {
        toast.success(data?.message || "Notice posted successfully");
        setTitle("");
        setDescription("");
        handleClearImage();
        // Refresh notices list
        if (typeof selectedProjectId === "number") {
          fetchNotices(selectedProjectId);
        }
      } else {
        toast.error(data?.message || "Failed to post notice");
      }
    } catch (err: any) {
      console.error("Error creating notice:", err);
      toast.error(err?.message || "Network error posting notice");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. Delete Notice
  const handleConfirmDelete = async () => {
    if (!noticeToDelete) return;

    try {
      setIsDeleting(true);
      const baseUrl = getBaseUrl();

      const res = await authFetch(`${baseUrl}/project-notices/${noticeToDelete.id}`, {
        method: "DELETE",
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success !== false) {
        toast.success(data?.message || "Notice deleted successfully");
        setNotices((prev) => prev.filter((n) => n.id !== noticeToDelete.id));
        setNoticeToDelete(null);
      } else {
        toast.error(data?.message || "Failed to delete notice");
      }
    } catch (err: any) {
      console.error("Error deleting notice:", err);
      toast.error(err?.message || "Network error deleting notice");
    } finally {
      setIsDeleting(false);
    }
  };

  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const formatNoticeDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="w-full space-y-6 font-sans font-normal animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-stone-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#044133]/10 text-[#044133] flex items-center justify-center shrink-0 border border-[#044133]/15">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl text-stone-900 tracking-tight font-normal">
              Project Notices
            </h1>
            <p className="text-xs text-stone-500 font-normal">
              Manage & broadcast project updates directly to project owners
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            fetchProjects();
            if (typeof selectedProjectId === "number") {
              fetchNotices(selectedProjectId);
            }
          }}
          disabled={loadingProjects || loadingNotices}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-normal transition-colors cursor-pointer shadow-2xs disabled:opacity-50"
          title="Refresh Projects and Notices"
        >
          <RefreshCw
            className={cn(
              "w-3.5 h-3.5",
              (loadingProjects || loadingNotices) && "animate-spin text-[#044133]"
            )}
          />
          <span>Refresh</span>
        </button>
      </div>

      {/* Main Grid: Left Panel (Project select & Form) | Right Panel (Notice History) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Project Picker & Create Notice Form */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card 1: Project Selector */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-normal text-stone-800">
                <Building2 className="w-4 h-4 text-[#044133]" />
                <span>Select Project</span>
                <span className="text-rose-500">*</span>
              </label>
              {loadingProjects && (
                <span className="inline-flex items-center gap-1.5 text-[11px] text-stone-400">
                  <Loader2 className="w-3 h-3 animate-spin text-[#044133]" />
                  Loading...
                </span>
              )}
            </div>

            <div className="relative">
              <select
                value={selectedProjectId}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedProjectId(val ? Number(val) : "");
                }}
                disabled={loadingProjects}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs text-stone-800 focus:outline-none focus:border-[#044133] focus:ring-1 focus:ring-[#044133] font-normal cursor-pointer disabled:bg-stone-50 disabled:cursor-not-allowed appearance-none pr-9"
              >
                <option value="">-- Choose a Project --</option>
                {projects.map((proj) => (
                  <option key={proj.id} value={proj.id}>
                    {proj.name} {proj.location ? `(${proj.location})` : ""}
                  </option>
                ))}
              </select>

              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-stone-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>

            {selectedProject && (
              <div className="p-3 bg-[#044133]/5 rounded-xl border border-[#044133]/15 flex items-center justify-between gap-3 text-xs">
                <div className="min-w-0">
                  <p className="font-normal text-stone-900 truncate">
                    {selectedProject.name}
                  </p>
                  {selectedProject.location && (
                    <p className="text-[11px] text-stone-500 truncate">
                      {selectedProject.location}
                    </p>
                  )}
                </div>
                {selectedProject.status && (
                  <span className="shrink-0 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] border border-emerald-100 uppercase tracking-wider font-mono">
                    {selectedProject.status}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Card 2: Create Notice Form */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#044133] text-white flex items-center justify-center shrink-0 shadow-xs">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm text-stone-900 font-normal">
                  Create New Notice
                </h2>
                <p className="text-xs text-stone-400 font-normal mt-0.5">
                  Broadcast updates to this project&apos;s owners
                </p>
              </div>
            </div>

            {!selectedProjectId ? (
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/60 text-amber-800 text-xs flex items-center gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Please select a project first to compose a notice.</span>
              </div>
            ) : (
              <form onSubmit={handleCreateNotice} className="space-y-4">
                {/* Title (Optional) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs text-stone-600 font-normal">
                      Notice Title
                    </label>
                    <span className="text-[11px] text-stone-400 font-normal">
                      Optional
                    </span>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Construction Update"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#044133] focus:ring-1 focus:ring-[#044133] font-normal"
                  />
                </div>

                {/* Description (Required) */}
                <div>
                  <label className="block text-xs text-stone-600 font-normal mb-1.5">
                    Notice Description <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="e.g. 5th-floor casting has been completed successfully."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#044133] focus:ring-1 focus:ring-[#044133] font-normal resize-y leading-relaxed"
                  />
                </div>

                {/* Image Attachment (Optional) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs text-stone-600 font-normal">
                      Attachment Image
                    </label>
                    <span className="text-[11px] text-stone-400 font-normal">
                      PNG, JPG, GIF (Max 5MB)
                    </span>
                  </div>

                  <div className="space-y-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                      onChange={handleImageChange}
                      className="hidden"
                      id="project-notice-image-upload"
                    />

                    {!imagePreview ? (
                      <label
                        htmlFor="project-notice-image-upload"
                        className="flex flex-col items-center justify-center p-4 border border-dashed border-stone-300 rounded-xl bg-stone-50/50 hover:bg-stone-50 cursor-pointer transition-colors text-center group"
                      >
                        <Upload className="w-5 h-5 text-stone-400 group-hover:text-[#044133] transition-colors mb-1" />
                        <span className="text-xs text-stone-600">
                          Click to upload notice image
                        </span>
                        <span className="text-[10px] text-stone-400 mt-0.5">
                          Up to 5MB attachment
                        </span>
                      </label>
                    ) : (
                      <div className="relative flex items-center justify-between p-2.5 rounded-xl border border-stone-200 bg-[#fcfbf9]">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                            <Image
                              src={imagePreview}
                              alt="Preview"
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs text-stone-800 font-normal truncate max-w-[200px]">
                              {imageFile?.name || "Selected image"}
                            </p>
                            <p className="text-[10px] text-stone-400">
                              {imageFile ? `${(imageFile.size / 1024).toFixed(0)} KB` : ""}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleClearImage}
                          className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                          title="Remove image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#044133] hover:bg-[#033026] text-white text-xs font-normal transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Posting Notice...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Post Notice</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Project Notice History */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <h2 className="text-sm text-stone-900 font-normal">
                  Notice History
                </h2>
                {selectedProjectId && (
                  <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 text-[11px] font-normal border border-stone-200">
                    {notices.length} {notices.length === 1 ? "notice" : "notices"}
                  </span>
                )}
              </div>

              {selectedProjectId && (
                <button
                  type="button"
                  onClick={() => {
                    if (typeof selectedProjectId === "number") {
                      fetchNotices(selectedProjectId);
                    }
                  }}
                  disabled={loadingNotices}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer disabled:opacity-50"
                  title="Refresh Notices"
                >
                  <RefreshCw
                    className={cn(
                      "w-3.5 h-3.5",
                      loadingNotices && "animate-spin text-[#044133]"
                    )}
                  />
                </button>
              )}
            </div>

            {/* Content States */}
            {!selectedProjectId ? (
              <div className="py-16 text-center text-stone-400 flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 border border-stone-200">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xs text-stone-700 font-normal mb-1">
                    No Project Selected
                  </h3>
                  <p className="text-[11px] text-stone-400 max-w-xs mx-auto">
                    Please select a project from the left dropdown to view its existing notices or broadcast a new one.
                  </p>
                </div>
              </div>
            ) : loadingNotices ? (
              <div className="py-16 text-center text-stone-400 flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-[#044133]" />
                <span className="text-xs font-normal">Loading project notices...</span>
              </div>
            ) : notices.length === 0 ? (
              <div className="py-16 text-center text-stone-400 flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-400 border border-stone-200">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xs text-stone-700 font-normal mb-1">
                    No Notices Found
                  </h3>
                  <p className="text-[11px] text-stone-400 max-w-xs mx-auto">
                    There are no notices posted for this project yet. Use the form on the left to broadcast your first update.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {notices.map((notice) => (
                  <div
                    key={notice.id}
                    className="p-4 sm:p-5 rounded-xl border border-stone-200 hover:border-stone-300 bg-[#fcfbf9]/60 hover:bg-[#fcfbf9] transition-all space-y-3"
                  >
                    {/* Top Row: Title, Date & Delete Button */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-xs text-stone-900 font-normal">
                            {notice.title || "Project Notice"}
                          </h3>
                        </div>
                        {notice.created_at && (
                          <div className="flex items-center gap-1.5 text-[11px] text-stone-400">
                            <Calendar className="w-3 h-3 text-stone-400" />
                            <span>{formatNoticeDate(notice.created_at)}</span>
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => setNoticeToDelete(notice)}
                        className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                        title="Delete notice"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Notice Description */}
                    <p className="text-xs text-stone-700 font-normal leading-relaxed whitespace-pre-wrap">
                      {notice.description}
                    </p>

                    {/* Attachment Image Preview (if available) */}
                    {notice.image && (
                      <div className="pt-1">
                        <div
                          onClick={() => setPreviewImageUrl(notice.image!)}
                          className="group relative w-full sm:w-60 h-36 rounded-xl overflow-hidden border border-stone-200 bg-stone-100 cursor-pointer shadow-2xs"
                        >
                          <Image
                            src={notice.image}
                            alt={notice.title || "Notice Image"}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/70 text-white text-[10px] font-normal backdrop-blur-2xs">
                              <Eye className="w-3 h-3" />
                              View Full
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LIGHTBOX MODAL FOR NOTICE IMAGE */}
      {previewImageUrl && (
        <div
          onClick={() => setPreviewImageUrl(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] w-full h-[80vh] flex flex-col items-center justify-center cursor-default"
          >
            <button
              type="button"
              onClick={() => setPreviewImageUrl(null)}
              className="absolute -top-10 right-0 p-1.5 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors cursor-pointer"
              title="Close image"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={previewImageUrl}
                alt="Enlarged Notice Image"
                fill
                className="object-contain"
                unoptimized
              />
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {noticeToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-stone-200 shadow-xl space-y-4 font-normal">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base text-stone-900 font-normal">
                Delete Notice?
              </h3>
              <p className="text-xs text-stone-500 font-normal">
                Are you sure you want to delete this project notice? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setNoticeToDelete(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-700 hover:bg-stone-50 transition-colors font-normal cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-normal transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isDeleting ? (
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
