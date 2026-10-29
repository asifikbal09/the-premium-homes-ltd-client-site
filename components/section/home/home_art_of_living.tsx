"use client";

import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useScroll,
  useTransform,
} from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Appear, Words } from "@/components/ui/motion";
import { PlayButton } from "@/components/ui/video_modal";
import { FILM, Sources } from "@/lib/media";
import { fluid, SETTLE } from "@/lib/utils";

type State = "idle" | "playing" | "paused";

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
      <rect x="6" y="4" width="4" height="16" rx="1.2" fill="currentColor" />
      <rect x="14" y="4" width="4" height="16" rx="1.2" fill="currentColor" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
      <path
        d="M7 4.5v15a1 1 0 0 0 1.5.86l12.4-7.5a1 1 0 0 0 0-1.72L8.5 3.64A1 1 0 0 0 7 4.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function SoundIcon({ muted }: { muted: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path
        d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z"
        fill="currentColor"
        stroke="none"
      />
      {muted ? (
        <path d="M16 9.5l5 5M21 9.5l-5 5" />
      ) : (
        <path d="M16 9a4.2 4.2 0 0 1 0 6M18.6 6.5a7.8 7.8 0 0 1 0 11" />
      )}
    </svg>
  );
}

const CONTROL =
  "grid size-9 place-items-center md:size-11 rounded-full border border-white/25 bg-black/30 text-white backdrop-blur-md transition-colors duration-300 hover:bg-warm hover:text-green";

/**
 * The film frame opens from an inset card to full bleed as it scrolls in, while
 * the still drifts inside it. Caption and play button then arrive in order.
 * Play runs the film right here in the frame: no popup.
 */
export function HomeArtOfLiving() {
  const ref = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [state, setState] = useState<State>("idle");
  const [muted, setMuted] = useState(false);
  const progress = useMotionValue(0);

  // Opening: the frame grows from an inset card to the full width.
  const { scrollYProgress: enter } = useScroll({
    target: ref,
    offset: ["start end", "start 0.15"],
  });
  const inset = useTransform(enter, [0, 1], [7, 0]);
  // Sharp corners throughout; only the inset opens.
  const clipPath = useTransform(inset, (i) => `inset(${i}% ${i}% 0% ${i}%)`);
  // The still drifts and settles inside the frame.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.18, 1.04, 1.1]);

  const play = useInView(frameRef, { once: true, amount: 0.45 });
  const onScreen = useInView(frameRef, { amount: 0.2 });
  // The film's source attaches only when the section is about a screen away.
  const near = useInView(frameRef, { once: true, margin: "100% 0px 100% 0px" });
  const started = state !== "idle";

  // Leaving the section pauses the film.
  useEffect(() => {
    if (!onScreen && state === "playing") videoRef.current?.pause();
  }, [onScreen, state]);

  // Progress line follows the film while it plays.
  useEffect(() => {
    if (state !== "playing") return;
    let raf = 0;
    const tick = () => {
      const v = videoRef.current;
      if (v && v.duration) progress.set(v.currentTime / v.duration);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [state, progress]);

  const start = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = muted;
    v.play().catch(() => {
      // Autoplay with sound refused: play muted instead of not at all.
      v.muted = true;
      setMuted(true);
      v.play().catch(() => {});
    });
  };
  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) start();
    else v.pause();
  };
  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  return (
    <section ref={ref} className="relative bg-white">
      <motion.div
        ref={frameRef}
        // Same markup on server and client; reduced motion drops the opening clip in CSS.
        style={{ clipPath }}
        className={`relative overflow-hidden bg-green-deep motion-reduce:![clip-path:none] transition-[height] duration-700 ease-out-expo will-change-[clip-path] ${
          // While the film runs the frame takes its exact 16:9 shape (never taller than the screen), so no edge is cut.
          started
            ? "h-[min(56.25vw,100svh)] bg-black"
            : "h-[clamp(560px,56.25vw,900px)]"
        }`}
      >
        <motion.div style={{ y, scale }} className="absolute inset-0">
          <Image
            src="/home/img/living.png"
            alt="Premium Homes leadership in conversation"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>

        {/* Film plays inline over the still; it only loads once asked for. */}
        <motion.video
          ref={videoRef}
          playsInline
          preload="none"
          onPlay={() => setState("playing")}
          onPause={() => setState((s) => (s === "idle" ? s : "paused"))}
          onEnded={() => {
            setState("idle");
            progress.set(0);
          }}
          onClick={toggle}
          initial={false}
          animate={{ opacity: started ? 1 : 0 }}
          transition={{ duration: 0.7, ease: SETTLE }}
          className="absolute inset-0 size-full cursor-pointer object-contain"
          style={{ pointerEvents: started ? "auto" : "none" }}
        >
          {/* WebM first, MP4 fallback; attached only once the section is near. No poster: the optimised
              still underneath already shows, and a poster would fetch the raw file at load. */}
          {near && <Sources video={FILM} />}
        </motion.video>

        <motion.div
          aria-hidden
          initial={false}
          animate={{ opacity: started ? 0 : 1 }}
          transition={{ duration: 0.6 }}
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-black/10"
        />

        {/* Caption and play: eyebrow, then the title lines, then the button. Steps aside once the film runs. */}
        <motion.div
          initial={false}
          animate={started ? { opacity: 0, y: 24 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: SETTLE }}
          className="shell pointer-events-none absolute inset-x-0 bottom-[clamp(32px,5vw,80px)] flex items-end justify-between gap-6"
        >
          <div className="flex flex-col gap-4">
            <Appear
              as="p"
              preset="lift"
              play={play}
              className="text-[14px] font-medium uppercase leading-[1.5] text-gold md:text-[16px]"
            >
              ART of Living
            </Appear>
            <Words
              as="h2"
              play={play}
              delay={0.15}
              mask
              text="More Than Buildings A Way of Living"
              className="max-w-[9.2em] font-display font-normal! capitalize leading-[1.05] text-white"
              style={{ fontSize: fluid(60, 34) }}
            />
          </div>
          <Appear
            preset="pop"
            play={play}
            delay={0.6}
            className="pointer-events-auto relative"
          >
            {/* Soft ring breathes around the button until the film is played. */}
            <span
              aria-hidden
              className="absolute inset-0 animate-ping rounded-full bg-warm/40 [animation-duration:2.4s] motion-reduce:hidden"
            />
            <PlayButton
              onClick={start}
              label="Play the Art of Living film"
              tabIndex={started ? -1 : undefined}
              className="relative"
            />
          </Appear>
        </motion.div>

        {/* Paused: a centred play disc resumes. */}
        <AnimatePresence>
          {state === "paused" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
              className="pointer-events-none absolute inset-0 grid place-items-center"
            >
              <PlayButton
                onClick={start}
                label="Resume the film"
                className="pointer-events-auto"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls and progress once the film is running. */}
        <AnimatePresence>
          {started && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.5, ease: SETTLE, delay: 0.2 }}
              className="absolute inset-x-0 bottom-0 flex flex-col gap-2 bg-linear-to-t from-black/50 to-transparent pt-10 md:gap-4 md:pt-16"
            >
              <div className="shell flex items-center justify-start gap-3">
                <button
                  type="button"
                  onClick={toggle}
                  aria-label={
                    state === "playing" ? "Pause the film" : "Play the film"
                  }
                  className={CONTROL}
                >
                  {state === "playing" ? <PauseIcon /> : <PlayIcon />}
                </button>
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={muted ? "Unmute" : "Mute"}
                  className={CONTROL}
                >
                  <SoundIcon muted={muted} />
                </button>
              </div>
              <div className="h-[3px] w-full bg-white/20">
                <motion.div
                  style={{ scaleX: progress }}
                  className="h-full origin-left bg-gold"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
