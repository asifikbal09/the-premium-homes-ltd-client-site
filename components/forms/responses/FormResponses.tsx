"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormUserAuth } from "@/context/FormUserAuthContext";
import { toast } from "sonner";
import {
  ArrowLeft,
  Download,
  CheckCircle2,
  X,
  FileSpreadsheet,
  Eye,
  ChevronLeft,
  ChevronRight,
  FileText,
  Loader2,
  Briefcase,
  Table as TableIcon,
  Layers,
  Calendar,
  Clock,
  Inbox,
  Sparkles,
} from "lucide-react";
import { resolveStorageUrl } from "@/lib/forms/formUtils";
import { isRecruitmentForm } from "@/lib/forms/formTemplates";
import { CandidateSpreadsheetView } from "./CandidateSpreadsheetView";

const getApiBaseUrl = () => {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://api.dpremiumhomes.com/api"
  ).replace(/\/+$/, "");
};

interface FormResponsesProps {
  formId?: string | null;
}

export function FormResponses({ formId: propFormId }: FormResponsesProps) {
  const router = useRouter();
  const { authFetch, token } = useFormUserAuth();

  const [allForms, setAllForms] = useState<any[]>([]);
  const [selectedFormId, setSelectedFormId] = useState<string>(propFormId || "");

  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"auto" | "spreadsheet" | "standard">("auto");

  // Pagination & Stats
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    this_week: 0,
    this_month: 0,
  });

  // Export Modal State
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportStartId, setExportStartId] = useState("");
  const [exportEndId, setExportEndId] = useState("");
  const [exporting, setExporting] = useState(false);

  // Response Details Modal State
  const [selectedResponse, setSelectedResponse] = useState<any | null>(null);

  // Load all forms for dropdown selector
  useEffect(() => {
    const fetchAllForms = async () => {
      try {
        const baseUrl = getApiBaseUrl();
        const res = await authFetch(`${baseUrl}/tphl-forms/forms`);
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : data?.forms || data?.data || [];
          setAllForms(list);
          if (!selectedFormId && list.length > 0) {
            setSelectedFormId(String(list[0].id));
          }
        }
      } catch (err) {
        console.error("Failed to load forms dropdown:", err);
      }
    };
    fetchAllForms();
  }, [authFetch, selectedFormId]);

  // Determine current active form
  const selectedForm = useMemo(() => {
    return allForms.find((f) => String(f.id) === String(selectedFormId));
  }, [allForms, selectedFormId]);

  const isRecruitment = isRecruitmentForm(selectedForm);
  const effectiveViewMode =
    viewMode === "auto" ? (isRecruitment ? "spreadsheet" : "standard") : viewMode;

  // Fetch responses and stats
  const fetchResponses = useCallback(
    async (page = 1) => {
      if (!selectedFormId) return;
      try {
        setLoading(true);
        const baseUrl = getApiBaseUrl();
        const res = await authFetch(
          `${baseUrl}/tphl-forms/forms/${selectedFormId}/responses?page=${page}`
        );

        if (!res.ok) {
          throw new Error("Failed to load responses");
        }

        const data = await res.json();

        // Support various API response wrapper structures
        const pagination = data?.pagination || data?.responses || data?.data;
        const list = Array.isArray(pagination?.data)
          ? pagination.data
          : Array.isArray(pagination)
          ? pagination
          : Array.isArray(data)
          ? data
          : [];

        setResponses(list);
        setCurrentPage(pagination?.current_page || page);
        setLastPage(pagination?.last_page || 1);
        setTotalCount(pagination?.total || list.length);

        if (data?.stats) {
          setStats(data.stats);
        } else {
          setStats({
            total: pagination?.total || list.length,
            today: data?.today_count || 0,
            this_week: data?.week_count || 0,
            this_month: data?.month_count || 0,
          });
        }
      } catch (error) {
        console.error("Fetch responses error:", error);
        toast.error("Failed to load form responses");
      } finally {
        setLoading(false);
      }
    },
    [selectedFormId, authFetch]
  );

  useEffect(() => {
    if (selectedFormId) {
      fetchResponses(1);
    }
  }, [selectedFormId, fetchResponses]);

  // Normalize raw file object
  const normalizeFileObj = (fileObj: any) => {
    if (!fileObj) return { name: "document.pdf", path: "", url: "" };
    if (typeof fileObj === "string") {
      const name = fileObj.split("/").pop() || "document.pdf";
      return { name, path: fileObj, url: resolveStorageUrl(fileObj) };
    }
    return {
      name:
        fileObj.name ||
        (fileObj.path ? fileObj.path.split("/").pop() : "document.pdf"),
      path: fileObj.path || "",
      url: fileObj.url || (fileObj.path ? resolveStorageUrl(fileObj.path) : ""),
    };
  };

  // View file in new browser tab
  const handleViewFile = async (
    responseId: string | number,
    questionKey: string,
    rawFileObj: any
  ) => {
    const fileObj = normalizeFileObj(rawFileObj);
    const toastId = toast.loading("Opening document...");

    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(
        `${baseUrl}/tphl-forms/responses/${responseId}/file?field=${encodeURIComponent(
          questionKey
        )}&path=${encodeURIComponent(fileObj.path)}&action=view`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        // Fallback to direct resolved storage URL if proxy fails
        if (fileObj.url) {
          window.open(fileObj.url, "_blank");
          toast.dismiss(toastId);
          return;
        }
        throw new Error("Could not access file");
      }

      const blob = await res.blob();
      const mimeType = res.headers.get("content-type") || "application/pdf";
      const blobUrl = window.URL.createObjectURL(new Blob([blob], { type: mimeType }));
      window.open(blobUrl, "_blank");
      toast.dismiss(toastId);
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
    } catch {
      if (fileObj.url) {
        window.open(fileObj.url, "_blank");
      } else {
        toast.error("File could not be opened");
      }
      toast.dismiss(toastId);
    }
  };

  // Download file directly
  const handleDownloadFile = async (
    responseId: string | number,
    questionKey: string,
    rawFileObj: any
  ) => {
    const fileObj = normalizeFileObj(rawFileObj);
    const fileName = fileObj.name || "document.pdf";
    const toastId = toast.loading(`Downloading ${fileName}...`);

    try {
      const baseUrl = getApiBaseUrl();
      const res = await fetch(
        `${baseUrl}/tphl-forms/responses/${responseId}/file?field=${encodeURIComponent(
          questionKey
        )}&path=${encodeURIComponent(fileObj.path)}&action=download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        if (fileObj.url) {
          const a = document.createElement("a");
          a.href = fileObj.url;
          a.download = fileName;
          a.target = "_blank";
          document.body.appendChild(a);
          a.click();
          a.remove();
          toast.success("Download started");
          toast.dismiss(toastId);
          return;
        }
        throw new Error("Download request failed");
      }

      const blob = await res.blob();
      const mimeType = res.headers.get("content-type") || "application/octet-stream";
      const blobUrl = window.URL.createObjectURL(new Blob([blob], { type: mimeType }));
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 5000);

      toast.success(`${fileName} downloaded successfully`);
      toast.dismiss(toastId);
    } catch {
      toast.error("Failed to download file");
      toast.dismiss(toastId);
    }
  };

  // Handle Export CSV
  const handleExecuteExport = async () => {
    try {
      setExporting(true);
      const baseUrl = getApiBaseUrl();

      let url = `${baseUrl}/tphl-forms/forms/${selectedFormId}/responses?export=true`;
      if (exportStartId) url += `&start_id=${exportStartId}`;
      if (exportEndId) url += `&end_id=${exportEndId}`;

      const res = await authFetch(url);
      if (!res.ok) throw new Error("Failed to export data");

      const data = await res.json();
      const exportList: any[] = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data)
        ? data
        : responses;

      if (exportList.length === 0) {
        toast.info("No responses found in selected range");
        return;
      }

      // Build CSV string
      const headers = ["ID", "Submitted At"];
      const sampleData = exportList[0]?.data_json || {};
      const questionKeys = Object.keys(sampleData);
      headers.push(...questionKeys);

      const csvRows = [headers.join(",")];

      exportList.forEach((row) => {
        const rowData = row.data_json || {};
        const values = [
          row.id,
          `"${new Date(row.created_at).toLocaleString()}"`,
        ];

        questionKeys.forEach((key) => {
          let val = rowData[key];
          if (Array.isArray(val)) val = val.join("; ");
          if (val === null || val === undefined) val = "";
          values.push(`"${String(val).replace(/"/g, '""')}"`);
        });

        csvRows.push(values.join(","));
      });

      const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `TPHL_Responses_Form_${selectedFormId}_${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 5000);

      // Mark exported in backend
      const exportedIds = exportList.map((r) => r.id);
      await authFetch(`${baseUrl}/tphl-forms/forms/${selectedFormId}/responses/export`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response_ids: exportedIds }),
      });

      toast.success("CSV exported successfully!");
      setShowExportModal(false);
      fetchResponses(currentPage);
    } catch (err: any) {
      console.error("Export error:", err);
      toast.error(err?.message || "Export failed");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="w-full space-y-6 text-[#1f2723]">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/tphl-forms/dashboard"
            className="p-2 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors"
            title="Back to Forms Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-normal text-[#1f2723] tracking-tight">
              Form Responses
            </h1>
            <p className="text-xs text-stone-500 font-normal mt-0.5">
              Review candidate applications and campaign form submissions
            </p>
          </div>
        </div>

        {/* Form Selector Dropdown & Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={selectedFormId}
            onChange={(e) => {
              setSelectedFormId(e.target.value);
              router.push(`/tphl-forms/forms/${e.target.value}/responses`);
            }}
            className="px-3 py-2 rounded-xl border border-stone-200 bg-white text-xs font-normal text-stone-800 outline-none focus:border-emerald-600 shadow-xs max-w-xs"
          >
            {allForms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.campaign_name || f.title || `Form #${f.id}`}
              </option>
            ))}
          </select>

          {/* View Mode Toggle Button */}
          <div className="flex items-center bg-stone-100 p-1 rounded-lg border border-stone-200/80 text-xs">
            <button
              onClick={() => setViewMode("standard")}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer font-normal flex items-center gap-1 ${
                effectiveViewMode === "standard"
                  ? "bg-white text-stone-900 shadow-xs"
                  : "text-stone-500 hover:text-stone-900"
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode("spreadsheet")}
              className={`px-2.5 py-1 rounded-md transition-all cursor-pointer font-normal flex items-center gap-1 ${
                effectiveViewMode === "spreadsheet"
                  ? "bg-white text-stone-900 shadow-xs"
                  : "text-stone-500 hover:text-stone-900"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Spreadsheet</span>
            </button>
          </div>

          <button
            onClick={() => setShowExportModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#044133] hover:bg-[#065845] text-white rounded-lg text-xs font-normal shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Stats Overview Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] text-stone-500 font-normal">Total Submissions</p>
            <h3 className="text-xl font-normal text-stone-900 mt-0.5">
              {stats.total || totalCount}
            </h3>
          </div>
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-[#044133] flex items-center justify-center">
            <Inbox className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] text-stone-500 font-normal">Today</p>
            <h3 className="text-xl font-normal text-stone-900 mt-0.5">
              {stats.today || 0}
            </h3>
          </div>
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] text-stone-500 font-normal">This Week</p>
            <h3 className="text-xl font-normal text-stone-900 mt-0.5">
              {stats.this_week || 0}
            </h3>
          </div>
          <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
            <Calendar className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] text-stone-500 font-normal">This Month</p>
            <h3 className="text-xl font-normal text-stone-900 mt-0.5">
              {stats.this_month || 0}
            </h3>
          </div>
          <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Main View Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-stone-200 shadow-xs text-stone-400">
          <Loader2 className="w-7 h-7 animate-spin text-[#044133] mb-3" />
          <p className="text-xs font-normal text-stone-500">Loading responses...</p>
        </div>
      ) : responses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-xl border border-stone-200 shadow-xs text-center">
          <div className="w-12 h-12 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-400 mb-3">
            <FileSpreadsheet className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h3 className="text-sm font-normal text-stone-800">
            No responses recorded yet
          </h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm font-normal">
            Share your public form link to start collecting submissions.
          </p>
          {selectedForm?.slug && (
            <a
              href={`/f/${selectedForm.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 px-3.5 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-xs font-normal text-stone-700 transition-colors"
            >
              Open Public Form
            </a>
          )}
        </div>
      ) : effectiveViewMode === "spreadsheet" ? (
        <CandidateSpreadsheetView
          responses={responses}
          formId={selectedFormId}
          formName={selectedForm?.campaign_name || selectedForm?.title}
          onViewFile={handleViewFile}
          onDownloadFile={handleDownloadFile}
          onExportCsv={() => setShowExportModal(true)}
          onViewResponse={(resp) => setSelectedResponse(resp)}
        />
      ) : (
        /* Standard Table View */
        <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-100 text-stone-400 font-normal bg-stone-50/60">
                  <th className="py-3 px-4 font-normal">#ID</th>
                  <th className="py-3 px-4 font-normal">Submitted Date</th>
                  <th className="py-3 px-4 font-normal">Key Answers</th>
                  <th className="py-3 px-4 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {responses.map((resp) => {
                  const data = resp.data_json || {};
                  const keys = Object.keys(data).slice(0, 3);

                  return (
                    <tr
                      key={resp.id}
                      className="hover:bg-stone-50/70 transition-colors cursor-pointer group"
                      onClick={() => setSelectedResponse(resp)}
                    >
                      <td className="py-3.5 px-4 font-normal text-stone-500 whitespace-nowrap">
                        #{resp.id}
                      </td>

                      <td className="py-3.5 px-4 font-normal text-stone-700 whitespace-nowrap">
                        {new Date(resp.created_at).toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4 font-normal text-stone-700">
                        <div className="flex flex-wrap items-center gap-2">
                          {keys.map((k) => (
                            <span
                              key={k}
                              className="inline-block max-w-[200px] truncate px-2 py-0.5 rounded bg-stone-100 text-stone-600 text-[11px]"
                            >
                              {String(data[k])}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td
                        className="py-3.5 px-4 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => setSelectedResponse(resp)}
                          className="p-1 hover:bg-stone-100 rounded text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
                          title="View Full Submission"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {lastPage > 1 && (
            <div className="p-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-normal">
              <span>
                Page {currentPage} of {lastPage}
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => fetchResponses(currentPage - 1)}
                  className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={currentPage >= lastPage}
                  onClick={() => fetchResponses(currentPage + 1)}
                  className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Response Detail Modal */}
      {selectedResponse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-stone-100 space-y-6">
            <div className="flex items-start justify-between border-b border-stone-100 pb-4">
              <div>
                <span className="text-[11px] text-stone-400 font-normal">
                  Response #{selectedResponse.id}
                </span>
                <h3 className="text-base font-normal text-stone-900">
                  Submission Details
                </h3>
                <p className="text-xs text-stone-400 font-normal mt-0.5">
                  Submitted at: {new Date(selectedResponse.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedResponse(null)}
                className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {Object.entries(selectedResponse.data_json || {}).map(([key, val]) => (
                <div
                  key={key}
                  className="p-3.5 rounded-xl bg-stone-50/70 border border-stone-100 space-y-1"
                >
                  <span className="text-xs text-stone-500 font-normal block">
                    {key}
                  </span>
                  <div className="text-xs text-stone-900 font-normal break-words">
                    {Array.isArray(val) ? val.join(", ") : String(val)}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3 border-t border-stone-100">
              <button
                onClick={() => setSelectedResponse(null)}
                className="px-4 py-2 rounded-lg bg-stone-100 text-stone-700 text-xs font-normal hover:bg-stone-200 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-100 space-y-4">
            <div>
              <h3 className="text-base font-normal text-stone-900">
                Export Responses to CSV
              </h3>
              <p className="text-xs text-stone-500 font-normal mt-1 leading-relaxed">
                Download responses in CSV format. Optionally specify an ID range or leave blank to export all.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs text-stone-600 font-normal mb-1">
                  Start Response ID (Optional)
                </label>
                <input
                  type="number"
                  value={exportStartId}
                  onChange={(e) => setExportStartId(e.target.value)}
                  placeholder="e.g. 1"
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs outline-none focus:border-emerald-600 font-normal"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-600 font-normal mb-1">
                  End Response ID (Optional)
                </label>
                <input
                  type="number"
                  value={exportEndId}
                  onChange={(e) => setExportEndId(e.target.value)}
                  placeholder="e.g. 100"
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs outline-none focus:border-emerald-600 font-normal"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-stone-100">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-3.5 py-2 text-xs font-normal text-stone-600 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteExport}
                disabled={exporting}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#044133] hover:bg-[#065845] text-white text-xs font-normal shadow-xs transition-colors cursor-pointer disabled:opacity-60"
              >
                {exporting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Exporting...</span>
                  </>
                ) : (
                  <span>Export</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
