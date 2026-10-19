"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { toast } from "sonner";
import {
  Briefcase,
  Search,
  RefreshCw,
  Loader2,
  Eye,
  Mail,
  Phone,
  MapPin,
  Clock,
  Calendar,
  ExternalLink,
  X,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface InvestorLead {
  id: number;
  name: string;
  contact_number?: string;
  phone?: string;
  email?: string;
  address?: string;
  socialLink?: string;
  timeline?: string;
  investmentInterest?: string;
  contactMathod?: string;
  contactMethod?: string;
  discussion_availability?: string;
  termsAgreement?: boolean | number;
  created_at?: string;
}

const ITEMS_PER_PAGE = 20;

export function InvestorLeadsTab() {
  const { authFetch } = useAdminAuth();

  const [leads, setLeads] = useState<InvestorLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeLead, setActiveLead] = useState<InvestorLead | null>(null);

  const getBaseUrl = () => {
    return (
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://api.dpremiumhomes.com/api"
    ).replace(/\/+$/, "");
  };

  const fetchLeads = useCallback(async () => {
    try {
      setLoading(true);
      const baseUrl = getBaseUrl();
      const res = await authFetch(`${baseUrl}/investments`, { method: "GET" });

      if (res.ok) {
        const data = await res.json().catch(() => null);
        const list: InvestorLead[] = Array.isArray(data)
          ? data
          : data?.data || data?.investments || data?.leads || [];
        setLeads(list);
      } else {
        toast.error("Failed to fetch investor leads");
      }
    } catch (err: any) {
      console.error("Error fetching investor leads:", err);
      toast.error(err?.message || "Network error loading investor leads");
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Reset to first page on search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return dateStr.split("T")[0];
  };

  const formatTimestamp = (dateStr?: string) => {
    if (!dateStr) return "-";
    return dateStr.replace("T", " ").substring(0, 19);
  };

  const filteredLeads = leads.filter((lead) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (lead.name && lead.name.toLowerCase().includes(q)) ||
      (lead.email && lead.email.toLowerCase().includes(q)) ||
      (lead.contact_number && lead.contact_number.includes(q)) ||
      (lead.phone && lead.phone.includes(q)) ||
      (lead.address && lead.address.toLowerCase().includes(q)) ||
      (lead.investmentInterest && lead.investmentInterest.toLowerCase().includes(q)) ||
      String(lead.id).includes(q)
    );
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE) || 1;
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="w-full space-y-6 font-sans font-normal animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#044133]" />
            <h1 className="text-xl sm:text-2xl text-stone-900 tracking-tight font-normal">
              Investor Leads
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-1 font-normal">
            {leads.length} total investor inquiries received
          </p>
        </div>

        <button
          type="button"
          onClick={fetchLeads}
          disabled={loading}
          className="self-start sm:self-auto p-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
          title="Refresh investor leads"
        >
          <RefreshCw
            className={cn("w-4 h-4", loading && "animate-spin text-[#044133]")}
          />
        </button>
      </div>

      {/* Search */}
      <div className="w-full max-w-sm relative">
        <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          placeholder="Search by name, email, phone, location..."
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
                <th scope="col" className="py-3.5 px-5 font-normal min-w-[160px]">
                  INVESTOR
                </th>
                <th scope="col" className="py-3.5 px-5 font-normal min-w-[160px]">
                  CONTACT
                </th>
                <th scope="col" className="py-3.5 px-5 font-normal min-w-[130px]">
                  TIMELINE
                </th>
                <th scope="col" className="py-3.5 px-5 font-normal min-w-[180px]">
                  INTEREST
                </th>
                <th scope="col" className="py-3.5 px-5 font-normal min-w-[100px]">
                  DATE
                </th>
                <th scope="col" className="py-3.5 px-5 font-normal text-right w-20">
                  ACTION
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100 font-normal">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-[#044133]" />
                      <span>Loading investor leads...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileText className="w-8 h-8 text-stone-300" />
                      <span>No investor leads found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedLeads.map((lead, idx) => {
                  const serialNumber = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                  return (
                    <tr key={lead.id || idx} className="hover:bg-[#fbfcfb] transition-colors">
                      <td className="py-4 px-5 text-stone-400 font-normal">
                        {serialNumber}
                      </td>

                      <td className="py-4 px-5 text-stone-900 font-normal">
                        <div>
                          <p className="line-clamp-1">{lead.name}</p>
                          {lead.address && (
                            <p className="text-[11px] text-stone-400 line-clamp-1 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-2.5 h-2.5" />
                              {lead.address}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-5 text-stone-600 font-normal">
                        <div className="space-y-0.5">
                          <p className="line-clamp-1">
                            {lead.contact_number || lead.phone || "-"}
                          </p>
                          {lead.email && (
                            <p className="text-[11px] text-stone-400 line-clamp-1">
                              {lead.email}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-5 text-stone-700 font-normal">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-normal bg-stone-100 text-stone-700 border border-stone-200/60">
                          {lead.timeline || "Not specified"}
                        </span>
                      </td>

                      <td className="py-4 px-5 text-stone-600 font-normal">
                        <p className="line-clamp-1 max-w-xs">
                          {lead.investmentInterest || "-"}
                        </p>
                      </td>

                      <td className="py-4 px-5 text-stone-500 font-normal whitespace-nowrap">
                        {formatDate(lead.created_at)}
                      </td>

                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setActiveLead(lead)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-stone-200 text-stone-600 hover:text-[#044133] hover:bg-stone-50 transition-colors cursor-pointer text-xs font-normal"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 20 items Pagination Footer */}
        {filteredLeads.length > 0 && (
          <div className="px-5 py-4 border-t border-stone-200 bg-[#fcfbf9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-500 font-normal">
            <div>
              Showing{" "}
              <span className="text-stone-800 font-normal">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              </span>{" "}
              to{" "}
              <span className="text-stone-800 font-normal">
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredLeads.length)}
              </span>{" "}
              of{" "}
              <span className="text-stone-800 font-normal">
                {filteredLeads.length}
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
                    // Show first, last, current, and surrounding pages
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

      {/* LEAD DETAILS MODAL */}
      {activeLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-2xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 border border-stone-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="text-base text-stone-900 font-normal">
                  Investor Inquiry Details
                </h3>
                <p className="text-xs text-stone-400 font-normal">
                  Inquiry #{activeLead.id}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveLead(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-700">
              <div className="grid grid-cols-2 gap-3 bg-stone-50 p-3 rounded-xl border border-stone-200/60">
                <div>
                  <span className="text-[11px] text-stone-400 block mb-0.5">Name</span>
                  <span className="text-stone-900 font-normal">{activeLead.name}</span>
                </div>
                <div>
                  <span className="text-[11px] text-stone-400 block mb-0.5">Date</span>
                  <span className="text-stone-900 font-normal">
                    {formatTimestamp(activeLead.created_at)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  <span>{activeLead.contact_number || activeLead.phone || "No phone"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  <span>{activeLead.email || "No email"}</span>
                </div>
                {activeLead.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>{activeLead.address}</span>
                  </div>
                )}
                {activeLead.timeline && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>Timeline: {activeLead.timeline}</span>
                  </div>
                )}
                {activeLead.discussion_availability && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>Availability: {activeLead.discussion_availability}</span>
                  </div>
                )}
              </div>

              {activeLead.investmentInterest && (
                <div className="pt-2 border-t border-stone-100">
                  <span className="text-[11px] text-stone-400 block mb-1">
                    Investment Interest
                  </span>
                  <p className="bg-stone-50 p-2.5 rounded-lg border border-stone-200/60 leading-relaxed text-stone-800">
                    {activeLead.investmentInterest}
                  </p>
                </div>
              )}

              {activeLead.socialLink && (
                <div className="pt-1">
                  <a
                    href={activeLead.socialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#044133] hover:underline"
                  >
                    <span>View Social Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setActiveLead(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-normal cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
