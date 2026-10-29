"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { EmptyState } from "@/components/ui/empty_state";
import { FilterChips } from "@/components/ui/filter_chips";
import { Appear } from "@/components/ui/motion";
import { GreenPill } from "@/components/ui/primitives";
import { SearchField } from "@/components/ui/search_field";
import type { BlogSummary } from "@/lib/blogs";
import { useDebounced } from "@/lib/use-debounced";
import { BlogCard } from "./blog_card";

const TABS = ["All", "News", "Event"];
const PAGE_SIZE = 9;

/** "Event" holds posts whose category mentions an event; "News" holds every other post. */
function inTab(post: BlogSummary, tab: string) {
  if (tab === "All") return true;
  return /event/i.test(post.category) === (tab === "Event");
}

/** Figma Blog body: category chips and a search over a 3-column grid of posts, nine at a time. */
export function BlogsGrid({ posts }: { posts: BlogSummary[] }) {
  const [tab, setTab] = useState("All");
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounced(query.trim().toLowerCase());
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // A new filter starts again from the first page (adjusted during render, as React recommends).
  const filterKey = `${tab}|${debouncedQuery}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (prevFilterKey !== filterKey) {
    setPrevFilterKey(filterKey);
    setVisibleCount(PAGE_SIZE);
  }

  const filtered = useMemo(
    () =>
      posts.filter(
        (p) =>
          inTab(p, tab) &&
          (!debouncedQuery || [p.title, p.excerpt].some((f) => f.toLowerCase().includes(debouncedQuery))),
      ),
    [posts, tab, debouncedQuery],
  );
  const shown = filtered.slice(0, visibleCount);

  const clearFilters = () => {
    setTab("All");
    setQuery("");
  };

  return (
    <section aria-label="Blog posts" className="bg-white py-[clamp(48px,5vw,80px)]">
      <div className="shell">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <FilterChips options={TABS} value={tab} onChange={setTab} tall />
          <Appear preset="lift" delay={0.55} className="relative">
            <SearchField value={query} onChange={setQuery} placeholder="Search blogs" className="sm:w-[340px]" />
          </Appear>
        </div>

        {shown.length > 0 ? (
          <motion.div layout className="mt-10 grid grid-cols-1 gap-x-5 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {shown.map((p, i) => (
                <BlogCard key={p.id} post={p} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <EmptyState
            title="No posts found"
            copy={
              posts.length > 0
                ? "No posts match these filters. Try another category or search."
                : "New stories are on the way. Check back soon."
            }
            onClear={posts.length > 0 ? clearFilters : undefined}
            className="mt-10"
          />
        )}

        {visibleCount < filtered.length && (
          // Block wrapper so the reveal sentinel sits at the button's own slot.
          <div className="relative mt-12 flex justify-center">
            <Appear preset="lift">
              <GreenPill onClick={() => setVisibleCount((n) => n + PAGE_SIZE)} size="lg" arrow className="sm:px-10">
                Read more
              </GreenPill>
            </Appear>
          </div>
        )}
      </div>
    </section>
  );
}
