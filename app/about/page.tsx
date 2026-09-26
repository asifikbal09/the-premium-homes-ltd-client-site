import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AboutHero } from "@/components/section/about/about_hero";
import { AboutProvenTrust } from "@/components/section/about/about_proven_trust";
import { PhilosophyPillars } from "@/components/section/home/philosophy_pillars";
import { FounderMessage } from "@/components/section/home/founder_message";
import { ResidentReviews } from "@/components/section/home/resident_reviews";
import { PropertyPredictionSection } from "@/components/section/team/property_prediction_section";

export const metadata: Metadata = {
  title: "About Us | The Story Of A Dream | Premium Homes",
  description:
    "TPHL is shaping accessible premium living in Bangladesh through honest communication, structured buying journeys, and homes designed around real families.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#ffffff] text-[#1f2723]">
      {/* Sticky Top Navbar on Scroll */}
      <Navbar />

      <main className="flex-1">
        {/* Animated Visual Hero with 5-image showcase */}
        <AboutHero />

        {/* Built On Trust, Proven By Delivery (Second Section) */}
        <AboutProvenTrust />

      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

