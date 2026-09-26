"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BlogItem {
  id: number | string;
  title: string;
  slug?: string;
  category?: string | null;
  author?: string;
  date?: string;
  created_at?: string;
  image?: string;
  readTime?: string;
  excerpt?: string;
}

const FALLBACK_BLOGS: BlogItem[] = [
  {
    id: 1,
    title: "Building Better Communities: The Future Of Modern Living",
    slug: "top-real-estate-company-in-bangladesh",
    category: "NEWS",
    date: "2026-03-12",
    image: "https://api.dpremiumhomes.com/assets/blogs/blogs7.jpeg",
  },
  {
    id: 2,
    title: "Designing Spaces That Bring People Closer Together",
    slug: "best-real-estate-company-in-bangladesh",
    category: "NEWS",
    date: "2026-03-12",
    image: "https://api.dpremiumhomes.com/assets/blogs/blog6.jpg",
  },
  {
    id: 3,
    title: "What Makes A Home Truly Premium?",
    slug: "top-property-developer-in-dhaka",
    category: "NEWS",
    date: "2026-03-12",
    image: "https://api.dpremiumhomes.com/assets/Banner-images/bannerOne.png",
  },
  {
    id: 4,
    title: "The Future Of Urban Living In Dhaka",
    slug: "flat-for-sale-in-dhaka",
    category: "NEWS",
    date: "2026-03-12",
    image: "https://api.dpremiumhomes.com/assets/Property/std203.png",
  },
  {
    id: 5,
    title: "Architecture That Shapes The Way We Live",
    slug: "trusted-real-estate-company-in-bangladesh",
    category: "NEWS",
    date: "2026-03-13",
    image: "https://api.dpremiumhomes.com/assets/blogs/blog1.webp",
  },
  {
    id: 6,
    title: "Creating Homes Designed For Life, Not Just Living",
    slug: "luxury-apartments-in-bangladesh",
    category: "NEWS",
    date: "2026-03-12",
    image: "https://api.dpremiumhomes.com/assets/Property/crpProp1.png",
  },
  {
    id: 7,
    title: "Inside Premium Homes: Our Approach To Better Communities",
    slug: "top-10-real-estate-companies-in-bangladesh",
    category: "NEWS",
    date: "2026-03-12",
    image: "https://api.dpremiumhomes.com/assets/Property/mrProp1.png",
  },
  {
    id: 8,
    title: "Why Community Matters In Modern Real Estate",
    slug: "top-real-estate-companies-in-dhaka-2026",
    category: "NEWS",
    date: "2026-03-12",
    image: "https://api.dpremiumhomes.com/assets/Property/mrProp2.png",
  },
  {
    id: 9,
    title: "The Evolution Of Contemporary Living In Bangladesh",
    slug: "best-real-estate-companies-in-dhaka-2026",
    category: "NEWS",
    date: "2026-03-12",
    image: "https://api.dpremiumhomes.com/assets/Property/premiumLakeview1.png",
  },
];

function sanitizeImageUrl(url?: string | null): string {
  if (!url || typeof url !== "string") {
    return "https://api.dpremiumhomes.com/assets/blogs/blogs7.jpeg";
  }
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
    .replace(/â€“|—|–/g, "—")
    .replace(/\s*\?["']\s*/g, " — ")
    .replace(/\s*\?"\s*/g, " — ")
    .replace(/[\uFFFD]/g, "")
    .trim();
}

function formatBlogDate(dateStr?: string | null, createdAt?: string | null): string {
  const raw = dateStr || createdAt;
  if (!raw) return "MAR 12, 2026";
  try {
    const d = new Date(raw);
    if (isNaN(d.getTime())) return "MAR 12, 2026";
    return d
      .toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
      .toUpperCase();
  } catch {
    return "MAR 12, 2026";
  }
}

type CategoryTab = "ALL" | "NEWS" | "EVENT";

export function BlogsGrid() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<CategoryTab>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(9);

  useEffect(() => {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.API_BASE_URL ||
      "https://api.dpremiumhomes.com/api";
    const endpoint = `${baseUrl.replace(/\/+$/, "")}/blogs`;

    fetch(endpoint)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const rawList: BlogItem[] = Array.isArray(data)
          ? data
          : data?.blogs || data?.data || [];

        if (Array.isArray(rawList) && rawList.length > 0) {
          const mapped = rawList.map((item, idx) => ({
            ...item,
            category:
              item.category && item.category.trim() !== ""
                ? item.category.toUpperCase()
                : "NEWS",
            image:
              sanitizeImageUrl(item.image) ||
              FALLBACK_BLOGS[idx % FALLBACK_BLOGS.length].image,
          }));
          setBlogs(mapped);
        } else {
          setBlogs(FALLBACK_BLOGS);
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch blogs from API, using fallback data:", err);
        setBlogs(FALLBACK_BLOGS);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      // Category filter
      if (activeTab === "NEWS") {
        if (blog.category && blog.category !== "NEWS") return false;
      } else if (activeTab === "EVENT") {
        if (!blog.category || !blog.category.includes("EVENT")) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const titleMatch = blog.title?.toLowerCase().includes(query);
        const excerptMatch = blog.excerpt?.toLowerCase().includes(query);
        return titleMatch || excerptMatch;
      }

      return true;
    });
  }, [blogs, activeTab, searchQuery]);

  const displayedBlogs = filteredBlogs.slice(0, visibleCount);
  const hasMore = visibleCount < filteredBlogs.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 9);
  };

  const tabs: CategoryTab[] = ["ALL", "NEWS", "EVENT"];

  return (
    <section aria-label="Blogs Content Section" className="w-full bg-white py-10 sm:py-14 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Control Bar: Category Tabs on Left, Search on Right */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-neutral-100 pb-6 sm:pb-8">
          {/* Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {tabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab);
                    setVisibleCount(9);
                  }}
                  className={cn(
                    "px-5 sm:px-6 py-2 rounded-full text-xs font-semibold tracking-[0.14em] uppercase transition-all duration-200 cursor-pointer whitespace-nowrap",
                    isActive
                      ? "bg-[#044133] text-white shadow-xs"
                      : "bg-transparent text-neutral-600 border border-neutral-300 hover:border-neutral-400 hover:text-black",
                  )}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72 md:w-80">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setVisibleCount(9);
              }}
              placeholder="SEARCH PROJECT"
              aria-label="Search blogs"
              className="w-full pl-10 pr-4 py-2 bg-transparent border border-neutral-300 rounded-full text-xs font-medium tracking-[0.12em] uppercase text-neutral-800 placeholder:text-neutral-400 placeholder:uppercase focus:outline-none focus:border-[#044133] focus:ring-1 focus:ring-[#044133] transition-all"
            />
          </div>
        </div>

        {/* Loading Skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mt-10">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="animate-pulse flex flex-col space-y-3">
                <div className="w-full aspect-[16/10] bg-neutral-200 rounded-lg" />
                <div className="h-3 w-1/3 bg-neutral-200 rounded" />
                <div className="h-5 w-4/5 bg-neutral-200 rounded" />
              </div>
            ))}
          </div>
        ) : displayedBlogs.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20">
            <p className="text-neutral-500 text-sm">No blogs found matching your criteria.</p>
            {(searchQuery || activeTab !== "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab("ALL");
                  setSearchQuery("");
                }}
                className="mt-4 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-[#044133] border border-[#044133] rounded-full hover:bg-[#044133] hover:text-white transition-all cursor-pointer"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          /* Blog Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mt-10">
            {displayedBlogs.map((blog) => {
              const category = blog.category || "NEWS";
              const formattedDate = formatBlogDate(blog.date, blog.created_at);
              const imageUrl = sanitizeImageUrl(blog.image);
              const blogLink = blog.slug ? `/blogs/${blog.slug}` : "/blogs";

              return (
                <article key={blog.id} className="group flex flex-col cursor-pointer">
                  <Link href={blogLink} className="flex flex-col">
                    {/* Image Container with rounded corners and hover effect */}
                    <div className="relative w-full aspect-[16/10] overflow-hidden rounded-lg bg-neutral-100">
                      <Image
                        src={imageUrl}
                        alt={blog.title || "Blog Post"}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    </div>

                    {/* Metadata: Category & Date */}
                    <div className="mt-4 flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.16em] uppercase text-neutral-500">
                      <span>{category}</span>
                      <span>•</span>
                      <span>{formattedDate}</span>
                    </div>

                    {/* Blog Title */}
                    <h2 className="font-heading text-xl sm:text-2xl font-normal text-[#1a2e26] group-hover:text-[#044133] leading-snug mt-2 line-clamp-2 transition-colors">
                      {cleanBlogTitle(blog.title)}
                    </h2>
                  </Link>
                </article>
              );
            })}
          </div>
        )}

        {/* Centered Read More Button */}
        {!loading && hasMore && (
          <div className="flex justify-center mt-12 sm:mt-16">
            <button
              type="button"
              onClick={handleLoadMore}
              className="px-8 sm:px-10 py-3 rounded-full bg-[#044133] hover:bg-[#055b4b] text-white text-xs font-semibold tracking-[0.16em] uppercase transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              READ MORE
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

