import { Appear } from "@/components/ui/motion";
import { GreenPill } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

/** Dashed warm panel shown when a list has nothing to show, with an optional "Clear filters" pill. */
export function EmptyState({
  title,
  copy,
  onClear,
  className,
}: {
  title: string;
  copy: string;
  /** Resets the filters that emptied the list; omit when there is nothing to reset. */
  onClear?: () => void;
  className?: string;
}) {
  return (
    <Appear
      preset="lift"
      className={cn(
        "flex flex-col items-center gap-5 rounded-[24px] border border-dashed border-chip bg-warm px-4 py-16 text-center",
        className,
      )}
    >
      <p className="font-display text-[28px] font-medium text-green">{title}</p>
      <p className="max-w-md text-[14px] leading-[1.5] text-sage">{copy}</p>
      {onClear && <GreenPill onClick={onClear}>Clear filters</GreenPill>}
    </Appear>
  );
}
