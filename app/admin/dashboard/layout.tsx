import React from "react";
import type { Metadata } from "next";
import { AdminProtectedRoute } from "@/components/admin/AdminProtectedRoute";

export const metadata: Metadata = {
  title: "Admin Dashboard | The Premium Homes Ltd.",
  description: "Executive control panel and management dashboard for The Premium Homes Ltd.",
};

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminProtectedRoute>{children}</AdminProtectedRoute>;
}
