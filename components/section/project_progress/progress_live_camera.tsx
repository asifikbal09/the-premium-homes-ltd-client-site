"use client";

import { motion, useInView } from "motion/react";
import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Pause, Radio, RefreshCw, VideoOff, VolumeX, X } from "lucide-react";
import { Appear, Shutter } from "@/components/ui/motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn, SETTLE } from "@/lib/utils";

export interface CameraFeedItem {
  id?: number | string;
  project_id?: number | string;
  project_name?: string;
  location?: string;
  name?: string;
  camera_name?: string;
  camera_link?: string;
  link?: string;
  url?: string;
  stream_url?: string;
  status?: string;
  is_online?: boolean;
  live_status?: string;
  image?: string;
}

interface NormalizedCameraFeed {
  id: string;
  name: string;
  shortLabel: string;
  streamUrl: string;
  image: string;
  isOnline?: boolean;
}

interface ProgressLiveCameraProps {
  cameras?: Array<CameraFeedItem | string>;
  workCategoryProgress?: Record<string, string | undefined>;
  fallbackImage?: string;
  overallProgress?: number;
  projectName?: string;
}

function parsePercentage(val?: string | number): number {
  if (typeof val === "number") return val;
  if (!val) return 0;
  const num = parseFloat(String(val).replace(/%/g, "").trim());
  return isNaN(num) ? 0 : Math.round(num);
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

function formatShortCameraLabel(rawName: string, idx: number): string {
  if (!rawName) return `Camera ${idx + 1}`;
  // Extract "Cam 1" or suffix after " - " if prefixed with project name
  const dashParts = rawName.split(/\s+-\s+/);
  if (dashParts.length > 1) {
    return dashParts[dashParts.length - 1].trim();
  }
  return rawName;
}

function normalizeCameras(
  cameras?: Array<CameraFeedItem | string>,
  fallbackImage?: string,
): NormalizedCameraFeed[] {
  const defaultImg = fallbackImage || "/image/progress/live_camera.png";
  if (!Array.isArray(cameras) || cameras.length === 0) {
    return [];
  }

  const list: NormalizedCameraFeed[] = [];

  cameras.forEach((item, idx) => {
    const fallbackLabel = `Camera ${idx + 1}`;

    if (typeof item === "string") {
      const url = item.trim();
      if (!url) return;
      list.push({
        id: `cam-${idx + 1}`,
        name: fallbackLabel,
        shortLabel: fallbackLabel,
        streamUrl: url,
        image: defaultImg,
      });
      return;
    }

    if (item && typeof item === "object") {
      const rawUrl =
        item.camera_link ||
        item.stream_url ||
        item.url ||
        (typeof item.link === "string" ? item.link : "") ||
        "";
      const streamUrl = typeof rawUrl === "string" ? rawUrl.trim() : "";
      if (!streamUrl && !item.image) return;

      const fullName = item.name || item.camera_name || fallbackLabel;
      list.push({
        id: String(item.id ?? `cam-${idx + 1}`),
        name: fullName,
        shortLabel: formatShortCameraLabel(fullName, idx),
        streamUrl,
        image: item.image || defaultImg,
        isOnline: item.is_online,
      });
    }
  });

  return list;
}

export function ProgressLiveCamera({
  cameras = [],
  workCategoryProgress,
  fallbackImage,
  overallProgress,
  projectName,
}: ProgressLiveCameraProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsInstanceRef = useRef<any>(null);

  const inView = useInView(sectionRef, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();

  const resolvedCameras = normalizeCameras(cameras, fallbackImage);
  const hasCameras = resolvedCameras.length > 0;

  const [activeCameraId, setActiveCameraId] = useState<string>(
    resolvedCameras[0]?.id ?? "",
  );
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [streamBuffering, setStreamBuffering] = useState(false);
  const [streamError, setStreamError] = useState(false);

  const currentCamera = hasCameras
    ? resolvedCameras.find((c) => c.id === String(activeCameraId)) ||
      resolvedCameras[0]
    : null;

  const currentCameraName = currentCamera?.name || "Live Site Camera";
  const currentCameraStreamUrl = currentCamera?.streamUrl || "";
  const currentCameraImage =
    currentCamera?.image ||
    fallbackImage ||
    "/image/progress/live_camera.png";

  const isEmbeddableStream =
    Boolean(currentCameraStreamUrl) &&
    (currentCameraStreamUrl.includes("youtube.com") ||
      currentCameraStreamUrl.includes("youtu.be") ||
      currentCameraStreamUrl.includes("vimeo.com"));

  const setupStream = useCallback(() => {
    if (!currentCameraStreamUrl || !videoRef.current) {
      setStreamBuffering(false);
      return;
    }

    if (isEmbeddableStream) {
      setStreamBuffering(false);
      setStreamError(false);
      return;
    }

    setStreamBuffering(true);
    setStreamError(false);

    const videoEl = videoRef.current;

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
            manifestLoadingMaxRetry: 2,
            levelLoadingTimeOut: 15000,
          });

          hlsInstanceRef.current = hls;
          hls.loadSource(currentCameraStreamUrl);
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
          videoEl.src = currentCameraStreamUrl;
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
          videoEl.src = currentCameraStreamUrl;
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
  }, [currentCameraStreamUrl, isEmbeddableStream, isMuted]);

  useEffect(() => {
    setupStream();
    return () => {
      if (hlsInstanceRef.current) {
        hlsInstanceRef.current.destroy();
        hlsInstanceRef.current = null;
      }
    };
  }, [currentCamera?.id, currentCameraStreamUrl, setupStream]);

  const togglePlay = () => {
    if (!videoRef.current || !currentCameraStreamUrl) return;
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
    if (!videoRef.current) {
      setIsMuted((m) => !m);
      return;
    }
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleFullscreen = () => {
    if (playerContainerRef.current && playerContainerRef.current.requestFullscreen) {
      if (!document.fullscreenElement) {
        playerContainerRef.current.requestFullscreen().catch(() => {
          setIsFullscreen(true);
        });
      } else {
        document.exitFullscreen().catch(() => {});
      }
    } else {
      setIsFullscreen(true);
    }
  };

  const hasWorkData =
    workCategoryProgress && Object.keys(workCategoryProgress).length > 0;

  const breakdownItems = hasWorkData
    ? [
        {
          label: "Handover",
          percentage:
            overallProgress !== undefined
              ? Math.min(100, Math.max(0, Math.round(overallProgress)))
              : parsePercentage(workCategoryProgress?.structural_work),
        },
        {
          label: "Structure",
          percentage: parsePercentage(workCategoryProgress?.structural_work),
        },
        {
          label: "Brickwork",
          percentage: parsePercentage(workCategoryProgress?.brick_work),
        },
        {
          label: "Electrical",
          percentage: parsePercentage(workCategoryProgress?.electrical_work),
        },
        {
          label: "Plumbing",
          percentage: parsePercentage(workCategoryProgress?.plumbing_work),
        },
        {
          label: "Interior",
          percentage: parsePercentage(
            workCategoryProgress?.tiles_work ?? workCategoryProgress?.plaster_work,
          ),
        },
        {
          label: "Finishing",
          percentage: parsePercentage(workCategoryProgress?.paint_work),
        },
      ]
    : [
        { label: "Handover", percentage: 0 },
        { label: "Structure", percentage: 0 },
        { label: "Brickwork", percentage: 0 },
        { label: "Electrical", percentage: 0 },
        { label: "Plumbing", percentage: 0 },
        { label: "Interior", percentage: 0 },
        { label: "Finishing", percentage: 0 },
      ];

  return (
    <section
      ref={sectionRef}
      aria-label="Live Construction Camera and Progress Breakdown"
      className="w-full bg-white pb-[clamp(56px,5vw,80px)] pt-10"
    >
      <div className="shell">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[832fr_552fr] lg:gap-[56px]">
          {/* Left Column: Live Construction Camera (Figma 8036:25083) */}
          <div className="flex flex-col items-start gap-[24px]">
            <Appear preset="lift" delay={0.08}>
              <h2 className="font-display text-[28px] font-semibold capitalize leading-[1.1] text-[#054b3c] sm:text-[32px]">
                Live Construction Camera
              </h2>
            </Appear>

            <div className="flex w-full flex-col items-start gap-[24px]">
              {/* Video Player Frame (832 × 448 in Figma 8036:25086) */}
              <Shutter className="relative h-[260px] w-full bg-black sm:h-[380px] lg:h-[448px]">
                <div
                  ref={playerContainerRef}
                  className="relative size-full overflow-hidden bg-[#09221c]"
                >
                  {hasCameras && currentCamera ? (
                    <>
                      {isEmbeddableStream ? (
                        <iframe
                          src={currentCameraStreamUrl}
                          title={currentCameraName}
                          className="size-full border-0"
                          allow="autoplay; encrypted-media; picture-in-picture"
                          allowFullScreen
                        />
                      ) : currentCameraStreamUrl ? (
                        <video
                          ref={videoRef}
                          playsInline
                          autoPlay
                          muted={isMuted}
                          poster={currentCameraImage}
                          className="size-full bg-black object-cover"
                          onPlay={() => setIsPlaying(true)}
                          onPause={() => setIsPlaying(false)}
                          onWaiting={() => setStreamBuffering(true)}
                          onPlaying={() => setStreamBuffering(false)}
                        />
                      ) : (
                        <>
                          <Image
                            src={currentCameraImage}
                            alt={`${currentCameraName} Live Construction Feed`}
                            fill
                            sizes="(max-width: 1024px) 100vw, 832px"
                            className="object-cover object-center"
                            priority
                          />
                          <div
                            aria-hidden
                            className="pointer-events-none absolute inset-0 bg-black/[0.08]"
                          />
                        </>
                      )}

                      {/* Buffering Overlay */}
                      {streamBuffering && !streamError && (
                        <div className="absolute inset-0 z-15 flex flex-col items-center justify-center gap-2.5 bg-black/55 text-white backdrop-blur-[2px]">
                          <Loader2 className="size-7 animate-spin text-white" />
                          <span className="font-sans text-xs font-medium uppercase tracking-[1.5px] text-white/90">
                            Connecting Live Stream ({currentCamera.shortLabel})...
                          </span>
                        </div>
                      )}

                      {/* Stream Offline / Error Overlay */}
                      {streamError && (
                        <div className="absolute inset-0 z-15 flex flex-col items-center justify-center gap-3 bg-[#09221c]/90 p-6 text-center text-white backdrop-blur-xs">
                          <Image
                            src={currentCameraImage}
                            alt={currentCameraName}
                            fill
                            sizes="(max-width: 1024px) 100vw, 832px"
                            className="pointer-events-none object-cover object-center opacity-20"
                          />
                          <div className="relative z-10 flex max-w-md flex-col items-center gap-2.5">
                            <Radio className="size-7 animate-pulse text-[#e14640]" />
                            <p className="font-display text-xl font-medium text-white sm:text-2xl">
                              {currentCameraName} Feed Offline
                            </p>
                            <p className="font-sans text-xs leading-relaxed text-white/70 sm:text-sm">
                              The live camera stream could not be reached right now. The site camera may be undergoing scheduled maintenance.
                            </p>
                            <button
                              type="button"
                              onClick={setupStream}
                              className="press mt-1 inline-flex cursor-pointer items-center gap-2 rounded-full bg-white/15 px-4 py-2 font-sans text-xs font-medium uppercase tracking-wider text-white transition hover:bg-white/25"
                            >
                              <RefreshCw className="size-3.5" />
                              <span>Retry Connection</span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Top-Left LIVE Pill (Figma 8036:25113) */}
                      <div className="absolute left-[20px] top-[20px] z-20 flex items-center justify-center rounded-[100px] bg-[#e14640] px-[12px] py-[7px]">
                        <div className="flex items-center gap-[6px]">
                          <span className="relative flex size-[8px] items-center justify-center">
                            <span className="absolute inline-flex size-full animate-ping rounded-full bg-white opacity-75" />
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src="/image/progress/icons/lead-icon.svg"
                              alt=""
                              width={8}
                              height={8}
                              className="relative size-[8px]"
                            />
                          </span>
                          <span className="trim font-sans text-[10px] font-normal uppercase leading-none tracking-[0.1px] text-white">
                            LIVE
                          </span>
                          {currentCamera.shortLabel && (
                            <span className="border-l border-white/30 pl-1.5 font-sans text-[10px] font-medium uppercase leading-none text-white/95">
                              {currentCamera.shortLabel}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Bottom Video Controls Overlay (Figma 8036:25088) */}
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-24 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                      {/* Scrub Timeline Bar (Figma 8036:25109) */}
                      <div className="absolute bottom-[49px] left-[2.4%] right-[2.4%] z-20 h-[3px]">
                        <div className="absolute inset-0 bg-[#eaeaea]/20" />
                        <div className="absolute inset-y-0 left-0 w-[40%] bg-[#eaeaea]/50" />
                        <div className="absolute inset-0 bg-[#fc0d1c]" />
                      </div>

                      {/* Bottom Control Icons Row (Figma 8036:25089) */}
                      <div className="absolute bottom-[20.5px] left-[20px] right-[20.27px] z-20 flex items-center justify-between">
                        {/* Play & Sound */}
                        <div className="flex items-center gap-[28px]">
                          <button
                            type="button"
                            onClick={togglePlay}
                            aria-label={isPlaying ? "Pause stream" : "Play stream"}
                            className="flex cursor-pointer items-center justify-center text-white opacity-95 transition-opacity hover:opacity-100"
                          >
                            {isPlaying ? (
                              <Pause className="size-4 fill-white text-white" />
                            ) : (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src="/image/progress/icons/ico-play.svg"
                                alt=""
                                width={13}
                                height={16}
                                className="h-[16.23px] w-[13.19px]"
                              />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={toggleMute}
                            aria-label={isMuted ? "Unmute stream" : "Mute stream"}
                            className="flex cursor-pointer items-center justify-center text-white opacity-95 transition-opacity hover:opacity-100"
                          >
                            {!isMuted ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src="/image/progress/icons/ico-sound.svg"
                                alt=""
                                width={14}
                                height={16}
                                className="h-[16.23px] w-[13.44px]"
                              />
                            ) : (
                              <VolumeX className="size-4 text-white" />
                            )}
                          </button>
                        </div>

                        {/* Right Icons: HD Gear, Theater, TV, Fullscreen (Figma 8036:25090) */}
                        <div className="flex items-center gap-[18px]">
                          {/* Gear + HD badge */}
                          <button
                            type="button"
                            onClick={setupStream}
                            title="Reconnect Stream (HD)"
                            aria-label="Stream Quality HD"
                            className="relative flex cursor-pointer items-center justify-center pr-[6px]"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src="/image/progress/icons/ico-gear.svg"
                              alt=""
                              width={13}
                              height={14}
                              className="h-[14.23px] w-[12.74px]"
                            />
                            <span className="absolute -right-[1px] -top-[4px] flex h-[7.75px] w-[11.19px] items-center justify-center rounded-[0.86px] bg-[#ee1a26]">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src="/image/progress/icons/ico-hd.svg"
                                alt="HD"
                                width={9}
                                height={5}
                                className="h-[5.07px] w-[9.13px]"
                              />
                            </span>
                          </button>

                          <button
                            type="button"
                            aria-label="Theater view"
                            onClick={handleFullscreen}
                            className="flex cursor-pointer items-center justify-center opacity-95 transition-opacity hover:opacity-100"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src="/image/progress/icons/ico-theater.svg"
                              alt=""
                              width={20}
                              height={14}
                              className="h-[14.2px] w-[20.29px]"
                            />
                          </button>

                          <button
                            type="button"
                            onClick={setupStream}
                            aria-label="Reload Stream"
                            className="flex cursor-pointer items-center justify-center opacity-95 transition-opacity hover:opacity-100"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src="/image/progress/icons/ico-tv.svg"
                              alt=""
                              width={19}
                              height={16}
                              className="h-[15.81px] w-[19.32px]"
                            />
                          </button>

                          <button
                            type="button"
                            onClick={handleFullscreen}
                            aria-label="Fullscreen"
                            className="flex cursor-pointer items-center justify-center opacity-95 transition-opacity hover:opacity-100"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src="/image/progress/icons/ico-fullscreen.svg"
                              alt=""
                              width={16}
                              height={16}
                              className="size-[16.23px]"
                            />
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Relevant No-Camera State when this specific project has no camera in API */
                    <div className="relative flex size-full flex-col items-center justify-center p-6 text-center text-white sm:p-10">
                      <Image
                        src={fallbackImage || "/image/progress/live_camera.png"}
                        alt={projectName || "Project Site"}
                        fill
                        sizes="(max-width: 1024px) 100vw, 832px"
                        className="pointer-events-none object-cover object-center opacity-20"
                      />
                      <div className="relative z-10 flex max-w-md flex-col items-center">
                        <div className="mb-4 flex size-14 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-[#cfa564] backdrop-blur-xs">
                          <VideoOff className="size-7" />
                        </div>
                        <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 font-sans text-[11px] font-medium uppercase tracking-[1.5px] text-white/90">
                          <span className="size-1.5 rounded-full bg-[#cfa564]" />
                          Camera Not Deployed
                        </span>
                        <h3 className="font-display text-2xl font-medium capitalize leading-tight text-white sm:text-[28px]">
                          No Active Camera Feed{" "}
                          {projectName ? `for ${projectName}` : "Available"}
                        </h3>
                        <p className="mt-2.5 font-sans text-xs leading-relaxed text-white/75 sm:text-sm">
                          There is currently no live CCTV stream assigned to this project in the camera server. You can track the latest verified construction milestones in the progress breakdown panel.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Shutter>

              {/* Camera Selector Pill Tabs for ALL cameras of this project (Figma 8036:25118) */}
              {hasCameras && (
                <div className="flex flex-wrap items-center gap-[12px]">
                  {resolvedCameras.map((feed, idx) => {
                    const isActive = String(activeCameraId) === feed.id;
                    return (
                      <Appear
                        key={feed.id}
                        preset="lift"
                        delay={0.14 + idx * 0.05}
                      >
                        <button
                          type="button"
                          onClick={() => setActiveCameraId(feed.id)}
                          title={feed.name}
                          className={cn(
                            "press flex h-[44px] cursor-pointer items-center justify-center rounded-[40px] font-sans text-[14px] font-medium uppercase leading-[1.7] tracking-[2px] whitespace-nowrap transition-colors duration-300",
                            isActive
                              ? "bg-[#054b3c] px-[24px] py-[16px] text-white"
                              : "border border-[#dcdcdc] bg-white px-[20px] py-[18px] text-[#546360] hover:border-[#054b3c] hover:text-[#054b3c]",
                          )}
                        >
                          <span className="trim">{feed.shortLabel}</span>
                        </button>
                      </Appear>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Progress Breakdown Card (Figma 8036:25058, 552 × 450) */}
          <Appear
            preset="lift"
            delay={0.18}
            className="w-full border border-[#ddd] bg-white p-6 sm:p-[32px] lg:mt-[57px] lg:min-h-[450px]"
          >
            <div className="flex flex-col items-start gap-[32px]">
              <h3 className="font-display text-[28px] font-medium capitalize leading-[1.1] text-[#054b3c] sm:text-[32px]">
                Progress Breakdown
              </h3>

              <div className="flex w-full flex-col gap-[28px]">
                {breakdownItems.map((item, idx) => (
                  <div
                    key={item.label}
                    className="flex w-full items-center justify-between gap-4"
                  >
                    <span className="trim shrink-0 whitespace-nowrap font-sans text-[16px] font-normal leading-[1.2] text-black sm:text-[18px]">
                      {item.label}
                    </span>

                    <div className="flex w-full max-w-[344px] items-center gap-[12px]">
                      <div className="relative h-[8px] min-w-0 flex-1 overflow-hidden rounded-[4px] bg-[#f2f4f7]">
                        <motion.div
                          initial={{ width: "0%" }}
                          animate={{
                            width: inView ? `${item.percentage}%` : "0%",
                          }}
                          transition={
                            reduce
                              ? { duration: 0 }
                              : {
                                  duration: 1.1,
                                  ease: SETTLE,
                                  delay: 0.25 + idx * 0.06,
                                }
                          }
                          className="h-[8px] rounded-[4px] bg-[#054b3c]"
                        />
                      </div>

                      <span className="w-[34px] shrink-0 text-right font-sans text-[14px] font-medium leading-[20px] text-[#344054]">
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Appear>
        </div>
      </div>

      {/* Fallback Fullscreen Camera Lightbox */}
      {isFullscreen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-8"
          onClick={() => setIsFullscreen(false)}
        >
          <div
            className="relative aspect-[16/9] max-h-[85vh] w-full max-w-5xl bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={currentCameraImage}
              alt={currentCameraName}
              fill
              className="object-contain"
            />
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              aria-label="Close fullscreen"
              className="absolute right-4 top-4 cursor-pointer rounded-full bg-black/60 p-2 text-white transition-colors hover:bg-black"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
