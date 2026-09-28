import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Dashboard | The Premium Homes Ltd.",
  description:
    "Exclusive client portal for The Premium Homes property owners. Track construction progress, review installments, and access 24/7 site cameras.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8faf9] text-[#1f2723]">
      {children}
    </div>
  );
}
