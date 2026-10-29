import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { HomeHero } from "@/components/section/home/home_hero";
import { HomeAbout } from "@/components/section/home/home_about";
import { SignatureDevelopments } from "@/components/section/home/signature_developments";
import { HomeFeaturedProjects } from "@/components/section/home/home_featured_projects";
import { HomeArtOfLiving } from "@/components/section/home/home_art_of_living";
import { CommunityGallery } from "@/components/section/home/community_gallery";
import { FounderMessage } from "@/components/section/home/founder_message";
import { PhilosophyPillars } from "@/components/section/home/philosophy_pillars";
import { HomeTestimonials } from "@/components/section/home/home_testimonials";
import { MobileAppSection } from "@/components/section/home/mobile_app_section";
import { LatestBlogs } from "@/components/section/home/latest_blogs";
import { HomeCta } from "@/components/section/home/home_cta";
import { getProjects } from "@/lib/projects";

export default async function Home() {
  const projects = await getProjects();
  const locations = Array.from(
    new Set(
      projects
        .map((p) => p.location?.trim())
        .filter(Boolean) as string[],
    ),
  );
  const statuses = Array.from(
    new Set(
      projects
        .map((p) => p.status?.trim())
        .filter(Boolean) as string[],
    ),
  );

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />
      {/* The page rides above the footer and slides open to reveal it. */}
      <main className="relative z-10 flex-1 bg-white text-sage">
        <HomeHero initialLocations={locations} initialStatuses={statuses} />
        <HomeAbout />
        <SignatureDevelopments initialProjects={projects} />
        <HomeFeaturedProjects initialProjects={projects} />
        <HomeArtOfLiving />
        <CommunityGallery />
        <FounderMessage />
        <PhilosophyPillars />
        <HomeTestimonials />
        <MobileAppSection />
        <LatestBlogs />
        <HomeCta />
      </main>
      <Footer reveal />
    </div>
  );
}
