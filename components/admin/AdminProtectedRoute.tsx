"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { Loader2, ShieldCheck } from "lucide-react";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const { isAuthenticated, loading } = useAdminAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/admin/login");
    }
  }, [loading, isAuthenticated, router]);

  // Centered pristine brand loading screen while verifying session
  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f8faf9] text-[#1f2723]">
        <div className="relative w-48 h-14 mb-6 animate-pulse">
          <Image
            src="/image/logo/LOGO-GREEN.png"
            alt="The Premium Homes Ltd."
            fill
            priority
            sizes="200px"
            className="object-contain"
          />
        </div>

        <div className="flex flex-col items-center gap-3 bg-white p-6 rounded-2xl shadow-xl border border-stone-100 max-w-xs w-full text-center">
          <div className="relative flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-[#044133]" />
          </div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#044133] font-normal">
            Verifying Admin Session
          </p>
          <p className="text-[11px] text-stone-500">
            Connecting securely to administration services...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
