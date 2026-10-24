"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Radio,
  SlidersHorizontal,
  VideoOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface CameraFeedItem {
  id: number | string;
  name?: string;
  camera_name?: string;
  camera_link?: string;
  link?: string;
  url?: string;
  stream_url?: string;
  status?: string;
  image?: string;
}

interface ProgressLiveCameraProps {
  cameras?: CameraFeedItem[];
  workCategoryProgress?: Record<string, string | undefined>;
  fallbackImage?: string;
}

function parsePercentage(val?: string | number): number {
  if (typeof val === "number") return val;
  if (!val) return 0;
  const num = parseFloat(String(val).replace(/%/g, "").trim());
  return isNaN(num) ? 0 : Math.round(num);
}

export function ProgressLiveCamera({
  cameras = [],
  workCategoryProgress,
  fallbackImage,
}: ProgressLiveCameraProps) {
  const hasCameras = Array.isArray(cameras) && cameras.length > 0;
  const [activeCameraId, setActiveCameraId] = useState<string | number>(
    hasCameras ? cameras[0].id : ""
  );
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const currentCamera = hasCameras
    ? cameras.find((c) => String(c.id) === String(activeCameraId)) || cameras[0]
    : null;

  const currentCameraName =
    currentCamera?.name ||
    currentCamera?.camera_name ||
    (currentCamera ? `Camera ${currentCamera.id}` : "Site Camera");

  const currentCameraImage =
    currentCamera?.image ||
    fallbackImage ||
    "/image/progress/live_camera.png";

  const breakdownItems = [
    {
      label: "Structural Work",
      percentage: parsePercentage(workCategoryProgress?.structural_work),
    },
    {
      label: "Brick Work",
      percentage: parsePercentage(workCategoryProgress?.brick_work),
    },
    {
      label: "Plaster Work",
      percentage: parsePercentage(workCategoryProgress?.plaster_work),
    },
    {
      label: "Electrical Work",
      percentage: parsePercentage(workCategoryProgress?.electrical_work),
    },
    {
      label: "Plumbing Work",
      percentage: parsePercentage(workCategoryProgress?.plumbing_work),
    },
    {
      label: "Tiles Work",
      percentage: parsePercentage(workCategoryProgress?.tiles_work),
    },
    {
      label: "Paint Work",
      percentage: parsePercentage(workCategoryProgress?.paint_work),
    },
  ];

  return (
    <section
      aria-label="Live Construction Camera and Progress Breakdown"
      className="w-full bg-[#fbf9f5] py-16 sm:py-20 md:py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-normal text-[#083327] tracking-tight mb-8 sm:mb-10">
          Live Construction Camera & Work Breakdown
        </h2>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Live Camera Video Feed */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {hasCameras && currentCamera ? (
              <>
                {/* Camera Video Player Box */}
                <div className="relative w-full aspect-[16/10] sm:aspect-[16/9.5] rounded-2xl overflow-hidden bg-black shadow-md border border-black/10 group">
                  {currentCamera.camera_link &&
                  (currentCamera.camera_link.includes("youtube.com") ||
                    currentCamera.camera_link.includes("vimeo.com")) ? (
                    <iframe
                      src={currentCamera.camera_link}
                      title={currentCameraName}
                      className="w-full h-full border-0"
                      allow="autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <Image
                      src={currentCameraImage}
                      alt={`${currentCameraName} Live Construction Feed`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 60vw"
                      className="object-cover object-center transition-all duration-300"
                      priority
                    />
                  )}

                  {/* LIVE Badge */}
                  <div className="absolute top-4 left-4 z-20">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase text-white bg-[#dc2626] shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      <span>LIVE</span>
                    </span>
                  </div>

                  {/* Camera Title Overlay Top Right */}
                  <div className="absolute top-4 right-4 z-20">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-medium tracking-wider uppercase text-white/90 bg-black/50 backdrop-blur-sm border border-white/10">
                      <Radio className="w-3 h-3 text-[#d0a65b]" />
                      <span>{currentCameraName}</span>
                    </span>
                  </div>

                  {/* Bottom Video Controls Overlay */}
                  <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/85 via-black/40 to-transparent pt-12 pb-3.5 px-4 sm:px-5">
                    {/* Scrub Line */}
                    <div className="w-full h-1 bg-white/25 rounded-full overflow-hidden mb-3 relative">
                      <div className="h-full bg-red-600 rounded-full w-full animate-pulse" />
                    </div>

                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setIsPlaying((prev) => !prev)}
                          aria-label={isPlaying ? "Pause stream" : "Play stream"}
                          className="p-1.5 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                        >
                          {isPlaying ? (
                            <Pause className="w-4 h-4 fill-white" />
                          ) : (
                            <Play className="w-4 h-4 fill-white" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setIsMuted((prev) => !prev)}
                          aria-label={isMuted ? "Unmute stream" : "Mute stream"}
                          className="p-1.5 rounded-full hover:bg-white/20 transition-colors cursor-pointer"
                        >
                          {isMuted ? (
                            <VolumeX className="w-4 h-4" />
                          ) : (
                            <Volume2 className="w-4 h-4" />
                          )}
                        </button>

                        <span className="text-[11px] text-white/70 font-mono tracking-wider ml-1">
                          HD LIVE FEED
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          aria-label="Stream Settings"
                          className="p-1.5 rounded-full hover:bg-white/20 transition-colors cursor-pointer text-white/80"
                        >
                          <SlidersHorizontal className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          aria-label="Full Screen"
                          className="p-1.5 rounded-full hover:bg-white/20 transition-colors cursor-pointer text-white/80"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Camera Feeds Selector Tabs */}
                {cameras.length > 1 && (
                  <div className="flex flex-wrap items-center gap-2.5 mt-1">
                    {cameras.map((feed) => {
                      const isActive = String(activeCameraId) === String(feed.id);
                      const feedName =
                        feed.name || feed.camera_name || `Camera ${feed.id}`;
                      return (
                        <button
                          key={feed.id}
                          type="button"
                          onClick={() => setActiveCameraId(feed.id)}
                          className={cn(
                            "px-4 sm:px-5 py-2 rounded-full text-[10px] sm:text-xs font-semibold tracking-[0.14em] uppercase transition-all duration-200 cursor-pointer shadow-2xs",
                            isActive
                              ? "bg-[#083327] text-white"
                              : "bg-white text-[#4a5851] border border-black/10 hover:border-black/25"
                          )}
                        >
                          {feedName}
                        </button>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              /* No Live Camera Available State */
              <div className="relative w-full aspect-[16/10] sm:aspect-[16/9.5] rounded-2xl overflow-hidden bg-[#0d211b] border border-white/10 shadow-md flex flex-col items-center justify-center p-6 text-center text-white">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-4 text-[#d0a65b] border border-white/15">
                  <VideoOff className="w-8 h-8" />
                </div>
                <h3 className="font-heading text-xl sm:text-2xl font-normal text-white">
                  Live Camera Broadcast Offline
                </h3>
                <p className="text-xs sm:text-sm text-white/70 max-w-md mt-2 leading-relaxed">
                  CCTV streaming is scheduled during active superstructure casting phases.
                  Work category progress is tracked live in the right panel.
                </p>
                <div className="mt-4 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-mono text-[#d0a65b]">
                  Status: Closed Circuit Pending Activation
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Dynamic Progress Breakdown */}
          <div className="lg:col-span-5">
            <div className="w-full bg-white rounded-2xl border border-black/[0.08] p-6 sm:p-7 shadow-xs">
              <h3 className="font-heading text-2xl sm:text-[26px] font-normal text-[#083327] mb-6">
                Progress Breakdown
              </h3>

              <div className="space-y-4 sm:space-y-5">
                {breakdownItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-3 text-xs sm:text-sm"
                  >
                    {/* Stage Label */}
                    <span className="w-28 sm:w-32 text-xs font-medium text-[#25332c] shrink-0 truncate">
                      {item.label}
                    </span>

                    {/* Progress Track */}
                    <div className="flex-1 h-2 bg-[#f0f4f1] rounded-full overflow-hidden relative">
                      <div
                        style={{ width: `${item.percentage}%` }}
                        className="h-full bg-[#c59e5f] rounded-full transition-all duration-700 ease-out"
                      />
                    </div>

                    {/* Percentage */}
                    <span className="w-9 text-right text-xs font-medium text-[#7d8b84] shrink-0 font-mono">
                      {item.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
