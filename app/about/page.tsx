import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AboutHero } from "@/components/section/about/about_hero";
import { AboutProvenTrust } from "@/components/section/about/about_proven_trust";
import { AboutFamilySlider } from "@/components/section/about/about_family_slider";
import { AboutPrinciplesDna } from "@/components/section/about/about_principles_dna";
import { AboutMissionVision } from "@/components/section/about/about_mission_vision";
import { AboutPromiseCards } from "@/components/section/about/about_promise_cards";
import { AboutBuildingJourney } from "@/components/section/about/about_building_journey";
import { AboutMilestones } from "@/components/section/about/about_milestones";
import { AboutFounderTrust } from "@/components/section/about/about_founder_trust";
import { AboutPartners } from "@/components/section/about/about_partners";
import { AboutCareerCta } from "@/components/section/about/about_career_cta";
import { LifeAtTphlStories } from "@/components/section/life_at_tphl/life_at_tphl_stories";
import { HomeTestimonials } from "@/components/section/home/home_testimonials";

export const metadata: Metadata = {
  title: "About Us | The Story Of A Dream | Premium Homes",
  description:
    "TPHL is shaping accessible premium living in Bangladesh through honest communication, structured buying journeys, and homes designed around real families.",
};

/** Sections in Figma "About page" order. */
export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      {/* The page rides above the footer and slides open to reveal it. */}
      <main className="relative z-10 flex-1 bg-white text-sage">
        <AboutHero />
        <AboutProvenTrust />
        <AboutFamilySlider />
        <AboutPrinciplesDna />
        <AboutMissionVision />
        <AboutPromiseCards />
        <AboutBuildingJourney />
        <AboutMilestones />
        <AboutFounderTrust />
        <LifeAtTphlStories
          title="Explore life at the premium home"
          cta={{ label: "Visit life at TPH", href: "/life-at-premium-homes" }}
        />
        <AboutPartners />
        <HomeTestimonials />
        <AboutCareerCta />
      </main>
      <Footer reveal />
    </div>
  );
}
