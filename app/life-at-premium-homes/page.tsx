import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LifeAtTphlHero } from "@/components/section/life_at_tphl/life_at_tphl_hero";
import { LifeAtTphlVideo } from "@/components/section/life_at_tphl/life_at_tphl_video";
import { LifeAtTphlPurpose } from "@/components/section/life_at_tphl/life_at_tphl_purpose";
import { LifeAtTphlCulture } from "@/components/section/life_at_tphl/life_at_tphl_culture";
import { LifeAtTphlStories } from "@/components/section/life_at_tphl/life_at_tphl_stories";
import { LifeAtTphlJoinTeam } from "@/components/section/life_at_tphl/life_at_tphl_join_team";

export const metadata: Metadata = {
  title: "Life At TPHL | Premium Homes",
  description:
    "A culture built around people, stories, ambition, and the human side of building homes. Discover Life At TPHL.",
};

export default function LifeAtPremiumHomesPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-white text-[#1f2723]">
      <Navbar />
      <main className="flex-1">
        <LifeAtTphlHero />
        <LifeAtTphlVideo />
        <LifeAtTphlPurpose />
        <LifeAtTphlCulture />
        <LifeAtTphlStories />
        <LifeAtTphlJoinTeam />
      </main>
      <Footer />
    </div>
  );
}
