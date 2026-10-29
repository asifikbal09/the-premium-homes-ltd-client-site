import Image from "next/image";
import { cn } from "@/lib/utils";

/** Figma "Search project" field: a 48px outline pill with a search glyph; the rim turns green while focused. */
export function SearchField({
  value,
  onChange,
  placeholder,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  /** Also the field's accessible name. */
  placeholder: string;
  className?: string;
}) {
  return (
    <label
      className={cn(
        "flex h-12 min-w-0 items-center gap-1 rounded-full border border-chip px-6 transition-colors duration-300 focus-within:border-green",
        className,
      )}
    >
      <Image src="/projects/icons/search.svg" alt="" width={20} height={20} className="size-5 shrink-0" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="min-w-0 flex-1 bg-transparent text-[14px] font-medium uppercase tracking-[2px] text-sage outline-none placeholder:text-sage/50"
      />
    </label>
  );
}
