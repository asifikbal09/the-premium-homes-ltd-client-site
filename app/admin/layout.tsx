import React from "react";
import type { Metadata } from "next";
import { AdminAuthProvider } from "@/context/AdminAuthContext";

export const metadata: Metadata = {
  title: "Admin Portal | The Premium Homes Ltd.",
  description: "Secure Administrative Management Portal for The Premium Homes Ltd.",
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminAuthProvider>{children}</AdminAuthProvider>;
}
