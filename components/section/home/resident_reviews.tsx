"use client";

import React, { useEffect, useRef, useState } from "react";
import { Play, ArrowLeft, ArrowRight, X } from "lucide-react";
import Image from "next/image";

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
  const match = url.match(/(?:embed\/|v=|youtu\.be\/|\/v\/|shorts\/)([^?&"/]+)/);
  return match ? match[1] : null;
}

function buildAutoplayEmbedUrl(url: string): string {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}autoplay=1&rel=0&playsinline=1&modestbranding=1`;
}

function getThumbnailUrl(review: ReviewItem): string {
  if (review.image && review.image.trim() !== "") {
    return review.image;
  }
  const videoId = extractYouTubeId(review.videoUrl);
  if (!videoId) return "/image/studio6.png";
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

function getReviewInfo(review: ReviewItem) {
  const trimmedName = review.name?.trim();
  const hasValidName = Boolean(
    trimmedName && trimmedName !== "" && trimmedName !== "-" && trimmedName.toLowerCase() !== "null",
  );

  const title = hasValidName
    ? trimmedName!
    : review.role
      ? `Valued ${review.role}`
      : "Valued Resident";

  const roleText = hasValidName ? review.role : null;
  const projectText = review.project || "The Premium Homes";

  const subtitle = [roleText, projectText].filter(Boolean).join(" • ");

  return { title, subtitle };
}

export function ResidentReviews() {
  const [reviews, setReviews] = useState<ReviewItem[]>(FALLBACK_REVIEWS);
  const [activeModalReview, setActiveModalReview] = useState<ReviewItem | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.API_BASE_URL ||
      "http://localhost:3000/api";
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

  // Lock body scroll and listen for Escape key when video modal is open
  useEffect(() => {
    if (!activeModalReview) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveModalReview(null);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeModalReview]);

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
          className="flex gap-4 sm:gap-6 md:gap-7 overflow-x-auto scroll-smooth pb-6 pt-1 -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8 lg:-mx-10 lg:px-10 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {reviews.map((review) => {
            const videoId = extractYouTubeId(review.videoUrl);
            const thumbnailUrl = getThumbnailUrl(review);
            const { title, subtitle } = getReviewInfo(review);

            return (
              <div
                key={review.id}
                onClick={() => setActiveModalReview(review)}
                className="relative w-[280px] sm:w-[330px] md:w-[360px] lg:w-[380px] aspect-[9/13.5] shrink-0 snap-start rounded-[24px] sm:rounded-[30px] md:rounded-[34px] overflow-hidden shadow-md hover:shadow-2xl bg-[#041713] group select-none transition-all duration-500 cursor-pointer border border-white/5 hover:border-[#d0a65b]/30"
              >
                {/* Video Thumbnail */}
                <Image
                  src={thumbnailUrl}
                  alt={title}
                  fill
                  sizes="(max-width: 640px) 280px, (max-width: 768px) 330px, (max-width: 1024px) 360px, 380px"
                  priority
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (videoId && !target.src.includes("hqdefault.jpg")) {
                      target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                    }
                  }}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Top Project Badge */}
                <div className="absolute top-4 sm:top-5 left-4 sm:left-5 z-10 pointer-events-none">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-medium tracking-wide uppercase bg-black/45 backdrop-blur-md text-[#d0a65b] border border-[#d0a65b]/25 shadow-sm">
                    {review.project || "Resident Story"}
                  </span>
                </div>

                {/* Top Vignette Overlay (for contrast on bright thumbnails) */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent pointer-events-none" />

                {/* Bottom Dark Gradient Fade (Layered UNDER play button and text) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-transparent pointer-events-none" />

                {/* Central Luxury Glassmorphic Play Button */}
                <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                  <div className="w-13 h-13 sm:w-15 sm:h-15 md:w-16 md:h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/40 text-white shadow-2xl flex items-center justify-center group-hover:scale-110 group-hover:bg-[#d0a65b] group-hover:border-[#d0a65b] group-hover:text-[#044133] active:scale-95 transition-all duration-300">
                    <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current ml-0.5 transition-colors" />
                  </div>
                </div>

                {/* Bottom Resident Information */}
                <div className="absolute bottom-0 inset-x-0 z-10 p-5 sm:p-6 md:p-7 text-left pointer-events-none">
                  <h3 className="font-heading text-lg sm:text-xl md:text-2xl font-normal text-white leading-tight mb-1 group-hover:text-[#d0a65b] transition-colors duration-300">
                    {title}
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-[#fdfdf8]/85 font-light">
                    {subtitle}
                  </p>
                  {review.review && (
                    <p className="mt-2 text-[11px] sm:text-xs text-[#d0a65b]/90 font-light italic line-clamp-2 leading-relaxed">
                      “{review.review}”
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Responsive Video Lightbox Modal */}
      {activeModalReview && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Video Player Modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/85 backdrop-blur-md transition-all duration-300"
          onClick={() => setActiveModalReview(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-[#041713] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 16:9 Video Frame */}
            <div className="relative w-full aspect-video bg-black">
              <iframe
                src={buildAutoplayEmbedUrl(activeModalReview.videoUrl)}
                title={getReviewInfo(activeModalReview).title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActiveModalReview(null)}
                aria-label="Close video modal"
                className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-all cursor-pointer border border-white/20 shadow-md hover:scale-105 active:scale-95"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Details Bar */}
            <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#041713] text-left">
              <div>
                <span className="text-[#d0a65b] font-medium text-[11px] sm:text-xs tracking-[0.15em] uppercase block mb-1">
                  {activeModalReview.project || "The Premium Homes"}
                </span>
                <h3 className="font-heading text-lg sm:text-xl md:text-2xl text-white font-normal leading-tight">
                  {getReviewInfo(activeModalReview).title}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#fdfdf8]/75 mt-0.5">
                  {getReviewInfo(activeModalReview).subtitle}
                </p>
              </div>
              {activeModalReview.review && (
                <p className="sm:max-w-md text-xs sm:text-sm text-[#d0a65b]/90 italic font-light line-clamp-2">
                  “{activeModalReview.review}”
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
