"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useIntro } from "@/components/providers/intro";
import { ChatPanel } from "@/components/chat_panel";
import { Appear } from "@/components/ui/motion";
import { cn, SPRING } from "@/lib/utils";

const AUTO_OPENED_KEY = "tph-chat-auto-opened";

/**
 * Floating chat, fixed to the bottom-right of the screen on every page
 * position. It opens by itself once the intro has lifted; after that the
 * WhatsApp disc toggles it, and the panel's menu button and Escape close it.
 */
export function ChatWidget() {
  const { done } = useIntro();
  const [open, setOpen] = useState(false);

  // Opens on its own once the page is revealed, a beat after the disc lands; only on the first page of a visit.
  useEffect(() => {
    if (!done) return;
    try {
      if (sessionStorage.getItem(AUTO_OPENED_KEY) === "1") return;
    } catch {}
    const t = setTimeout(() => {
      setOpen(true);
      try {
        sessionStorage.setItem(AUTO_OPENED_KEY, "1");
      } catch {}
    }, 1900);
    return () => clearTimeout(t);
  }, [done]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            id="site-chat"
            key="site-chat"
            initial={{ opacity: 0.001, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16, transition: { duration: 0.25 } }}
            transition={SPRING}
            className="fixed bottom-[88px] right-4 z-[35] origin-bottom-right md:bottom-[96px] md:right-6"
          >
            <ChatPanel
              active
              className="max-h-[calc(100svh-120px)] w-[min(327px,calc(100vw-32px))] rounded-[16px]"
              onClose={() => setOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Appear preset="grow" play={done} delay={1.1} className="fixed bottom-4 right-4 z-[35] md:bottom-6 md:right-6">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="site-chat"
          aria-label={open ? "Close chat" : "Chat with us"}
          className="press relative block rounded-full"
        >
          <Image src="/home/icons/whatsapp.svg" alt="" width={48} height={48} className="size-12 drop-shadow-lg" />
          <span
            aria-hidden
            className={cn(
              "absolute -right-0.5 -top-0.5 grid size-[18px] place-items-center rounded-full bg-white text-[12px] font-medium leading-none text-green-deep shadow transition-all duration-300 ease-out-expo",
              open ? "scale-100 opacity-100" : "scale-50 opacity-0",
            )}
          >
            ×
          </span>
        </button>
      </Appear>
    </>
  );
}
