import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BookingPolicyHero } from "@/components/section/booking-policy/booking_policy_hero";
import { ServiceChargeContent } from "@/components/section/service-charge/service_charge_content";

export const metadata: Metadata = {
  title:
    "Services Covered Under Service Charge | The Premium Homes Ltd",
  description:
    "A clear breakdown of the planning, documentation, coordination, construction supervision, and project management services covered by the applicable consultancy service charge.",
};

export default function ServicesCoveredPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#ffffff] text-[#1f2723]">
      <Navbar />
      <main className="flex-1">
        <BookingPolicyHero
          eyebrow="COMPANY POLICY / SERVICES COVERED UNDER SERVICE CHARGE"
          title="Alternative: Construction Consultancy"
          titleBreak="& Management Service Charge"
          subtitle="A clear breakdown of the planning, documentation, coordination, construction supervision, and project management services covered by the applicable consultancy service charge."
        />
        <ServiceChargeContent />
      </main>
      <Footer />
    </div>
  );
}
