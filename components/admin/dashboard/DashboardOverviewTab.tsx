"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useAdminAuth } from "@/context/AdminAuthContext";
import {
  Activity,
  Users,
  Briefcase,
  Mail,
  Download,
  Gavel,
  Building2,
  FileText,
  ImageIcon,
  Eye,
  Star,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardMetrics {
  users: number;
  investments: number;
  contacts: number;
  brochureLeads: number;
  auctions: number;
  projects: number;
  blogs: number;
  sliders: number;
  virtualTours: number;
  reviews: number;
}

const INITIAL_METRICS: DashboardMetrics = {
  users: 0,
  investments: 0,
  contacts: 0,
  brochureLeads: 0,
  auctions: 0,
  projects: 0,
  blogs: 0,
  sliders: 0,
  virtualTours: 0,
  reviews: 0,
};

export function DashboardOverviewTab() {
  const { authFetch } = useAdminAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics>(INITIAL_METRICS);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getBaseUrl = () => {
    return (
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://api.dpremiumhomes.com/api"
    ).replace(/\/+$/, "");
  };

  const fetchMetrics = useCallback(async () => {
    try {
      const baseUrl = getBaseUrl();

      const endpoints = [
        { key: "users", url: `${baseUrl}/users` },
        { key: "investments", url: `${baseUrl}/investments` },
        { key: "contacts", url: `${baseUrl}/admin/contacts` },
        { key: "brochureLeads", url: `${baseUrl}/brochure-leads` },
        { key: "auctions", url: `${baseUrl}/admin/auctions` },
        { key: "projects", url: `${baseUrl}/projects` },
        { key: "blogs", url: `${baseUrl}/blogs` },
        { key: "sliders", url: `${baseUrl}/sliders` },
        { key: "virtualTours", url: `${baseUrl}/virtual-tours` },
        { key: "reviews", url: `${baseUrl}/reviews` },
      ];

      const responses = await Promise.allSettled(
        endpoints.map(async (ep) => {
          const res = await authFetch(ep.url, { method: "GET" });
          if (!res.ok) {
            return { key: ep.key, count: 0 };
          }
          const json = await res.json().catch(() => null);
          return { key: ep.key, json };
        })
      );

      const updatedMetrics: DashboardMetrics = { ...INITIAL_METRICS };

      responses.forEach((result) => {
        if (result.status === "fulfilled") {
          const { key, json } = result.value;
          let count = 0;

          if (!json) {
            count = 0;
          } else if (Array.isArray(json)) {
            count = json.length;
          } else if (key === "users") {
            count = json.users?.length || json.data?.length || 0;
          } else if (key === "investments") {
            count = json.data?.length || (Array.isArray(json) ? json.length : 0);
          } else if (key === "contacts") {
            count = json.contacts?.length || json.data?.length || 0;
          } else if (key === "brochureLeads") {
            count = json.leads?.length || json.data?.length || 0;
          } else if (key === "auctions") {
            count = json.auctions?.length || json.data?.length || 0;
          } else if (key === "projects") {
            count = json.projects?.length || json.data?.length || 0;
          } else if (key === "blogs") {
            count = json.blogs?.length || json.data?.length || 0;
          } else if (key === "sliders") {
            count = json.slides?.length || json.sliders?.length || json.data?.length || 0;
          } else if (key === "virtualTours") {
            count = json.tours?.length || json.virtualTours?.length || json.data?.length || 0;
          } else if (key === "reviews") {
            count = json.reviews?.length || json.data?.length || 0;
          }

          (updatedMetrics as any)[key] = Number(count) || 0;
        }
      });

      setMetrics(updatedMetrics);
    } catch (error) {
      console.error("Failed to fetch dashboard metrics:", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [authFetch]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchMetrics();
  };

  // Section 1: Engagement & Users (Colors matching the clean UI from screenshot)
  const engagementCards = [
    {
      title: "Total Registered Users",
      value: metrics.users,
      icon: Users,
      bg: "bg-[#f3f0ff] text-[#7c3aed]",
    },
    {
      title: "Investor Leads",
      value: metrics.investments,
      icon: Briefcase,
      bg: "bg-[#ecfdf5] text-[#059669]",
    },
    {
      title: "Contact Messages",
      value: metrics.contacts,
      icon: Mail,
      bg: "bg-[#fff1f2] text-[#e11d48]",
    },
    {
      title: "Brochure Leads",
      value: metrics.brochureLeads,
      icon: Download,
      bg: "bg-[#f0fdf4] text-[#16a34a]",
    },
    {
      title: "Active/Total Auctions",
      value: metrics.auctions,
      icon: Gavel,
      bg: "bg-[#fffbeb] text-[#d97706]",
    },
  ];

  // Section 2: Content & Properties (Colors matching the clean UI from screenshot)
  const contentCards = [
    {
      title: "Projects/Properties",
      value: metrics.projects,
      icon: Building2,
      bg: "bg-[#ecfdf5] text-[#059669]",
    },
    {
      title: "Published Blogs",
      value: metrics.blogs,
      icon: FileText,
      bg: "bg-[#eff6ff] text-[#2563eb]",
    },
    {
      title: "Slider Items",
      value: metrics.sliders,
      icon: ImageIcon,
      bg: "bg-[#faf5ff] text-[#9333ea]",
    },
    {
      title: "Virtual Tours",
      value: metrics.virtualTours,
      icon: Eye,
      bg: "bg-[#ecfeff] text-[#0891b2]",
    },
    {
      title: "User Reviews",
      value: metrics.reviews,
      icon: Star,
      bg: "bg-[#fffbeb] text-[#f59e0b]",
    },
  ];

  return (
    <div className="space-y-7 font-sans w-full">
      {/* 1. Header: Activity Pulse Icon + Title + Subtitle */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#044133]" />
            <h1 className="text-xl sm:text-2xl text-stone-900 tracking-tight font-normal">
              Dashboard Overview
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 font-normal">
            A complete overview of your platform&apos;s data
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading || isRefreshing}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-xs text-stone-600 hover:text-stone-900 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
        >
          <RefreshCw
            className={cn("w-3.5 h-3.5", (loading || isRefreshing) && "animate-spin text-[#044133]")}
          />
          <span className="font-normal">Sync Live Data</span>
        </button>
      </div>

      {/* 2. Section 1: Engagement & Users */}
      <div className="space-y-3">
        <h2 className="text-sm text-stone-900 font-normal">
          Engagement &amp; Users
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {engagementCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="bg-white rounded-2xl p-5 border border-stone-100 shadow-xs hover:shadow-sm transition-shadow flex flex-col justify-between min-h-[135px]"
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mb-3",
                    card.bg
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-stone-500 font-normal mb-1">
                    {card.title}
                  </p>
                  {loading ? (
                    <div className="h-8 w-16 bg-stone-100 rounded-md animate-pulse" />
                  ) : (
                    <p className="font-sans text-2xl sm:text-3xl text-stone-900 tracking-tight font-normal">
                      {card.value.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Section 2: Content & Properties */}
      <div className="space-y-3">
        <h2 className="text-sm text-stone-900 font-normal">
          Content &amp; Properties
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {contentCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="bg-white rounded-2xl p-5 border border-stone-100 shadow-xs hover:shadow-sm transition-shadow flex flex-col justify-between min-h-[135px]"
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mb-3",
                    card.bg
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-stone-500 font-normal mb-1">
                    {card.title}
                  </p>
                  {loading ? (
                    <div className="h-8 w-16 bg-stone-100 rounded-md animate-pulse" />
                  ) : (
                    <p className="font-sans text-2xl sm:text-3xl text-stone-900 tracking-tight font-normal">
                      {card.value.toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Bottom Welcome Banner (Clean, original forest green rounded card) */}
      <div className="rounded-2xl p-6 sm:p-7 bg-[#044133] text-white shadow-sm font-normal">
        <h3 className="text-base sm:text-lg font-normal mb-2 text-white">
          Welcome to your Admin Panel
        </h3>
        <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed font-normal">
          Use the sidebar on the left to navigate through different sections. You can manage properties, users, auctions, and all website content directly from here. Changes are instantly synced to your live application.
        </p>
      </div>
    </div>
  );
}
