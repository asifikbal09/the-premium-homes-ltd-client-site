import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AboutHero } from "@/components/section/about/about_hero";
import { AboutProvenTrust } from "@/components/section/about/about_proven_trust";
import { AboutFamilySlider } from "@/components/section/about/about_family_slider";
import { AboutPrinciplesDna } from "@/components/section/about/about_principles_dna";
import { AboutBuildingJourney } from "@/components/section/about/about_building_journey";

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

        {/* Designed for families. Scaled for tomorrow. (Third Section - Stacked Slider) */}
        <AboutFamilySlider />

        {/* Additional sections can be added here */}
        <AboutPrinciplesDna/>

        <AboutBuildingJourney/>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

