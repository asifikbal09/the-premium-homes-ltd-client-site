"use client";

import { AnimatePresence, motion } from "motion/react";
import Image, { getImageProps } from "next/image";
import { useEffect, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useLenis } from "@/components/providers/smooth_scroll";
import { Sources, type VideoSources } from "@/lib/media";
import { cn, SPRING } from "@/lib/utils";

/** Cream play disc from the design (72px, #F9F5EF). Swells on hover; the icon itself stays still. */
export function PlayButton({
  onClick,
  className,
  label = "Play video",
  tabIndex,
}: {
  onClick?: () => void;
  className?: string;
  label?: string;
  tabIndex?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      tabIndex={tabIndex}
      className={cn(
        "press group grid size-14 place-items-center rounded-full bg-warm md:size-[72px]",
        className,
      )}
    >
      <Image
        src="/home/icons/play.svg"
        alt=""
        width={24}
        height={24}
        className="size-6"
      />
    </button>
  );
}

export function VideoModal({
  open,
  onClose,
  poster,
  title,
  sources,
  embedUrl,
}: {
  open: boolean;
  onClose: () => void;
  poster: string;
  title: string;
  /** WebM with MP4 fallback. */
  sources?: VideoSources;
  /** Hosted player (e.g. a YouTube embed with autoplay), used instead of `sources`. */
  embedUrl?: string;
}) {
  const lenis = useLenis();

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [open, lenis, onClose]);

  // Rendered at the end of <body>: inside the page wrapper the navbar would sit on top of it.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={onClose}
          className="fixed inset-0 z-[70] grid place-items-center bg-green-deep/90 p-4 backdrop-blur-md md:p-10"
        >
          <motion.div
            initial={{ scale: 0.86, y: 80, opacity: 0.001 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0, transition: { duration: 0.25 } }}
            transition={SPRING}
            onClick={(e) => e.stopPropagation()}
            className="relative aspect-video w-full max-w-[1200px] overflow-hidden rounded-[20px] bg-black"
          >
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={title}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                className="size-full border-0"
              />
            ) : sources ? (
              <video
                // Poster through the image optimiser (resized WebP), not the raw source file.
                poster={
                  poster
                    ? getImageProps({
                        src: poster,
                        alt: "",
                        width: 1200,
                        height: 675,
                      }).props.src
                    : undefined
                }
                controls
                autoPlay
                playsInline
                className="size-full object-cover"
              >
                <Sources video={sources} />
              </video>
            ) : (
              <>
                <Image
                  src={poster}
                  alt={title}
                  fill
                  sizes="1200px"
                  className="object-cover opacity-80"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/30 text-white">
                  <PlayButton label="Video unavailable" />
                  <p className="text-[14px] uppercase tracking-[2px]">
                    Film coming soon
                  </p>
                </div>
              </>
            )}
          </motion.div>
          <button
            type="button"
            onClick={onClose}
            className="press absolute right-4 top-4 rounded-full border border-white/30 px-5 py-2 text-[14px] font-medium uppercase tracking-[2px] text-white hover:bg-white hover:text-green md:right-10 md:top-10"
          >
            Close
          </button>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
