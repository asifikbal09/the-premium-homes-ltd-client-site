"use client";

import React, { useState, useMemo } from "react";
import { Bell, Calendar, ArrowLeft, Loader2, Building2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ClientFlat } from "./types";
import { fetchProjectNotices, ProjectNoticeItem } from "@/lib/client-dashboard";

interface NoticeTabProps {
  projects?: ClientFlat[];
  isLoading?: boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export function NoticeTab({ projects = [], isLoading: isParentLoading = false }: NoticeTabProps) {
  const [selectedProject, setSelectedProject] = useState<ClientFlat | null>(null);
  const [notices, setNotices] = useState<ProjectNoticeItem[]>([]);
  const [isLoadingNotices, setIsLoadingNotices] = useState(false);

  // Deduplicate user's real registered projects (no fake fallback projects)
  const displayProjects = useMemo(() => {
    if (!projects || projects.length === 0) return [];
    const seen = new Set<string>();
    const list: ClientFlat[] = [];
    projects.forEach((p) => {
      const key = String(p.project_id || p.slug || p.title).toLowerCase().trim();
      if (!seen.has(key)) {
        seen.add(key);
        list.push(p);
      }
    });
    return list;
  }, [projects]);

  const handleSelectProject = async (project: ClientFlat) => {
    setSelectedProject(project);
    setIsLoadingNotices(true);

    try {
      const targetId = project.project_id || project.id;
      const apiNotices = await fetchProjectNotices(targetId);
      setNotices(apiNotices || []);
    } catch {
      setNotices([]);
    } finally {
      setIsLoadingNotices(false);
    }
  };

  return (
    <div className="max-w-[800px] mx-auto w-full">
      <AnimatePresence mode="wait">
        {!selectedProject ? (
          /* ── VIEW 1: Project Selection Screen (Figma node 8315:25860) ── */
          <motion.div
            key="notice-project-list"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }}
            className="flex flex-col gap-[32px] items-start w-full"
          >
            {/* Header (Figma node 8315:25862) */}
            <motion.div variants={itemVariants} className="flex flex-col gap-[12px] items-start w-full">
              <h1 className="capitalize font-serif font-semibold leading-[1.1] text-[#054b3c] text-[24px]">
                Project Notices
              </h1>
              <p className="font-sans font-normal leading-none text-[#3b3e40] text-[15px] sm:text-[16px]">
                Select a project to view its official notices and updates.
              </p>
            </motion.div>

            {/* White Container Card (Figma node 8315:25866) */}
            <motion.div
              variants={itemVariants}
              className="bg-white flex flex-col gap-[16px] items-start p-[20px] sm:p-[24px] rounded-[12px] w-full"
            >
              {isParentLoading ? (
                <div className="flex flex-col gap-[16px] w-full">
                  {[1, 2].map((n) => (
                    <div key={n} className="flex items-center gap-[24px] sm:gap-[40px] w-full animate-pulse">
                      <div className="size-[76px] sm:size-[100px] rounded-[8px] bg-stone-200 shrink-0" />
                      <div className="flex-1 space-y-3">
                        <div className="h-5 w-48 bg-stone-200 rounded" />
                        <div className="h-4 w-32 bg-stone-100 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : displayProjects.length === 0 ? (
                <div className="py-10 text-center w-full flex flex-col items-center justify-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#f1f6f5] flex items-center justify-center text-[#054b3c] mb-3">
                    <Building2 className="w-7 h-7" />
                  </div>
                  <p className="font-serif text-lg font-semibold text-[#054b3c]">
                    No Registered Projects Found
                  </p>
                  <p className="text-xs sm:text-sm text-[#59657b] mt-1 max-w-md">
                    Official notices and updates for your registered properties will appear here once assigned to your account.
                  </p>
                </div>
              ) : (
                displayProjects.map((project, idx) => (
                  <React.Fragment key={`${project.id}-${idx}`}>
                    {idx > 0 && (
                      <div className="bg-[#f1f2f6] h-px shrink-0 w-full" />
                    )}
                    <motion.div
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.995 }}
                      onClick={() => handleSelectProject(project)}
                      className="group flex gap-[20px] sm:gap-[40px] items-center w-full cursor-pointer"
                    >
                      {/* 100x100 rounded-[8px] project thumbnail (Figma node 8315:25868) */}
                      <div className="relative rounded-[8px] shrink-0 size-[76px] sm:size-[100px] bg-[#d9d9d9] overflow-hidden">
                        <img
                          src={project.image || "/image/progress/tph_green_valley.png"}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Project Title & Location (Figma node 8315:25869) */}
                      <div className="flex flex-1 flex-col gap-[12px] sm:gap-[16px] items-start min-w-0">
                        <h3 className="font-sans font-medium leading-[1.2] sm:leading-[20px] text-[#232f43] text-[18px] sm:text-[24px] group-hover:text-[#054b3c] transition-colors truncate w-full">
                          {project.title}
                        </h3>

                        <div className="flex gap-[12px] items-center w-full min-w-0">
                          {/* 20x20 city-01 building icon (Figma node 8315:25873) */}
                          <svg
                            className="size-[20px] text-[#59657b] shrink-0"
                            viewBox="0 0 20 20"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M2.5 17.5H17.5" />
                            <path d="M4.16667 17.5V5.83333C4.16667 4.91286 4.91286 4.16667 5.83333 4.16667H10.8333C11.7538 4.16667 12.5 4.91286 12.5 5.83333V17.5" />
                            <path d="M12.5 9.16667H14.1667C15.0871 9.16667 15.8333 9.91286 15.8333 10.8333V17.5" />
                            <path d="M7.5 7.5H9.16667" />
                            <path d="M7.5 10.8333H9.16667" />
                            <path d="M7.5 14.1667H9.16667" />
                          </svg>
                          <p className="font-sans font-normal leading-[18px] text-[#59657b] text-[14px] sm:text-[16px] truncate">
                            {project.location}
                          </p>
                        </div>
                      </div>

                      {/* 20x20 arrow-right-01 (Figma node 8315:25875) */}
                      <div className="relative shrink-0 size-[20px] text-[#232f43] group-hover:text-[#054b3c] group-hover:translate-x-1 transition-all">
                        <svg viewBox="0 0 20 20" fill="none" className="size-full">
                          <path
                            d="M7.5 4.16667L13.3333 10L7.5 15.8333"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </motion.div>
                  </React.Fragment>
                ))
              )}
            </motion.div>
          </motion.div>
        ) : (
          /* ── VIEW 2: Notices & Official Circulars Screen ── */
          <motion.div
            key="notice-detail-view"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }}
            className="flex flex-col gap-[24px] w-full"
          >
            <motion.div variants={itemVariants}>
              <button
                onClick={() => setSelectedProject(null)}
                className="inline-flex items-center gap-1.5 text-[14px] font-medium text-[#054b3c] hover:underline mb-3 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Projects</span>
              </button>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex flex-col gap-[8px]">
                  <h1 className="capitalize font-serif font-semibold leading-[1.1] text-[#054b3c] text-[24px] sm:text-[28px]">
                    Notices &amp; Official Circulars
                  </h1>
                  <p className="font-sans font-normal text-[#3b3e40] text-[14px] sm:text-[16px]">
                    Stay informed on project announcements, society bulletins, and holiday schedules.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#054b3c]/10 text-[#054b3c] rounded-full text-xs font-semibold self-start sm:self-auto shrink-0">
                  {selectedProject.title}
                </span>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-4">
              {isLoadingNotices ? (
                <div className="bg-white rounded-[12px] p-12 flex flex-col items-center justify-center text-[#546360]">
                  <Loader2 className="w-7 h-7 animate-spin text-[#054b3c] mb-3" />
                  <p className="text-sm font-medium text-[#232f43]">
                    Fetching notices for {selectedProject.title}...
                  </p>
                </div>
              ) : notices.length === 0 ? (
                <div className="bg-white rounded-[12px] p-10 text-center text-[#546360]">
                  <Bell className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                  <p className="text-sm font-medium text-[#232f43]">No new notices at this time.</p>
                  <p className="text-xs text-[#59657b] mt-0.5">
                    Official project announcements and circulars will be published here.
                  </p>
                </div>
              ) : (
                notices.map((notice) => (
                  <motion.div
                    key={notice.id}
                    whileHover={{ y: -2 }}
                    className="bg-white rounded-[12px] p-[24px] transition-all space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#054b3c]/10 text-[#054b3c]">
                          {notice.category || "General"}
                        </span>
                        {notice.isUnread && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ffe8e8] text-[#ec0000]">
                            NEW
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-[#59657b]">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{notice.date}</span>
                      </div>
                    </div>

                    <h3 className="font-semibold text-[18px] sm:text-[20px] text-[#054b3c] leading-snug font-serif">
                      {notice.title}
                    </h3>

                    <p className="text-[14px] text-[#3b3e40] leading-relaxed">
                      {notice.description}
                    </p>

                    {notice.image && (
                      <div className="pt-2">
                        <img
                          src={notice.image}
                          alt={notice.title}
                          className="max-h-64 rounded-[8px] border border-stone-100 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                          onClick={() => window.open(notice.image!, "_blank")}
                        />
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
