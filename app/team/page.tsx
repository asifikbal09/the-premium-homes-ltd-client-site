import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { TeamHero } from "@/components/section/team/team_hero";
import { BoardOfLeadership } from "@/components/section/team/board_of_leadership";
import { PropertyPredictionSection } from "@/components/section/team/property_prediction_section";

export const metadata: Metadata = {
  title: "Meet The Team & Board Of Leadership | Premium Homes",
  description:
    "The people behind every Premium Home. Dedicated professionals and visionary leadership committed to delivering excellence across every development.",
};

export default function TeamPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#ffffff] text-[#1f2723]">
      <Navbar />
      <main className="flex-1">
        <TeamHero />
        <BoardOfLeadership />
        <PropertyPredictionSection />
      </main>
      <Footer />
    </div>
  );
}
