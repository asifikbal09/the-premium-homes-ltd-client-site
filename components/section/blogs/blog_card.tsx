"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import type { BlogSummary } from "@/lib/blogs";
import { SPRING } from "@/lib/utils";
import { BlogMeta } from "./blog_meta";

/**
 * Figma "Blog Card". Fades up as it scrolls in, a beat after the card to its left; cards a filter
 * adds or drops enter and leave on the grid's layout animation. A post has one photo, so on hover it
 * breathes in its frame under a soft green shade while the title turns green and underlines itself.
 */
export function BlogCard({
  post,
  index = 0,
}: {
  post: BlogSummary;
  /** Position in the grid, for the stagger across a row. */
  index?: number;
}) {
  const href = post.slug ? `/blogs/${encodeURIComponent(post.slug)}` : "/blogs";

  return (
    <motion.article
      layout
      initial={{ opacity: 0.001, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.3 } }}
      transition={{ ...SPRING, delay: (index % 3) * 0.12 }}
    >
      <Link href={href} className="group flex flex-col gap-6">
        <div className="zoom-frame relative aspect-[467/340] bg-mist">
          <div className="absolute inset-0">
            <Image
              src={post.image}
              alt=""
              fill
              sizes="(min-width: 1024px) 30vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <span
            aria-hidden
            className="absolute inset-0 bg-green-deep/0 transition-colors duration-700 ease-out-expo group-hover:bg-green-deep/15"
          />
        </div>

        <div className="flex flex-col gap-4">
          <BlogMeta items={[post.category, post.date]} />
          <h2 className="font-display text-[clamp(20px,1.5vw,24px)] capitalize leading-[1.4] text-ink transition-colors duration-300 group-hover:text-green">
            <span className="link-draw">{post.title}</span>
          </h2>
        </div>
      </Link>
    </motion.article>
  );
}
