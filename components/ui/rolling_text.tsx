import { cn } from "@/lib/utils";

/**
 * Letter-by-letter roll on hover of the enclosing `group`: each letter slides up
 * out of its clip while a twin in the accent colour rolls in from below.
 * Serif links keep a little room for descenders. All-caps labels are trimmed to
 * cap height and the clip is a flex box, so it is exactly the glyph's height and
 * nothing of the twin shows. Tight mode keeps 0.14em of slack under the baseline
 * for round-letter overshoot and the J tail; the twin starts that far below the
 * clip so none of it shows at rest.
 */
export function RollingText({
  text,
  tight = false,
  twin = "text-gold",
  align = "baseline",
}: {
  text: string;
  tight?: boolean;
  twin?: string;
  /** "top" keeps the clips inside the parent's line box (for links with no text beside them). */
  align?: "baseline" | "top";
}) {
  const chars = [...text];
  return (
    <span aria-label={text} className={tight ? "inline-flex" : "inline-block"}>
      {chars.map((ch, i) => (
        <span
          key={i}
          aria-hidden
          className={cn(
            "overflow-hidden",
            tight
              ? "inline-flex leading-none pb-[0.14em] -mb-[0.14em]"
              : cn(
                  "inline-block pb-[0.08em] -mb-[0.08em]",
                  align === "top" ? "align-top" : "align-baseline",
                ),
          )}
        >
          <span
            className={cn(
              "relative inline-block transition-transform duration-[520ms] ease-out-expo",
              tight
                ? "trim group-hover:translate-y-[calc(-100%-0.14em)]"
                : "group-hover:-translate-y-full",
            )}
            style={{ transitionDelay: `${i * 18}ms` }}
          >
            {ch === " " ? " " : ch}
            <span
              className={cn(
                "absolute left-0",
                twin,
                tight ? "trim top-[calc(100%+0.14em)]" : "top-full",
              )}
            >
              {ch === " " ? " " : ch}
            </span>
          </span>
        </span>
      ))}
    </span>
  );
}
