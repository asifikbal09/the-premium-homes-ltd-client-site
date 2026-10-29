"use client";

import { motion, useInView } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLoopCarousel } from "@/components/ui/carousel";
import { Appear } from "@/components/ui/motion";
import { ArrowPair, Eyebrow, Heading } from "@/components/ui/primitives";
import { PlayButton, VideoModal } from "@/components/ui/video_modal";
import {
  FALLBACK_REVIEWS,
  buildAutoplayEmbedUrl,
  getReviewInfo,
  getThumbnailUrl,
  type ReviewItem,
} from "@/lib/reviews";
import { SPRING_SLOW } from "@/lib/utils";

type Testimonial = {
  id: number | string;
  name: string;
  role: string;
  src: string;
  embedUrl: string;
};

function toTestimonials(reviews: ReviewItem[]): Testimonial[] {
  return reviews
    .filter((r) => r.videoUrl)
    .map((r) => {
      const { title, subtitle } = getReviewInfo(r);
      return {
        id: r.id,
        name: title,
        role: subtitle,
        src: getThumbnailUrl(r),
        embedUrl: buildAutoplayEmbedUrl(r.videoUrl),
      };
    });
}

export function HomeTestimonials() {
  const [items, setItems] = useState<Testimonial[]>(() => toTestimonials(FALLBACK_REVIEWS));

  useEffect(() => {
    const baseUrl = (
      process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.dpremiumhomes.com/api"
    ).replace(/\/+$/, "");
    fetch(`${baseUrl}/reviews`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const list = toTestimonials(Array.isArray(data?.reviews) ? data.reviews : []);
        if (list.length > 0) setItems(list);
      })
      .catch((err) => console.warn("Failed to load reviews, using fallback data:", err));
  }, []);

  const N = items.length;
  // Three copies in a row so the slider loops endlessly both ways (manual only, no autoplay).
  const LOOP = [...items, ...items, ...items];
  const { trackRef, x, prev, next, onDragEnd, isClone } = useLoopCarousel(N);
  // Until someone uses the slider, the copies to the left of the first card stay hidden so the
  // page gutter is empty, as in the design. The first arrow click or drag brings them in.
  const [touched, setTouched] = useState(false);
  const [active, setActive] = useState<Testimonial | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const seen = useInView(sectionRef, { once: true, amount: 0.15 });

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="bg-white pb-10 pt-16 md:pt-[100px]"
    >
      <div className="shell flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div className="flex max-w-[835px] flex-col gap-4">
          <Eyebrow play={seen}>Testimonials</Eyebrow>
          <Heading size={80} min={40} mask play={seen} delay={0.15}>
            What Our Residents and Partners Say
          </Heading>
        </div>
        <Appear preset="lift" play={seen} delay={0.45}>
          <ArrowPair
            onPrev={() => {
              setTouched(true);
              prev();
            }}
            onNext={() => {
              setTouched(true);
              next();
            }}
          />
        </Appear>
      </div>

      <div className="mx-auto mt-10 max-w-[100vw] md:mt-16">
        <div className="w-full overflow-hidden">
          <motion.div
            ref={trackRef}
            style={{ x }}
            drag="x"
            dragElastic={0.08}
            dragMomentum={false}
            onDragStart={() => setTouched(true)}
            onDragEnd={onDragEnd}
            className="flex w-max cursor-grab touch-pan-y gap-4 px-[clamp(16px,5vw,80px)] active:cursor-grabbing md:gap-6 3xl:pl-[calc((100vw-1600px)/2+80px)]"
          >
            {LOOP.map((t, i) => (
              <motion.article
                key={i}
                aria-hidden={isClone(i) ? true : undefined}
                style={i < N && !touched ? { visibility: "hidden" } : undefined}
                initial={{ opacity: 0.001, x: 160 }}
                animate={
                  seen ? { opacity: 1, x: 0 } : { opacity: 0.001, x: 160 }
                }
                transition={{ ...SPRING_SLOW, delay: 0.55 + (i % N) * 0.12 }}
                className="group relative aspect-[480/800] w-[min(78vw,clamp(280px,30vw,480px))] shrink-0 select-none overflow-hidden rounded-[24px] bg-[#f8f8f8] md:rounded-[32px]"
              >
                <div className="zoom-frame absolute inset-0">
                  <div className="absolute inset-0">
                    <div className="absolute inset-0">
                      <Image
                        src={t.src}
                        alt={`${t.name} testimonial`}
                        fill
                        draggable={false}
                        sizes="(min-width: 768px) 30vw, 78vw"
                        className="pointer-events-none object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/20" />
                  </div>
                </div>

                <PlayButton
                  tabIndex={isClone(i) ? -1 : undefined}
                  onClick={() => setActive(t)}
                  label={`Play ${t.name} testimonial`}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                />

                <div
                  className="absolute inset-x-0 bottom-0 flex h-[38%] flex-col justify-end px-6 pb-6 md:px-8 md:pb-8"
                  style={{
                    backgroundImage:
                      "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.28) 45%, rgba(0,0,0,0) 100%)",
                  }}
                >
                  <p className="font-display text-[24px] font-medium leading-[1.5] tracking-[-0.32px] text-white md:text-[32px]">
                    {t.name}
                  </p>
                  <p className="text-[15px] leading-[1.5] text-white md:text-[20px]">
                    {t.role}
                  </p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="shell mt-12">
        <div className="h-px bg-stone-2/40" />
      </div>

      <VideoModal
        open={!!active}
        onClose={() => setActive(null)}
        poster={active?.src ?? ""}
        embedUrl={active?.embedUrl}
        title={active ? `${active.name} testimonial` : "Testimonial"}
      />
    </section>
  );
}
