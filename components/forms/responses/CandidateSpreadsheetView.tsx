"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Download,
  Eye,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Award,
  X,
  Copy,
  ExternalLink,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  RotateCcw,
  FileText,
  Star,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { extractCandidateData, BANGLADESH_UNIVERSITIES } from "@/lib/forms/formTemplates";

export const DECISION_CONFIG: Record<
  string,
  { label: string; badge: string; dot: string; selectClass: string }
> = {
  Shortlisted: {
    label: "Shortlisted",
    badge: "bg-emerald-50 text-emerald-800 border-emerald-300",
    dot: "bg-emerald-500",
    selectClass: "bg-emerald-50 text-emerald-800 border-emerald-300 focus:ring-emerald-500",
  },
  Interview: {
    label: "Interview",
    badge: "bg-blue-50 text-blue-800 border-blue-300",
    dot: "bg-blue-500",
    selectClass: "bg-blue-50 text-blue-800 border-blue-300 focus:ring-blue-500",
  },
  "Under Review": {
    label: "Under Review",
    badge: "bg-amber-50 text-amber-800 border-amber-300",
    dot: "bg-amber-500",
    selectClass: "bg-amber-50 text-amber-800 border-amber-300 focus:ring-amber-500",
  },
  Rejected: {
    label: "Rejected",
    badge: "bg-rose-50 text-rose-800 border-rose-300",
    dot: "bg-rose-500",
    selectClass: "bg-rose-50 text-rose-800 border-rose-300 focus:ring-rose-500",
  },
  Pending: {
    label: "Pending",
    badge: "bg-stone-50 text-stone-700 border-stone-300",
    dot: "bg-stone-400",
    selectClass: "bg-stone-50 text-stone-700 border-stone-200 focus:ring-stone-400",
  },
};

export interface CandidateRecord {
  id: any;
  created_at: any;
  is_exported: any;
  name: string;
  phone: string;
  email: string;
  degree: string;
  university: string;
  passingYear: string;
  major: string;
  cgpa: string;
  ecas: string[];
  achievements: string;
  experience: string;
  lastRole: string;
  functions: string[];
  whyJoin: string;
  contribute: string;
  situation: string;
  resume: any;
  resumeKey: string;
  rawData: any;
  rawItem: any;
  [key: string]: any;
}

interface CandidateSpreadsheetViewProps {
  responses: any[];
  formId: string | number;
  formName?: string;
  onViewFile: (responseId: string | number, fieldKey: string, fileObj: any) => void;
  onDownloadFile: (responseId: string | number, fieldKey: string, fileObj: any) => void;
  onExportCsv: () => void;
  onViewResponse: (response: any) => void;
}

export function CandidateSpreadsheetView({
  responses,
  formId,
  formName,
  onViewFile,
  onDownloadFile,
  onExportCsv,
  onViewResponse,
}: CandidateSpreadsheetViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("all");
  const [selectedCgpa, setSelectedCgpa] = useState("all");
  const [selectedExperience, setSelectedExperience] = useState("all");
  const [selectedFunction, setSelectedFunction] = useState("all");
  const [selectedDecision, setSelectedDecision] = useState("all");
  const [sortField, setSortField] = useState("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);

  // Evaluation storage
  const storageKey = `tphl_evaluations_form_${formId || "default"}`;
  const [evaluations, setEvaluations] = useState<Record<string, { decision?: string; score?: number | string; notes?: string }>>(() => {
    try {
      const saved = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null;
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setEvaluations(saved ? JSON.parse(saved) : {});
    } catch {
      setEvaluations({});
    }
  }, [storageKey]);

  const updateEvaluation = (candidateId: string | number, field: string, value: any) => {
    setEvaluations((prev) => {
      const current = prev[candidateId] || { decision: "Pending", score: "", notes: "" };
      const updated = {
        ...prev,
        [candidateId]: { ...current, [field]: value },
      };
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Convert raw responses to structured candidate records
  const candidates: CandidateRecord[] = useMemo(() => {
    return responses
      .map((r) => extractCandidateData(r))
      .filter((c): c is CandidateRecord => c !== null);
  }, [responses]);

  // Unique university & function options for filters
  const universityOptions = useMemo(() => {
    const set = new Set<string>();
    candidates.forEach((c) => {
      if (c.university && c.university !== "N/A") set.add(c.university);
    });
    return Array.from(set).sort();
  }, [candidates]);

  const functionOptions = useMemo(() => {
    const set = new Set<string>();
    candidates.forEach((c) => {
      (c.functions || []).forEach((f: string) => set.add(f));
    });
    return Array.from(set).sort();
  }, [candidates]);

  // Filtered & Sorted candidate list
  const filteredCandidates = useMemo(() => {
    return candidates
      .filter((c) => {
        // Search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const match =
            c.name.toLowerCase().includes(q) ||
            c.email.toLowerCase().includes(q) ||
            c.phone.toLowerCase().includes(q) ||
            c.university.toLowerCase().includes(q) ||
            c.major.toLowerCase().includes(q);
          if (!match) return false;
        }

        // University
        if (selectedUniversity !== "all" && c.university !== selectedUniversity) {
          return false;
        }

        // CGPA
        if (selectedCgpa !== "all") {
          const num = parseFloat(c.cgpa);
          if (isNaN(num)) return false;
          if (selectedCgpa === "3.75+" && num < 3.75) return false;
          if (selectedCgpa === "3.5-3.74" && (num < 3.5 || num >= 3.75)) return false;
          if (selectedCgpa === "3.0-3.49" && (num < 3.0 || num >= 3.5)) return false;
          if (selectedCgpa === "<3.0" && num >= 3.0) return false;
        }

        // Experience
        if (selectedExperience !== "all" && c.experience !== selectedExperience) {
          return false;
        }

        // Function
        if (selectedFunction !== "all" && !c.functions.includes(selectedFunction)) {
          return false;
        }

        // Decision
        if (selectedDecision !== "all") {
          const dec = evaluations[c.id]?.decision || "Pending";
          if (dec !== selectedDecision) return false;
        }

        return true;
      })
      .sort((a, b) => {
        let valA: any = a[sortField];
        let valB: any = b[sortField];

        if (sortField === "cgpa") {
          valA = parseFloat(valA) || 0;
          valB = parseFloat(valB) || 0;
        }

        if (valA < valB) return sortDirection === "asc" ? -1 : 1;
        if (valA > valB) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
  }, [
    candidates,
    searchQuery,
    selectedUniversity,
    selectedCgpa,
    selectedExperience,
    selectedFunction,
    selectedDecision,
    evaluations,
    sortField,
    sortDirection,
  ]);

  const toggleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedUniversity("all");
    setSelectedCgpa("all");
    setSelectedExperience("all");
    setSelectedFunction("all");
    setSelectedDecision("all");
  };

  return (
    <div className="w-full space-y-4">
      {/* Top Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate name, email, phone, major..."
              className="w-full pl-9 pr-3 py-1.5 border border-stone-200 rounded-lg text-xs text-stone-800 placeholder-stone-400 outline-none focus:border-emerald-600 bg-stone-50/50 focus:bg-white transition-all font-normal"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Export and Total count */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 font-normal">
              Showing {filteredCandidates.length} of {candidates.length} candidates
            </span>
            <button
              onClick={onExportCsv}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-xs font-normal text-stone-700 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filter Dropdowns Row */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-stone-100 text-xs">
          <div className="flex items-center gap-1 text-stone-400 font-normal">
            <Filter className="w-3 h-3" />
            <span>Filters:</span>
          </div>

          {/* University Filter */}
          <select
            value={selectedUniversity}
            onChange={(e) => setSelectedUniversity(e.target.value)}
            className="px-2.5 py-1 border border-stone-200 rounded-lg bg-stone-50/70 text-stone-700 text-xs outline-none focus:border-emerald-600 font-normal"
          >
            <option value="all">All Universities</option>
            {universityOptions.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>

          {/* CGPA Filter */}
          <select
            value={selectedCgpa}
            onChange={(e) => setSelectedCgpa(e.target.value)}
            className="px-2.5 py-1 border border-stone-200 rounded-lg bg-stone-50/70 text-stone-700 text-xs outline-none focus:border-emerald-600 font-normal"
          >
            <option value="all">All CGPA</option>
            <option value="3.75+">3.75 and above</option>
            <option value="3.5-3.74">3.50 - 3.74</option>
            <option value="3.0-3.49">3.00 - 3.49</option>
            <option value="<3.0">Below 3.00</option>
          </select>

          {/* Experience Filter */}
          <select
            value={selectedExperience}
            onChange={(e) => setSelectedExperience(e.target.value)}
            className="px-2.5 py-1 border border-stone-200 rounded-lg bg-stone-50/70 text-stone-700 text-xs outline-none focus:border-emerald-600 font-normal"
          >
            <option value="all">All Experience</option>
            <option value="Fresher">Fresher</option>
            <option value="0 - 1 Years">0 - 1 Years</option>
            <option value="1 - 2 Years">1 - 2 Years</option>
            <option value="2 - 3 Years">2 - 3 Years</option>
          </select>

          {/* Function Filter */}
          <select
            value={selectedFunction}
            onChange={(e) => setSelectedFunction(e.target.value)}
            className="px-2.5 py-1 border border-stone-200 rounded-lg bg-stone-50/70 text-stone-700 text-xs outline-none focus:border-emerald-600 font-normal"
          >
            <option value="all">All Functions</option>
            {functionOptions.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>

          {/* Decision Filter */}
          <select
            value={selectedDecision}
            onChange={(e) => setSelectedDecision(e.target.value)}
            className="px-2.5 py-1 border border-stone-200 rounded-lg bg-stone-50/70 text-stone-700 text-xs outline-none focus:border-emerald-600 font-normal"
          >
            <option value="all">All Decisions</option>
            {Object.keys(DECISION_CONFIG).map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1 text-stone-400 hover:text-stone-700 ml-auto transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Spreadsheet Table Container */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-100 text-stone-400 font-normal bg-stone-50/60 select-none">
                <th className="py-3 px-4 font-normal">Candidate</th>
                <th
                  onClick={() => toggleSort("university")}
                  className="py-3 px-3 font-normal cursor-pointer hover:text-stone-700"
                >
                  <div className="flex items-center gap-1">
                    <span>University</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort("cgpa")}
                  className="py-3 px-3 font-normal cursor-pointer hover:text-stone-700"
                >
                  <div className="flex items-center gap-1">
                    <span>CGPA</span>
                    <ArrowUpDown className="w-3 h-3 opacity-60" />
                  </div>
                </th>
                <th className="py-3 px-3 font-normal">Experience</th>
                <th className="py-3 px-3 font-normal">Functions</th>
                <th className="py-3 px-3 font-normal">Resume</th>
                <th className="py-3 px-3 font-normal">Decision</th>
                <th className="py-3 px-4 font-normal text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">
                    No candidates match the specified filters.
                  </td>
                </tr>
              ) : (
                filteredCandidates.map((c) => {
                  const evalData = evaluations[c.id] || { decision: "Pending" };
                  const currentDecision = evalData.decision || "Pending";
                  const config = DECISION_CONFIG[currentDecision] || DECISION_CONFIG.Pending;

                  return (
                    <tr
                      key={c.id}
                      className="hover:bg-stone-50/70 transition-colors group cursor-pointer"
                      onClick={() => setSelectedCandidate(c)}
                    >
                      {/* Candidate Name & Contact */}
                      <td className="py-3.5 px-4 font-normal text-stone-900">
                        <div>
                          <div className="text-stone-900 font-normal">{c.name}</div>
                          <div className="text-[11px] text-stone-400 font-normal">
                            {c.email} • {c.phone}
                          </div>
                        </div>
                      </td>

                      {/* University & Degree */}
                      <td className="py-3.5 px-3 max-w-[200px] truncate text-stone-700 font-normal">
                        <div>{c.university}</div>
                        <div className="text-[11px] text-stone-400 truncate">
                          {c.major} ({c.passingYear})
                        </div>
                      </td>

                      {/* CGPA */}
                      <td className="py-3.5 px-3 font-normal text-stone-800">
                        <span className="inline-block px-2 py-0.5 rounded bg-stone-100 border border-stone-200/80 text-[11px]">
                          {c.cgpa}
                        </span>
                      </td>

                      {/* Experience */}
                      <td className="py-3.5 px-3 font-normal text-stone-700 whitespace-nowrap">
                        {c.experience}
                      </td>

                      {/* Functions */}
                      <td className="py-3.5 px-3 max-w-[180px] truncate text-stone-600 font-normal">
                        {c.functions.join(", ") || "-"}
                      </td>

                      {/* Resume */}
                      <td
                        className="py-3.5 px-3 whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {c.resume ? (
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() =>
                                onViewFile(c.id, c.resumeKey, c.resume)
                              }
                              className="p-1 hover:bg-stone-100 rounded text-emerald-700 hover:text-emerald-900 transition-colors cursor-pointer"
                              title="View Resume in New Tab"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() =>
                                onDownloadFile(c.id, c.resumeKey, c.resume)
                              }
                              className="p-1 hover:bg-stone-100 rounded text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
                              title="Download Resume"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-stone-400">None</span>
                        )}
                      </td>

                      {/* Decision Selector */}
                      <td
                        className="py-3.5 px-3 whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <select
                          value={currentDecision}
                          onChange={(e) =>
                            updateEvaluation(c.id, "decision", e.target.value)
                          }
                          className={`px-2 py-1 rounded-md text-[11px] border font-normal outline-none cursor-pointer ${config.selectClass}`}
                        >
                          {Object.keys(DECISION_CONFIG).map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Action */}
                      <td
                        className="py-3.5 px-4 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => setSelectedCandidate(c)}
                          className="px-2 py-1 rounded text-[11px] border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer font-normal"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Candidate Profile Details Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-stone-100 space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-stone-100 pb-4">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-stone-400 font-normal">
                  Candidate Application
                </span>
                <h2 className="text-xl font-normal text-stone-900 mt-0.5">
                  {selectedCandidate.name}
                </h2>
                <div className="flex items-center gap-3 text-xs text-stone-500 mt-1 font-normal">
                  <span>{selectedCandidate.email}</span>
                  <span>•</span>
                  <span>{selectedCandidate.phone}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Status / Evaluation Bar */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-600 font-normal">
                  Application Status:
                </span>
                <select
                  value={
                    evaluations[selectedCandidate.id]?.decision || "Pending"
                  }
                  onChange={(e) =>
                    updateEvaluation(
                      selectedCandidate.id,
                      "decision",
                      e.target.value
                    )
                  }
                  className="px-2.5 py-1 rounded-md text-xs border bg-white border-stone-300 font-normal outline-none"
                >
                  {Object.keys(DECISION_CONFIG).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCandidate.resume && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      onViewFile(
                        selectedCandidate.id,
                        selectedCandidate.resumeKey,
                        selectedCandidate.resume
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-normal hover:bg-emerald-100 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View CV / Resume</span>
                  </button>
                  <button
                    onClick={() =>
                      onDownloadFile(
                        selectedCandidate.id,
                        selectedCandidate.resumeKey,
                        selectedCandidate.resume
                      )
                    }
                    className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 transition-colors cursor-pointer"
                    title="Download CV"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Candidate Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl border border-stone-100 bg-stone-50/50">
                <span className="text-stone-400 block mb-0.5 font-normal">
                  Highest Degree
                </span>
                <span className="text-stone-800 font-normal">
                  {selectedCandidate.degree}
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-stone-100 bg-stone-50/50">
                <span className="text-stone-400 block mb-0.5 font-normal">
                  University
                </span>
                <span className="text-stone-800 font-normal">
                  {selectedCandidate.university}
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-stone-100 bg-stone-50/50">
                <span className="text-stone-400 block mb-0.5 font-normal">
                  Major & Passing Year
                </span>
                <span className="text-stone-800 font-normal">
                  {selectedCandidate.major} ({selectedCandidate.passingYear})
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-stone-100 bg-stone-50/50">
                <span className="text-stone-400 block mb-0.5 font-normal">
                  CGPA
                </span>
                <span className="text-stone-800 font-normal">
                  {selectedCandidate.cgpa}
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-stone-100 bg-stone-50/50">
                <span className="text-stone-400 block mb-0.5 font-normal">
                  Experience
                </span>
                <span className="text-stone-800 font-normal">
                  {selectedCandidate.experience}
                  {selectedCandidate.lastRole !== "N/A" &&
                    ` (${selectedCandidate.lastRole})`}
                </span>
              </div>

              <div className="p-3.5 rounded-xl border border-stone-100 bg-stone-50/50">
                <span className="text-stone-400 block mb-0.5 font-normal">
                  Functions Interested
                </span>
                <span className="text-stone-800 font-normal">
                  {selectedCandidate.functions.join(", ") || "None"}
                </span>
              </div>
            </div>

            {/* Screening Questions Answers */}
            <div className="space-y-4 pt-2 border-t border-stone-100 text-xs">
              {selectedCandidate.whyJoin && (
                <div>
                  <h4 className="text-stone-500 font-normal mb-1">
                    Why do you want to join TPHL?
                  </h4>
                  <p className="text-stone-800 leading-relaxed p-3 rounded-xl bg-stone-50 border border-stone-100 font-normal">
                    {selectedCandidate.whyJoin}
                  </p>
                </div>
              )}

              {selectedCandidate.contribute && (
                <div>
                  <h4 className="text-stone-500 font-normal mb-1">
                    How do you plan to contribute?
                  </h4>
                  <p className="text-stone-800 leading-relaxed p-3 rounded-xl bg-stone-50 border border-stone-100 font-normal">
                    {selectedCandidate.contribute}
                  </p>
                </div>
              )}

              {selectedCandidate.situation && (
                <div>
                  <h4 className="text-stone-500 font-normal mb-1">
                    Problem-solving or initiative experience:
                  </h4>
                  <p className="text-stone-800 leading-relaxed p-3 rounded-xl bg-stone-50 border border-stone-100 font-normal">
                    {selectedCandidate.situation}
                  </p>
                </div>
              )}
            </div>

            {/* Review Notes */}
            <div className="pt-2 border-t border-stone-100 space-y-2">
              <label className="block text-xs text-stone-500 font-normal">
                Evaluation Notes (Internal Team Only):
              </label>
              <textarea
                rows={2}
                value={evaluations[selectedCandidate.id]?.notes || ""}
                onChange={(e) =>
                  updateEvaluation(
                    selectedCandidate.id,
                    "notes",
                    e.target.value
                  )
                }
                placeholder="Write interviewer notes, feedback or rating..."
                className="w-full p-2.5 text-xs text-stone-800 rounded-xl border border-stone-200 outline-none focus:border-emerald-600 bg-stone-50/50 font-normal resize-none"
              />
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end pt-2 border-t border-stone-100">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-4 py-2 rounded-lg bg-stone-100 text-stone-700 text-xs font-normal hover:bg-stone-200 transition-colors cursor-pointer"
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
