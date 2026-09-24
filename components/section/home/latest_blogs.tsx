"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BlogItem {
  id: number | string;
  title: string;
  slug?: string;
  category?: string | null;
  author?: string;
  date?: string;
  image?: string;
  readTime?: string;
  excerpt?: string;
}

// Fallback matching the design reference and backend data
const FALLBACK_BLOGS: BlogItem[] = [
  {
    id: 1,
    title: "The Art Of Designing Homes That Age Gracefully",
    slug: "the-art-of-designing-homes-that-age-gracefully",
    category: "SPECIALS",
    image: "https://api.dpremiumhomes.com/assets/blogs/blogs7.jpeg",
    date: "2025-10-19",
  },
  {
    id: 2,
    title: "Dhaka's Premium Zones Are Outperforming Market Expectations",
    slug: "dhakas-premium-zones-are-outperforming-market-expectations",
    category: "SPECIALS",
    image: "https://api.dpremiumhomes.com/assets/blogs/blog6.jpg",
    date: "2025-10-19",
  },
  {
    id: 3,
    title: "Building The Connected Home: TPHL's Integrated Tech",
    slug: "building-the-connected-home-tphls-integrated-tech",
    category: "SPECIALS",
    image: "https://api.dpremiumhomes.com/assets/Banner-images/bannerOne.png",
    date: "2025-10-19",
  },
  {
    id: 4,
    title: "Flat for Sale in Dhaka: Curated Luxury Condominiums",
    slug: "flat-for-sale-in-dhaka",
    category: "SPECIALS",
    image: "https://api.dpremiumhomes.com/assets/Property/std203.png",
    date: "2025-10-19",
  },
  {
    id: 5,
    title: "Trusted Real Estate Innovations Across Bangladesh",
    slug: "trusted-real-estate-company-in-bangladesh",
    category: "SPECIALS",
    image: "https://api.dpremiumhomes.com/assets/blogs/blog1.webp",
    date: "2025-10-19",
  },
  {
    id: 6,
    title: "Luxury Living: Why Natural Light Defines Modern Architecture",
    slug: "luxury-apartments-in-bangladesh",
    category: "SPECIALS",
    image: "https://api.dpremiumhomes.com/assets/Property/crpProp1.png",
    date: "2025-10-19",
  },
  {
    id: 7,
    title: "Top 10 Architectural Milestones in Contemporary Development",
    slug: "top-10-real-estate-companies-in-bangladesh",
    category: "SPECIALS",
    image: "https://api.dpremiumhomes.com/assets/Property/mrProp1.png",
    date: "2025-10-19",
  },
  {
    id: 8,
    title: "Prime Gated Communities: Capital Growth & Enduring Value",
    slug: "top-real-estate-companies-in-dhaka-2026",
    category: "SPECIALS",
    image: "https://api.dpremiumhomes.com/assets/Property/mrProp2.png",
    date: "2025-10-19",
  },
  {
    id: 9,
    title: "Sustainable Residences: Where Elegance Meets Efficiency",
    slug: "best-real-estate-companies-in-dhaka-2026",
    category: "SPECIALS",
    image: "https://api.dpremiumhomes.com/assets/Property/premiumLakeview1.png",
    date: "2025-10-19",
  },
  {
    id: 10,
    title: "Luxury vs Affordable Apartments in Dhaka: An Expert Comparison",
    slug: "luxury-vs-affordable-apartments-in-dhaka",
    category: "SPECIALS",
    image: "https://api.dpremiumhomes.com/assets/Property/crpProp3.png",
    date: "2025-10-19",
  },
];

function sanitizeImageUrl(url?: string | null): string {
  if (!url || typeof url !== "string") return "/image/studio6.png";
  if (url.startsWith("http://api.dpremiumhomes.com")) {
    return url.replace(
      "http://api.dpremiumhomes.com",
      "https://api.dpremiumhomes.com",
    );
  }
  return url;
}

function cleanBlogTitle(title: string): string {
  if (!title) return "";
  return title
    .replace(/\s*\?["']\s*/g, " — ")
    .replace(/\s*\?"\s*/g, " — ")
    .replace(/[\uFFFD]/g, "")
    .trim();
}

export function LatestBlogs() {
  const [blogs, setBlogs] = useState<BlogItem[]>(FALLBACK_BLOGS);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.API_BASE_URL ||
      "https://api.dpremiumhomes.com/api/";
    const endpoint = `${baseUrl.replace(/\/+$/, "")}/blogs`;

    fetch(endpoint)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const rawList = Array.isArray(data)
          ? data
          : data?.blogs || data?.data || [];

        if (Array.isArray(rawList) && rawList.length > 0) {
          // Take 10 blogs as requested
          const sliced = rawList.slice(0, 10).map((b, idx) => ({
            ...b,
            category:
              b.category && b.category.trim() !== "" ? b.category : "SPECIALS",
            image:
              sanitizeImageUrl(b.image) ||
              FALLBACK_BLOGS[idx % FALLBACK_BLOGS.length].image,
          }));
          setBlogs(sliced);
        }
      })
      .catch((err) => {
        console.warn(
          "Failed to fetch blogs from API, using fallback data:",
          err,
        );
      });
  }, []);

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    updateScrollButtons();
    window.addEventListener("resize", updateScrollButtons);
    return () => window.removeEventListener("resize", updateScrollButtons);
  }, [blogs]);

  const scrollNext = () => {
    if (scrollRef.current) {
      const card = scrollRef.current.firstElementChild as HTMLElement;
      const cardWidth = card ? card.offsetWidth + 28 : 400;
      scrollRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
    }
  };

  const scrollPrev = () => {
    if (scrollRef.current) {
      const card = scrollRef.current.firstElementChild as HTMLElement;
      const cardWidth = card ? card.offsetWidth + 28 : 400;
      scrollRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" });
    }
  };

  return (
    <section
      id="blogs"
      aria-label="Latest From Premium Homes"
      className="w-full bg-[#ffffff] py-14 sm:py-18 md:py-20 lg:py-24 selection:bg-[#d0a65b]/20 overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        {/* Header: Title on Left, Controls on Right */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 sm:gap-6 mb-8 sm:mb-12 md:mb-14">
          <div>
            <span className="text-[#C49C57] font-semibold text-[11px] sm:text-xs md:text-sm tracking-[0.25em] uppercase block mb-2 sm:mb-2.5">
              BLOGS
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-normal text-[#044133] leading-[1.08] tracking-tight">
              Latest From
              <br />
              Premium Homes
            </h2>
          </div>

          {/* Navigation Controls: Left Arrow, Right Arrow, Browse All */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 self-start sm:self-end">
            <button
              type="button"
              onClick={scrollPrev}
              disabled={!canScrollLeft}
              aria-label="Previous blog articles"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#044133]/40 flex items-center justify-center text-[#044133] hover:border-[#044133] hover:bg-[#044133]/5 active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              disabled={!canScrollRight}
              aria-label="Next blog articles"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#044133] flex items-center justify-center text-[#fdfdf8] hover:bg-[#055b4b] active:scale-95 transition-all shadow-xs disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
            </button>
            <Link
              href="/blogs"
              className="px-5 sm:px-7 py-2.5 sm:py-3 rounded-full bg-[#044133] hover:bg-[#055b4b] text-[#fdfdf8] text-[11px] sm:text-xs font-semibold tracking-[0.16em] uppercase transition-all shadow-xs active:scale-95 cursor-pointer whitespace-nowrap inline-flex items-center justify-center"
            >
              BROWSE ALL
            </Link>
          </div>
        </div>

        {/* Blog Cards Carousel with Alternating Image Heights */}
        <div
          ref={scrollRef}
          onScroll={updateScrollButtons}
          className="flex items-start gap-5 sm:gap-6 md:gap-7 lg:gap-8 overflow-x-auto scroll-smooth pb-8 pt-1 -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8 lg:-mx-10 lg:px-10 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {blogs.slice(0, 10).map((blog, index) => {
            // Alternating heights: even index has less height, odd index has more height
            const isTaller = index % 2 === 1;
            const category =
              blog.category && blog.category.trim() !== ""
                ? blog.category
                : "SPECIALS";
            const imageUrl = sanitizeImageUrl(blog.image);
            const blogLink = blog.slug ? `/blogs/${blog.slug}` : "/blogs";

            return (
              <article
                key={blog.id || index}
                className="group w-[280px] sm:w-[330px] md:w-[370px] lg:w-[395px] shrink-0 flex flex-col select-none cursor-pointer"
              >
                <Link href={blogLink} className="flex flex-col">
                  {/* Image Container with alternating heights */}
                  <div
                    className={cn(
                      "relative w-full overflow-hidden bg-[#F4F1EB] transition-all duration-300",
                      isTaller
                        ? "h-[320px] sm:h-[380px] md:h-[410px] lg:h-[430px]"
                        : "h-[200px] sm:h-[240px] md:h-[260px] lg:h-[275px]",
                    )}
                  >
                    <Image
                      src={imageUrl}
                      alt={blog.title || "Blog post image"}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 80vw, 400px"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>

                  {/* Text Content below Image */}
                  <div className="mt-3.5 sm:mt-4 md:mt-5 flex flex-col">
                    <span className="text-[#C49C57] font-semibold text-[10px] sm:text-[11px] tracking-[0.2em] uppercase mb-1 sm:mb-1.5 block">
                      {category}
                    </span>
                    <h3 className="font-heading text-lg sm:text-xl md:text-[22px] lg:text-[24px] font-normal text-[#083A30] leading-[1.22] tracking-tight group-hover:text-[#044133] transition-colors line-clamp-2">
                      {cleanBlogTitle(blog.title)}
                    </h3>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
