"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChatWidget } from "@/components/chat_widget";
import { Appear } from "@/components/ui/motion";
import { PatternStrip } from "@/components/ui/primitives";
import { RollingText } from "@/components/ui/rolling_text";
import { CONTACT, FOOTER_COLUMNS, LEGAL_LINKS, SOCIALS } from "@/lib/site";
import { SETTLE } from "@/lib/utils";

// Column widths are Figma's; Figma sets Vazirmatn "normal" leading at 25px (16) / 28px (18).
const COLUMNS = [
  {
    title: "Socials",
    w: 81,
    links: SOCIALS.map((s) => ({ name: s.label, href: s.href })),
  },
  ...FOOTER_COLUMNS,
];

const isExternal = (href: string) => href.startsWith("http");

function FooterLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      {...(isExternal(href) && { target: "_blank", rel: "noopener noreferrer" })}
      // Extra tap area on phones through padding cancelled by negative margin, so the 28px rhythm from Figma holds.
      // A fixed 28px row (Figma's leading) with the rolling label centred in it keeps the column rhythm,
      // and puts the underline just under the descenders instead of a line-box gap below them.
      className="group flex h-7 w-fit items-center whitespace-nowrap bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-[position:0_calc(100%-6px)] bg-no-repeat py-1.5 -my-1.5 leading-[28px] transition-[background-size] duration-[400ms] ease-out-expo hover:bg-[length:100%_1px] md:bg-left-bottom md:py-0 md:my-0"
    >
      <RollingText text={children} align="top" />
    </Link>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "done" | "error">("idle");

  return (
    <div className="flex w-full max-w-[494px] flex-col gap-6">
      <p className="text-[18px] uppercase leading-[normal] tracking-[-0.4px] text-gold md:text-[20px]">
        Subscribe Newsletter
      </p>
      <div className="flex flex-col gap-4">
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            setState(/^\S+@\S+\.\S+$/.test(email) ? "done" : "error");
          }}
          className="flex h-[60px] w-full max-w-[454px] items-center justify-between rounded-full border border-white/[0.04] bg-white/[0.06] py-2.5 pl-5 pr-2.5 transition-colors focus-within:border-gold/50"
        >
          <label htmlFor="newsletter" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setState("idle");
            }}
            placeholder="Enter your email"
            // Vazirmatn carries tall Arabic ascent metrics, so its Latin caps sit 2.4px above the line-box centre; the padding re-centres them.
            className="min-w-0 flex-1 bg-transparent pt-[5px] text-[16px] tracking-[-0.32px] text-white outline-none placeholder:text-white/45"
          />
          <button
            type="submit"
            className="press flex h-10 w-[138px] shrink-0 items-center justify-center rounded-full bg-[rgba(230,230,230,0.2)] text-[14px] font-medium uppercase tracking-[2px] text-white hover:bg-gold hover:text-green-deep"
          >
            <span className="trim leading-[1.7]">Subscribe</span>
          </button>
        </form>
        <AnimatePresence mode="wait">
          <motion.p
            key={state}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="text-[16px] leading-[24px] tracking-[-0.36px] text-stone-2 md:text-[18px]"
          >
            {state === "done" ? (
              <span className="text-gold">Thank you — you’re on the list.</span>
            ) : state === "error" ? (
              <span className="text-[#f2a7a0]">
                Please enter a valid email address.
              </span>
            ) : (
              <>
                By subscribing you agree with our{" "}
                <Link
                  href="/privacy-policy"
                  className="group inline-block bg-[linear-gradient(currentColor,currentColor)] bg-[length:100%_1px] bg-bottom bg-no-repeat py-2 -my-2 [background-origin:content-box] md:py-0 md:my-0"
                >
                  <RollingText text="Privacy Policy" align="top" />
                </Link>
              </>
            )}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

export interface FooterProps {
  /**
   * The page rides above the footer and slides open to reveal it. Needs the page's <main>
   * to sit above it (`relative z-10` with a background), so only pages built for it opt in.
   */
  reveal?: boolean;
}

export function Footer({ reveal = false }: FooterProps = {}) {
  const reduce = useReducedMotion();
  // In reveal mode the footer is painted under the page from the start, so the browser counted its
  // logo as the largest paint. It stays hidden until the end of the page is within a screen, which
  // the sentinel right after <main> tells us.
  const endRef = useRef<HTMLDivElement>(null);
  const nearEnd = useInView(endRef, { once: true, margin: "0px 0px 100% 0px" });
  const near = !reveal || nearEnd;
  // The reveal pins the footer to the bottom of the screen. That only works while the whole footer
  // fits on screen; on phones and short laptops it is taller, its top could never be scrolled to,
  // so there it is an ordinary section that scrolls in like the rest.
  const footRef = useRef<HTMLElement>(null);
  const [fits, setFits] = useState(false);
  useEffect(() => {
    const el = footRef.current;
    if (!el) return;
    const check = () => setFits(el.offsetHeight <= window.innerHeight);
    // The observer reports once on observe, then on every size change of the footer.
    const ro = new ResizeObserver(check);
    ro.observe(el);
    window.addEventListener("resize", check);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", check);
    };
  }, []);
  return (
    <>
      <div ref={endRef} aria-hidden className="h-0" />
      <footer
        ref={footRef}
        className={`${reveal && fits ? "sticky bottom-0" : "relative"} z-0 flex flex-col gap-16 bg-green-deep pb-10 md:gap-[100px] ${near ? "" : "invisible"}`}
      >
        <PatternStrip tone="dark" />

        <div className="shell flex flex-col gap-8">
          <div className="flex flex-col gap-14 xl:flex-row xl:items-start xl:justify-between">
            <Appear
              preset="rise"
              amount={0.3}
              className="w-full max-w-[494px] xl:min-w-[400px] xl:shrink"
            >
              <Newsletter />
            </Appear>
            <div className="grid grid-cols-2 gap-x-10 gap-y-12 md:flex md:flex-wrap md:gap-x-[clamp(40px,5vw,80px)] xl:flex-nowrap">
              {COLUMNS.map((c, i) => (
                <Appear
                  key={c.title}
                  preset="rise"
                  delay={0.12 + i * 0.1}
                  amount={0.3}
                  className="flex flex-col gap-4 xl:min-w-[var(--col-w)]"
                  style={{ ["--col-w" as string]: `${c.w}px` }}
                >
                  <p className="text-[16px] uppercase leading-[25px] tracking-[-0.32px] text-gold">
                    {c.title}
                  </p>
                  <div className="flex flex-col gap-2 text-[16px] leading-[28px] tracking-[-0.36px] text-warm md:text-[18px]">
                    {c.links.map((l) => (
                      <FooterLink key={l.name} href={l.href}>
                        {l.name}
                      </FooterLink>
                    ))}
                  </div>
                </Appear>
              ))}
              <Appear
                preset="rise"
                delay={0.42}
                amount={0.3}
                className="col-span-2 flex flex-col gap-4 xl:min-w-[238px]"
              >
                <p className="text-[16px] uppercase leading-[25px] tracking-[-0.32px] text-gold">
                  Contact
                </p>
                <div className="flex flex-col gap-[43.2px]">
                  <div className="flex flex-col gap-3 text-[16px] tracking-[-0.36px] text-warm md:text-[18px]">
                    {[CONTACT.phone, CONTACT.email].map((c) => (
                      <a
                        key={c.href}
                        href={c.href}
                        className="group flex h-3.5 w-fit items-start leading-[28px]"
                      >
                        <span className="-mt-[4px] block">
                          <RollingText text={c.label} align="top" />
                        </span>
                      </a>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-[16px] uppercase leading-[25px] tracking-[-0.32px] text-gold">
                      office:
                    </p>
                    <p className="text-[16px] leading-[28px] tracking-[-0.36px] text-warm md:text-[18px]">
                      {CONTACT.office[0]}
                      <br />
                      {CONTACT.office[1]}
                    </p>
                  </div>
                </div>
              </Appear>
            </div>
          </div>

          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: reduce ? 0 : 1.8, ease: SETTLE }}
            className="-mb-[1.5px] block h-[1.5px] origin-left bg-white/10"
          />

          <div className="flex flex-col gap-12 md:flex-row md:items-end md:justify-between">
            <Appear preset="rise" slow amount={0.4}>
              <span className="relative block aspect-[435/99] w-[clamp(240px,27.2vw,435px)]">
                <Image
                  src="/image/logo/LOGO-WHITE.png"
                  alt="The Premium Homes"
                  fill
                  sizes="(min-width: 1600px) 435px, 27.2vw"
                  className="object-contain object-left"
                />
              </span>
            </Appear>
            <Appear
              preset="rise"
              delay={0.15}
              amount={0.4}
              className="flex w-full max-w-[532px] flex-col gap-6 leading-[1.5]"
            >
              <div className="flex flex-col gap-4">
                <p className="font-display text-[28px] font-normal uppercase text-gold md:text-[32px]">
                  TPHL Properties
                </p>
                <p className="max-w-[455px] text-[16px] capitalize tracking-[-0.18px] text-white md:text-[18px]">
                  A Regional Real Estate Developer Building Communities with
                  Vision, Precision, and Purpose.
                </p>
              </div>
              <div className="flex flex-col font-display text-[20px] font-normal lowercase tracking-[0.24px] text-white md:text-[24px]">
                {[CONTACT.email, CONTACT.phoneLocal].map((c) => (
                  <a key={c.href} href={c.href} className="group w-fit">
                    <RollingText text={c.label} align="top" />
                  </a>
                ))}
              </div>
            </Appear>
          </div>

          <span className="-mb-[1.5px] block h-[1.5px] bg-white/10" />

          <div className="flex flex-col gap-2 text-[16px] leading-[28px] tracking-[-0.36px] text-white/50 sm:flex-row sm:items-center sm:justify-between md:text-[18px]">
            <p>© 2026 TPH. All right reserved</p>
            <p>
              {LEGAL_LINKS.map((l, i) => (
                <span key={l.href}>
                  {i > 0 && ", "}
                  <Link href={l.href} className="group">
                    <RollingText text={l.name} twin="text-white" align="top" />
                  </Link>
                </span>
              ))}
            </p>
          </div>
        </div>
      </footer>
      <ChatWidget />
    </>
  );
}
