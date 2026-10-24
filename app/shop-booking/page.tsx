import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BookingPolicyHero } from "@/components/section/booking-policy/booking_policy_hero";
import { BookingPolicyContent } from "@/components/section/booking-policy/booking_policy_content";
import { SHOP_BOOKING_POLICY_DATA } from "@/components/section/booking-policy/data";

export const metadata: Metadata = {
  title: "Shop Booking Policy | The Premium Homes Ltd",
  description:
    "Rules and regulations applicable for purchasing a shop with land from The Premium Homes Ltd., valid for all shareholders.",
};

export default function ShopBookingPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#ffffff] text-[#1f2723]">
      <Navbar />
      <main className="flex-1">
        <BookingPolicyHero
          eyebrow={SHOP_BOOKING_POLICY_DATA.eyebrow}
          title={SHOP_BOOKING_POLICY_DATA.heroTitle}
          titleBreak={SHOP_BOOKING_POLICY_DATA.heroTitleBreak}
          subtitle={SHOP_BOOKING_POLICY_DATA.heroSubtitle}
        />
        <BookingPolicyContent data={SHOP_BOOKING_POLICY_DATA} />
      </main>
      <Footer />
    </div>
  );
}
