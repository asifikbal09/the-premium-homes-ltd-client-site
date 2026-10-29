import { Appear } from "@/components/ui/motion";
import { cn } from "@/lib/utils";

export type IconCardItem = {
  /** Figma icon export; rendered at its own root size. */
  icon: string;
  title: string;
  body?: string;
};

/**
 * Bordered card with a 56px line icon over a display title, from the Career page. Without `body` it
 * is the compact "benefit" card (24px ink title); with one it is the taller "value" card (28px green
 * title and copy). Cards rise in one after another; on hover the border warms to gold and the icon
 * lifts.
 */
export function IconCard({ item, index }: { item: IconCardItem; index: number }) {
  const value = Boolean(item.body);
  return (
    <Appear
      preset="rise"
      delay={index * 0.08}
      className={cn(
        "group flex h-full flex-col items-start border border-[#e6e6e6] bg-white p-6 transition-colors duration-500 hover:border-gold/60 hover:bg-warm",
        value ? "gap-[clamp(40px,5vw,80px)]" : "gap-12 pb-7",
      )}
    >
      <span className="grid size-14 place-items-center transition-transform duration-500 ease-out-expo group-hover:-translate-y-1.5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={item.icon} alt="" className="block" />
      </span>
      <div className="flex flex-col gap-5">
        <h3
          className={cn(
            "font-display font-medium capitalize",
            value ? "text-[clamp(24px,1.75vw,28px)] leading-[1.1] text-green" : "text-[clamp(20px,1.5vw,24px)] leading-[1.3] text-ink",
          )}
        >
          {item.title}
        </h3>
        {item.body && <p className="text-[16px] leading-[1.6] text-sage">{item.body}</p>}
      </div>
    </Appear>
  );
}
