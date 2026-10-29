import Image from "next/image";
import { Fragment } from "react";
import { cn } from "@/lib/utils";

/** Figma blog meta: category, date and the like in one 14px all-caps row, split by small dots. Empty items are left out. */
export function BlogMeta({ items, className }: { items: (string | null | undefined)[]; className?: string }) {
  return (
    <p className={cn("flex flex-wrap items-center gap-2 text-[14px] font-medium uppercase leading-none text-sage", className)}>
      {items.filter(Boolean).map((item, i) => (
        <Fragment key={i}>
          {i > 0 && <Image src="/blogs/icons/dot.svg" alt="" width={8} height={8} className="size-2 shrink-0" />}
          <span className="trim">{item}</span>
        </Fragment>
      ))}
    </p>
  );
}
