"use client";

import React, { useState } from "react";
import { Bell, Calendar, ChevronRight, Building2, ArrowLeft, Loader2 } from "lucide-react";
import { ClientFlat } from "./types";
import { fetchProjectNotices, ProjectNoticeItem } from "@/lib/client-dashboard";

interface NoticeTabProps {
  projects?: ClientFlat[];
}

const FALLBACK_PROJECTS: ClientFlat[] = [
  {
    id: "proj-sunleaf-1",
    title: "The Premium Sunleaf Garden",
    location: "Ashulia Model Town",
    image: "/image/progress/tph_green_valley.png",
    status: "Under Construction",
    construction_pct: 75,
    handover_date: "Dec 2027",
    price: "From ৳2.2 Cr",
  },
  {
    id: "proj-sunleaf-2",
    title: "The Premium Sunleaf Garden",
    location: "Ashulia Model Town",
    image: "/image/progress/tph_green_valley.png",
    status: "Under Construction",
    construction_pct: 75,
    handover_date: "Dec 2027",
    price: "From ৳2.2 Cr",
  },
  {
    id: "proj-sunleaf-3",
    title: "The Premium Sunleaf Garden",
    location: "Ashulia Model Town",
    image: "/image/progress/tph_green_valley.png",
    status: "Under Construction",
    construction_pct: 75,
    handover_date: "Dec 2027",
    price: "From ৳2.2 Cr",
  },
  {
    id: "proj-sunleaf-4",
    title: "The Premium Sunleaf Garden",
    location: "Ashulia Model Town",
    image: "/image/progress/tph_green_valley.png",
    status: "Under Construction",
    construction_pct: 75,
    handover_date: "Dec 2027",
    price: "From ৳2.2 Cr",
  },
];

export function NoticeTab({ projects }: NoticeTabProps) {
  const [selectedProject, setSelectedProject] = useState<ClientFlat | null>(null);
  const [notices, setNotices] = useState<ProjectNoticeItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // If projects list is provided and not empty, use it. Otherwise fallback to sample projects.
  const displayProjects =
    projects && projects.length > 0 ? projects : FALLBACK_PROJECTS;

  const handleSelectProject = async (project: ClientFlat) => {
    setSelectedProject(project);
    setIsLoading(true);

    try {
      const apiNotices = await fetchProjectNotices(project.id);
      setNotices(apiNotices || []);
    } catch {
      setNotices([]);
    } finally {
      setIsLoading(false);
    }
  };

  // ── VIEW 1: Project Selection Screen (Image 2) ─────────────────────────
  if (!selectedProject) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-[32px] font-bold text-[#044133] tracking-tight">
            Project Notices
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Select a project to view its official notices and updates.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden divide-y divide-stone-100">
          {displayProjects.map((project, idx) => (
            <div
              key={`${project.id}-${idx}`}
              onClick={() => handleSelectProject(project)}
              className="p-4 sm:p-5 flex items-center justify-between hover:bg-stone-50/80 cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-100">
                  <img
                    src={project.image || "/image/progress/tph_green_valley.png"}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-base sm:text-lg text-stone-900 group-hover:text-[#044133] transition-colors truncate">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs sm:text-sm text-stone-500 mt-1">
                    <Building2 className="w-4 h-4 text-stone-400 shrink-0" />
                    <span className="truncate">
                      {project.location || "Ashulia Model Town"}
                    </span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-[#044133] group-hover:translate-x-0.5 transition-all shrink-0 ml-4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── VIEW 2: Notices & Official Circulars Screen (Image 1) ──────────────
  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={() => setSelectedProject(null)}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#044133] hover:text-[#065E33] hover:underline mb-3 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="font-serif text-2xl sm:text-[32px] font-bold text-[#044133] tracking-tight">
              Notices & Official Circulars
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Stay informed on project announcements, society bulletins, and holiday schedules.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#044133]/10 text-[#044133] rounded-full text-xs font-semibold self-start sm:self-auto">
            <Building2 className="w-3.5 h-3.5" />
            {selectedProject.title}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-white rounded-2xl p-12 border border-stone-200/80 flex flex-col items-center justify-center text-stone-500 shadow-xs">
            <Loader2 className="w-7 h-7 animate-spin text-[#044133] mb-3" />
            <p className="text-sm font-medium text-stone-700">
              Fetching notices for {selectedProject.title}...
            </p>
          </div>
        ) : notices.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 border border-stone-200/80 text-center text-stone-500 shadow-xs">
            <Bell className="w-8 h-8 mx-auto mb-2 text-stone-300" />
            <p className="text-sm font-medium text-stone-700">No new notices at this time.</p>
            <p className="text-xs text-stone-400 mt-0.5">
              Official project announcements and circulars will be published here.
            </p>
          </div>
        ) : (
          notices.map((notice) => (
            <div
              key={notice.id}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/80 shadow-xs hover:shadow-sm transition-all space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#044133]/10 text-[#044133]">
                    {notice.category || "General"}
                  </span>
                  {notice.isUnread && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                      NEW
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-stone-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{notice.date}</span>
                </div>
              </div>

              <h3 className="font-bold text-base sm:text-lg text-stone-900 leading-snug font-serif">
                {notice.title}
              </h3>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {notice.description}
              </p>

              {notice.image && (
                <div className="pt-2">
                  <img
                    src={notice.image}
                    alt={notice.title}
                    className="max-h-64 rounded-xl border border-stone-100 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                    onClick={() => window.open(notice.image!, "_blank")}
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
