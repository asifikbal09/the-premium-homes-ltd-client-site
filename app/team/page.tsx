import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { TeamHero } from "@/components/section/team/team_hero";
import { BoardOfLeadership } from "@/components/section/team/board_of_leadership";
import { HomeCta } from "@/components/section/home/home_cta";

export const metadata: Metadata = {
  title: "Meet The Team & Board Of Leadership | Premium Homes",
  description:
    "The people behind every Premium Home. Dedicated professionals and visionary leadership committed to delivering excellence across every development.",
};

/** Sections in Figma "Team" order. */
export default function TeamPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      {/* The page rides above the footer and slides open to reveal it. */}
      <main className="relative z-10 flex-1 bg-white text-sage">
        <TeamHero />
        <BoardOfLeadership />
        <HomeCta />
      </main>
      <Footer reveal />
    </div>
  );
}
