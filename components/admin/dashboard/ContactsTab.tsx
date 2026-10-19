"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { toast } from "sonner";
import {
  Users,
  Search,
  RefreshCw,
  Loader2,
  Mail,
  Phone,
  Building2,
  Trash2,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Clock,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ContactInquiry {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  source?: string;
  property?: string;
  property_name?: string;
  property_title?: string;
  subject?: string;
  message?: string;
  created_at?: string;
}

const ITEMS_PER_PAGE = 20;

export function ContactsTab() {
  const { authFetch } = useAdminAuth();

  const [contacts, setContacts] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sourceFilter, setSourceFilter] = useState<"All" | "Contact Page" | "Property Page">("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRowIds, setExpandedRowIds] = useState<number[]>([]);

  // Delete modal state
  const [contactToDelete, setContactToDelete] = useState<ContactInquiry | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const getBaseUrl = () => {
    return (
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://api.dpremiumhomes.com/api"
    ).replace(/\/+$/, "");
  };

  // 1. FETCH ALL CONTACTED PERSONS
  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      const baseUrl = getBaseUrl();
      const res = await authFetch(`${baseUrl}/admin/contacts`, { method: "GET" });

      if (res.ok) {
        const data = await res.json().catch(() => null);
        const list: ContactInquiry[] = Array.isArray(data)
          ? data
          : data?.contacts || data?.data || [];
        setContacts(list);
      } else {
        toast.error("Failed to fetch contact inquiries");
      }
    } catch (err: any) {
      console.error("Error fetching contacts:", err);
      toast.error(err?.message || "Network error loading contact inquiries");
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // Reset to first page on filter or search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sourceFilter]);

  // 2. DELETE CONTACT INQUIRY
  const handleConfirmDelete = async () => {
    if (!contactToDelete) return;

    try {
      setIsDeleting(true);
      const baseUrl = getBaseUrl();
      const res = await authFetch(`${baseUrl}/admin/contacts/${contactToDelete.id}`, {
        method: "DELETE",
      });

      const data = await res.json().catch(() => null);
      if (res.ok) {
        toast.success(data?.message || "Contact inquiry deleted successfully");
        setContacts((prev) => prev.filter((c) => c.id !== contactToDelete.id));
        setContactToDelete(null);
      } else {
        toast.error(data?.message || "Failed to delete contact inquiry");
      }
    } catch (err: any) {
      console.error("Delete contact error:", err);
      toast.error(err?.message || "Network error deleting inquiry");
    } finally {
      setIsDeleting(false);
    }
  };

  // Toggle row expansion
  const toggleRow = (id: number) => {
    setExpandedRowIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Format relative or date time
  const formatTimeAgo = (dateStr?: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return dateStr.split("T")[0];
  };

  // Helpers
  const getPropertyTitle = (item: ContactInquiry) => {
    return item.property || item.property_name || item.property_title || "-";
  };

  const getNormalizedSource = (src?: string) => {
    if (!src) return "Contact Page";
    const s = src.toLowerCase().replace(/_/g, " ").trim();
    if (s.includes("property")) return "Property Page";
    return "Contact Page";
  };

  // Filtered contacts
  const filteredContacts = contacts.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    const propTitle = getPropertyTitle(c).toLowerCase();
    const normSource = getNormalizedSource(c.source);

    const matchesSearch =
      !q ||
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.phone && c.phone.includes(q)) ||
      propTitle.includes(q) ||
      (c.subject && c.subject.toLowerCase().includes(q)) ||
      String(c.id).includes(q);

    if (!matchesSearch) return false;

    if (sourceFilter !== "All") {
      return normSource === sourceFilter;
    }
    return true;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredContacts.length / ITEMS_PER_PAGE) || 1;
  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="w-full space-y-6 font-sans font-normal animate-in fade-in duration-200">
      {/* Header matching screenshot */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#044133]" />
            <h1 className="text-xl sm:text-2xl text-stone-900 tracking-tight font-normal">
              Contacted Persons
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-1 font-normal">
            {contacts.length} total inquiries
          </p>
        </div>

        <button
          type="button"
          onClick={fetchContacts}
          disabled={loading}
          className="self-start sm:self-auto p-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
          title="Refresh inquiries"
        >
          <RefreshCw
            className={cn("w-4 h-4", loading && "animate-spin text-[#044133]")}
          />
        </button>
      </div>

      {/* Search & Source Filter Bar matching screenshot */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="w-full max-w-sm relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, email, phone, or property..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#044133] focus:ring-1 focus:ring-[#044133] shadow-2xs font-normal"
          />
        </div>

        {/* Source Pills matching screenshot */}
        <div className="flex items-center gap-1.5 self-start md:self-auto bg-white p-1 rounded-xl border border-stone-200">
          {(["All", "Contact Page", "Property Page"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setSourceFilter(tab)}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-normal whitespace-nowrap transition-colors cursor-pointer",
                sourceFilter === tab
                  ? "bg-[#044133] text-white shadow-2xs"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container matching screenshot */}
      <div className="w-full bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-[#fcfbf9] border-b border-stone-200 text-[11px] uppercase tracking-wider text-stone-500 font-normal">
              <tr>
                <th scope="col" className="py-3.5 px-5 font-normal w-14">
                  SL
                </th>
                <th scope="col" className="py-3.5 px-5 font-normal min-w-[180px]">
                  NAME
                </th>
                <th scope="col" className="py-3.5 px-5 font-normal min-w-[200px]">
                  CONTACT
                </th>
                <th scope="col" className="py-3.5 px-5 font-normal min-w-[130px]">
                  SOURCE
                </th>
                <th scope="col" className="py-3.5 px-5 font-normal min-w-[180px]">
                  PROPERTY
                </th>
                <th scope="col" className="py-3.5 px-5 font-normal min-w-[110px]">
                  DATE
                </th>
                <th scope="col" className="py-3.5 px-5 font-normal text-right w-24">
                  ACTIONS
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100 font-normal">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-[#044133]" />
                      <span>Loading contact inquiries...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="w-8 h-8 text-stone-300" />
                      <span>No contact inquiries found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedContacts.map((contact, idx) => {
                  const serialNumber = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                  const isExpanded = expandedRowIds.includes(contact.id);
                  const initial = contact.name ? contact.name.charAt(0).toUpperCase() : "C";
                  const normSource = getNormalizedSource(contact.source);
                  const propTitle = getPropertyTitle(contact);

                  return (
                    <React.Fragment key={contact.id}>
                      <tr
                        onClick={() => toggleRow(contact.id)}
                        className={cn(
                          "hover:bg-[#fbfcfb] transition-colors cursor-pointer select-none",
                          isExpanded && "bg-[#fafbfa]"
                        )}
                      >
                        {/* SL Number */}
                        <td className="py-4 px-5 text-stone-400 font-normal">
                          {serialNumber}
                        </td>

                        {/* Name with Circle Avatar Initial */}
                        <td className="py-4 px-5 text-stone-900 font-normal">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 flex items-center justify-center text-xs font-normal shrink-0">
                              {initial}
                            </div>
                            <span className="line-clamp-1">{contact.name || "Anonymous"}</span>
                          </div>
                        </td>

                        {/* Contact (Email + Phone) */}
                        <td className="py-4 px-5 text-stone-600 font-normal">
                          <div className="space-y-1">
                            {contact.email && (
                              <div className="flex items-center gap-1.5 text-stone-700">
                                <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                                <span className="line-clamp-1">{contact.email}</span>
                              </div>
                            )}
                            {contact.phone && (
                              <div className="flex items-center gap-1.5 text-stone-500 text-[11px]">
                                <Phone className="w-3 h-3 text-stone-400 shrink-0" />
                                <span>{contact.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Source Badge */}
                        <td className="py-4 px-5">
                          {normSource === "Property Page" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-normal bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                              Property Page
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-normal bg-blue-50 text-blue-700 border border-blue-200/80">
                              Contact Page
                            </span>
                          )}
                        </td>

                        {/* Property */}
                        <td className="py-4 px-5 text-stone-700 font-normal">
                          {propTitle === "-" ? (
                            <span className="text-stone-400">-</span>
                          ) : (
                            <span className="line-clamp-1">{propTitle}</span>
                          )}
                        </td>

                        {/* Date */}
                        <td className="py-4 px-5 text-stone-500 font-normal whitespace-nowrap">
                          <div className="flex items-center gap-1 text-[11px]">
                            <Clock className="w-3 h-3 text-stone-400" />
                            <span>{formatTimeAgo(contact.created_at)}</span>
                          </div>
                        </td>

                        {/* Actions: Delete & Chevron Toggle */}
                        <td className="py-4 px-5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setContactToDelete(contact);
                              }}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Delete Inquiry"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <div className="text-stone-400">
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>

                      {/* Expanded Inquiry Details Row */}
                      {isExpanded && (
                        <tr className="bg-[#fcfdfc] border-b border-stone-100">
                          <td colSpan={7} className="px-6 py-4">
                            <div className="space-y-2 text-xs">
                              {contact.subject && (
                                <div className="flex items-center gap-2">
                                  <span className="text-stone-400 font-normal">Subject:</span>
                                  <span className="text-stone-800 font-normal">
                                    {contact.subject}
                                  </span>
                                </div>
                              )}

                              <div>
                                <span className="text-stone-400 font-normal block mb-1">
                                  Message / Inquiry:
                                </span>
                                <div className="bg-white p-3.5 rounded-xl border border-stone-200/80 text-stone-800 font-normal leading-relaxed whitespace-pre-line shadow-2xs">
                                  {contact.message || "No detailed message provided."}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 20 items Pagination Footer */}
        {filteredContacts.length > 0 && (
          <div className="px-5 py-4 border-t border-stone-200 bg-[#fcfbf9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-500 font-normal">
            <div>
              Showing{" "}
              <span className="text-stone-800 font-normal">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              </span>{" "}
              to{" "}
              <span className="text-stone-800 font-normal">
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredContacts.length)}
              </span>{" "}
              of{" "}
              <span className="text-stone-800 font-normal">
                {filteredContacts.length}
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

      {/* Delete Confirmation Modal */}
      {contactToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-2xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 border border-stone-200 shadow-xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-base text-stone-900 font-normal">
                Delete Contact Inquiry?
              </h3>
              <p className="text-xs text-stone-500 mt-1 font-normal leading-relaxed">
                Are you sure you want to delete the inquiry from{" "}
                <span className="text-stone-800">
                  {contactToDelete.name || "this person"}
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setContactToDelete(null)}
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
