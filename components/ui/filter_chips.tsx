"use client";

import { motion } from "motion/react";
import { useId, useState } from "react";
import { Appear } from "@/components/ui/motion";
import { cn } from "@/lib/utils";

/**
 * Row of filter chips. One green pill glides between them: it follows the hovered chip, and settles
 * back on the selected one when the pointer leaves the row. Each chip fades up a beat after the last.
 */
export function FilterChips({
  options,
  value,
  onChange,
  delay = 0.35,
  tall = false,
  className,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  /** Seconds before the first chip arrives. */
  delay?: number;
  /** Every chip 48px high, as on the projects page; otherwise the home sizes (42 first, 45 rest). */
  tall?: boolean;
  className?: string;
}) {
  // Two rows on one page must not share a pill.
  const pillId = useId();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div
      className={cn("flex gap-3", className)}
      onMouseLeave={() => setHovered(null)}
    >
      {options.map((option, i) => {
        const active = option === value;
        const lit = option === (hovered ?? value);
        return (
          <Appear
            key={option}
            preset="lift"
            delay={delay + i * 0.08}
            className="relative shrink-0"
          >
            <button
              type="button"
              onClick={() => onChange(option)}
              onMouseEnter={() => setHovered(option)}
              onFocus={() => setHovered(option)}
              onBlur={() => setHovered(null)}
              aria-pressed={active}
              className={cn(
                "relative flex items-center justify-center whitespace-nowrap rounded-[40px] text-[14px] font-medium uppercase tracking-[2px] transition-colors duration-300",
                // Turn white as the gliding pill arrives under the label, not before it.
                lit && "delay-150",
                i === 0 ? "px-6" : "px-5",
                tall ? "h-12" : i === 0 ? "h-[42px]" : "h-[45px]",
                lit ? "text-white" : "text-sage",
              )}
            >
              {lit && (
                <motion.span
                  layoutId={pillId}
                  transition={{ type: "spring", bounce: 0, duration: 0.7 }}
                  className="absolute inset-0 rounded-[40px] bg-green"
                />
              )}
              {!lit && (
                <span className="absolute inset-0 rounded-[40px] border border-chip" />
              )}
              {/* Labels sit above the pill, so it never covers a neighbour's label while it glides past. */}
              <span className="trim relative z-10 leading-[1.7]">{option}</span>
            </button>
          </Appear>
        );
      })}
    </div>
  );
}
