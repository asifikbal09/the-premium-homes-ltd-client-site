import { Appear } from "@/components/ui/motion";
import { Eyebrow, Heading } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

/**
 * Figma "Section Header", centred: optional gold eyebrow, a 64px display title that inks in and an
 * 18px line of copy that fades up after it. `light` sets the title in white for dark bands.
 */
export function SectionIntro({
  eyebrow,
  title,
  copy,
  copyWidth,
  light = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  copy?: string;
  /** Figma width of the copy block in px. */
  copyWidth?: number;
  light?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center gap-6 text-center", className)}>
      <div className="flex flex-col items-center gap-4">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <Heading size={64} min={36} leading={1.1} mask className={cn(light && "text-white")}>
          {title}
        </Heading>
      </div>
      {copy && (
        <Appear
          as="p"
          preset="lift"
          delay={0.3}
          className="text-[clamp(16px,1.125vw,18px)] leading-[1.5] text-sage"
          style={{ maxWidth: copyWidth }}
        >
          {copy}
        </Appear>
      )}
    </div>
  );
}
