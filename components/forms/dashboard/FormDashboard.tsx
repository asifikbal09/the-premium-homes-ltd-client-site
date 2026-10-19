"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormUserAuth } from "@/context/FormUserAuthContext";
import { toast } from "sonner";
import {
  Briefcase,
  Plus,
  ExternalLink,
  Edit,
  Trash2,
  Menu,
  Loader2,
  AlertCircle,
  Copy,
  Check,
  Building2,
  FileSpreadsheet,
} from "lucide-react";

export interface TphlFormItem {
  id: number | string;
  title?: string;
  campaign_name?: string;
  name?: string;
  category?: "recruitment" | "custom" | string;
  type?: "recruitment" | "custom" | string;
  slug?: string;
  link?: string;
  created_at?: string;
  created_date?: string;
  responses_count?: number;
  [key: string]: any;
}

type TabType = "all" | "recruitment" | "custom";

const getApiBaseUrl = () => {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://api.dpremiumhomes.com/api"
  ).replace(/\/+$/, "");
};

export function FormDashboard() {
  const router = useRouter();
  const { authFetch } = useFormUserAuth();

  const [forms, setForms] = useState<TphlFormItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [copiedId, setCopiedId] = useState<string | number | null>(null);

  // Delete modal state
  const [deletingForm, setDeletingForm] = useState<TphlFormItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Fetch all forms from GET /tphl-forms/forms
  const fetchForms = useCallback(async () => {
    setLoading(true);
    try {
      const baseUrl = getApiBaseUrl();
      const res = await authFetch(`${baseUrl}/tphl-forms/forms`);

      if (!res.ok) {
        throw new Error("Failed to fetch forms");
      }

      const data = await res.json();
      const formList: TphlFormItem[] = Array.isArray(data)
        ? data
        : data?.forms || data?.data || [];

      setForms(formList);
    } catch (err: any) {
      console.error("Error loading forms:", err);
      toast.error("Could not load forms. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  // Helper to normalize category
  const isRecruitment = (item: TphlFormItem) => {
    const cat = (item.category || item.type || "").toLowerCase();
    return cat.includes("recruitment");
  };

  // Tab counts
  const recruitmentCount = useMemo(
    () => forms.filter((f) => isRecruitment(f)).length,
    [forms]
  );
  const customCount = useMemo(
    () => forms.filter((f) => !isRecruitment(f)).length,
    [forms]
  );

  // Filtered list based on active tab
  const filteredForms = useMemo(() => {
    if (activeTab === "recruitment") {
      return forms.filter((f) => isRecruitment(f));
    }
    if (activeTab === "custom") {
      return forms.filter((f) => !isRecruitment(f));
    }
    return forms;
  }, [forms, activeTab]);

  // Helper to format date as M/D/YYYY
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
    } catch {
      return dateStr;
    }
  };

  // Copy public form link
  const handleCopyLink = async (slug?: string, id?: string | number) => {
    if (!slug) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const publicUrl = `${origin}/f/${slug}`;

    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopiedId(id || slug);
      toast.success("Public link copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  // Delete form handler: DELETE /tphl-forms/forms/{id}
  const handleDeleteConfirm = async () => {
    if (!deletingForm) return;
    setIsDeleting(true);

    try {
      const baseUrl = getApiBaseUrl();
      const res = await authFetch(
        `${baseUrl}/tphl-forms/forms/${deletingForm.id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to delete form");
      }

      setForms((prev) => prev.filter((f) => f.id !== deletingForm.id));
      toast.success("Form deleted successfully");
      setDeletingForm(null);
    } catch (err: any) {
      console.error("Delete error:", err);
      toast.error(err?.message || "Error deleting form. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-normal text-[#1f2723] tracking-tight">
            All Forms
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage custom campaigns and recruitment forms
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href="/tphl-forms/builder?type=recruitment"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#044133] hover:bg-[#065845] active:bg-[#033026] text-white text-xs font-normal rounded-lg shadow-xs transition-colors"
          >
            <Building2 className="w-4 h-4" />
            <span>Create Recruitment Form</span>
          </Link>

          <Link
            href="/tphl-forms/builder"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#00a86b] hover:bg-[#00915c] active:bg-[#007a4e] text-white text-xs font-normal rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Blank Form</span>
          </Link>
        </div>
      </div>

      {/* Tabs Filter Bar */}
      <div className="flex items-center gap-2 border-b border-stone-200/80 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === "all"
              ? "bg-[#1f2723] text-white shadow-xs"
              : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
          }`}
        >
          <span>All Forms ({forms.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("recruitment")}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === "recruitment"
              ? "bg-[#1f2723] text-white shadow-xs"
              : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Recruitment Forms ({recruitmentCount})</span>
        </button>

        <button
          onClick={() => setActiveTab("custom")}
          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === "custom"
              ? "bg-[#1f2723] text-white shadow-xs"
              : "text-stone-600 hover:text-stone-900 hover:bg-stone-100"
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Custom Forms ({customCount})</span>
        </button>
      </div>

      {/* Forms Table Container */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-stone-400">
            <Loader2 className="w-7 h-7 animate-spin text-[#044133] mb-3" />
            <p className="text-xs font-medium text-stone-500">Loading forms...</p>
          </div>
        ) : filteredForms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-12 h-12 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-400 mb-3">
              <FileSpreadsheet className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="text-sm font-normal text-stone-800">
              No forms found
            </h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm">
              {activeTab === "all"
                ? "No campaigns or recruitment forms have been created yet. Click 'Create Recruitment Form' or 'Create Blank Form' to begin."
                : `No ${activeTab} forms found in the database.`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-100 text-stone-400 font-medium">
                  <th className="py-3 px-5 font-normal">Campaign Name</th>
                  <th className="py-3 px-4 font-normal">Category</th>
                  <th className="py-3 px-4 font-normal">Link</th>
                  <th className="py-3 px-4 font-normal">Created Date</th>
                  <th className="py-3 px-5 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredForms.map((form) => {
                  const name =
                    form.campaign_name || form.title || form.name || "Untitled Form";
                  const recruitment = isRecruitment(form);
                  const slug =
                    form.slug ||
                    (form.link ? form.link.replace(/^\/?f\//, "") : "");
                  const publicPath = `/f/${slug}`;
                  const createdDate = formatDate(
                    form.created_at || form.created_date
                  );

                  return (
                    <tr
                      key={form.id}
                      className="hover:bg-stone-50/70 transition-colors group"
                    >
                      {/* Campaign Name */}
                      <td className="py-4 px-5 font-normal text-stone-800">
                        {name}
                      </td>

                      {/* Category Badge */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {recruitment ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                            <Building2 className="w-3 h-3" />
                            <span>Recruitment</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-stone-100 text-stone-600 border border-stone-200/80">
                            <span>Custom</span>
                          </span>
                        )}
                      </td>

                      {/* Public Link */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Link
                            href={publicPath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-700 hover:text-emerald-800 hover:underline"
                          >
                            <span>{publicPath}</span>
                            <ExternalLink className="w-3 h-3 shrink-0" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleCopyLink(slug, form.id)}
                            className="text-stone-300 hover:text-stone-600 p-0.5 transition-colors"
                            title="Copy link to clipboard"
                          >
                            {copiedId === form.id ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Created Date */}
                      <td className="py-4 px-4 text-stone-600 whitespace-nowrap">
                        {createdDate}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-3">
                          {/* View Responses Button */}
                          <Link
                            href={`/tphl-forms/forms/${form.id}/responses`}
                            className={`p-1 transition-colors ${
                              recruitment
                                ? "text-emerald-700 hover:text-emerald-900"
                                : "text-blue-600 hover:text-blue-800"
                            }`}
                            title={
                              recruitment
                                ? "View Candidate Applications"
                                : "View Form Responses"
                            }
                          >
                            {recruitment ? (
                              <Building2 className="w-4 h-4" />
                            ) : (
                              <Menu className="w-4 h-4" />
                            )}
                          </Link>

                          {/* Edit Form Button */}
                          <Link
                            href={`/tphl-forms/forms/${form.id}/edit`}
                            className="p-1 text-stone-600 hover:text-stone-900 transition-colors"
                            title="Edit Form"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          {/* Delete Form Button */}
                          <button
                            type="button"
                            onClick={() => setDeletingForm(form)}
                            className="p-1 text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                            title="Delete Form"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-100">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <AlertCircle className="w-5 h-5" />
            </div>

            <h3 className="text-base font-normal text-stone-900">
              Delete Form?
            </h3>
            <p className="text-xs text-stone-500 mt-2 leading-relaxed">
              Are you sure you want to delete{" "}
              <span className="text-stone-800">
                &quot;{deletingForm.campaign_name || deletingForm.title || "this form"}&quot;
              </span>
              ? This action will permanently remove the form and all its submitted responses.
            </p>

            <div className="flex items-center justify-end gap-2.5 mt-6">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeletingForm(null)}
                className="px-3.5 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-60"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Form</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
