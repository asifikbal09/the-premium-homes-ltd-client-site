"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { toast } from "sonner";
import {
  Sparkles,
  Search,
  RefreshCw,
  Loader2,
  Phone,
  Clock,
  Calendar,
  MapPin,
  Briefcase,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface FestivalLead {
  id: number;
  name: string;
  profession?: string;
  phone?: string;
  visiting_hour?: string;
  booking_time?: string;
  area?: string;
  created_at?: string;
}

const AREAS = [
  "All",
  "Asulia",
  "Bashundhara",
  "Jalshiri",
  "RoyalCity",
  "SmartyCity",
];

const ITEMS_PER_PAGE = 20;

export function FestivalLeadsTab() {
  const { authFetch } = useAdminAuth();

  const [leads, setLeads] = useState<FestivalLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);

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
      const res = await authFetch(`${baseUrl}/leads`, { method: "GET" });

      if (res.ok) {
        const data = await res.json().catch(() => null);
        const list: FestivalLead[] = Array.isArray(data)
          ? data
          : data?.data || data?.leads || [];
        setLeads(list);
      } else {
        toast.error("Failed to fetch festival leads");
      }
    } catch (err: any) {
      console.error("Error fetching festival leads:", err);
      toast.error(err?.message || "Network error loading festival leads");
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Reset to first page on search or area change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedArea]);

  const formatTimestamp = (dateStr?: string) => {
    if (!dateStr) return "-";
    return dateStr.replace("T", " ").substring(0, 19);
  };

  const filteredLeads = leads.filter((lead) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (lead.name && lead.name.toLowerCase().includes(q)) ||
      (lead.profession && lead.profession.toLowerCase().includes(q)) ||
      (lead.phone && lead.phone.includes(q)) ||
      (lead.area && lead.area.toLowerCase().includes(q)) ||
      String(lead.id).includes(q);

    if (!matchesSearch) return false;

    if (selectedArea !== "All") {
      return (lead.area || "").toLowerCase() === selectedArea.toLowerCase();
    }
    return true;
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
            <Sparkles className="w-5 h-5 text-[#044133]" />
            <h1 className="text-xl sm:text-2xl text-stone-900 tracking-tight font-normal">
              Festival Leads
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-1 font-normal">
            {leads.length} registrations from Living Festival 2026 campaign
          </p>
        </div>

        <button
          type="button"
          onClick={fetchLeads}
          disabled={loading}
          className="self-start sm:self-auto p-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
          title="Refresh festival leads"
        >
          <RefreshCw
            className={cn("w-4 h-4", loading && "animate-spin text-[#044133]")}
          />
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="w-full max-w-sm relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, profession, phone, area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#044133] focus:ring-1 focus:ring-[#044133] shadow-2xs font-normal"
          />
        </div>

        {/* Area Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {AREAS.map((area) => (
            <button
              key={area}
              type="button"
              onClick={() => setSelectedArea(area)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-normal whitespace-nowrap transition-colors cursor-pointer",
                selectedArea === area
                  ? "bg-[#044133] text-white shadow-2xs"
                  : "bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50"
              )}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="w-full bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-[#fcfbf9] border-b border-stone-200 text-[11px] uppercase tracking-wider text-stone-500 font-normal">
              <tr>
                <th scope="col" className="py-3.5 px-5 font-normal w-14">
                  SL
                </th>
                <th scope="col" className="py-3.5 px-5 font-normal min-w-[150px]">
                  VISITOR NAME
                </th>
                <th scope="col" className="py-3.5 px-5 font-normal min-w-[120px]">
                  PROFESSION
                </th>
                <th scope="col" className="py-3.5 px-5 font-normal min-w-[140px]">
                  PHONE
                </th>
                <th scope="col" className="py-3.5 px-5 font-normal min-w-[140px]">
                  VISITING HOUR
                </th>
                <th scope="col" className="py-3.5 px-5 font-normal min-w-[110px]">
                  BOOKING TIME
                </th>
                <th scope="col" className="py-3.5 px-5 font-normal min-w-[120px]">
                  AREA
                </th>
                <th scope="col" className="py-3.5 px-5 font-normal text-right min-w-[130px]">
                  REGISTERED ON
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100 font-normal">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-[#044133]" />
                      <span>Loading festival registrations...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="w-8 h-8 text-stone-300" />
                      <span>No registrations found</span>
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
                        <span className="line-clamp-1">{lead.name}</span>
                      </td>

                      <td className="py-4 px-5 text-stone-600 font-normal">
                        <div className="flex items-center gap-1.5">
                          <Briefcase className="w-3 h-3 text-stone-400 shrink-0" />
                          <span className="line-clamp-1">{lead.profession || "-"}</span>
                        </div>
                      </td>

                      <td className="py-4 px-5 text-stone-600 font-normal">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3 h-3 text-stone-400 shrink-0" />
                          <span>{lead.phone || "-"}</span>
                        </div>
                      </td>

                      <td className="py-4 px-5 text-stone-600 font-normal">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-stone-400 shrink-0" />
                          <span>{lead.visiting_hour || "-"}</span>
                        </div>
                      </td>

                      <td className="py-4 px-5 text-stone-600 font-normal">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-stone-400 shrink-0" />
                          <span>{lead.booking_time || "-"}</span>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        {lead.area ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-normal bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                            <MapPin className="w-2.5 h-2.5" />
                            {lead.area}
                          </span>
                        ) : (
                          <span className="text-stone-400">-</span>
                        )}
                      </td>

                      <td className="py-4 px-5 text-right text-stone-500 font-normal whitespace-nowrap">
                        {formatTimestamp(lead.created_at)}
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
  );
}
