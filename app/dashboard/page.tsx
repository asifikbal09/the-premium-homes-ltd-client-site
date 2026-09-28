"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardSidebar, DashboardTab } from "@/components/dashboard/dashboard_sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard_header";
import { OverviewTab } from "@/components/dashboard/overview_tab";
import { PaymentTab } from "@/components/dashboard/payment_tab";
import { ProgressTab } from "@/components/dashboard/progress_tab";
import { NoticeTab } from "@/components/dashboard/notice_tab";
import { CameraTab } from "@/components/dashboard/camera_tab";
import { ReferTab } from "@/components/dashboard/refer_tab";
import { SupportTab } from "@/components/dashboard/support_tab";
import { ProfileTab } from "@/components/dashboard/profile_tab";
import { ClientUser, ClientFlat, ClientPayment } from "@/components/dashboard/types";
import { fetchUserPaymentInfo } from "@/lib/client-dashboard";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams?.get("tab") as DashboardTab) || "overviews";
  const [activeTab, setActiveTab] = useState<DashboardTab>(initialTab);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Dynamic user data
  const [user, setUser] = useState<ClientUser>({
    name: "Afsar Hossen",
    full_name: "Afsar Hossen",
    email: "afsar.hossain@example.com",
    avatar: "/image/team/AlfaaniShuvo.png",
    total_paid: "৳ 42,20,000",
    outstanding: "৳ 3,56,000",
    total_expense: "৳ 50,78,000",
    completion: 70, // Static per requirement
  });

  // Dynamic state from user-payment-info?user_id={userId}
  const [myFlats, setMyFlats] = useState<ClientFlat[]>([]);
  const [dynamicPayments, setDynamicPayments] = useState<ClientPayment[]>([]);
  const [dynamicStats, setDynamicStats] = useState<any>(null);

  // Load authenticated user and fetch user-payment-info on mount
  useEffect(() => {
    async function loadUserDataAndPaymentStats() {
      try {
        setIsLoading(true);

        const storedUser =
          localStorage.getItem("tphl_user") ||
          localStorage.getItem("user");
        const storedAuthData = localStorage.getItem("tphl_auth_data");
        const storedUserId =
          localStorage.getItem("tphl_user_id") ||
          localStorage.getItem("user_id");

        let parsedUser: any = null;

        if (storedUser) {
          try {
            parsedUser = JSON.parse(storedUser);
          } catch {
            // ignore
          }
        } else if (storedAuthData) {
          try {
            const authData = JSON.parse(storedAuthData);
            parsedUser = authData?.user || authData?.data || authData;
          } catch {
            // ignore
          }
        }

        // Determine effective user id: stored or from user object, fallback to '1' for preview
        const effectiveUserId =
          storedUserId ||
          parsedUser?.id ||
          parsedUser?.user_id ||
          "1";

        if (parsedUser && typeof parsedUser === "object") {
          setUser((prev) => ({
            ...prev,
            ...parsedUser,
            name:
              parsedUser.name ||
              parsedUser.full_name ||
              [parsedUser.first_name, parsedUser.last_name].filter(Boolean).join(" ") ||
              prev.name,
            email: parsedUser.email || prev.email,
            avatar: parsedUser.avatar || parsedUser.image || prev.avatar,
            completion: 70, // Static 70% per user instructions
          }));
        }

        // Fetch dynamic payment and property info: user-payment-info?user_id={userId}
        if (effectiveUserId) {
          const paymentData = await fetchUserPaymentInfo(effectiveUserId);

          if (paymentData) {
            // Update user stats with values computed from savedProperties:
            // price (total_expense), partial_payment (total_paid), and due_payment (outstanding)
            setUser((prev) => ({
              ...prev,
              name: paymentData.clientInfo?.client_name || prev.name,
              full_name: paymentData.clientInfo?.client_name || prev.full_name,
              phone: paymentData.clientInfo?.phone || prev.phone,
              email: paymentData.clientInfo?.email || prev.email,
              total_paid: paymentData.stats.formattedPaid,
              outstanding: paymentData.stats.formattedDue,
              total_expense: paymentData.stats.formattedPrice,
              completion: 70, // Static 70% completion
            }));

            // Only show savedProperties flats in "My Flats" as requested
            setMyFlats(paymentData.dynamicFlats);
            setDynamicPayments(paymentData.payments);
            setDynamicStats(paymentData.stats);
          }
        }
      } catch (err) {
        console.error("Error loading user dashboard payment stats:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadUserDataAndPaymentStats();

    // Check for ?tab= query parameter on mount (e.g. ?tab=payment)
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab") as DashboardTab;
      if (
        tabParam &&
        [
          "overviews",
          "payment",
          "progress",
          "notice",
          "live-camera",
          "refer",
          "support",
          "profile",
        ].includes(tabParam)
      ) {
        setActiveTab(tabParam);
      }
    }
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("tphl_auth_token");
      localStorage.removeItem("token");
      localStorage.removeItem("tphl_user_id");
      localStorage.removeItem("user_id");
      localStorage.removeItem("tphl_user");
      localStorage.removeItem("user");
      localStorage.removeItem("tphl_auth_data");
    } catch {
      // ignore
    }
    router.push("/login");
  };

  const handleUpdateUser = (updated: ClientUser) => {
    setUser(updated);
    try {
      localStorage.setItem("tphl_user", JSON.stringify(updated));
      localStorage.setItem("user", JSON.stringify(updated));
    } catch (e) {
      console.error("Error updating user in localStorage:", e);
    }
  };

  const handleSelectProject = (project: ClientFlat) => {
    setActiveTab("progress");
  };

  return (
    <div className="min-h-screen flex bg-[#f8faf9] text-[#1f2723]">
      {/* 1. Left Sidebar Navigation */}
      <DashboardSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <DashboardHeader
          user={user}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onNotificationClick={() => setActiveTab("notice")}
          onSparklesClick={() => setActiveTab("support")}
        />

        {/* Scrollable Tab Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === "overviews" && (
            <OverviewTab
              user={user}
              myFlats={myFlats}
              isLoading={isLoading}
              onViewAllFlats={() => setActiveTab("progress")}
              onViewAllProjects={() => router.push("/projects")}
              onSelectProject={handleSelectProject}
            />
          )}

          {activeTab === "payment" && (
            <PaymentTab
              payments={dynamicPayments}
              stats={dynamicStats}
              user={user}
              myFlats={myFlats}
            />
          )}

          {activeTab === "progress" && <ProgressTab />}

          {activeTab === "notice" && <NoticeTab />}

          {activeTab === "live-camera" && <CameraTab />}

          {activeTab === "refer" && <ReferTab />}

          {activeTab === "support" && <SupportTab />}

          {activeTab === "profile" && (
            <ProfileTab user={user} onUpdateUser={handleUpdateUser} />
          )}
        </main>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f8faf9] text-stone-400 text-sm font-medium">
          Loading dashboard...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
