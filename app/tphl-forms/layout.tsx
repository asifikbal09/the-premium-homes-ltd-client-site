import React from "react";
import type { Metadata } from "next";
import { FormUserAuthProvider } from "@/context/FormUserAuthContext";

export const metadata: Metadata = {
  title: "TPHL Forms Portal | The Premium Homes Ltd.",
  description: "Form Management and Submissions Portal for The Premium Homes Ltd.",
};

export default function TphlFormsRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FormUserAuthProvider>{children}</FormUserAuthProvider>;
}
