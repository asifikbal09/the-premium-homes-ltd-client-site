import React from "react";
import type { Metadata } from "next";
import { FormUserProtectedRoute } from "@/components/forms/FormUserProtectedRoute";

export const metadata: Metadata = {
  title: "TPHL Forms Dashboard | The Premium Homes Ltd.",
  description: "Form submissions and data management portal for The Premium Homes Ltd.",
};

export default function TphlFormsDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <FormUserProtectedRoute>{children}</FormUserProtectedRoute>;
}
