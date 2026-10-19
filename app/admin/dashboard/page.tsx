"use client";

import React, { useState } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { AdminSidebar, AdminTab } from "@/components/admin/dashboard/AdminSidebar";
import { DashboardOverviewTab } from "@/components/admin/dashboard/DashboardOverviewTab";
import { BlogsTab } from "@/components/admin/dashboard/BlogsTab";
import { SlidersTab } from "@/components/admin/dashboard/SlidersTab";
import { VirtualToursTab } from "@/components/admin/dashboard/VirtualToursTab";
import { ReviewsTab } from "@/components/admin/dashboard/ReviewsTab";
import { LiveStreamsTab } from "@/components/admin/dashboard/LiveStreamsTab";
import { NotificationsTab } from "@/components/admin/dashboard/NotificationsTab";
import { AuctionsTab } from "@/components/admin/dashboard/AuctionsTab";
import { FAQsTab } from "@/components/admin/dashboard/FAQsTab";
import { InvestorLeadsTab } from "@/components/admin/dashboard/InvestorLeadsTab";
import { BrochureLeadsTab } from "@/components/admin/dashboard/BrochureLeadsTab";
import { FestivalLeadsTab } from "@/components/admin/dashboard/FestivalLeadsTab";
import { GuestUsersTab } from "@/components/admin/dashboard/GuestUsersTab";
import { ContactsTab } from "@/components/admin/dashboard/ContactsTab";
import { Menu } from "lucide-react";

export default function AdminDashboardPage() {
  const { admin, logout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-full bg-[#f8faf9] text-stone-800 flex overflow-hidden font-normal">
      {/* Left Sidebar (Fixed on Screen) */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        admin={admin}
        onLogout={logout}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area (Independent Smooth Scrolling) */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-y-auto">
        {/* Top Sticky Minimal Bar */}
        <header className="sticky top-0 z-30 h-[84px] shrink-0 bg-white/95 backdrop-blur-xs border-b border-stone-200 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 cursor-pointer"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-sm font-normal text-stone-800 capitalize">
                {activeTab === "dashboard" ? "Dashboard Overview" : activeTab.replace("-", " ")}
              </h1>
              <p className="text-xs text-stone-400 font-normal">
                Admin Management Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-normal border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Connected
            </span>
          </div>
        </header>

        {/* Main Content View (100% Full Width) */}
        <main className="flex-1 p-6 md:p-8 w-full">
          {activeTab === "dashboard" && <DashboardOverviewTab />}
          {activeTab === "blogs" && <BlogsTab />}
          {activeTab === "sliders" && <SlidersTab />}
          {activeTab === "virtual-tours" && <VirtualToursTab />}
          {activeTab === "reviews" && <ReviewsTab />}
          {activeTab === "live-streams" && <LiveStreamsTab />}
          {activeTab === "notifications" && <NotificationsTab />}
          {activeTab === "auctions" && <AuctionsTab />}
          {activeTab === "faqs" && <FAQsTab />}
          {activeTab === "investor-leads" && <InvestorLeadsTab />}
          {activeTab === "brochure-leads" && <BrochureLeadsTab />}
          {activeTab === "festival-leads" && <FestivalLeadsTab />}
          {activeTab === "contacts" && <ContactsTab />}
          {activeTab === "guest-users" && <GuestUsersTab />}

          {activeTab !== "dashboard" &&
            activeTab !== "blogs" &&
            activeTab !== "sliders" &&
            activeTab !== "virtual-tours" &&
            activeTab !== "reviews" &&
            activeTab !== "live-streams" &&
            activeTab !== "notifications" &&
            activeTab !== "auctions" &&
            activeTab !== "faqs" &&
            activeTab !== "investor-leads" &&
            activeTab !== "brochure-leads" &&
            activeTab !== "festival-leads" &&
            activeTab !== "contacts" &&
            activeTab !== "guest-users" && (
              <div className="bg-white rounded-2xl p-8 border border-stone-200 text-center font-normal">
                <h2 className="text-lg text-stone-800 font-normal capitalize mb-1">
                  {activeTab.replace("-", " ")} Management
                </h2>
                <p className="text-xs text-stone-500 font-normal">
                  This section is ready for custom content and tables.
                </p>
              </div>
            )}
        </main>
      </div>
    </div>
  );
}
