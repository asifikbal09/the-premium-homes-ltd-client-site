import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HomeHero } from "@/components/section/home/home_hero";
import { PhilosophyPillars } from "@/components/section/home/philosophy_pillars";
import { HomeAbout } from "@/components/section/home/home_about";
import { FounderMessage } from "@/components/section/home/founder_message";
import { FeaturedProjects } from "@/components/section/home/featured_projects";
import { ArtOfLivingVideo } from "@/components/section/home/art_of_living_video";
import { CommunityGallery } from "@/components/section/home/community_gallery";
import { MobileAppSection } from "@/components/section/home/mobile_app_section";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#ffffff] text-[#1f2723]">
      <Navbar />
      <main className="flex-1">
        <HomeHero />
        <PhilosophyPillars />
        <HomeAbout />
        <FeaturedProjects />
        <ArtOfLivingVideo />
        <CommunityGallery />
        <FounderMessage />
        <MobileAppSection />
      </main>
      <Footer />
    </div>
  );
}
