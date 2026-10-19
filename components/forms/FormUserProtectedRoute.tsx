"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useFormUserAuth } from "@/context/FormUserAuthContext";
import { Loader2 } from "lucide-react";

interface FormUserProtectedRouteProps {
  children: React.ReactNode;
}

export function FormUserProtectedRoute({ children }: FormUserProtectedRouteProps) {
  const { isAuthenticated, loading } = useFormUserAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/tphl-forms/login");
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
          <p className="text-xs uppercase tracking-[0.2em] text-[#044133] font-medium">
            Verifying Form Session
          </p>
          <p className="text-[11px] text-stone-500">
            Checking authorization with server...
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
