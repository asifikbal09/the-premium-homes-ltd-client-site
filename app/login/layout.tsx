import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In To Your Account | The Premium Homes Ltd.",
  description:
    "Welcome back to The Premium Homes Ltd. Log in to manage your luxury properties, profile, and inquiries.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // No header and no footer layout
  return children;
}
