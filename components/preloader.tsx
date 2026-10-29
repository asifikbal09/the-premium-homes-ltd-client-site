"use client";

import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useIntro } from "@/components/providers/intro";
import { useLenis } from "@/components/providers/smooth_scroll";
import { SETTLE } from "@/lib/utils";

const SEEN_KEY = "tph-intro-seen";
const MAX_WAIT = 4500; // never hold the page longer than this

/** Resolves when the hero image and the web fonts are ready (or after MAX_WAIT). */
function assetsReady() {
  const hero = document.querySelector<HTMLImageElement>("#top img");
  const image = new Promise<void>((resolve) => {
    if (!hero || hero.complete) return resolve();
    hero.addEventListener("load", () => resolve(), { once: true });
    hero.addEventListener("error", () => resolve(), { once: true });
  });
  return Promise.race([
    Promise.all([image, document.fonts?.ready ?? Promise.resolve()]),
    new Promise((r) => setTimeout(r, MAX_WAIT)),
  ]);
}

/** The brand logo is wiped in from left to right, then settles from a slight zoom. */
function LogoReveal({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ clipPath: "inset(0 100% 0 0)", scale: 1.06 }}
      animate={{ clipPath: "inset(0 0% 0 0)", scale: 1 }}
      transition={reduce ? { duration: 0 } : { duration: 1.1, ease: [0.65, 0, 0.35, 1], delay: 0.05 }}
      className={className}
    >
      <Image
        src="/image/logo/LOGO-WHITE.png"
        alt="The Premium Homes"
        fill
        preload
        sizes="231px"
        className="object-contain"
      />
    </motion.div>
  );
}

/** One odometer wheel: a strip of digit faces slid by a continuous index. */
function Wheel({ index, faces }: { index: MotionValue<number>; faces: number[] }) {
  const y = useTransform(index, (v) => `${-v}em`);
  return (
    <span className="relative inline-block h-[1em] overflow-hidden align-top">
      <motion.span style={{ y }} className="flex flex-col">
        {faces.map((n, i) => (
          <span key={i} className="block h-[1em] leading-none">
            {n}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

const ONES_FACES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0]; // trailing 0 so 9 → 0 wraps without a jump
const TENS_FACES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // "10" face so the finish reads 100

/**
 * 00 → 100 as a mechanical odometer driven straight off the eased progress
 * value: the ones wheel rolls continuously, the tens wheel only turns while
 * the ones wheel passes from 9 to 0.
 */
function Odometer({ progress }: { progress: MotionValue<number> }) {
  const value = useTransform(progress, (v) => Math.min(Math.max(v, 0), 1) * 100);
  const ones = useTransform(value, (n) => (n >= 100 ? 0 : n % 10));
  const tens = useTransform(value, (n) => {
    if (n >= 100) return 10;
    const whole = Math.floor(n / 10);
    const carry = Math.max(0, (n % 10) - 9); // 0 → 1 across the last unit
    return whole + carry;
  });
  return (
    <span aria-hidden className="inline-flex tabular-nums">
      <Wheel index={tens} faces={TENS_FACES} />
      <Wheel index={ones} faces={ONES_FACES} />
    </span>
  );
}

/**
 * A quiet first screen: the wordmark drawing itself on deep green and an
 * odometer counter. When everything is ready the whole screen slides up and away
 * and the hero rises in underneath it.
 */
export function Preloader() {
  const { finish } = useIntro();
  const lenis = useLenis();
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const progress = useMotionValue(0);

  // Hold scroll while the screen is up.
  useEffect(() => {
    if (!visible) return;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, [visible, lenis]);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
      sessionStorage.setItem(SEEN_KEY, "1");
    } catch {}
    const minTime = reduce ? 0.2 : seen ? 0.8 : 1.6;
    const run = animate(progress, 0.9, { duration: minTime, ease: [0.33, 0, 0.2, 1] });
    let cancelled = false;
    Promise.all([assetsReady(), run.finished]).then(() => {
      if (cancelled) return;
      animate(progress, 1, { duration: reduce ? 0.1 : 0.45, ease: SETTLE }).finished.then(() => {
        if (cancelled) return;
        setTimeout(() => {
          finish();
          setVisible(false);
        }, reduce ? 0 : 200);
      });
    });
    return () => {
      cancelled = true;
      run.stop();
    };
  }, [finish, progress, reduce]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          role="status"
          aria-live="polite"
          aria-label="Loading Premium Homes"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={reduce ? { duration: 0.2 } : { type: "spring", bounce: 0, duration: 1.4 }}
          className="fixed inset-0 z-[100] flex flex-col justify-end bg-green-deep px-6 py-6 text-warm md:px-12 md:py-10"
        >
          <motion.div
            initial={{ opacity: 0.001, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 1, ease: SETTLE, delay: 0.1 }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-5"
          >
            <LogoReveal className="relative aspect-[231/52] w-[clamp(160px,18vw,231px)]" />
            <span className="text-center text-[11px] uppercase tracking-[3px] text-warm/50 md:text-[12px]">Shaping tomorrow’s lifestyle</span>
          </motion.div>

          <motion.div exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="relative flex items-end justify-end">
            <span className="font-display text-[clamp(40px,5vw,80px)] font-normal leading-none text-warm" role="status" aria-label="Loading">
              <Odometer progress={progress} />
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
