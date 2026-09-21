"use client";

import React, { useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const VIDEO_URL =
  "https://res.cloudinary.com/j0g5i7h7/video/upload/v1789819294/AQMfDnffPSr71tD_c62fIdNh-x7bZ6Cv91scBpt_fIbKEWo212ffRk7TRkVJn4G_8QO6KfwW5qiMP07zu4d-8YGq0DdB2ir3ZmwXrRmxgLmGpg.mp4";

const POSTER_URL =
  "https://res.cloudinary.com/j0g5i7h7/image/upload/v1789819294/AQMfDnffPSr71tD_c62fIdNh-x7bZ6Cv91scBpt_fIbKEWo212ffRk7TRkVJn4G_8QO6KfwW5qiMP07zu4d-8YGq0DdB2ir3ZmwXrRmxgLmGpg_poster.jpg";

export function ArtOfLivingVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showControls, setShowControls] = useState(false);

  // Play video immediately upon click
  const handlePlay = async () => {
    if (videoRef.current) {
      try {
        await videoRef.current.play();
        setIsPlaying(true);
      } catch (err) {
        console.error("Video playback failed:", err);
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
      id="art-of-living"
      aria-label="Art Of Living Video"
      className="w-full bg-[#ffffff] py-6 sm:py-12 lg:py-18 selection:bg-[#d0a65b]/20"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        {/* Cinematic 16:9 Video Container */}
        <div
          ref={containerRef}
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
          className="relative w-full aspect-[16/9] bg-black overflow-hidden shadow-2xl rounded-xs select-none group"
        >
          {/* HTML5 Video Element */}
          <video
            ref={videoRef}
            src={VIDEO_URL}
            poster={POSTER_URL}
            playsInline
            preload="metadata"
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleVideoEnded}
            onClick={togglePlay}
            className="absolute inset-0 w-full h-full object-cover cursor-pointer"
          />

          {/* Overall Subtle Vignette & Dedicated Bottom-Left Dark Gradient for High Text Visibility */}
          <div
            onClick={togglePlay}
            className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
              isPlaying ? "opacity-0 group-hover:opacity-60" : "opacity-100"
            }`}
            style={{
              background: `
                radial-gradient(ellipse 75% 70% at 0% 100%, rgba(0, 0, 0, 0.92) 0%, rgba(0, 0, 0, 0.72) 40%, rgba(0, 0, 0, 0.25) 75%, transparent 100%),
                linear-gradient(180deg, rgba(0, 0, 0, 0.35) 0%, transparent 35%, rgba(0, 0, 0, 0.5) 100%)
              `,
            }}
          />

          {/* Bottom Left: Tag & Heading Overlay */}
          <div
            className={`absolute bottom-0 left-0 z-20 p-3.5 sm:p-6 md:p-10 lg:p-14 max-w-2xl pointer-events-none transition-all duration-500 ${
              isPlaying
                ? "opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0"
                : "opacity-100 translate-y-0"
            }`}
          >
            <span className="inline-block text-[7px] sm:text-[10px] md:text-xs lg:text-[13px] font-semibold tracking-[0.22em] uppercase text-[#d0a65b] mb-0.5 sm:mb-1.5 md:mb-2.5 drop-shadow-sm">
              ART OF LIVING
            </span>
            <h2 className="font-heading text-sm sm:text-2xl md:text-4xl lg:text-[56px] font-normal text-white leading-[1.08] tracking-tight drop-shadow-lg">
              More Than Buildings
              <br />A Way Of Living
            </h2>
          </div>

          {/* Bottom Right: Circular Frosted Play Button (matching reference) */}
          <AnimatePresence>
            {!isPlaying && (
              <motion.button
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.25 }}
                type="button"
                onClick={handlePlay}
                aria-label="Play video"
                className="absolute bottom-3.5 right-3.5 sm:bottom-6 sm:right-6 md:bottom-10 md:right-10 lg:bottom-14 lg:right-14 z-20 w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-[#1b2329]/75 hover:bg-[#1b2329]/95 text-white flex items-center justify-center backdrop-blur-md border border-white/20 shadow-[0_12px_36px_rgba(0,0,0,0.6)] transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer group/btn"
              >
                <Play className="w-3.5 h-3.5 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 fill-white text-white translate-x-0.5 group-hover/btn:scale-110 transition-transform duration-200" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Active Playback Floating Controls (revealed on hover when playing) */}
          {isPlaying && (
            <div
              className={`absolute inset-0 z-30 flex flex-col justify-between p-3 sm:p-6 transition-opacity duration-300 pointer-events-none ${
                showControls ? "opacity-100" : "opacity-0"
              }`}
            >
              {/* Top Controls Bar */}
              <div className="flex justify-end gap-1.5 sm:gap-2 pointer-events-auto">
                {/* Mute/Unmute Button */}
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? "Unmute video" : "Mute video"}
                  className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-md border border-white/15 cursor-pointer transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  )}
                </button>

                {/* Fullscreen Button */}
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  aria-label="Fullscreen"
                  className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center backdrop-blur-md border border-white/15 cursor-pointer transition-colors"
                >
                  <Maximize className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>

              {/* Center Quick Pause/Play Icon */}
              <div className="self-center pointer-events-auto">
                <button
                  type="button"
                  onClick={handlePause}
                  aria-label="Pause video"
                  className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-black/55 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg cursor-pointer transition-transform hover:scale-105 active:scale-95"
                >
                  <Pause className="w-4 h-4 sm:w-6 sm:h-6 fill-white" />
                </button>
              </div>

              {/* Bottom Progress Bar */}
              <div className="w-full pointer-events-auto pt-2">
                <div
                  role="progressbar"
                  aria-valuenow={Math.round(progress)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const pct = clickX / rect.width;
                    if (videoRef.current) {
                      videoRef.current.currentTime =
                        pct * videoRef.current.duration;
                    }
                  }}
                  className="w-full h-1 sm:h-1.5 bg-white/25 hover:h-2 transition-all rounded-full overflow-hidden cursor-pointer"
                >
                  <div
                    className="h-full bg-[#d0a65b] rounded-full transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
