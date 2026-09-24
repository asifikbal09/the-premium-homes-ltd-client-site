"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const VIDEO_URL =
  "https://res.cloudinary.com/j0g5i7h7/video/upload/v1789819294/AQMfDnffPSr71tD_c62fIdNh-x7bZ6Cv91scBpt_fIbKEWo212ffRk7TRkVJn4G_8QO6KfwW5qiMP07zu4d-8YGq0DdB2ir3ZmwXrRmxgLmGpg.mp4";

export function LifeAtTphlVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(false);

  const handlePlay = async () => {
    setIsPlaying(true);
    if (videoRef.current) {
      try {
        await videoRef.current.play();
      } catch (err) {
        console.error("Playback failed:", err);
      }
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen().catch((err) => {
          console.error("Fullscreen error:", err);
        });
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      setProgress(
        (videoRef.current.currentTime / videoRef.current.duration) * 100,
      );
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <section
      aria-label="Life At TPHL Video Tour"
      className="w-full bg-white py-10 sm:py-16 md:py-20 lg:py-24"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        {/* Rounded Cinematic Video Card matching image */}
        <div
          ref={containerRef}
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
          className="relative w-full aspect-[16/9] sm:aspect-[1.85/1] rounded-2xl sm:rounded-3xl md:rounded-[28px] lg:rounded-[36px] overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.18)] bg-neutral-900 group select-none"
        >
          {/* Poster Image (Visible when not playing) */}
          <div
            className={`absolute inset-0 transition-opacity duration-500 z-10 ${
              isPlaying ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <Image
              src="/image/life-at-tphl/vedioImage.png"
              alt="Life at TPHL showcase walkthrough"
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1240px"
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.02]"
            />
          </div>

          {/* HTML5 Video Element */}
          <video
            ref={videoRef}
            src={VIDEO_URL}
            playsInline
            preload="metadata"
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnded}
            onClick={togglePlay}
            className={`absolute inset-0 w-full h-full object-cover cursor-pointer z-0 ${
              isPlaying ? "z-20" : "z-0"
            }`}
          />

          {/* Center Circular Play Button */}
          {!isPlaying && (
            <button
              type="button"
              onClick={handlePlay}
              aria-label="Play Life at TPHL video"
              className="absolute inset-0 m-auto z-30 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-white text-[#044133] flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.45)] transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
            >
              <Play className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 fill-[#044133] text-[#044133] translate-x-0.5 transition-transform duration-200" />
            </button>
          )}

          {/* Active Playback Floating Controls */}
          {isPlaying && (
            <div
              className={`absolute inset-0 z-30 flex flex-col justify-between p-3 sm:p-6 transition-opacity duration-300 pointer-events-none ${
                showControls ? "opacity-100" : "opacity-0"
              }`}
            >
              {/* Top Bar with Status and Pause Button */}
              <div className="flex items-center justify-end pointer-events-auto">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Pause className="w-3.5 h-3.5 fill-white text-white" />
                  <span>Pause</span>
                </button>
              </div>

              {/* Bottom Control Bar */}
              <div className="w-full flex flex-col gap-2 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-black/60 backdrop-blur-md pointer-events-auto">
                {/* Progress Bar */}
                <div
                  className="relative w-full h-1.5 bg-white/30 rounded-full overflow-hidden cursor-pointer"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const newProgress = clickX / rect.width;
                    if (videoRef.current && videoRef.current.duration) {
                      videoRef.current.currentTime =
                        newProgress * videoRef.current.duration;
                    }
                  }}
                >
                  <div
                    className="h-full bg-[#d0a65b] rounded-full transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Buttons Bar */}
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={togglePlay}
                      aria-label={isPlaying ? "Pause video" : "Play video"}
                      className="p-1 hover:text-[#d0a65b] transition-colors cursor-pointer"
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={toggleMute}
                      aria-label={isMuted ? "Unmute" : "Mute"}
                      className="p-1 hover:text-[#d0a65b] transition-colors cursor-pointer"
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={toggleFullscreen}
                    aria-label="Toggle Fullscreen"
                    className="p-1 hover:text-[#d0a65b] transition-colors cursor-pointer"
                  >
                    <Maximize className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
