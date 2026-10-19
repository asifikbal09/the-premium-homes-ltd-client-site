"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { toast } from "sonner";
import {
  Radio,
  RefreshCw,
  Loader2,
  Eye,
  Square,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Tv,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface LiveStreamItem {
  id: number;
  channel: string;
  title: string;
  description?: string;
  host?: string;
  viewers?: number;
  status: string;
  started_at?: string;
  created_at?: string;
}

const ITEMS_PER_PAGE = 20;

export function LiveStreamsTab() {
  const { authFetch } = useAdminAuth();

  const [streams, setStreams] = useState<LiveStreamItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Start Stream Form state
  const [streamTitle, setStreamTitle] = useState("");
  const [streamDescription, setStreamDescription] = useState("");
  const [isStarting, setIsStarting] = useState(false);

  // Stop Stream state
  const [streamToStop, setStreamToStop] = useState<LiveStreamItem | null>(null);
  const [isStopping, setIsStopping] = useState(false);

  const getBaseUrl = () => {
    return (
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://api.dpremiumhomes.com/api"
    ).replace(/\/+$/, "");
  };

  // 1. FETCH ALL ACTIVE LIVE STREAMS
  const fetchStreams = useCallback(async () => {
    try {
      setLoading(true);
      const baseUrl = getBaseUrl();
      let res = await authFetch(`${baseUrl}/admin/live-streams`, { method: "GET" });

      if (!res.ok && res.status === 404) {
        res = await authFetch(`${baseUrl}/live-streams`, { method: "GET" });
      }

      if (res.ok) {
        const data = await res.json().catch(() => null);
        const list: LiveStreamItem[] = Array.isArray(data)
          ? data
          : data?.streams || data?.data || [];
        setStreams(list);
      } else {
        toast.error("Failed to load live streams");
      }
    } catch (err: any) {
      console.error("Error fetching live streams:", err);
      toast.error(err?.message || "Network error loading live streams");
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    fetchStreams();
  }, [fetchStreams]);

  // 2. START NEW STREAM
  const handleStartStream = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!streamTitle.trim()) {
      toast.error("Please enter a stream title");
      return;
    }

    try {
      setIsStarting(true);
      const baseUrl = getBaseUrl();
      let res = await authFetch(`${baseUrl}/admin/live-streams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: streamTitle.trim(),
          description: streamDescription.trim() || undefined,
        }),
      });

      if (!res.ok && res.status === 404) {
        res = await authFetch(`${baseUrl}/live-streams`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: streamTitle.trim(),
            description: streamDescription.trim() || undefined,
          }),
        });
      }

      const data = await res.json().catch(() => null);
      if (res.ok) {
        toast.success(data?.message || "Live stream started successfully!");
        setStreamTitle("");
        setStreamDescription("");
        fetchStreams();
      } else {
        toast.error(data?.message || "Failed to start live stream");
      }
    } catch (err: any) {
      console.error("Start stream error:", err);
      toast.error(err?.message || "Network error starting live stream");
    } finally {
      setIsStarting(false);
    }
  };

  // 3. STOP / END LIVE STREAM
  const handleConfirmStop = async () => {
    if (!streamToStop) return;

    try {
      setIsStopping(true);
      const baseUrl = getBaseUrl();
      const identifier = streamToStop.id || streamToStop.channel;

      let res = await authFetch(`${baseUrl}/admin/live-streams/${identifier}/stop`, {
        method: "POST",
      });

      if (!res.ok) {
        res = await authFetch(`${baseUrl}/admin/live-streams/${identifier}`, {
          method: "DELETE",
        });
      }

      const data = await res.json().catch(() => null);
      if (res.ok) {
        toast.success(data?.message || "Live stream stopped successfully");
        setStreams((prev) =>
          prev.filter((s) => s.id !== streamToStop.id && s.channel !== streamToStop.channel)
        );
        setStreamToStop(null);
      } else {
        toast.error(data?.message || "Failed to stop stream");
      }
    } catch (err: any) {
      console.error("Stop stream error:", err);
      toast.error(err?.message || "Network error stopping stream");
    } finally {
      setIsStopping(false);
    }
  };

  // Format started time
  const formatStartedTime = (item: LiveStreamItem) => {
    if (item.started_at) return item.started_at;
    if (item.created_at) {
      const date = new Date(item.created_at);
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      }
    }
    return "Just now";
  };

  // Pagination calculation
  const totalPages = Math.ceil(streams.length / ITEMS_PER_PAGE) || 1;
  const paginatedStreams = streams.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="w-full space-y-6 font-sans font-normal animate-in fade-in duration-200">
      {/* Page Header matching screenshot */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-[#044133]" />
          <h1 className="text-xl sm:text-2xl text-stone-900 tracking-tight font-normal">
            Live Streams
          </h1>
        </div>

        <button
          type="button"
          onClick={fetchStreams}
          disabled={loading}
          className="p-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
          title="Refresh active streams"
        >
          <RefreshCw
            className={cn("w-4 h-4", loading && "animate-spin text-[#044133]")}
          />
        </button>
      </div>

      {/* 1. START NEW STREAM CARD (Matches Screenshot 1 top) */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
        <h2 className="text-sm text-stone-900 font-normal">
          Start New Stream
        </h2>

        <form onSubmit={handleStartStream} className="space-y-4 max-w-xl">
          <div>
            <input
              type="text"
              required
              placeholder="Stream Title *"
              value={streamTitle}
              onChange={(e) => setStreamTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#044133] focus:ring-1 focus:ring-[#044133] font-normal"
            />
          </div>

          <div>
            <textarea
              rows={3}
              placeholder="Description (optional)"
              value={streamDescription}
              onChange={(e) => setStreamDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#044133] focus:ring-1 focus:ring-[#044133] font-normal resize-y"
            />
          </div>

          <button
            type="submit"
            disabled={isStarting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#044133] hover:bg-[#033026] text-white text-xs font-normal transition-colors cursor-pointer shadow-sm disabled:opacity-50"
          >
            {isStarting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Starting Stream...</span>
              </>
            ) : (
              <>
                <Radio className="w-4 h-4" />
                <span>Go Live</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* 2. ALL ACTIVE STREAMS CARD (Matches Screenshot 1 bottom) */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
        <h2 className="text-sm text-stone-900 font-normal">
          All Active Streams
        </h2>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-[#fcfbf9] border-b border-stone-200 text-[11px] uppercase tracking-wider text-stone-500 font-normal">
              <tr>
                <th scope="col" className="py-3.5 px-5 font-normal w-14">
                  SL
                </th>
                <th scope="col" className="py-3.5 px-5 font-normal min-w-[180px]">
                  CHANNEL
                </th>
                <th scope="col" className="py-3.5 px-5 font-normal min-w-[160px]">
                  TITLE
                </th>
                <th scope="col" className="py-3.5 px-5 font-normal min-w-[100px]">
                  HOST
                </th>
                <th scope="col" className="py-3.5 px-5 font-normal min-w-[100px]">
                  VIEWERS
                </th>
                <th scope="col" className="py-3.5 px-5 font-normal min-w-[100px]">
                  STARTED
                </th>
                <th scope="col" className="py-3.5 px-5 font-normal min-w-[90px]">
                  STATUS
                </th>
                <th scope="col" className="py-3.5 px-5 font-normal text-right w-24">
                  ACTIONS
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100 font-normal">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="w-6 h-6 animate-spin text-[#044133]" />
                      <span>Loading active streams...</span>
                    </div>
                  </td>
                </tr>
              ) : streams.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Tv className="w-8 h-8 text-stone-300" />
                      <span>No active live streams at this moment</span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedStreams.map((stream, idx) => {
                  const serialNumber = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;
                  return (
                    <tr key={stream.id || stream.channel || idx} className="hover:bg-[#fbfcfb] transition-colors">
                      <td className="py-4 px-5 text-stone-400 font-normal">
                        {serialNumber}
                      </td>

                      <td className="py-4 px-5 font-mono text-[11px] text-stone-600">
                        {stream.channel}
                      </td>

                      <td className="py-4 px-5 text-stone-900 font-normal">
                        <span className="line-clamp-1">{stream.title || "Live Stream"}</span>
                      </td>

                      <td className="py-4 px-5 text-stone-600 font-normal">
                        {stream.host || "Host"}
                      </td>

                      <td className="py-4 px-5 text-stone-700 font-normal">
                        <div className="flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-stone-400" />
                          <span>{stream.viewers ?? 0}</span>
                        </div>
                      </td>

                      <td className="py-4 px-5 text-stone-500 font-normal whitespace-nowrap">
                        {formatStartedTime(stream)}
                      </td>

                      <td className="py-4 px-5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-normal bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          LIVE
                        </span>
                      </td>

                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setStreamToStop(stream)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-normal transition-colors cursor-pointer shadow-2xs"
                        >
                          <Square className="w-3 h-3 fill-current" />
                          <span>Stop</span>
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
        {streams.length > 0 && (
          <div className="px-5 py-4 border-t border-stone-200 bg-[#fcfbf9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-500 font-normal rounded-b-2xl">
            <div>
              Showing{" "}
              <span className="text-stone-800 font-normal">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              </span>{" "}
              to{" "}
              <span className="text-stone-800 font-normal">
                {Math.min(currentPage * ITEMS_PER_PAGE, streams.length)}
              </span>{" "}
              of{" "}
              <span className="text-stone-800 font-normal">{streams.length}</span>{" "}
              streams
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

      {/* Stop Stream Confirmation Modal */}
      {streamToStop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-2xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 border border-stone-200 shadow-xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-base text-stone-900 font-normal">
                End Live Stream?
              </h3>
              <p className="text-xs text-stone-500 mt-1 font-normal leading-relaxed">
                Are you sure you want to stop the stream &quot;
                <span className="text-stone-800">{streamToStop.title}</span>&quot;?
                Connected viewers will be disconnected.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setStreamToStop(null)}
                disabled={isStopping}
                className="px-3.5 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-normal cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmStop}
                disabled={isStopping}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-normal cursor-pointer disabled:opacity-50"
              >
                {isStopping ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Stopping...</span>
                  </>
                ) : (
                  <span>Stop Stream</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
