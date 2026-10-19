"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { toast } from "sonner";
import {
  UserCheck,
  Search,
  RefreshCw,
  Loader2,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface GuestUser {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  is_verified?: boolean | number;
  created_at?: string;
}

const ITEMS_PER_PAGE = 20;

export function GuestUsersTab() {
  const { authFetch } = useAdminAuth();

  const [users, setUsers] = useState<GuestUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Verified" | "Unverified">("All");
  const [currentPage, setCurrentPage] = useState(1);

  const getBaseUrl = () => {
    return (
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://api.dpremiumhomes.com/api"
    ).replace(/\/+$/, "");
  };

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const baseUrl = getBaseUrl();
      const res = await authFetch(`${baseUrl}/guest-users`, { method: "GET" });

      if (res.ok) {
        const data = await res.json().catch(() => null);
        const list: GuestUser[] = Array.isArray(data)
          ? data
          : data?.users || data?.data || [];
        setUsers(list);
      } else {
        toast.error("Failed to fetch guest users");
      }
    } catch (err: any) {
      console.error("Error fetching guest users:", err);
      toast.error(err?.message || "Network error loading guest users");
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Reset to first page on search or status change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const formatTimestamp = (dateStr?: string) => {
    if (!dateStr) return "-";
    return dateStr.replace("T", " ").substring(0, 19);
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.phone && u.phone.includes(q)) ||
      String(u.id).includes(q);

    if (!matchesSearch) return false;

    const isVer = Boolean(u.is_verified);
    if (statusFilter === "Verified") return isVer;
    if (statusFilter === "Unverified") return !isVer;

    return true;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE) || 1;
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="w-full space-y-6 font-sans font-normal animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#044133]" />
            <h1 className="text-xl sm:text-2xl text-stone-900 tracking-tight font-normal">
              Guest Users List
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-1 font-normal">
            {users.length} total registered guest users
          </p>
        </div>

        <button
          type="button"
          onClick={fetchUsers}
          disabled={loading}
          className="self-start sm:self-auto p-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
          title="Refresh guest users"
        >
          <RefreshCw
            className={cn("w-4 h-4", loading && "animate-spin text-[#044133]")}
          />
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="w-full max-w-sm relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 bg-white text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#044133] focus:ring-1 focus:ring-[#044133] shadow-2xs font-normal"
          />
        </div>

        {/* Verification Pills */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-white p-1 rounded-xl border border-stone-200">
          {(["All", "Verified", "Unverified"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setStatusFilter(tab)}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-normal transition-colors cursor-pointer",
                statusFilter === tab
                  ? "bg-[#044133] text-white shadow-2xs"
                  : "text-stone-600 hover:text-stone-900 hover:bg-stone-50"
              )}
            >
              {tab}
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
                <th scope="col" className="py-3.5 px-5 font-normal min-w-[200px]">
                  NAME
                </th>
                <th scope="col" className="py-3.5 px-5 font-normal min-w-[200px]">
                  EMAIL
                </th>
                <th scope="col" className="py-3.5 px-5 font-normal min-w-[150px]">
                  PHONE
                </th>
                <th scope="col" className="py-3.5 px-5 font-normal min-w-[140px]">
                  STATUS
                </th>
                <th scope="col" className="py-3.5 px-5 font-normal text-right min-w-[140px]">
                  JOINED DATE
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100 font-normal">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-[#044133]" />
                      <span>Loading guest users...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="w-8 h-8 text-stone-300" />
                      <span>No guest users found</span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((u, idx) => {
                  const serialNumber = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                  const isVerified = Boolean(u.is_verified);
                  const initial = u.name ? u.name.charAt(0).toUpperCase() : "G";

                  return (
                    <tr key={u.id} className="hover:bg-[#fbfcfb] transition-colors">
                      <td className="py-4 px-5 text-stone-400 font-normal">
                        {serialNumber}
                      </td>

                      <td className="py-4 px-5 text-stone-900 font-normal">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 flex items-center justify-center text-xs font-normal shrink-0">
                            {initial}
                          </div>
                          <span className="line-clamp-1">{u.name || "Guest User"}</span>
                        </div>
                      </td>

                      <td className="py-4 px-5 text-stone-600 font-normal">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <span className="line-clamp-1">{u.email || "-"}</span>
                        </div>
                      </td>

                      <td className="py-4 px-5 text-stone-600 font-normal">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                          <span>{u.phone || "-"}</span>
                        </div>
                      </td>

                      <td className="py-4 px-5">
                        {isVerified ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-normal bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-normal bg-stone-100 text-stone-600 border border-stone-200">
                            <XCircle className="w-3 h-3 text-stone-400" />
                            Unverified
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-5 text-right text-stone-500 font-normal whitespace-nowrap">
                        {formatTimestamp(u.created_at)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 20 items Pagination Footer */}
        {filteredUsers.length > 0 && (
          <div className="px-5 py-4 border-t border-stone-200 bg-[#fcfbf9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-500 font-normal">
            <div>
              Showing{" "}
              <span className="text-stone-800 font-normal">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              </span>{" "}
              to{" "}
              <span className="text-stone-800 font-normal">
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)}
              </span>{" "}
              of{" "}
              <span className="text-stone-800 font-normal">
                {filteredUsers.length}
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
