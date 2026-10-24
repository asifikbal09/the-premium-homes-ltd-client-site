import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BookingPolicyHero } from "@/components/section/booking-policy/booking_policy_hero";
import {
  RefundPolicyContent,
  type RefundRule,
} from "@/components/section/refund-policy/refund_policy_content";

export const metadata: Metadata = {
  title: "Refund Policy – After Booking | The Premium Homes Ltd",
  description:
    "This page outlines the financial refund and share-sale policies applicable to shareholders of The Premium Homes Ltd., after booking and before registration.",
};

const AFTER_BOOKING_RULES: RefundRule[] = [
  {
    number: "01",
    text: "To avail the mentioned benefits, a shareholder must submit a formal application to The Premium Homes Ltd. The application might take up to 7 working days for approval.",
    emailLink: "experience@dpremiumhomes.com",
  },
  {
    number: "02",
    text: "From the date of approval, The Premium Homes Ltd. will take no more than 30 days to resell the share.",
  },
  {
    number: "03",
    text: "The shareholder has to surrender all share-related documents, as follows: the booking deed, the money receipt, and other files (including all photocopies) to The Premium Homes Ltd.",
  },
  {
    number: "04",
    text: "An office charge equivalent to 5% of the booking amount will be deducted.",
  },
];

export default function RefundPolicyAfterBookingPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#ffffff] text-[#1f2723]">
      <Navbar />
      <main className="flex-1">
        <BookingPolicyHero
          eyebrow="COMPANY POLICY / REFUND POLICY AFTER BOOKING"
          title="Refund Policy – After"
          titleBreak="Booking"
          subtitle="This page outlines the financial refund and share-sale policies applicable to shareholders of The Premium Homes Ltd., after booking and before registration."
        />
        <RefundPolicyContent
          stageText="after booking and before registration"
          rules={AFTER_BOOKING_RULES}
        />
      </main>
      <Footer />
    </div>
  );
}
