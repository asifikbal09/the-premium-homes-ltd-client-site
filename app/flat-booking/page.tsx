import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BookingPolicyHero } from "@/components/section/booking-policy/booking_policy_hero";
import { BookingPolicyContent } from "@/components/section/booking-policy/booking_policy_content";
import { FLAT_BOOKING_POLICY_DATA } from "@/components/section/booking-policy/data";

export const metadata: Metadata = {
  title: "Flat Booking Policy | The Premium Homes Ltd",
  description:
    "Rules and regulations applicable for purchasing a flat with land from The Premium Homes Ltd., valid for all shareholders.",
};

export default function FlatBookingPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#ffffff] text-[#1f2723]">
      <Navbar />
      <main className="flex-1">
        <BookingPolicyHero
          eyebrow={FLAT_BOOKING_POLICY_DATA.eyebrow}
          title={FLAT_BOOKING_POLICY_DATA.heroTitle}
          titleBreak={FLAT_BOOKING_POLICY_DATA.heroTitleBreak}
          subtitle={FLAT_BOOKING_POLICY_DATA.heroSubtitle}
        />
        <BookingPolicyContent data={FLAT_BOOKING_POLICY_DATA} />
      </main>
      <Footer />
    </div>
  );
}
