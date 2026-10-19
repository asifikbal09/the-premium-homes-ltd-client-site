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
  ChevronDown,
  ChevronUp,
  Save,
  Loader2,
  RefreshCw,
  FileText,
  AlertTriangle,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface BlogItem {
  id: number;
  title: string;
  slug: string;
  category?: string;
  author?: string;
  date?: string;
  readTime?: string;
  comments?: number;
  image?: string;
  metaTitle?: string;
  metaDescription?: string;
  excerpt?: string;
  title2?: string;
  excerpt2?: string;
  title3?: string;
  excerpt3?: string;
  title4?: string;
  excerpt4?: string;
  title5?: string;
  excerpt5?: string;
  title6?: string;
  excerpt6?: string;
  title7?: string;
  excerpt7?: string;
  title8?: string;
  excerpt8?: string;
  title9?: string;
  excerpt9?: string;
  title10?: string;
  excerpt10?: string;
}

const EMPTY_FORM: Omit<BlogItem, "id"> = {
  title: "",
  slug: "",
  category: "Real Estate",
  author: "Admin",
  date: new Date().toISOString().split("T")[0],
  readTime: "5 min read",
  comments: 0,
  image: "",
  metaTitle: "",
  metaDescription: "",
  excerpt: "",
  title2: "",
  excerpt2: "",
  title3: "",
  excerpt3: "",
  title4: "",
  excerpt4: "",
  title5: "",
  excerpt5: "",
  title6: "",
  excerpt6: "",
  title7: "",
  excerpt7: "",
  title8: "",
  excerpt8: "",
  title9: "",
  excerpt9: "",
  title10: "",
  excerpt10: "",
};

export function BlogsTab() {
  const { authFetch } = useAdminAuth();

  // View state: 'list' | 'create' | 'edit'
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form state
  const [formData, setFormData] = useState<Omit<BlogItem, "id">>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Accordion state for Sections 2-10
  const [openSections, setOpenSections] = useState<Record<number, boolean>>({
    2: true, // section 2 open by default
  });

  // Delete modal state
  const [blogToDelete, setBlogToDelete] = useState<BlogItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const getBaseUrl = () => {
    return (
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://api.dpremiumhomes.com/api"
    ).replace(/\/+$/, "");
  };

  // Helper to slugify titles
  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // 1. FETCH BLOGS LIST
  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const baseUrl = getBaseUrl();
      const res = await authFetch(`${baseUrl}/blogs`, { method: "GET" });
      if (res.ok) {
        const data = await res.json().catch(() => null);
        const list: BlogItem[] = Array.isArray(data)
          ? data
          : data?.blogs || data?.data || [];
        setBlogs(list);
      } else {
        toast.error("Failed to fetch blogs list");
      }
    } catch (err: any) {
      console.error("Error fetching blogs:", err);
      toast.error(err?.message || "Network error loading blogs");
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Handle Title change + auto-generate slug in create mode
  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug: view === "create" ? slugify(val) : prev.slug,
    }));
  };

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
        toast.success("Image uploaded successfully!");
      } else {
        toast.error(data?.message || "Failed to upload image");
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      toast.error(err?.message || "Network error during image upload");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Open Create Mode
  const handleOpenCreate = () => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setOpenSections({ 2: true });
    setView("create");
  };

  // Open Edit Mode
  const handleOpenEdit = (blog: BlogItem) => {
    setFormData({
      title: blog.title || "",
      slug: blog.slug || "",
      category: blog.category || "Real Estate",
      author: blog.author || "Admin",
      date: blog.date || new Date().toISOString().split("T")[0],
      readTime: blog.readTime || "5 min read",
      comments: blog.comments || 0,
      image: blog.image || "",
      metaTitle: blog.metaTitle || "",
      metaDescription: blog.metaDescription || "",
      excerpt: blog.excerpt || "",
      title2: blog.title2 || "",
      excerpt2: blog.excerpt2 || "",
      title3: blog.title3 || "",
      excerpt3: blog.excerpt3 || "",
      title4: blog.title4 || "",
      excerpt4: blog.excerpt4 || "",
      title5: blog.title5 || "",
      excerpt5: blog.excerpt5 || "",
      title6: blog.title6 || "",
      excerpt6: blog.excerpt6 || "",
      title7: blog.title7 || "",
      excerpt7: blog.excerpt7 || "",
      title8: blog.title8 || "",
      excerpt8: blog.excerpt8 || "",
      title9: blog.title9 || "",
      excerpt9: blog.excerpt9 || "",
      title10: blog.title10 || "",
      excerpt10: blog.excerpt10 || "",
    });
    setEditingId(blog.id);
    setOpenSections({ 2: true });
    setView("edit");
  };

  // 3. CREATE & UPDATE SUBMISSION
  const handleSubmitBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Please enter a blog title");
      return;
    }

    try {
      setIsSubmitting(true);
      const baseUrl = getBaseUrl();

      const url =
        view === "edit" && editingId
          ? `${baseUrl}/blogs/${editingId}`
          : `${baseUrl}/blogs`;

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
              ? "Blog updated successfully!"
              : "Blog created successfully!")
        );
        setView("list");
        fetchBlogs();
      } else {
        toast.error(data?.message || "Failed to save blog");
      }
    } catch (err: any) {
      console.error("Submit blog error:", err);
      toast.error(err?.message || "Network error while saving blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 4. DELETE BLOG
  const handleConfirmDelete = async () => {
    if (!blogToDelete) return;
    try {
      setIsDeleting(true);
      const baseUrl = getBaseUrl();
      const res = await authFetch(`${baseUrl}/blogs/${blogToDelete.id}`, {
        method: "DELETE",
      });

      const data = await res.json().catch(() => null);
      if (res.ok) {
        toast.success(data?.message || "Blog deleted successfully");
        setBlogs((prev) => prev.filter((b) => b.id !== blogToDelete.id));
        setBlogToDelete(null);
      } else {
        toast.error(data?.message || "Failed to delete blog");
      }
    } catch (err: any) {
      console.error("Delete blog error:", err);
      toast.error(err?.message || "Network error deleting blog");
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleSection = (num: number) => {
    setOpenSections((prev) => ({
      ...prev,
      [num]: !prev[num],
    }));
  };

  // Filtered blogs
  const filteredBlogs = blogs.filter((b) => {
    const q = searchQuery.toLowerCase();
    return (
      b.title?.toLowerCase().includes(q) ||
      b.slug?.toLowerCase().includes(q) ||
      String(b.id).includes(q)
    );
  });

  return (
    <div className="w-full space-y-6 font-sans font-normal animate-in fade-in duration-200">
      {/* ========================================================= */}
      {/* 1. LIST VIEW                                              */}
      {/* ========================================================= */}
      {view === "list" && (
        <div className="w-full space-y-5">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl text-stone-900 tracking-tight font-normal">
                Blogs
              </h1>
              <p className="text-xs text-stone-500 mt-1 font-normal">
                {blogs.length} total blogs
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={fetchBlogs}
                disabled={loading}
                className="p-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                title="Refresh blogs"
              >
                <RefreshCw className={cn("w-4 h-4", loading && "animate-spin text-[#044133]")} />
              </button>

              <button
                type="button"
                onClick={handleOpenCreate}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#044133] hover:bg-[#033026] text-white text-xs font-normal transition-colors cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Blog</span>
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="w-full max-w-sm relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search blogs..."
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
                    <th scope="col" className="py-3.5 px-5 font-normal w-16">
                      ID
                    </th>
                    <th scope="col" className="py-3.5 px-5 font-normal">
                      Title
                    </th>
                    <th scope="col" className="py-3.5 px-5 font-normal">
                      Slug
                    </th>
                    <th scope="col" className="py-3.5 px-5 font-normal whitespace-nowrap w-32">
                      Date
                    </th>
                    <th scope="col" className="py-3.5 px-5 font-normal text-right w-28">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-stone-100 font-normal">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-stone-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <Loader2 className="w-6 h-6 animate-spin text-[#044133]" />
                          <span>Loading blogs...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredBlogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-stone-400">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <FileText className="w-8 h-8 text-stone-300" />
                          <span>No blogs found</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredBlogs.map((blog) => (
                      <tr
                        key={blog.id}
                        className="hover:bg-[#fbfcfb] transition-colors"
                      >
                        <td className="py-4 px-5 text-stone-400 font-normal">
                          {blog.id}
                        </td>
                        <td className="py-4 px-5 text-stone-900 font-normal max-w-md">
                          <p className="line-clamp-2 leading-relaxed">
                            {blog.title}
                          </p>
                        </td>
                        <td className="py-4 px-5 text-stone-500 font-normal">
                          <span className="bg-stone-50 px-2 py-1 rounded text-[11px] text-stone-600 border border-stone-200/60 font-mono">
                            {blog.slug}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-stone-500 font-normal whitespace-nowrap">
                          {blog.date || "—"}
                        </td>
                        <td className="py-4 px-5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(blog)}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-[#044133] hover:bg-stone-100 transition-colors cursor-pointer"
                              title="Edit Blog"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setBlogToDelete(blog)}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Delete Blog"
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
      {/* 2. CREATE / EDIT FORM VIEW                                */}
      {/* ========================================================= */}
      {(view === "create" || view === "edit") && (
        <form onSubmit={handleSubmitBlog} className="w-full space-y-6">
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
                {view === "edit" ? "Edit Blog" : "Create New Blog"}
              </h1>
              <p className="text-xs text-stone-500 mt-0.5 font-normal">
                Fill in blog content using the title/excerpt fields
              </p>
            </div>
          </div>

          {/* CARD 1: SEO & META */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
              <span className="w-1.5 h-3.5 bg-[#044133] rounded-full" />
              <h2 className="text-xs uppercase tracking-wider text-[#044133] font-normal">
                SEO &amp; Meta
              </h2>
            </div>

            <div>
              <label className="block text-xs text-stone-700 font-normal mb-1.5">
                Meta Title
              </label>
              <input
                type="text"
                value={formData.metaTitle}
                onChange={(e) =>
                  setFormData({ ...formData, metaTitle: e.target.value })
                }
                placeholder="SEO Meta Title"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-[#fbfcfb] text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#044133] focus:bg-white font-normal"
              />
            </div>

            <div>
              <label className="block text-xs text-stone-700 font-normal mb-1.5">
                Meta Description
              </label>
              <textarea
                rows={3}
                value={formData.metaDescription}
                onChange={(e) =>
                  setFormData({ ...formData, metaDescription: e.target.value })
                }
                placeholder="SEO Meta Description"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-[#fbfcfb] text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#044133] focus:bg-white font-normal resize-y"
              />
            </div>
          </div>

          {/* CARD 2: BASIC INFO */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
              <span className="w-1.5 h-3.5 bg-[#044133] rounded-full" />
              <h2 className="text-xs uppercase tracking-wider text-[#044133] font-normal">
                Basic Info
              </h2>
            </div>

            {/* Title (Main H1) */}
            <div>
              <label className="block text-xs text-stone-700 font-normal mb-1.5">
                Title (Main H1) *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Enter main blog title"
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-[#fbfcfb] text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#044133] focus:bg-white font-normal"
              />
            </div>

            {/* Two-Column Layout: Left Side (All Inputs), Right Side (Featured Image) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start pt-1">
              {/* LEFT SIDE: Slug, Author, Date, Read Time, Comments */}
              <div className="lg:col-span-7 space-y-4">
                {/* Slug */}
                <div>
                  <label className="block text-xs text-stone-700 font-normal mb-1.5">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    placeholder="top-real-estate-companies"
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-[#fbfcfb] text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#044133] focus:bg-white font-mono font-normal"
                  />
                </div>

                {/* Author & Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-stone-700 font-normal mb-1.5">
                      Author
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) =>
                        setFormData({ ...formData, author: e.target.value })
                      }
                      placeholder="Admin"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-[#fbfcfb] text-xs text-stone-800 focus:outline-none focus:border-[#044133] focus:bg-white font-normal"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-stone-700 font-normal mb-1.5">
                      Date
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-[#fbfcfb] text-xs text-stone-800 focus:outline-none focus:border-[#044133] focus:bg-white font-normal"
                    />
                  </div>
                </div>

                {/* Read Time & Comments */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-stone-700 font-normal mb-1.5">
                      Read Time
                    </label>
                    <input
                      type="text"
                      value={formData.readTime}
                      onChange={(e) =>
                        setFormData({ ...formData, readTime: e.target.value })
                      }
                      placeholder="5 min read"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-[#fbfcfb] text-xs text-stone-800 focus:outline-none focus:border-[#044133] focus:bg-white font-normal"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-stone-700 font-normal mb-1.5">
                      Comments Count
                    </label>
                    <input
                      type="number"
                      value={formData.comments}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          comments: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-[#fbfcfb] text-xs text-stone-800 focus:outline-none focus:border-[#044133] focus:bg-white font-normal"
                    />
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE: Featured Image */}
              <div className="lg:col-span-5 flex flex-col">
                <label className="block text-xs text-stone-700 font-normal mb-1.5">
                  Featured Image
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />

                {formData.image ? (
                  <div className="relative w-full rounded-xl overflow-hidden border border-stone-200 group bg-[#f7f8f7] flex items-center justify-center p-2 min-h-[220px]">
                    <div className="relative w-full h-[220px] sm:h-[240px]">
                      <Image
                        src={formData.image}
                        alt="Featured image"
                        fill
                        sizes="(max-width: 1024px) 100vw, 450px"
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
                    className="w-full h-[220px] sm:h-[240px] rounded-xl border-2 border-dashed border-stone-200 hover:border-[#044133] bg-[#fbfcfb] hover:bg-stone-50 transition-colors flex flex-col items-center justify-center cursor-pointer p-4 text-center"
                  >
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-6 h-6 animate-spin text-[#044133]" />
                        <span className="text-xs text-stone-500 font-normal">
                          Uploading image...
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
            </div>
          </div>

          {/* CARD 3: BLOG CONTENT SECTIONS */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-5">
            <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
              <span className="w-1.5 h-3.5 bg-[#044133] rounded-full" />
              <h2 className="text-xs uppercase tracking-wider text-[#044133] font-normal">
                Blog Content Sections
              </h2>
            </div>

            {/* Intro Excerpt */}
            <div>
              <label className="block text-xs text-stone-700 font-normal mb-1.5">
                Intro Excerpt
              </label>
              <textarea
                rows={4}
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                placeholder="Write the introduction paragraph of your blog..."
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-[#fbfcfb] text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#044133] focus:bg-white font-normal resize-y"
              />
            </div>

            {/* Accordions for Sections 2 through 10 */}
            <div className="space-y-3 pt-2">
              {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
                const titleKey = `title${num}` as keyof Omit<BlogItem, "id">;
                const excerptKey = `excerpt${num}` as keyof Omit<BlogItem, "id">;
                const isOpen = openSections[num];

                return (
                  <div
                    key={num}
                    className="border border-stone-200 rounded-xl overflow-hidden transition-colors bg-[#fbfcfb]"
                  >
                    <button
                      type="button"
                      onClick={() => toggleSection(num)}
                      className="w-full px-4 py-3 bg-stone-50/80 hover:bg-stone-100/80 flex items-center justify-between text-xs text-stone-800 font-normal transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-stone-500 font-normal">
                          Section {num}
                        </span>
                        {formData[titleKey] ? (
                          <span className="text-stone-400 text-[11px] truncate max-w-xs font-normal">
                            — {String(formData[titleKey])}
                          </span>
                        ) : null}
                      </div>

                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-stone-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-stone-400" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="p-4 space-y-3 bg-white border-t border-stone-100 animate-in fade-in duration-150">
                        <div>
                          <label className="block text-[11px] text-stone-600 font-normal mb-1">
                            Title {num}
                          </label>
                          <input
                            type="text"
                            value={String(formData[titleKey] || "")}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                [titleKey]: e.target.value,
                              })
                            }
                            placeholder={`Section ${num} Heading`}
                            className="w-full px-3.5 py-2 rounded-lg border border-stone-200 bg-[#fbfcfb] text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#044133] focus:bg-white font-normal"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] text-stone-600 font-normal mb-1">
                            Excerpt {num} (Content)
                          </label>
                          <textarea
                            rows={3}
                            value={String(formData[excerptKey] || "")}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                [excerptKey]: e.target.value,
                              })
                            }
                            placeholder={`Details for section ${num}...`}
                            className="w-full px-3.5 py-2 rounded-lg border border-stone-200 bg-[#fbfcfb] text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#044133] focus:bg-white font-normal resize-y"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
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
                  <span>Save Blog</span>
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
        </form>
      )}

      {/* ========================================================= */}
      {/* 3. DELETE CONFIRMATION MODAL                              */}
      {/* ========================================================= */}
      {blogToDelete && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm text-stone-900 font-normal">
                  Delete Blog Article
                </h3>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed font-normal">
                  Are you sure you want to permanently delete &ldquo;{blogToDelete.title}&rdquo;? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setBlogToDelete(null)}
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
