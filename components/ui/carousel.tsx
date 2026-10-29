"use client";

import { animate, useMotionValue } from "motion/react";
import { useCallback, useEffect, useRef } from "react";
import { SPRING } from "@/lib/utils";

/**
 * Endless carousel. Render the items three times in a row; the track always rests inside the
 * middle copy and, after every move, jumps back into it by exactly one set (the frame looks the
 * same), so it can run forever in both directions. Drag snaps to the nearest item.
 */
export function useLoopCarousel(count: number) {
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const index = useRef(count);
  const stepRef = useRef(0);

  const measure = useCallback(() => {
    const t = trackRef.current;
    const first = t?.children[0] as HTMLElement | undefined;
    if (!t || !first) return;
    stepRef.current =
      first.offsetWidth + parseFloat(getComputedStyle(t).columnGap || "0");
    x.set(-index.current * stepRef.current);
  }, [x]);

  // Items arrive from the API after the first render: re-centre on the middle copy of the new set.
  useEffect(() => {
    index.current = count;
    measure();
  }, [count, measure]);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, [measure]);

  const settle = useCallback(() => {
    if (index.current >= 2 * count) index.current -= count;
    else if (index.current < count) index.current += count;
    x.set(-index.current * stepRef.current);
  }, [count, x]);

  const goTo = useCallback(
    (i: number) => {
      // Wrap before moving, not after: the copies are identical, so shifting the track by one
      // copy is invisible, and the target always lands inside the middle copy. Waiting for the
      // spring to finish instead let quick repeat clicks run the track off its end (empty space).
      const step = stepRef.current || 1;
      let target = i;
      // Re-centre on the copy the track is actually showing (it may still be travelling from
      // earlier clicks), shifting the target by the same whole copy so nothing visibly moves.
      let shown = -x.get() / step;
      while (shown >= 2 * count) {
        shown -= count;
        target -= count;
        x.set(x.get() + count * step);
      }
      while (shown < count) {
        shown += count;
        target += count;
        x.set(x.get() - count * step);
      }
      // Never aim more than one card outside the middle copy, so the visible window always
      // stays inside the three copies, however fast the clicks come.
      target = Math.max(count - 1, Math.min(2 * count, target));
      index.current = target;
      animate(x, -target * step, { ...SPRING, onComplete: settle });
    },
    [count, settle, x],
  );

  const next = useCallback(() => goTo(index.current + 1), [goTo]);
  const prev = useCallback(() => goTo(index.current - 1), [goTo]);

  const onDragEnd = useCallback(
    (_: unknown, info: { velocity: { x: number } }) => {
      const raw = -x.get() / (stepRef.current || 1);
      const flick =
        Math.abs(info.velocity.x) > 300 ? -Math.sign(info.velocity.x) * 0.5 : 0;
      goTo(Math.round(raw + flick));
    },
    [goTo, x],
  );

  /** True for the two outer copies, which are visual only. */
  const isClone = (i: number) => i < count || i >= 2 * count;

  return { trackRef, x, next, prev, onDragEnd, isClone };
}
