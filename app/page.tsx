import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HomeHero } from "@/components/section/home/home_hero";
import { PhilosophyPillars } from "@/components/section/home/philosophy_pillars";
import { HomeAbout } from "@/components/section/home/home_about";
import { FounderMessage } from "@/components/section/home/founder_message";
import { FeaturedProjects } from "@/components/section/home/featured_projects";
import { SignatureDevelopments } from "@/components/section/home/signature_developments";
import { ArtOfLivingVideo } from "@/components/section/home/art_of_living_video";
import { CommunityGallery } from "@/components/section/home/community_gallery";
import { MobileAppSection } from "@/components/section/home/mobile_app_section";
import { PropertyPredictionSection } from "@/components/section/team/property_prediction_section";
import { ResidentReviews } from "@/components/section/home/resident_reviews";
import { LatestBlogs } from "@/components/section/home/latest_blogs";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#ffffff] text-[#1f2723]">
      <Navbar />
      <main className="flex-1">
        <HomeHero />
        <PhilosophyPillars />
        <HomeAbout />
        <FeaturedProjects />
        <SignatureDevelopments />
        <ArtOfLivingVideo />
        <CommunityGallery />
        <FounderMessage />
        <ResidentReviews />
        <MobileAppSection />
        <LatestBlogs />
        <PropertyPredictionSection />
      </main>
      <Footer />
    </div>
  );
}
