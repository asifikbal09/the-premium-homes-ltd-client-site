import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create an Account | The Premium Homes Ltd.",
  description:
    "Join The Premium Homes Ltd. Register to explore luxury living, commercial spaces, and exclusive real estate developments.",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
