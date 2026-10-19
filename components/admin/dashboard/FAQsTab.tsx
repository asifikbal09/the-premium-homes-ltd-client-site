"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { toast } from "sonner";
import {
  HelpCircle,
  Plus,
  Search,
  RefreshCw,
  Loader2,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  X,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

const DEFAULT_CATEGORIES = [
  "General",
  "Payment & Booking",
  "Legal & Registration",
  "Construction & Handover",
];

export function FAQsTab() {
  const { authFetch } = useAdminAuth();

  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [expandedFaqIds, setExpandedFaqIds] = useState<number[]>([]);

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formCategory, setFormCategory] = useState("General");
  const [formQuestion, setFormQuestion] = useState("");
  const [formAnswer, setFormAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete State
  const [faqToDelete, setFaqToDelete] = useState<FAQItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const getBaseUrl = () => {
    return (
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://api.dpremiumhomes.com/api"
    ).replace(/\/+$/, "");
  };

  // 1. FETCH FAQS
  const fetchFaqs = useCallback(async () => {
    try {
      setLoading(true);
      const baseUrl = getBaseUrl();
      const res = await authFetch(`${baseUrl}/faqs`, { method: "GET" });

      if (res.ok) {
        const data = await res.json().catch(() => null);
        let list: FAQItem[] = [];

        if (Array.isArray(data)) {
          list = data;
        } else if (Array.isArray(data?.faqs)) {
          list = data.faqs;
        } else if (data?.faqs && typeof data.faqs === "object") {
          // Response format is grouped by category: { "General": [...], "Payment & Booking": [...] }
          Object.entries(data.faqs).forEach(([catKey, items]) => {
            if (Array.isArray(items)) {
              items.forEach((item: any) => {
                list.push({
                  id: item.id,
                  question: item.question || "",
                  answer: item.answer || "",
                  category: item.category || catKey,
                });
              });
            }
          });
        } else if (Array.isArray(data?.data)) {
          list = data.data;
        }

        setFaqs(list);
        if (list.length > 0 && expandedFaqIds.length === 0) {
          setExpandedFaqIds([list[0].id]);
        }
      } else {
        toast.error("Failed to load FAQs");
      }
    } catch (err: any) {
      console.error("Error fetching FAQs:", err);
      toast.error(err?.message || "Network error loading FAQs");
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  // Unique categories list
  const categories = React.useMemo(() => {
    const set = new Set<string>(["All"]);
    DEFAULT_CATEGORIES.forEach((c) => set.add(c));
    faqs.forEach((f) => {
      if (f.category) set.add(f.category);
    });
    return Array.from(set);
  }, [faqs]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingId(null);
    setFormCategory(selectedCategory !== "All" ? selectedCategory : "General");
    setFormQuestion("");
    setFormAnswer("");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (faq: FAQItem) => {
    setEditingId(faq.id);
    setFormCategory(faq.category || "General");
    setFormQuestion(faq.question);
    setFormAnswer(faq.answer);
    setIsModalOpen(true);
  };

  // 2. CREATE & UPDATE FAQ
  const handleSubmitFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formQuestion.trim() || !formAnswer.trim()) {
      toast.error("Please fill in both the question and answer");
      return;
    }

    try {
      setIsSubmitting(true);
      const baseUrl = getBaseUrl();
      const payload = {
        category: formCategory.trim() || "General",
        question: formQuestion.trim(),
        answer: formAnswer.trim(),
      };

      const url = editingId ? `${baseUrl}/faqs/${editingId}` : `${baseUrl}/faqs`;
      const method = editingId ? "PUT" : "POST";

      const res = await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);
      if (res.ok) {
        toast.success(
          data?.message ||
            (editingId ? "FAQ updated successfully!" : "FAQ created successfully!")
        );
        setIsModalOpen(false);
        fetchFaqs();
      } else {
        toast.error(data?.message || "Failed to save FAQ");
      }
    } catch (err: any) {
      console.error("Submit FAQ error:", err);
      toast.error(err?.message || "Network error while saving FAQ");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. DELETE FAQ
  const handleConfirmDelete = async () => {
    if (!faqToDelete) return;

    try {
      setIsDeleting(true);
      const baseUrl = getBaseUrl();
      const res = await authFetch(`${baseUrl}/faqs/${faqToDelete.id}`, {
        method: "DELETE",
      });

      const data = await res.json().catch(() => null);
      if (res.ok) {
        toast.success(data?.message || "FAQ deleted successfully");
        setFaqs((prev) => prev.filter((item) => item.id !== faqToDelete.id));
        setFaqToDelete(null);
      } else {
        toast.error(data?.message || "Failed to delete FAQ");
      }
    } catch (err: any) {
      console.error("Delete FAQ error:", err);
      toast.error(err?.message || "Network error deleting FAQ");
    } finally {
      setIsDeleting(false);
    }
  };

  // Toggle FAQ Accordion
  const toggleFaq = (id: number) => {
    setExpandedFaqIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filtered FAQs
  const filteredFaqs = faqs.filter((faq) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      faq.question.toLowerCase().includes(q) ||
      faq.answer.toLowerCase().includes(q) ||
      faq.category.toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (selectedCategory !== "All") {
      return faq.category === selectedCategory;
    }
    return true;
  });

  return (
    <div className="w-full space-y-6 font-sans font-normal animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#044133]" />
            <h1 className="text-xl sm:text-2xl text-stone-900 tracking-tight font-normal">
              FAQs
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-1 font-normal">
            Manage frequently asked questions, answers, and categories
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchFaqs}
            disabled={loading}
            className="p-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            title="Refresh FAQs"
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
            <span>Add FAQ</span>
          </button>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="w-full max-w-sm relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search questions or answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#044133] focus:ring-1 focus:ring-[#044133] shadow-2xs font-normal"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-normal whitespace-nowrap transition-colors cursor-pointer",
                selectedCategory === cat
                  ? "bg-[#044133] text-white shadow-2xs"
                  : "bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQs List */}
      <div className="space-y-3">
        {loading ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
            <Loader2 className="w-6 h-6 animate-spin text-[#044133] mx-auto mb-2" />
            <p className="text-xs text-stone-500 font-normal">Loading FAQs...</p>
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
            <HelpCircle className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <p className="text-xs text-stone-500 font-normal">No FAQs found</p>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isExpanded = expandedFaqIds.includes(faq.id);
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden transition-colors"
              >
                {/* Header Row */}
                <div
                  onClick={() => toggleFaq(faq.id)}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-[#fbfcfb] select-none"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-normal bg-stone-100 text-stone-700 border border-stone-200/80">
                      {faq.category}
                    </span>
                    <h3 className="text-xs sm:text-sm text-stone-900 font-normal truncate">
                      {faq.question}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEdit(faq);
                      }}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-[#044133] hover:bg-stone-100 transition-colors cursor-pointer"
                      title="Edit FAQ"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFaqToDelete(faq);
                      }}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Delete FAQ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="text-stone-400 pl-1">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Answer Content */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 text-xs text-stone-600 font-normal leading-relaxed border-t border-stone-100 bg-[#fafbfa]">
                    <p className="whitespace-pre-line">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-2xs animate-in fade-in duration-150">
          <form
            onSubmit={handleSubmitFaq}
            className="w-full max-w-lg bg-white rounded-2xl p-6 border border-stone-200 shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="text-base text-stone-900 font-normal">
                {editingId ? "Edit FAQ" : "Add New FAQ"}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs text-stone-700 font-normal mb-1.5">
                Category
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  required
                  placeholder="e.g. General, Payment & Booking"
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 font-normal focus:outline-none focus:border-[#044133]"
                />
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {DEFAULT_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormCategory(cat)}
                    className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-normal cursor-pointer transition-colors",
                      formCategory === cat
                        ? "bg-[#044133] text-white"
                        : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Question */}
            <div>
              <label className="block text-xs text-stone-700 font-normal mb-1.5">
                Question *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. What is the handover period?"
                value={formQuestion}
                onChange={(e) => setFormQuestion(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 font-normal focus:outline-none focus:border-[#044133]"
              />
            </div>

            {/* Answer */}
            <div>
              <label className="block text-xs text-stone-700 font-normal mb-1.5">
                Answer *
              </label>
              <textarea
                rows={4}
                required
                placeholder="Enter detailed answer..."
                value={formAnswer}
                onChange={(e) => setFormAnswer(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-800 font-normal focus:outline-none focus:border-[#044133] resize-y"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl border border-stone-200 text-stone-700 text-xs font-normal hover:bg-stone-50 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#044133] hover:bg-[#033026] text-white text-xs font-normal cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save FAQ</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {faqToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-2xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 border border-stone-200 shadow-xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-base text-stone-900 font-normal">Delete FAQ?</h3>
              <p className="text-xs text-stone-500 mt-1 font-normal leading-relaxed">
                Are you sure you want to delete this FAQ: &quot;{faqToDelete.question}&quot;?
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setFaqToDelete(null)}
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
