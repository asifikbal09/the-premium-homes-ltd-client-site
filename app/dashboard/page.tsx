"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { DashboardSidebar, DashboardTab } from "@/components/dashboard/dashboard_sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard_header";
import { OverviewTab } from "@/components/dashboard/overview_tab";
import { PaymentTab } from "@/components/dashboard/payment_tab";
import { ProgressTab } from "@/components/dashboard/progress_tab";
import { WishlistTab } from "@/components/dashboard/wishlist_tab";
import { NoticeTab } from "@/components/dashboard/notice_tab";
import { CameraTab } from "@/components/dashboard/camera_tab";
import { ReferTab } from "@/components/dashboard/refer_tab";
import { SupportTab } from "@/components/dashboard/support_tab";
import { ProfileTab } from "@/components/dashboard/profile_tab";
import { ClientUser, ClientFlat, ClientPayment } from "@/components/dashboard/types";
import { fetchUserPaymentInfo } from "@/lib/client-dashboard";
import { Preloader, LoadingScreen } from "@/components/preloader";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams?.get("tab") as DashboardTab) || "overviews";
  const [activeTab, setActiveTab] = useState<DashboardTab>(initialTab);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Dynamic user data
  const [user, setUser] = useState<ClientUser | null>(null);

  // Dynamic state from /users/{userId}
  const [myFlats, setMyFlats] = useState<ClientFlat[]>([]);
  const [dynamicPayments, setDynamicPayments] = useState<ClientPayment[]>([]);
  const [dynamicStats, setDynamicStats] = useState<any>(null);

  // Load authenticated user and fetch /users/{userId} on mount
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

        // Determine effective user id strictly from stored auth
        const effectiveUserId =
          storedUserId ||
          parsedUser?.id ||
          parsedUser?.user_id;

        // If not logged in, redirect to login page (no fake fallback)
        if (!effectiveUserId && !storedUser) {
          router.push("/login");
          return;
        }

        if (parsedUser && typeof parsedUser === "object") {
          setUser({
            id: parsedUser.id || effectiveUserId,
            name:
              parsedUser.name ||
              parsedUser.full_name ||
              [parsedUser.first_name, parsedUser.last_name].filter(Boolean).join(" ") ||
              "",
            email: parsedUser.email || "",
            phone: parsedUser.phone || "",
            avatar: parsedUser.avatar || parsedUser.image || "",
            total_paid: "৳ 0",
            outstanding: "৳ 0",
            total_expense: "৳ 0",
            completion: 0,
          });
        }

        // Fetch dynamic payment and property info: /users/{userId}
        if (effectiveUserId) {
          const paymentData = await fetchUserPaymentInfo(effectiveUserId);

          if (paymentData) {
            const totalPrice = paymentData.stats.totalPrice;
            const totalPaid = paymentData.stats.totalPaid;
            const calcCompletion =
              totalPrice > 0
                ? Math.min(100, Math.round((totalPaid / totalPrice) * 100))
                : 0;

            const primaryFlat = paymentData.dynamicFlats?.[0];
            setUser((prev) => ({
              ...(prev || {}),
              name: paymentData.clientInfo?.client_name || prev?.name || "",
              full_name: paymentData.clientInfo?.client_name || prev?.full_name || "",
              phone: paymentData.clientInfo?.phone || prev?.phone || "",
              email: paymentData.clientInfo?.email || prev?.email || "",
              flat_no: primaryFlat?.flatNo ? `Unit ${primaryFlat.flatNo}` : prev?.flat_no || "",
              building_name: primaryFlat?.title || prev?.building_name || "",
              total_paid: paymentData.stats.formattedPaid,
              outstanding: paymentData.stats.formattedDue,
              total_expense: paymentData.stats.formattedPrice,
              completion: calcCompletion,
            }));

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
          "wishlist",
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
    <div className="h-screen flex overflow-hidden bg-[#f1f6f5] text-[#1f2723]">
      {/* 1. Left Sidebar Navigation */}
      <DashboardSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
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
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1320px] w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12, filter: "blur(3px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(2px)" }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
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
                  isLoading={isLoading}
                />
              )}

              {activeTab === "progress" && (
                <ProgressTab
                  myFlats={myFlats}
                  user={user}
                  isLoading={isLoading}
                />
              )}

              {activeTab === "wishlist" && <WishlistTab user={user} />}

              {activeTab === "notice" && (
                <NoticeTab projects={myFlats} isLoading={isLoading} />
              )}

              {activeTab === "live-camera" && (
                <CameraTab myFlats={myFlats} isLoading={isLoading} />
              )}

              {activeTab === "refer" && <ReferTab user={user} />}

              {activeTab === "support" && <SupportTab />}

              {activeTab === "profile" && (
                <ProfileTab
                  user={user}
                  isLoading={isLoading}
                  myFlats={myFlats}
                  onUpdateUser={handleUpdateUser}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Preloader />
      <DashboardContent />
    </Suspense>
  );
}
