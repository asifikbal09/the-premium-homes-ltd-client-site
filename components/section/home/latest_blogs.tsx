"use client";

import { motion, useInView, type PanInfo } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLoopCarousel } from "@/components/ui/carousel";
import { HoverShutter } from "@/components/ui/hover_shutter";
import { Appear } from "@/components/ui/motion";
import {
  ArrowPair,
  Eyebrow,
  GreenPill,
  Heading,
  PatternStrip,
} from "@/components/ui/primitives";
import { cleanBlogTitle, sanitizeImageUrl } from "@/lib/blogs";
import { SPRING_SLOW } from "@/lib/utils";

const MotionLink = motion.create(Link);

type Post = {
  title: string;
  category: string;
  src: string;
  /** Second photo, opened over the first with a shutter on hover. */
  hover: string;
  href: string;
  crop?: React.CSSProperties;
};

const MAX_POSTS = 10;

// Shown until the blogs API answers, and if it returns nothing.
const FALLBACK_POSTS: Post[] = [
  {
    title: "The Art of Designing Homes That Age Gracefully",
    category: "Specials",
    src: "/home/img/blog-1.png",
    hover: "/home/img/project-ariston.jpg",
    href: "/blogs",
    crop: { left: 0, top: "-11.2%", width: "100%", height: "147.21%" },
  },
  {
    title: "Dhaka's Premium Zones Are Outperforming Market Expectations",
    category: "Specials",
    src: "/home/img/blog-2.png",
    hover: "/home/img/project-prestige.jpg",
    href: "/blogs",
  },
  {
    title: "Building the Connected Home: TPHL's Integrated Tech",
    category: "Specials",
    src: "/home/img/blog-3.png",
    hover: "/home/img/project-studio.jpg",
    href: "/blogs",
    crop: { left: 0, top: "-53.4%", width: "100%", height: "276.86%" },
  },
  {
    title: "Dhaka's Premium Zones Are Outperforming Market Expectations",
    category: "Specials",
    src: "/home/img/blog-2.png",
    hover: "/home/video/spotlight-towers.jpg",
    href: "/blogs",
  },
];

type ApiBlog = { title?: string; slug?: string; category?: string | null; image?: string | null };

function toPosts(blogs: ApiBlog[]): Post[] {
  const valid = blogs.filter((b) => b.title).slice(0, MAX_POSTS);
  return valid.map((b, i) => ({
    title: cleanBlogTitle(b.title),
    category: b.category?.trim() || "Specials",
    src: sanitizeImageUrl(b.image),
    // The next post's photo opens over this one on hover.
    hover: sanitizeImageUrl(valid[(i + 1) % valid.length].image),
    href: b.slug ? `/blogs/${encodeURIComponent(b.slug)}` : "/blogs",
  }));
}

const AUTOPLAY_MS = 4000;

export function LatestBlogs() {
  const [posts, setPosts] = useState<Post[]>(FALLBACK_POSTS);

  useEffect(() => {
    const baseUrl = (
      process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.dpremiumhomes.com/api"
    ).replace(/\/+$/, "");
    fetch(`${baseUrl}/blogs`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const rawList = Array.isArray(data) ? data : data?.blogs || data?.data || [];
        if (Array.isArray(rawList) && rawList.length > 0) setPosts(toPosts(rawList));
      })
      .catch((err) => console.warn("Failed to fetch blogs, using fallback posts:", err));
  }, []);

  const N = posts.length;
  // Three copies in a row; the track always rests inside the middle copy, so it can run forever both ways.
  const LOOP = [...posts, ...posts, ...posts];
  const sectionRef = useRef<HTMLElement>(null);
  const {
    trackRef,
    x,
    next,
    prev,
    onDragEnd: snap,
    isClone,
  } = useLoopCarousel(N);
  const [paused, setPaused] = useState(false);
  // Hover photos mount the first time a pointer enters the section (never on touch screens).
  const [armed, setArmed] = useState(false);
  const inView = useInView(sectionRef, { amount: 0.3 });
  const seen = useInView(sectionRef, { once: true, amount: 0.15 });

  // Autoplay while on screen, paused while hovered or dragged.
  useEffect(() => {
    if (!inView || paused) return;
    const t = setInterval(next, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [inView, paused, next]);

  const onDragEnd = (e: unknown, info: PanInfo) => {
    snap(e, info);
    setPaused(false);
  };

  return (
    <section
      ref={sectionRef}
      onPointerEnter={(e) => e.pointerType === "mouse" && setArmed(true)}
      id="blogs"
      className="flex flex-col gap-12 bg-white pb-20 md:gap-14 md:pb-[160px]"
    >
      <PatternStrip tone="light" />

      <div className="shell flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="flex max-w-[655px] flex-col gap-4">
          <Eyebrow play={seen}>Blogs</Eyebrow>
          <Heading size={80} min={40} mask play={seen} delay={0.15}>
            Latest From Premium Homes
          </Heading>
        </div>
        <Appear
          preset="lift"
          play={seen}
          delay={0.45}
          className="flex flex-wrap items-center gap-4 sm:gap-6"
        >
          <ArrowPair onPrev={prev} onNext={next} />
          <GreenPill href="/blogs" arrow>
            browse all
          </GreenPill>
        </Appear>
      </div>

      <div
        className="w-full overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <motion.div
          ref={trackRef}
          style={{ x }}
          drag="x"
          dragElastic={0.08}
          dragMomentum={false}
          onDragStart={() => setPaused(true)}
          onDragEnd={onDragEnd}
          className="flex w-max cursor-grab touch-pan-y items-start gap-5 px-[clamp(16px,5vw,80px)] active:cursor-grabbing 3xl:pl-[calc((100vw-1600px)/2+80px)]"
        >
          {LOOP.map((p, i) => (
            <MotionLink
              key={i}
              href={p.href}
              draggable={false}
              // Only the middle copy is real for screen readers and the keyboard; the others are visual.
              aria-hidden={isClone(i) ? true : undefined}
              tabIndex={isClone(i) ? -1 : undefined}
              initial={{ opacity: 0.001, y: 160 }}
              animate={seen ? { opacity: 1, y: 0 } : { opacity: 0.001, y: 160 }}
              transition={{ ...SPRING_SLOW, delay: 0.55 + (i % N) * 0.14 }}
              className="group flex w-[min(80vw,clamp(280px,29.19vw,467px))] shrink-0 select-none flex-col gap-6"
            >
              <div
                className="zoom-frame relative w-full"
                // Alternate short and tall frames, as in the design.
                style={{ aspectRatio: (i % N) % 2 ? "467 / 500" : "467 / 340" }}
              >
                <div className="absolute inset-0">
                  <div className="absolute" style={p.crop ?? { inset: 0 }}>
                    <Image
                      src={p.src}
                      alt=""
                      fill
                      draggable={false}
                      sizes="(min-width: 768px) 30vw, 80vw"
                      className="pointer-events-none object-cover"
                    />
                  </div>
                </div>
                {/* Second photo opens over the first on hover, same shutter as the project cards. */}
                <HoverShutter
                  src={p.hover}
                  sizes="(min-width: 768px) 30vw, 80vw"
                  armed={armed}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-[14px] font-medium uppercase leading-[1.5] text-gold">
                  {p.category}
                </p>
                <h3 className="font-display text-[26px] font-normal capitalize leading-[1.35] text-green md:text-[32px] md:leading-[44px]">
                  <span className="link-draw">{p.title}</span>
                </h3>
              </div>
            </MotionLink>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
