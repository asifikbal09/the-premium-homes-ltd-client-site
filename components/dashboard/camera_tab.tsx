"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import {
  Video,
  VideoOff,
  RefreshCw,
  Maximize2,
  Minimize2,
  ShieldCheck,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Building2,
  MapPin,
  AlertCircle,
  Loader2,
  ChevronDown,
  Check,
  Radio,
  HardHat,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { ClientFlat, LiveCamera } from "./types";
import { cn } from "@/lib/utils";

interface CameraTabProps {
  myFlats?: ClientFlat[];
  onNavigateTab?: (tab: string) => void;
}

const FALLBACK_USER_PROJECTS: ClientFlat[] = [
  {
    id: "50",
    project_id: 50,
    title: "The Noble Court",
    flatNo: "3A",
    location: "Ashulia Model Town",
    image: "/image/progress/tph_green_valley.png",
    status: "Under Construction",
    construction_pct: 75,
    handover_date: "Dec 2027",
    price: "From ৳2.2 Cr",
  },
  {
    id: "54",
    project_id: 54,
    title: "The Premium Green Valley",
    flatNo: "5B",
    location: "Ashulia Model Town",
    image: "/image/progress/tph_green_valley.png",
    status: "Under Construction",
    construction_pct: 82,
    handover_date: "Dec 2026",
    price: "From ৳3.1 Cr",
  },
  {
    id: "999",
    project_id: 999,
    title: "The Premium Sky Horizon",
    flatNo: "8A",
    location: "Gulshan 2, Dhaka",
    image: "/image/progress/tph_green_valley.png",
    status: "Foundation Phase",
    construction_pct: 18,
    handover_date: "Dec 2029",
    price: "From ৳4.5 Cr",
  },
];

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

export function CameraTab({ myFlats = [] }: CameraTabProps) {
  const [allCameras, setAllCameras] = useState<LiveCamera[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Determine user's active projects list (deduplicated by title/id)
  const userProjects: ClientFlat[] = useMemo(() => {
    if (myFlats && myFlats.length > 0) {
      const seen = new Set<string>();
      const list: ClientFlat[] = [];
      myFlats.forEach((flat) => {
        const key = (flat.title || String(flat.id)).toLowerCase().trim();
        if (!seen.has(key)) {
          seen.add(key);
          list.push(flat);
        }
      });
      return list;
    }
    return FALLBACK_USER_PROJECTS;
  }, [myFlats]);

  // Selected project state (defaults to first user project)
  const [selectedProjectId, setSelectedProjectId] = useState<string | number>(
    userProjects[0]?.project_id || userProjects[0]?.id || ""
  );

  // Sync selected project if user projects change
  useEffect(() => {
    if (userProjects.length > 0) {
      const exists = userProjects.some(
        (p) => String(p.project_id || p.id) === String(selectedProjectId)
      );
      if (!exists) {
        setSelectedProjectId(userProjects[0].project_id || userProjects[0].id);
      }
    }
  }, [userProjects, selectedProjectId]);

  const activeProject = useMemo(() => {
    return (
      userProjects.find(
        (p) => String(p.project_id || p.id) === String(selectedProjectId)
      ) || userProjects[0]
    );
  }, [userProjects, selectedProjectId]);

  // Fetch cameras from API
  useEffect(() => {
    let isMounted = true;

    async function fetchCameras() {
      try {
        setIsLoading(true);
        setApiError(null);

        const res = await fetch("https://api.dpremiumhomes.com/api/cameras", {
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch cameras (status ${res.status})`);
        }

        const data = await res.json();
        const cameraList: LiveCamera[] = data.cameras || [];

        if (!isMounted) return;
        setAllCameras(cameraList);
      } catch (err: any) {
        if (!isMounted) return;
        console.error("Error loading cameras:", err);
        setApiError(err.message || "Failed to load live cameras");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchCameras();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter cameras strictly for the active user project
  const projectCameras = useMemo(() => {
    if (!activeProject || allCameras.length === 0) return [];

    const pId = activeProject.project_id || activeProject.id;
    // 1. Try matching by numerical project_id
    if (pId) {
      const matchedById = allCameras.filter(
        (c) => String(c.project_id) === String(pId)
      );
      if (matchedById.length > 0) return matchedById;
    }

    // 2. Try matching by normalized project name
    const cleanUserProj = activeProject.title
      .toLowerCase()
      .replace(/^(the\s+)?(premium\s+)?/i, "")
      .replace(/residence|garden|villa|court|terrace|valley|heaven/gi, "")
      .trim();

    const matchedByName = allCameras.filter((c) => {
      const cleanCamProj = c.project_name
        .toLowerCase()
        .replace(/^(the\s+)?(premium\s+)?/i, "")
        .replace(/residence|garden|villa|court|terrace|valley|heaven/gi, "")
        .trim();

      return (
        cleanCamProj.includes(cleanUserProj) ||
        cleanUserProj.includes(cleanCamProj)
      );
    });

    return matchedByName;
  }, [activeProject, allCameras]);

  // Selected camera state
  const [selectedCameraId, setSelectedCameraId] = useState<number | null>(null);

  // Auto-select first camera when project cameras change
  useEffect(() => {
    if (projectCameras.length > 0) {
      const stillValid = projectCameras.some((c) => c.id === selectedCameraId);
      if (!stillValid) {
        setSelectedCameraId(projectCameras[0].id);
      }
    } else {
      setSelectedCameraId(null);
    }
  }, [projectCameras, selectedCameraId]);

  const activeCamera = useMemo(() => {
    if (projectCameras.length === 0) return null;
    return (
      projectCameras.find((c) => c.id === selectedCameraId) ||
      projectCameras[0]
    );
  }, [projectCameras, selectedCameraId]);

  // Video player states
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [streamBuffering, setStreamBuffering] = useState(true);
  const [streamError, setStreamError] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const hlsInstanceRef = useRef<any>(null);

  // Setup HLS live stream player
  const setupStream = () => {
    if (!activeCamera?.camera_link || !videoRef.current) return;

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

    // Prioritize Hls.js for Chromium / Firefox / Edge
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
              .catch((err) => {
                console.warn("Autoplay muted required:", err);
                videoEl.muted = true;
                setIsMuted(true);
                videoEl.play().catch(() => {});
              });
          });

          hls.on(Hls.Events.ERROR, (_event: any, data: any) => {
            if (data.fatal) {
              console.warn("HLS fatal error encountered:", data.type, data.details);
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

        // Native HLS for Safari / iOS
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

        console.error("HLS is not supported in this browser");
        setStreamError(true);
        setStreamBuffering(false);
      })
      .catch((err) => {
        console.error("Failed to load Hls library:", err);
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

  // Video controls
  const togglePlay = () => {
    if (!videoRef.current) return;
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
      playerContainerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(() => {});
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(() => {});
    }
  };

  const handleReload = () => {
    setupStream();
  };

  return (
    <div className="space-y-6">
      {/* Tab Header & Title */}
      <div>
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
          </span>
          <h1 className="font-serif text-2xl sm:text-[30px] font-bold text-[#044133] tracking-tight">
            Live Site Surveillance
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Real-time 24/7 high-definition camera surveillance for your assigned property site.
        </p>
      </div>

      {/* User's Projects Selector Tabs */}
      {userProjects.length > 0 && (
        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-stone-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 font-mono">
              Your Registered Projects ({userProjects.length})
            </span>
            <span className="text-[11px] text-stone-400">
              Select project to switch camera feed
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {userProjects.map((proj) => {
              const projKey = proj.project_id || proj.id;
              const isSelected = String(projKey) === String(selectedProjectId);

              // Quick check if this project has any camera in allCameras
              const hasCams = allCameras.some((c) => {
                if (proj.project_id && String(c.project_id) === String(proj.project_id)) return true;
                const cleanUserProj = proj.title.toLowerCase().replace(/^(the\s+)?(premium\s+)?/i, "").trim();
                const cleanCamProj = c.project_name.toLowerCase().replace(/^(the\s+)?(premium\s+)?/i, "").trim();
                return cleanCamProj.includes(cleanUserProj) || cleanUserProj.includes(cleanCamProj);
              });

              return (
                <button
                  key={String(projKey)}
                  type="button"
                  onClick={() => setSelectedProjectId(projKey)}
                  className={cn(
                    "flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer border select-none",
                    isSelected
                      ? "bg-[#044133] text-white border-[#044133] shadow-xs"
                      : "bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200"
                  )}
                >
                  <Building2
                    className={cn(
                      "w-4 h-4 shrink-0",
                      isSelected ? "text-[#dfb775]" : "text-stone-400"
                    )}
                  />
                  <div className="text-left">
                    <p className="font-semibold leading-tight">{proj.title}</p>
                    <p
                      className={cn(
                        "text-[10px] mt-0.5",
                        isSelected ? "text-white/70" : "text-stone-400"
                      )}
                    >
                      {proj.flatNo ? `Unit ${proj.flatNo} • ` : ""}
                      {proj.location}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ml-1 shrink-0 uppercase",
                      isSelected
                        ? hasCams
                          ? "bg-red-500/20 text-red-200 border border-red-400/40"
                          : "bg-white/20 text-white/80"
                        : hasCams
                        ? "bg-red-50 text-red-600 border border-red-200"
                        : "bg-stone-200/70 text-stone-500"
                    )}
                  >
                    {hasCams ? "● Live" : "Offline"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {isLoading ? (
        <div className="w-full aspect-video rounded-2xl bg-stone-900 flex flex-col items-center justify-center text-white/70 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#dfb775]" />
          <p className="text-xs font-mono tracking-wider uppercase">
            Loading Live Cameras for {activeProject?.title}...
          </p>
        </div>
      ) : apiError ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
          <p className="text-sm font-semibold text-red-900">Failed to load camera feeds</p>
          <p className="text-xs text-red-600">{apiError}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 transition cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : projectCameras.length === 0 ? (
        /* RELEVANT EMPTY STATE: WHEN NO CAMERAS EXIST FOR THIS PROJECT */
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-stone-200/90 text-center space-y-6 shadow-xs max-w-3xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center mx-auto text-amber-700 shadow-2xs">
            <VideoOff className="w-8 h-8" />
          </div>

          <div className="space-y-2.5 max-w-lg mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-semibold uppercase bg-amber-100/80 text-amber-900 border border-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
              Surveillance Camera Not Configured
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
              No Live Camera Available for {activeProject?.title}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
              Currently, there are no 24/7 live surveillance cameras active or deployed for{" "}
              <strong className="text-stone-800">{activeProject?.title}</strong> ({activeProject?.location}). 
              Live site cameras are typically mounted during key structural deck casting and exterior finishing phases.
            </p>
          </div>

          {/* Project Details Banner */}
          <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/70 max-w-md mx-auto flex items-center justify-around text-xs">
            <div className="text-center">
              <p className="text-[10px] uppercase font-mono text-stone-400">Current Phase</p>
              <p className="font-semibold text-stone-800 mt-0.5">
                {activeProject?.status || "Under Construction"}
              </p>
            </div>
            <div className="h-8 w-px bg-stone-200" />
            <div className="text-center">
              <p className="text-[10px] uppercase font-mono text-stone-400">Completion</p>
              <p className="font-semibold text-[#044133] mt-0.5">
                {activeProject?.construction_pct || 75}%
              </p>
            </div>
            <div className="h-8 w-px bg-stone-200" />
            <div className="text-center">
              <p className="text-[10px] uppercase font-mono text-stone-400">Handover</p>
              <p className="font-semibold text-stone-800 mt-0.5">
                {activeProject?.handover_date || "Dec 2027"}
              </p>
            </div>
          </div>

          {/* Quick Guidance Actions */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/dashboard?tab=progress"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#044133] text-white text-xs font-semibold hover:bg-[#032f25] active:scale-95 transition shadow-xs cursor-pointer"
            >
              <HardHat className="w-4 h-4 text-[#dfb775]" />
              <span>View Construction Progress Photos</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
            <a
              href="/dashboard?tab=support"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium transition cursor-pointer"
            >
              <span>Inquire with Project Engineer</span>
            </a>
          </div>
        </div>
      ) : (
        /* CAMERA PLAYER & LIST FOR THIS PROJECT */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column: Live Video Player (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div
              ref={playerContainerRef}
              className="bg-black rounded-2xl overflow-hidden border border-stone-800 shadow-2xl relative aspect-video flex flex-col justify-between group"
            >
              {/* HTML5 Video Element */}
              <video
                ref={videoRef}
                playsInline
                autoPlay
                muted={isMuted}
                className="w-full h-full object-contain bg-black"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onWaiting={() => setStreamBuffering(true)}
                onPlaying={() => setStreamBuffering(false)}
              />

              {/* Buffering Indicator */}
              {streamBuffering && !streamError && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white z-20 space-y-2">
                  <Loader2 className="w-8 h-8 animate-spin text-[#dfb775]" />
                  <span className="text-xs font-mono tracking-wider text-stone-300">
                    CONNECTING LIVE ENCRYPTED FEED...
                  </span>
                </div>
              )}

              {/* Stream Error / Offline Fallback */}
              {streamError && (
                <div className="absolute inset-0 bg-stone-950 flex flex-col items-center justify-center p-6 text-center z-20 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-red-950/80 border border-red-800 flex items-center justify-center text-red-500">
                    <Radio className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="space-y-1 max-w-sm">
                    <h4 className="text-sm font-semibold text-white">Live Stream Reconnecting</h4>
                    <p className="text-xs text-stone-400 leading-relaxed">
                      Camera feed for <span className="text-stone-200 font-medium">{activeCamera?.camera_name}</span> is temporarily offline or undergoing scheduled site maintenance.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleReload}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium transition cursor-pointer border border-white/20"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reconnect Stream</span>
                  </button>
                </div>
              )}

              {/* Top Stream Info Bar */}
              <div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/85 via-black/40 to-transparent flex items-center justify-between text-white text-xs z-10 pointer-events-none">
                <div className="flex items-center gap-2.5 pointer-events-auto">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
                  </span>
                  <span className="font-bold tracking-wider uppercase text-red-500 font-mono text-[11px]">
                    LIVE FEED
                  </span>
                  <span className="text-white/40">|</span>
                  <span className="font-medium text-white/95 text-[11px] truncate max-w-[200px] sm:max-w-xs">
                    {activeCamera?.camera_name || activeProject?.title}
                  </span>
                </div>

                <div className="flex items-center gap-2 pointer-events-auto">
                  <span className="hidden sm:inline-block px-2.5 py-0.5 rounded bg-white/15 backdrop-blur-md text-[10px] font-mono text-white/90 border border-white/10">
                    1080P HD
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 backdrop-blur-md text-[10px] font-mono text-emerald-400 border border-emerald-500/30">
                    AES-256
                  </span>
                </div>
              </div>

              {/* Bottom Stream Controls Bar */}
              <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between text-white text-xs z-10">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={togglePlay}
                    aria-label={isPlaying ? "Pause stream" : "Play stream"}
                    className="p-2 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                  </button>

                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                    className="p-2 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={handleReload}
                    title="Reload live stream"
                    aria-label="Reload live stream"
                    className="p-2 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>

                  <span className="hidden md:inline font-mono text-white/70 text-[11px]">
                    {activeProject?.location}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    title="Toggle Fullscreen"
                    aria-label="Toggle Fullscreen"
                    className="p-2 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
                  >
                    {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Current Camera Meta Details */}
            {activeCamera && (
              <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <h3 className="font-serif font-bold text-stone-900 text-sm">
                    {activeCamera.camera_name}
                  </h3>
                  <p className="text-stone-500 mt-0.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>{activeCamera.location} — {activeProject?.title}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase font-mono bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    {activeCamera.status || "Active"}
                  </span>
                  <span className="text-stone-400">|</span>
                  <span className="text-[11px] text-stone-500 font-mono">
                    ID #{activeCamera.id}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Project Cameras List Sidebar (1 col) */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2 text-[#044133]">
                  <Video className="w-4 h-4" />
                  <h3 className="font-serif font-bold text-sm sm:text-base">Project Cameras</h3>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">
                  {projectCameras.length} Active
                </span>
              </div>

              {/* Cameras List */}
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {projectCameras.map((cam, idx) => {
                  const isActive = activeCamera?.id === cam.id;
                  return (
                    <button
                      key={cam.id}
                      type="button"
                      onClick={() => setSelectedCameraId(cam.id)}
                      className={cn(
                        "w-full text-left p-3.5 rounded-xl border text-xs transition-all cursor-pointer select-none",
                        isActive
                          ? "border-[#044133] bg-[#044133]/5 text-[#044133] font-semibold shadow-2xs"
                          : "border-stone-200 hover:bg-stone-50 text-stone-700 hover:border-stone-300"
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-xs truncate">
                          {cam.camera_name || `Camera ${idx + 1}`}
                        </span>
                        <span className="text-[10px] font-bold text-red-600 font-mono flex items-center gap-1 shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping inline-block" />
                          LIVE
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-1 truncate">
                        {cam.location || activeProject.title}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Client Security Notice */}
              <div className="pt-3 border-t border-stone-100 flex items-start gap-2 text-[11px] text-stone-500 leading-relaxed">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Exclusively accessible to registered property owners. Live streams are encrypted and monitored 24/7.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


