import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login | The Premium Homes Ltd.",
  description: "Secure Administrator Sign In Portal for The Premium Homes Ltd.",
};

export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
