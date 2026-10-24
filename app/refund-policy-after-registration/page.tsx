import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BookingPolicyHero } from "@/components/section/booking-policy/booking_policy_hero";
import {
  RefundPolicyContent,
  type RefundRule,
} from "@/components/section/refund-policy/refund_policy_content";

export const metadata: Metadata = {
  title: "Refund Policy – After Registration | The Premium Homes Ltd",
  description:
    "This page outlines the financial refund and share-sale policies applicable to shareholders of The Premium Homes Ltd., after registration.",
};

const AFTER_REGISTRATION_RULES: RefundRule[] = [
  {
    number: "01",
    text: "To avail the mentioned benefits, a shareholder must submit a formal application to The Premium Homes Ltd. The application might take up to 7 working days for approval.",
    emailLink: "experience@dpremiumhomes.com",
  },
  {
    number: "02",
    text: "From the date of approval, The Premium Homes Ltd. will take no more than 60 days to resell the share.",
  },
  {
    number: "03",
    text: "The shareholder has to surrender all the share-related documents as follows: booking deed, money receipt, land registration deed, mutation copy, and other files (including all photocopies) to The Premium Homes Ltd.",
  },
  {
    number: "04",
    text: "The shareholder has to transfer his/her share to the new shareholder or The Premium Homes Ltd., following all official and legal procedures.",
  },
  {
    number: "05",
    text: "After the completion of a new shareholder's ownership registration, the previous shareholder will get his/her financial refund (including the profit amount, as per the market value).",
  },
  {
    number: "06",
    text: "If the shareholder sells the property him/herself, no office charges will apply. But if The Premium Homes Ltd. has to sell the property on behalf of the shareholder, a 5% office charge will be deducted from the seller's gain or additional amount (Profit).",
  },
  {
    number: "07",
    text: "The new shareholder will have to pay the land registration, mutation fee + file transfer fee (equivalent to 10,000 BDT). The new shareholder must cooperate with the relevant file transfer and other procedures.",
  },
];

export default function RefundPolicyAfterRegistrationPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#ffffff] text-[#1f2723]">
      <Navbar />
      <main className="flex-1">
        <BookingPolicyHero
          eyebrow="COMPANY POLICY / REFUND POLICY AFTER REGISTRATION"
          title="Refund Policy – After"
          titleBreak="Registration"
          subtitle="This page outlines the financial refund and share-sale policies applicable to shareholders of The Premium Homes Ltd., after registration."
        />
        <RefundPolicyContent
          stageText="after registration"
          rules={AFTER_REGISTRATION_RULES}
        />
      </main>
      <Footer />
    </div>
  );
}
