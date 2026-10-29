"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn, SPRING_SOFT } from "@/lib/utils";
import { whatsappUrl } from "@/lib/site";

type Msg = { id: number; from: "bot" | "me"; text: string; time: string };

const GREETING: Msg[] = [
  {
    id: 1,
    from: "bot",
    text: "Hi there! I can help you find the perfect apartment or house. What kind of property are you looking for?",
    time: "",
  },
  {
    id: 2,
    from: "bot",
    text: "Type your question below and we’ll continue the conversation on WhatsApp.",
    time: "",
  },
];

function now() {
  const d = new Date();
  const h = d.getHours() % 12 || 12;
  return `${h}:${String(d.getMinutes()).padStart(2, "0")} ${d.getHours() >= 12 ? "PM" : "AM"}`;
}

function BotAvatar() {
  return (
    <Image
      src="/home/img/chat-avatar-sm.png"
      alt=""
      width={28}
      height={28}
      className="size-[27.73px] shrink-0 rounded-full object-cover"
    />
  );
}

function Typing() {
  return (
    <motion.div
      layout
      initial={{ opacity: 0.001, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      transition={SPRING_SOFT}
      className="flex items-end gap-[13.87px]"
    >
      <BotAvatar />
      <div
        role="status"
        aria-label="Typing"
        className="flex h-[41.6px] w-[73.95px] items-center gap-[7px] rounded-t-[9.24px] rounded-br-[9.24px] bg-mist pl-[18.49px]"
      >
        {/* Three dots on one keyframe, each a beat behind the last: a wave, not a blink. */}
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="size-[8px] rounded-full bg-green animate-[typing_1.1s_ease-in-out_infinite]"
            style={{ animationDelay: `${i * 0.16}s` }}
          />
        ))}
      </div>
    </motion.div>
  );
}

/**
 * Chat panel in the design's look. The greeting types itself in; whatever the visitor sends
 * opens WhatsApp with that message pre-filled, where the team answers for real.
 */
export function ChatPanel({
  className,
  onClose,
  active = true,
}: {
  className?: string;
  onClose?: () => void;
  /** Hold the greeting until the page intro has finished. */
  active?: boolean;
}) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  // The greeting arrives as if typed: a typing beat, the first line, another beat, the second.
  useEffect(() => {
    if (!active) return;
    const stamp = (m: Msg) => ({ ...m, time: now() });
    const timers = [
      setTimeout(() => setTyping(true), 600),
      setTimeout(() => {
        setTyping(false);
        setMessages([stamp(GREETING[0])]);
      }, 1700),
      setTimeout(() => setTyping(true), 2300),
      setTimeout(() => {
        setTyping(false);
        setMessages(GREETING.map(stamp));
      }, 3300),
    ];
    return () => timers.forEach(clearTimeout);
  }, [active]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (text) {
      setDraft("");
      setMessages((m) => [...m, { id: Date.now(), from: "me", text, time: now() }]);
    }
    window.open(whatsappUrl(text), "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className={cn(
        "flex h-[487.6px] w-[327px] flex-col overflow-hidden bg-white shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)]",
        className,
      )}
    >
      {/* Header */}
      <div className="flex h-[71.64px] shrink-0 items-center justify-between bg-[#f7f1e7] px-[18.49px]">
        <div className="flex items-center gap-[13.87px]">
          <Image
            src="/home/img/chat-avatar.png"
            alt="Bornali Haque"
            width={37}
            height={37}
            className="size-[36.98px] rounded-full object-cover"
          />
          <div className="flex flex-col gap-[11.56px]">
            <p className="trim text-[16.18px] font-medium leading-[1.7] text-black">Bornali Haque</p>
            <div className="flex items-center gap-[4.62px]">
              <span className="relative size-[9.24px]">
                <Image
                  src="/home/icons/dot-online.svg"
                  alt=""
                  width={14}
                  height={14}
                  className="absolute -inset-1/4 size-[150%] max-w-none"
                />
              </span>
              <p className="trim text-[11.56px] leading-[1.7] text-black">Online</p>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={onClose ? "Close chat" : "More options"}
          className="grid size-[27.73px] place-items-center rounded-full transition-colors hover:bg-black/5"
        >
          <Image src="/home/icons/more-vert.svg" alt="" width={28} height={28} className="size-[27.73px]" />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={listRef}
        data-lenis-prevent
        className="no-scrollbar flex flex-1 flex-col gap-[11.5px] overflow-y-auto px-[18.49px] pt-[18.97px] pb-2"
      >
        <AnimatePresence initial={false}>
          {messages.map((m) =>
            m.from === "bot" ? (
              <motion.div
                key={m.id}
                layout
                initial={{ opacity: 0.001, y: 28, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={SPRING_SOFT}
                className="flex origin-bottom-left flex-col gap-[10px]"
              >
                <div className="flex items-end gap-[13.87px]">
                  <BotAvatar />
                  <p className="flex-1 rounded-t-[11.56px] rounded-br-[11.56px] bg-mist p-[13.87px] text-[14px] leading-[1.5] text-black/80">
                    {m.text}
                  </p>
                </div>
                <p className="pl-[42.75px] text-[14px] leading-[1.6] text-black/80 opacity-60">{m.time}</p>
              </motion.div>
            ) : (
              <motion.div
                key={m.id}
                layout
                initial={{ opacity: 0.001, y: 28, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={SPRING_SOFT}
                className="flex origin-bottom-right flex-col items-end gap-[9.24px]"
              >
                <p className="w-full rounded-t-[9.24px] rounded-bl-[9.24px] bg-green p-[13.87px] text-[14px] leading-[1.6] text-white">
                  {m.text}
                </p>
                <p className="text-[14px] leading-[1.6] text-black/80 opacity-60">{m.time}</p>
              </motion.div>
            ),
          )}
          {typing && <Typing key="typing" />}
        </AnimatePresence>
      </div>

      {/* Composer */}
      <form onSubmit={send} className="flex shrink-0 items-center gap-[9.24px] px-[18.49px] pb-[18.5px] pt-2">
        <label className="sr-only" htmlFor="hero-chat-input">
          Ask a question
        </label>
        <input
          id="hero-chat-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Ask on WhatsApp..."
          autoComplete="off"
          className="h-[46.22px] min-w-0 flex-1 rounded-full bg-mist pl-[17.66px] pr-4 text-[14px] text-black outline-none ring-green/30 transition-shadow placeholder:text-black/60 focus:ring-2"
        />
        <button
          type="submit"
          aria-label="Send on WhatsApp"
          className="press size-[46.22px] shrink-0"
        >
          <Image src="/home/icons/chat-send.svg" alt="" width={47} height={47} className="-m-[0.58px] size-[47.37px] max-w-none" />
        </button>
      </form>
    </div>
  );
}
