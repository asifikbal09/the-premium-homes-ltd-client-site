import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CareerHero } from "@/components/section/career/career_hero";
import { CareerBenefits } from "@/components/section/career/career_benefits";
import { CareerOpportunities } from "@/components/section/career/career_opportunities";
import { CareerCulture } from "@/components/section/career/career_culture";
import { CareerLife } from "@/components/section/career/career_life";
import { HomeTestimonials } from "@/components/section/home/home_testimonials";
import { HomeCta } from "@/components/section/home/home_cta";

export const metadata: Metadata = {
  title: "Career | Build Your Future With Premium Homes",
  description:
    "Join a fast-growing real estate group shaping tomorrow's communities across the region. Explore current career opportunities with Premium Homes.",
};

/** Sections in Figma "Career" order. */
export default function CareerPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      {/* The page rides above the footer and slides open to reveal it. */}
      <main className="relative z-10 flex-1 bg-white text-sage">
        <CareerHero />
        <CareerBenefits />
        <CareerOpportunities />
        <CareerCulture />
        <CareerLife />
        <HomeTestimonials />
        <HomeCta />
      </main>
      <Footer reveal />
    </div>
  );
}
