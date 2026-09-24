"use client";

import React, { useEffect, useRef, useState } from "react";
import { Play, ArrowLeft, ArrowRight, X } from "lucide-react";

export interface ReviewItem {
  id: number;
  name: string | null;
  role: string | null;
  rating?: number;
  videoUrl: string;
  review?: string | null;
  date?: string | null;
  project?: string | null;
  created_at?: string;
  updated_at?: string;
  image?: string | null;
  deleted_at?: string | null;
}

const FALLBACK_REVIEWS: ReviewItem[] = [
  {
    id: 1,
    name: "Rj Kibria",
    role: "Business Owner",
    rating: 5,
    videoUrl: "https://www.youtube.com/embed/qM5_UKR-vzk",
    review:
      "The professionalism and transparency throughout the entire process was impressive. Premium Homes truly lives up to its name.",
    project: "The Premium Floral Haven",
  },
  {
    id: 2,
    name: "Md. Chowdhury",
    role: "Property Investor",
    rating: 5,
    videoUrl: "https://www.youtube.com/embed/k0a-Wvr-S10?si=O6-56ynjC2P06twC",
    review:
      "The Premium Homes exceeded all our expectations. The quality of construction and attention to detail is remarkable. Our family couldn't be happier!",
    project: "The Premium Green Valley",
  },
  {
    id: 7,
    name: "Valued Investor",
    role: "Investor",
    rating: 5,
    videoUrl: "https://www.youtube.com/embed/RHyHMzDHZQw",
    review: "একটি ভালো বিনিয়োগের পেছনে থাকে আস্থা এবং দীর্ঘমেয়াদি প্রত্যাশা।",
    project: "The Premium Residences",
  },
  {
    id: 8,
    name: "Valued Homeowner",
    role: "Flat Owner",
    rating: 5,
    videoUrl: "https://www.youtube.com/embed/DFMRRC9Ca0M",
    review:
      "আলহামদুলিল্লাহ! The Premium Azure Residence-এর জমি রেজিস্ট্রেশন সম্পন্ন",
    project: "The Premium Azure Residence",
  },
];

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:embed\/|v=|youtu\.be\/|\/v\/)([^?&"/]+)/);
  return match ? match[1] : null;
}

function buildAutoplayEmbedUrl(url: string): string {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}autoplay=1&rel=0&playsinline=1&modestbranding=1`;
}

function getReviewInfo(review: ReviewItem) {
  const hasName =
    review.name && review.name.trim() !== "" && review.name.trim() !== "-";

  const title = hasName
    ? review.name!.trim()
    : review.project
      ? review.project
      : review.role || "Valued Resident";

  const subtitle = hasName
    ? review.project
      ? `${review.role || "Resident"} • ${review.project}`
      : review.role || "Homeowner"
    : review.review ||
      (review.role ? `${review.role}, The Premium Homes` : "Resident");

  return { title, subtitle };
}

export function ResidentReviews() {
  const [reviews, setReviews] = useState<ReviewItem[]>(FALLBACK_REVIEWS);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.API_BASE_URL || "http://localhost:3000/api";
    const endpoint = `${baseUrl.replace(/\/+$/, "")}/reviews`;

    fetch(endpoint)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (
          data?.reviews &&
          Array.isArray(data.reviews) &&
          data.reviews.length > 0
        ) {
          setReviews(data.reviews);
        }
      })
      .catch((err) => {
        console.warn(
          "Failed to load reviews from API, using fallback data:",
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
  }, [reviews]);

  const scrollNext = () => {
    if (scrollRef.current) {
      const card = scrollRef.current.firstElementChild as HTMLElement;
      const cardWidth = card ? card.offsetWidth + 24 : 360;
      scrollRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
    }
  };

  const scrollPrev = () => {
    if (scrollRef.current) {
      const card = scrollRef.current.firstElementChild as HTMLElement;
      const cardWidth = card ? card.offsetWidth + 24 : 360;
      scrollRef.current.scrollBy({ left: -cardWidth, behavior: "smooth" });
    }
  };

  return (
    <section
      id="testimonials"
      aria-label="What Our Residents And Partners Say"
      className="w-full bg-[#ffffff] py-12 sm:py-16 md:py-20 lg:py-24 selection:bg-[#d0a65b]/20 overflow-hidden"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        {/* Header with Title and Carousel Controls */}
        <div className="flex flex-row items-end justify-between gap-4 mb-8 sm:mb-12 md:mb-14">
          <div>
            <span className="text-[#d0a65b] font-medium text-[11px] sm:text-xs md:text-sm tracking-[0.2em] uppercase block mb-1.5 sm:mb-2.5">
              TESTIMONIALS
            </span>
            <h2 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-[54px] font-normal text-[#044133] leading-[1.14] tracking-tight">
              What Our Residents
              <br />
              And Partners Say
            </h2>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 mb-1">
            <button
              type="button"
              onClick={scrollPrev}
              disabled={!canScrollLeft}
              aria-label="Previous testimonials"
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-full border border-[#044133]/50 flex items-center justify-center text-[#044133] hover:border-[#044133] hover:bg-[#044133]/5 active:scale-95 transition-all disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              disabled={!canScrollRight}
              aria-label="Next testimonials"
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#044133] flex items-center justify-center text-[#fdfdf8] hover:bg-[#055b4b] active:scale-95 transition-all shadow-sm disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
            >
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Carousel Slider */}
        <div
          ref={scrollRef}
          onScroll={updateScrollButtons}
          className="flex gap-4 sm:gap-6 md:gap-7 overflow-x-auto scroll-smooth pb-6 pt-1 -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8 lg:-mx-10 lg:px-10 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {reviews.map((review) => {
            const isPlaying = playingId === review.id;
            const videoId = extractYouTubeId(review.videoUrl);
            const thumbnailUrl = videoId
              ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
              : "/image/studio6.png";
            const { title, subtitle } = getReviewInfo(review);

            return (
              <div
                key={review.id}
                onClick={() => {
                  if (!isPlaying) setPlayingId(review.id);
                }}
                className="relative w-[280px] sm:w-[330px] md:w-[360px] lg:w-[380px] aspect-[9/13.5] shrink-0 rounded-[24px] sm:rounded-[30px] md:rounded-[34px] overflow-hidden shadow-md hover:shadow-xl bg-[#041713] group select-none transition-all duration-300 cursor-pointer"
              >
                {isPlaying ? (
                  <div className="relative w-full h-full bg-black">
                    <iframe
                      src={buildAutoplayEmbedUrl(review.videoUrl)}
                      title={title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPlayingId(null);
                      }}
                      aria-label="Close video"
                      className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Video Thumbnail */}
                    <img
                      src={thumbnailUrl}
                      alt={title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    />

                    {/* Central Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-[#fdfdf8]/90 text-[#044133] shadow-xl flex items-center justify-center backdrop-blur-xs group-hover:scale-110 active:scale-95 transition-all duration-300">
                        <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-[#044133] text-[#044133] ml-0.5" />
                      </div>
                    </div>

                    {/* Bottom Dark Gradient Fade */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none" />

                    {/* Bottom Resident Information */}
                    <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 md:p-7 text-left pointer-events-none">
                      <h3 className="font-heading text-lg sm:text-xl md:text-2xl font-normal text-white leading-tight mb-1">
                        {title}
                      </h3>
                      <p className="font-sans text-xs sm:text-sm text-[#fdfdf8]/85 font-light line-clamp-2">
                        {subtitle}
                      </p>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
