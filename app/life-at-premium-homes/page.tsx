import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LifeAtTphlHero } from "@/components/section/life_at_tphl/life_at_tphl_hero";
import { LifeAtTphlVideo } from "@/components/section/life_at_tphl/life_at_tphl_video";
import { LifeAtTphlPurpose } from "@/components/section/life_at_tphl/life_at_tphl_purpose";
import { LifeAtTphlBanner } from "@/components/section/life_at_tphl/life_at_tphl_banner";
import { LifeAtTphlCulture } from "@/components/section/life_at_tphl/life_at_tphl_culture";
import { LifeAtTphlJourney } from "@/components/section/life_at_tphl/life_at_tphl_journey";
import { LifeAtTphlStories } from "@/components/section/life_at_tphl/life_at_tphl_stories";
import { LifeAtTphlTeamSays } from "@/components/section/life_at_tphl/life_at_tphl_team_says";
import { LifeAtTphlJoinTeam } from "@/components/section/life_at_tphl/life_at_tphl_join_team";

export const metadata: Metadata = {
  title: "Life At TPHL | Premium Homes",
  description:
    "A culture built around people, stories, ambition, and the human side of building homes. Discover Life At TPHL.",
};

/** Sections in Figma "Life at TPH" order. */
export default function LifeAtPremiumHomesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      {/* The page rides above the footer and slides open to reveal it. */}
      <main className="relative z-10 flex-1 bg-white text-sage">
        <LifeAtTphlHero />
        <LifeAtTphlVideo />
        <LifeAtTphlPurpose />
        <LifeAtTphlBanner />
        <LifeAtTphlCulture />
        <LifeAtTphlStories />
        <LifeAtTphlTeamSays />
        <LifeAtTphlJourney />
        <LifeAtTphlJoinTeam />
      </main>
      <Footer reveal />
    </div>
  );
}
