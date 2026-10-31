"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import {
  RefreshCw,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Loader2,
  Radio,
  Settings,
  Tv,
  RectangleHorizontal,
  VideoOff,
  Building2,
} from "lucide-react";
import { motion } from "framer-motion";
import { ClientFlat, LiveCamera } from "./types";
import { cn } from "@/lib/utils";

interface CameraTabProps {
  myFlats?: ClientFlat[];
  isLoading?: boolean;
  onNavigateTab?: (tab: string) => void;
}

interface WorkCategoryProgress {
  structural_work?: string;
  plaster_work?: string;
  brick_work?: string;
  electrical_work?: string;
  plumbing_work?: string;
  tiles_work?: string;
  paint_work?: string;
  [key: string]: string | undefined;
}

interface ApiConstructionProgressItem {
  property_id: number;
  property_name?: string;
  lastUpdatedDate?: string;
  lastMonthTarget?: string;
  lastMonthAchieved?: string;
  totalProgress?: string;
  work_category_progress?: WorkCategoryProgress;
  project_name?: string;
  project_slug?: string;
  project_location?: string;
  project_image?: string;
  overall_progress?: string;
  cameras?: LiveCamera[];
}

export interface StageProgressRow {
  label: string;
  pct: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.04,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

function parsePercentage(val?: string | number | null): number {
  if (typeof val === "number") return Math.min(100, Math.max(0, Math.round(val)));
  if (!val) return 0;
  const num = parseFloat(String(val).replace(/%/g, "").trim());
  return isNaN(num) ? 0 : Math.min(100, Math.max(0, Math.round(num)));
}

function normalizeProjectName(name?: string): string {
  if (!name) return "";
  return name
    .toLowerCase()
    .replace(/^(the\s+)?(premium\s+)?/i, "")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function buildStageProgressRows(wcp?: WorkCategoryProgress | null): StageProgressRow[] {
  if (!wcp) {
    return [
      { label: "Structural Work", pct: 0 },
      { label: "Brickwork", pct: 0 },
      { label: "Plaster Work", pct: 0 },
      { label: "Electrical", pct: 0 },
      { label: "Plumbing", pct: 0 },
      { label: "Interior / Tiles", pct: 0 },
      { label: "Finishing / Paint", pct: 0 },
    ];
  }

  return [
    { label: "Structural Work", pct: parsePercentage(wcp.structural_work) },
    { label: "Brickwork", pct: parsePercentage(wcp.brick_work) },
    { label: "Plaster Work", pct: parsePercentage(wcp.plaster_work) },
    { label: "Electrical", pct: parsePercentage(wcp.electrical_work) },
    { label: "Plumbing", pct: parsePercentage(wcp.plumbing_work) },
    { label: "Interior / Tiles", pct: parsePercentage(wcp.tiles_work) },
    { label: "Finishing / Paint", pct: parsePercentage(wcp.paint_work) },
  ];
}

// Helper to dynamically load Hls.js from CDN without requiring npm dependency
function loadHlsScript(): Promise<any> {
  if (typeof window === "undefined") return Promise.reject();
  if ((window as any).Hls) return Promise.resolve((window as any).Hls);

  return new Promise((resolve, reject) => {
    const existing = document.getElementById("hls-script");
    if (existing) {
      existing.addEventListener("load", () => resolve((window as any).Hls));
      existing.addEventListener("error", reject);
      return;
    }
    const script = document.createElement("script");
    script.id = "hls-script";
    script.src = "https://cdn.jsdelivr.net/npm/hls.js@1.5.17/dist/hls.min.js";
    script.async = true;
    script.onload = () => resolve((window as any).Hls);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

interface ProjectCameraCardProps {
  project: ClientFlat;
  matchedProgress: ApiConstructionProgressItem | null;
  cameras: LiveCamera[];
  isLoadingData: boolean;
}

function ProjectCameraCard({
  project,
  matchedProgress,
  cameras,
  isLoadingData,
}: ProjectCameraCardProps) {
  const [selectedCamIdx, setSelectedCamIdx] = useState(0);
  const activeCamera = cameras[selectedCamIdx] || cameras[0] || null;
  const hasLiveCamera = Boolean(activeCamera && activeCamera.camera_link);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [streamBuffering, setStreamBuffering] = useState(false);
  const [streamError, setStreamError] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const hlsInstanceRef = useRef<any>(null);

  const displayTitle =
    matchedProgress?.project_name ||
    matchedProgress?.property_name ||
    project.title;

  const displayLocation =
    matchedProgress?.project_location ||
    activeCamera?.location ||
    project.location;

  const stageRows = useMemo(
    () => buildStageProgressRows(matchedProgress?.work_category_progress),
    [matchedProgress]
  );

  const hasProgressRecord = Boolean(matchedProgress?.work_category_progress);

  const setupStream = () => {
    if (!activeCamera?.camera_link || !videoRef.current) {
      setStreamBuffering(false);
      return;
    }

    // If YouTube or Vimeo embed link, iframe handles playback directly
    if (
      activeCamera.camera_link.includes("youtube.com") ||
      activeCamera.camera_link.includes("youtu.be") ||
      activeCamera.camera_link.includes("vimeo.com")
    ) {
      setStreamBuffering(false);
      setStreamError(false);
      return;
    }

    setStreamBuffering(true);
    setStreamError(false);

    const videoEl = videoRef.current;
    const streamUrl = activeCamera.camera_link;

    if (hlsInstanceRef.current) {
      hlsInstanceRef.current.destroy();
      hlsInstanceRef.current = null;
    }

    videoEl.removeAttribute("src");
    videoEl.load();

    loadHlsScript()
      .then((Hls) => {
        if (Hls && Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 30,
            manifestLoadingTimeOut: 15000,
            manifestLoadingMaxRetry: 3,
            levelLoadingTimeOut: 15000,
          });

          hlsInstanceRef.current = hls;
          hls.loadSource(streamUrl);
          hls.attachMedia(videoEl);

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            setStreamBuffering(false);
            setStreamError(false);
            videoEl.muted = isMuted;
            videoEl
              .play()
              .then(() => setIsPlaying(true))
              .catch(() => {
                videoEl.muted = true;
                setIsMuted(true);
                videoEl.play().catch(() => {});
              });
          });

          hls.on(Hls.Events.ERROR, (_event: any, data: any) => {
            if (data.fatal) {
              setStreamBuffering(false);
              setStreamError(true);
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  hls.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  hls.recoverMediaError();
                  break;
                default:
                  hls.destroy();
                  break;
              }
            }
          });
          return;
        }

        if (videoEl.canPlayType("application/vnd.apple.mpegurl")) {
          videoEl.src = streamUrl;
          videoEl.muted = isMuted;
          videoEl
            .play()
            .then(() => {
              setStreamBuffering(false);
              setIsPlaying(true);
            })
            .catch(() => {
              videoEl.muted = true;
              setIsMuted(true);
              videoEl.play().catch(() => {
                setStreamBuffering(false);
              });
            });
          return;
        }

        setStreamError(true);
        setStreamBuffering(false);
      })
      .catch(() => {
        if (videoEl.canPlayType("application/vnd.apple.mpegurl")) {
          videoEl.src = streamUrl;
          videoEl.muted = isMuted;
          videoEl
            .play()
            .then(() => {
              setStreamBuffering(false);
              setIsPlaying(true);
            })
            .catch(() => {
              setStreamBuffering(false);
            });
        } else {
          setStreamBuffering(false);
          setStreamError(true);
        }
      });
  };

  useEffect(() => {
    setupStream();
    return () => {
      if (hlsInstanceRef.current) {
        hlsInstanceRef.current.destroy();
        hlsInstanceRef.current = null;
      }
    };
  }, [activeCamera?.id, activeCamera?.camera_link]);

  const togglePlay = () => {
    if (!videoRef.current || !activeCamera?.camera_link) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMuted = !isMuted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
  };

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(() => {});
    } else {
      document
        .exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(() => {});
    }
  };

  const isEmbedUrl = Boolean(
    activeCamera?.camera_link &&
      (activeCamera.camera_link.includes("youtube.com") ||
        activeCamera.camera_link.includes("youtu.be") ||
        activeCamera.camera_link.includes("vimeo.com"))
  );

  const detailSlug =
    matchedProgress?.project_slug ||
    project.slug ||
    matchedProgress?.property_id ||
    project.project_id ||
    project.id;

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.25 }}
      className="bg-white flex flex-col gap-[20px] items-start overflow-hidden p-[16px] rounded-[20px] w-full"
    >
      {/* Card Header (Figma node 8313:24375) */}
      <div className="flex gap-[8px] items-center justify-between w-full">
        <div className="flex flex-1 flex-col gap-[5px] items-start min-w-0">
          <div className="flex items-center gap-2 w-full min-w-0">
            <h2 className="font-sans font-medium leading-[20px] text-[#232f43] text-[18px] truncate">
              {displayTitle}
            </h2>
            {project.flatNo && (
              <span className="px-2 py-0.5 rounded-full bg-[#f1f6f5] text-[#054b3c] text-[11px] font-semibold shrink-0">
                Unit {project.flatNo}
              </span>
            )}
          </div>
          <div className="flex gap-[4px] items-center w-full min-w-0">
            {/* 18x18 location-04 pin icon (Figma node 8313:24379) */}
            <svg
              className="size-[18px] text-[#59657b] shrink-0"
              viewBox="0 0 18 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 9.75C10.2426 9.75 11.25 8.74264 11.25 7.5C11.25 6.25736 10.2426 5.25 9 5.25C7.75736 5.25 6.75 6.25736 6.75 7.5C6.75 8.74264 7.75736 9.75 9 9.75Z" />
              <path d="M9 16.5C12 13.5 15 10.8137 15 7.5C15 4.18629 12.3137 1.5 9 1.5C5.68629 1.5 3 4.18629 3 7.5C3 10.8137 6 13.5 9 16.5Z" />
            </svg>
            <p className="font-sans font-normal leading-[18px] text-[#59657b] text-[14px] truncate">
              {displayLocation}
            </p>
          </div>
        </div>

        {/* Multi-camera switcher pills + Link to full project progress details */}
        <div className="flex items-center gap-2 shrink-0">
          {cameras.length > 1 && (
            <div className="flex items-center gap-1">
              {cameras.map((cam, idx) => (
                <button
                  key={cam.id}
                  type="button"
                  onClick={() => setSelectedCamIdx(idx)}
                  className={cn(
                    "px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-colors cursor-pointer",
                    selectedCamIdx === idx
                      ? "bg-[#054b3c] text-white"
                      : "bg-[#f1f2f6] text-[#546360] hover:bg-[#e4e6ed]"
                  )}
                >
                  {cam.camera_name || `Cam ${idx + 1}`}
                </button>
              ))}
            </div>
          )}

          <Link
            href={`/project-progress/${detailSlug}`}
            title="View Full Project Progress"
            className="relative shrink-0 size-[24px] text-[#232f43] hover:text-[#054b3c] transition-colors flex items-center justify-center"
          >
            <svg viewBox="0 0 24 24" fill="none" className="size-full">
              <path
                d="M7 17L17 7M17 7H8M17 7V16"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* Video Player Frame (Figma node 8313:24385: h-[349px] rounded-[16px] w-full) */}
      <div
        ref={playerContainerRef}
        className="h-[260px] sm:h-[349px] overflow-hidden relative rounded-[16px] shrink-0 w-full bg-[#111917] group"
      >
        {isLoadingData ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/80 gap-2.5">
            <Loader2 className="w-7 h-7 animate-spin text-white" />
            <span className="text-xs font-medium tracking-wider uppercase text-white/80">
              Checking Live Camera Feed...
            </span>
          </div>
        ) : hasLiveCamera && activeCamera ? (
          <>
            {isEmbedUrl ? (
              <iframe
                src={activeCamera.camera_link}
                title={activeCamera.camera_name || displayTitle}
                className="absolute inset-0 w-full h-full border-0 z-[1]"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                ref={videoRef}
                playsInline
                autoPlay
                muted={isMuted}
                poster={matchedProgress?.project_image || project.image}
                className="absolute inset-0 w-full h-full object-cover z-[1] bg-black"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onWaiting={() => setStreamBuffering(true)}
                onPlaying={() => setStreamBuffering(false)}
              />
            )}

            {/* Buffering Overlay */}
            {streamBuffering && !streamError && (
              <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px] flex flex-col items-center justify-center text-white z-[3] gap-2">
                <Loader2 className="w-7 h-7 animate-spin text-white" />
                <span className="text-[11px] font-medium tracking-wider uppercase text-white/90">
                  Connecting Live Stream ({activeCamera.camera_name || "Site Cam"})...
                </span>
              </div>
            )}

            {/* Stream Error / Offline Overlay */}
            {streamError && (
              <div className="absolute inset-0 bg-[#111917]/95 flex flex-col items-center justify-center p-5 text-center z-[3] gap-2.5">
                <Radio className="w-6 h-6 text-red-400 animate-pulse" />
                <p className="text-sm font-medium text-white">
                  {activeCamera.camera_name || displayTitle} Feed Offline
                </p>
                <p className="text-xs text-white/65 max-w-xs">
                  The live stream URL could not be reached right now. It may be undergoing scheduled site maintenance.
                </p>
                <button
                  type="button"
                  onClick={setupStream}
                  className="mt-1 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-medium transition cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Connection</span>
                </button>
              </div>
            )}

            {/* Bottom Dark Gradient Overlay (Figma node 8313:24387) */}
            {!isEmbedUrl && (
              <>
                <div className="absolute inset-0 bg-gradient-to-b from-[rgba(35,47,67,0)] via-[rgba(35,47,67,0.08)] to-[rgba(35,47,67,0.72)] pointer-events-none z-[2]" />

                {/* Top-Left LIVE Badge (Figma node 8313:24388) */}
                <div className="absolute bg-[#bf2318] flex gap-[5px] items-center justify-center left-[12px] top-[12px] px-[8px] py-[3px] rounded-[4px] z-[4]">
                  <span className="size-[6px] rounded-full bg-white animate-pulse" />
                  <span className="font-sans font-semibold text-[12px] leading-[14px] text-white uppercase tracking-wide">
                    LIVE
                  </span>
                  {activeCamera.camera_name && (
                    <span className="text-[11px] font-normal text-white/90 pl-1 border-l border-white/30">
                      {activeCamera.camera_name}
                    </span>
                  )}
                </div>

                {/* Timeline Bar (Figma node 8313:24412) */}
                <div className="absolute bottom-[40px] left-[12px] right-[12px] h-[3px] bg-[rgba(234,234,234,0.25)] rounded-full overflow-hidden z-[4]">
                  <div className="absolute inset-y-0 left-0 w-full bg-[#fc0d1c] rounded-full" />
                </div>

                {/* Bottom Controls Bar (Figma node 8313:24391) */}
                <div className="absolute bottom-[12px] left-[12px] right-[12px] flex items-center justify-between text-white z-[4]">
                  <div className="flex items-center gap-[18px]">
                    <button
                      type="button"
                      onClick={togglePlay}
                      aria-label={isPlaying ? "Pause" : "Play"}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    >
                      {isPlaying ? (
                        <Pause className="size-[15px] fill-white text-white" />
                      ) : (
                        <Play className="size-[15px] fill-white text-white" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={toggleMute}
                      aria-label={isMuted ? "Unmute" : "Mute"}
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    >
                      {isMuted ? (
                        <VolumeX className="size-[15px] text-white" />
                      ) : (
                        <Volume2 className="size-[15px] text-white" />
                      )}
                    </button>
                  </div>

                  <div className="flex items-center gap-[16px]">
                    <button
                      type="button"
                      onClick={setupStream}
                      title="Reconnect Stream (HD)"
                      className="relative hover:opacity-80 transition-opacity cursor-pointer flex items-center justify-center"
                    >
                      <Settings className="size-[14px] text-white" />
                      <span className="-top-1.5 -right-2.5 bg-[#ee1a26] text-white text-[7px] font-bold px-[2px] leading-[9px] rounded-[1px] absolute">
                        HD
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={toggleFullscreen}
                      title="Theater View"
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    >
                      <RectangleHorizontal className="size-[15px] text-white" />
                    </button>

                    <button
                      type="button"
                      onClick={setupStream}
                      title="Reload Stream"
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    >
                      <Tv className="size-[15px] text-white" />
                    </button>

                    <button
                      type="button"
                      onClick={toggleFullscreen}
                      title="Toggle Fullscreen"
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                    >
                      {isFullscreen ? (
                        <Minimize2 className="size-[14px] text-white" />
                      ) : (
                        <Maximize2 className="size-[14px] text-white" />
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          /* Honest Empty Camera State when this project has NO camera in /api/cameras */
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white">
            {(matchedProgress?.project_image || project.image) && (
              <img
                src={matchedProgress?.project_image || project.image}
                alt={displayTitle}
                className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
              />
            )}
            <div className="relative z-10 flex flex-col items-center max-w-sm">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mb-3 text-white/80">
                <VideoOff className="w-6 h-6" />
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/10 text-white/90 border border-white/15 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                Camera Offline / Not Deployed
              </span>
              <h3 className="font-serif text-lg font-semibold text-white">
                No Active Camera Feed for {displayTitle}
              </h3>
              <p className="text-xs text-white/70 mt-1 leading-relaxed">
                There is currently no live CCTV stream assigned to this project in the camera server. Real-time engineering progress from the construction API is shown below.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Real Construction Progress Rows from /api/constructions/projects-progress (Figma node 8313:24416) */}
      <div className="flex flex-col gap-[16px] items-start px-[4px] w-full">
        <div className="flex items-center justify-between w-full border-b border-[#f1f2f6] pb-2">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-[#546360]">
            Real-Time Construction Breakdown
          </span>
          {matchedProgress?.lastUpdatedDate ? (
            <span className="text-[11px] text-[#59657b]">
              Updated: {matchedProgress.lastUpdatedDate}
            </span>
          ) : !hasProgressRecord && !isLoadingData ? (
            <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              Awaiting Milestone Update
            </span>
          ) : null}
        </div>

        {isLoadingData ? (
          <div className="flex flex-col gap-[16px] w-full">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="flex items-center justify-between w-full">
                <div className="h-4 w-24 bg-stone-200 rounded animate-pulse" />
                <div className="h-2.5 w-[200px] sm:w-[253px] bg-stone-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-[16px] items-start w-full">
            {stageRows.map((stage, idx) => (
              <div
                key={stage.label}
                className="flex items-center justify-between gap-4 w-full"
              >
                <p className="font-sans font-medium leading-[18px] text-[#232f43] text-[14px] whitespace-nowrap">
                  {stage.label}
                </p>

                {/* 253px Progress Bar + Percentage (Figma node 8313:24419) */}
                <div className="flex gap-[8px] items-center shrink-0 w-[180px] sm:w-[253px]">
                  <div className="flex-1 h-[8px] relative rounded-[4px] bg-[#f2f4f7] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stage.pct}%` }}
                      transition={{
                        duration: 0.9,
                        delay: 0.1 + idx * 0.06,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="bg-[#054b3c] h-full rounded-[4px]"
                    />
                  </div>
                  <p className="font-sans font-normal leading-[18px] text-[#59657b] text-[14px] whitespace-nowrap w-[34px] text-right">
                    {stage.pct}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function CameraTab({
  myFlats = [],
  isLoading: isParentLoading = false,
}: CameraTabProps) {
  const [allCameras, setAllCameras] = useState<LiveCamera[]>([]);
  const [progressList, setProgressList] = useState<ApiConstructionProgressItem[]>([]);
  const [isLoadingApi, setIsLoadingApi] = useState(true);

  // Deduplicate user's real registered projects strictly from myFlats (NO fake fallback projects)
  const userProjects: ClientFlat[] = useMemo(() => {
    if (!myFlats || myFlats.length === 0) return [];
    const seen = new Set<string>();
    const list: ClientFlat[] = [];

    myFlats.forEach((flat) => {
      const key =
        (flat.project_id ? `id:${flat.project_id}` : "") ||
        (flat.slug ? `slug:${flat.slug.toLowerCase()}` : "") ||
        `title:${normalizeProjectName(flat.title)}`;

      if (!seen.has(key)) {
        seen.add(key);
        list.push(flat);
      }
    });

    return list;
  }, [myFlats]);

  // Fetch BOTH /api/cameras and /api/constructions/projects-progress in parallel
  useEffect(() => {
    let isMounted = true;

    async function fetchCameraAndProgressApis() {
      try {
        setIsLoadingApi(true);
        const baseUrl = (
          process.env.NEXT_PUBLIC_API_BASE_URL ||
          "https://api.dpremiumhomes.com/api"
        ).replace(/\/+$/, "");

        const [camRes, progRes] = await Promise.allSettled([
          fetch(`${baseUrl}/cameras`, {
            cache: "no-store",
            headers: { Accept: "application/json" },
          }),
          fetch(`${baseUrl}/constructions/projects-progress`, {
            cache: "no-store",
            headers: { Accept: "application/json" },
          }),
        ]);

        if (!isMounted) return;

        if (camRes.status === "fulfilled" && camRes.value.ok) {
          const camJson = await camRes.value.json();
          const camerasArray: LiveCamera[] = Array.isArray(camJson?.cameras)
            ? camJson.cameras
            : Array.isArray(camJson?.data)
            ? camJson.data
            : [];
          setAllCameras(camerasArray);
        }

        if (progRes.status === "fulfilled" && progRes.value.ok) {
          const progJson = await progRes.value.json();
          const progArray: ApiConstructionProgressItem[] = Array.isArray(progJson)
            ? progJson
            : Array.isArray(progJson?.data)
            ? progJson.data
            : [];
          setProgressList(progArray);
        }
      } catch (err) {
        console.error("[CameraTab] Error fetching camera & progress APIs:", err);
      } finally {
        if (isMounted) {
          setIsLoadingApi(false);
        }
      }
    }

    fetchCameraAndProgressApis();

    return () => {
      isMounted = false;
    };
  }, []);

  // Strictly match construction progress item for a user's project
  const findProgressForProject = (proj: ClientFlat): ApiConstructionProgressItem | null => {
    if (progressList.length === 0) return null;

    const rawPropId = Number(proj.project_id) || 0;
    const flatSlug = (proj.slug || "").toLowerCase().trim();
    const normUserTitle = normalizeProjectName(proj.title);

    // 1. Strict match by numeric property_id
    if (rawPropId > 0) {
      const byId = progressList.find((p) => Number(p.property_id) === rawPropId);
      if (byId) return byId;
    }

    // 2. Strict match by project_slug
    if (flatSlug) {
      const bySlug = progressList.find(
        (p) => (p.project_slug || "").toLowerCase().trim() === flatSlug
      );
      if (bySlug) return bySlug;
    }

    // 3. Strict match by normalized project name
    if (normUserTitle) {
      const byName = progressList.find((p) => {
        const normApiName = normalizeProjectName(p.project_name || p.property_name);
        return (
          normApiName &&
          (normApiName === normUserTitle ||
            normApiName.includes(normUserTitle) ||
            normUserTitle.includes(normApiName))
        );
      });
      if (byName) return byName;
    }

    return null;
  };

  // Strictly match cameras for a user's project (NEVER fallback to another project's camera)
  const findCamerasForProject = (
    proj: ClientFlat,
    matchedProgress: ApiConstructionProgressItem | null
  ): LiveCamera[] => {
    const combined: LiveCamera[] = [];
    const seenIds = new Set<string | number>();

    // Include any cameras directly embedded in the matched progress record
    if (Array.isArray(matchedProgress?.cameras)) {
      matchedProgress.cameras.forEach((c) => {
        if (c && !seenIds.has(c.id)) {
          seenIds.add(c.id);
          combined.push(c);
        }
      });
    }

    if (allCameras.length === 0) return combined;

    const targetIds = new Set<number>();
    if (Number(proj.project_id) > 0) targetIds.add(Number(proj.project_id));
    if (Number(matchedProgress?.property_id) > 0) {
      targetIds.add(Number(matchedProgress?.property_id));
    }

    const normUserTitle = normalizeProjectName(
      matchedProgress?.project_name || matchedProgress?.property_name || proj.title
    );

    allCameras.forEach((cam) => {
      if (seenIds.has(cam.id)) return;

      // 1. Match by numeric project_id
      if (cam.project_id && targetIds.has(Number(cam.project_id))) {
        seenIds.add(cam.id);
        combined.push(cam);
        return;
      }

      // 2. Match by normalized project_name
      const normCamProj = normalizeProjectName(cam.project_name);
      if (
        normUserTitle &&
        normCamProj &&
        (normCamProj === normUserTitle ||
          normCamProj.includes(normUserTitle) ||
          normUserTitle.includes(normCamProj))
      ) {
        seenIds.add(cam.id);
        combined.push(cam);
      }
    });

    return combined;
  };

  const showSkeleton = isParentLoading || (isLoadingApi && userProjects.length === 0);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-[32px] items-start w-full"
    >
      {/* Header (Figma node 8313:24368) */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between w-full"
      >
        <div className="flex flex-col gap-[12px] items-start">
          <h1 className="capitalize font-serif font-semibold leading-[1.1] text-[#054b3c] text-[28px] sm:text-[32px]">
            Live Project Progress
          </h1>
          <p className="font-sans font-normal leading-none text-[#546360] text-[15px] sm:text-[16px]">
            Watch Real-time construction progress from anywhere.
          </p>
        </div>
      </motion.div>

      {/* Content */}
      {showSkeleton ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px] lg:gap-[30px] items-start w-full">
          {[1, 2].map((n) => (
            <div
              key={`cam-skeleton-${n}`}
              className="bg-white rounded-[20px] p-[16px] flex flex-col gap-[20px] w-full animate-pulse"
            >
              <div className="space-y-2">
                <div className="h-5 w-48 bg-stone-200 rounded" />
                <div className="h-4 w-32 bg-stone-100 rounded" />
              </div>
              <div className="h-[260px] sm:h-[349px] rounded-[16px] bg-stone-200 w-full" />
              <div className="space-y-3 pt-2">
                {[1, 2, 3, 4, 5].map((r) => (
                  <div key={r} className="flex justify-between items-center">
                    <div className="h-4 w-24 bg-stone-200 rounded" />
                    <div className="h-2.5 w-[200px] bg-stone-100 rounded" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : userProjects.length === 0 ? (
        <div className="bg-white rounded-[20px] p-10 sm:p-12 text-center flex flex-col items-center justify-center w-full">
          <div className="w-16 h-16 rounded-2xl bg-[#f1f6f5] flex items-center justify-center text-[#054b3c] mb-4">
            <Building2 className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#054b3c]">
            No Registered Properties Found
          </h3>
          <p className="text-xs sm:text-sm text-[#546360] mt-1.5 max-w-md leading-relaxed">
            You do not have any registered properties in your account yet. Once a property is assigned to your profile, its live site camera and real-time construction progress will appear here.
          </p>
        </div>
      ) : (
        /* 2-Column Project Camera Cards Grid (Figma node 8313:24372: gap-[30px]) */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px] lg:gap-[30px] items-start w-full">
          {userProjects.map((proj, index) => {
            const matchedProgress = findProgressForProject(proj);
            const matchedCameras = findCamerasForProject(proj, matchedProgress);

            return (
              <ProjectCameraCard
                key={`${proj.id}-${index}`}
                project={proj}
                matchedProgress={matchedProgress}
                cameras={matchedCameras}
                isLoadingData={isLoadingApi}
              />
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
