"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import { EmptyState } from "@/components/ui/empty_state";
import { FilterChips } from "@/components/ui/filter_chips";
import { Appear } from "@/components/ui/motion";
import { GreenPill, Heading } from "@/components/ui/primitives";
import type { FaqCategory, FaqItem } from "@/lib/faqs";
import { CONTACT } from "@/lib/site";
import { cn, SETTLE, SPRING } from "@/lib/utils";

const ROW_PAD = "px-[clamp(20px,2vw,32px)]";

/**
 * One question: a white bar whose ⊕ spins a quarter turn on hover and settles into × as the answer
 * slides open beneath it. Rows rise in one after another when they mount or a tab brings them in.
 */
function FaqRow({
  item,
  index,
  open,
  onToggle,
}: {
  item: FaqItem;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = `faq-answer-${item.id}`;
  return (
    <motion.div
      initial={{ opacity: 0.001, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ ...SPRING, delay: index * 0.06 }}
      className="bg-white"
    >
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onToggle}
        className={cn("group flex w-full items-center justify-between gap-6 py-6 text-left", ROW_PAD)}
      >
        <span
          className={cn(
            "text-[clamp(16px,1.25vw,20px)] leading-[1.6] transition-colors duration-300",
            open ? "text-green" : "text-sage group-hover:text-green",
          )}
        >
          {item.question}
        </span>
        <Image
          src="/faq/icons/add-circle.svg"
          alt=""
          width={40}
          height={40}
          className={cn(
            "size-10 shrink-0 transition-transform duration-500 ease-out-expo",
            open ? "rotate-45" : "group-hover:rotate-90",
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: SETTLE }}
            className="overflow-hidden"
          >
            {/* Clear of the icon column, so the answer reads under the question. */}
            <p className={cn("whitespace-pre-line pb-6 pr-[72px] text-[16px] leading-[1.6] text-sage", ROW_PAD)}>
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/**
 * Figma FAQ body: the heading, a line of copy and two contact actions on the left; category tabs
 * over an accordion on the right. Tabs and questions are whatever GET /faqs returns. Switching tab
 * fades the old list out before the new questions rise in.
 */
export function FAQContent({ categories }: { categories: FaqCategory[] }) {
  const [active, setActive] = useState(categories[0]?.label ?? "");
  const [openId, setOpenId] = useState<FaqItem["id"] | null>(null);
  const items = categories.find((c) => c.label === active)?.items ?? [];

  return (
    <section aria-label="Frequently asked questions" className="bg-[#f5f6f7] py-[clamp(48px,5vw,80px)]">
      <div className="shell grid items-start gap-12 lg:grid-cols-[465fr_800fr] lg:gap-[clamp(40px,10.94vw,175px)]">
        <div className="flex flex-col items-start gap-12">
          <div className="flex flex-col gap-6">
            <Heading size={64} min={36} leading={1.1} mask>
              Answers to your questions about premium homes
            </Heading>
            <Appear
              as="p"
              preset="lift"
              delay={0.3}
              className="max-w-[442px] text-[clamp(16px,1.125vw,18px)] leading-[1.5] text-sage"
            >
              Don’t see your question answered? Our team can provide personalized answers and guidance
            </Appear>
          </div>
          <Appear preset="lift" delay={0.45} className="flex flex-wrap items-center gap-4">
            <GreenPill href="/contact" arrow>
              contact us
            </GreenPill>
            <a
              href={CONTACT.support.href}
              className="press inline-flex h-[42px] shrink-0 items-center gap-1 rounded-full border border-sage bg-white pl-4 pr-5 text-[14px] font-medium uppercase tracking-[2px] text-green hover:border-green"
            >
              <Image src="/faq/icons/call.svg" alt="" width={24} height={24} className="size-6 shrink-0" />
              <span className="trim leading-[1.7]">{CONTACT.support.label}</span>
            </a>
          </Appear>
        </div>

        {categories.length > 0 ? (
          <div className="flex min-w-0 flex-col gap-8">
            {/* Scrolls sideways on phones, where the three labels cannot share one row. */}
            <div className="no-scrollbar overflow-x-auto rounded-full bg-white px-4 py-3">
              <FilterChips
                options={categories.map((c) => c.label)}
                value={active}
                onChange={setActive}
                tall
                fill
              />
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                exit={{ opacity: 0, y: -12, transition: { duration: 0.25, ease: SETTLE } }}
                className="flex flex-col gap-4"
              >
                {items.map((item, i) => (
                  <FaqRow
                    key={item.id}
                    item={item}
                    index={i}
                    open={openId === item.id}
                    onToggle={() => setOpenId((id) => (id === item.id ? null : item.id))}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <EmptyState
            title="No questions yet"
            copy="Our FAQs are being updated. Contact us and our team will answer you directly."
          />
        )}
      </div>
    </section>
  );
}
