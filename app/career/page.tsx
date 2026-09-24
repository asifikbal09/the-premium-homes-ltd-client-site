import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CareerHero } from "@/components/section/career/career_hero";
import { CareerBenefits } from "@/components/section/career/career_benefits";
import { CareerCulture } from "@/components/section/career/career_culture";
import { CareerLife } from "@/components/section/career/career_life";
import { CareerOpportunities } from "@/components/section/career/career_opportunities";
import { ResidentReviews } from "@/components/section/home/resident_reviews";
import { PropertyPredictionSection } from "@/components/section/team/property_prediction_section";

export const metadata: Metadata = {
  title: "Career | Build Your Future With Premium Homes",
  description:
    "Join a fast-growing real estate group shaping tomorrow's communities across the region. Explore current career opportunities with Premium Homes.",
};

export default function CareerPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#ffffff] text-[#1f2723]">
      <Navbar />
      <main className="flex-1">
        <CareerHero />
        <CareerBenefits />
        <CareerCulture />
        <CareerOpportunities />
        <CareerLife />
        <ResidentReviews />
        <PropertyPredictionSection />
      </main>
      <Footer />
    </div>
  );
}
