"use client";

import React, { Suspense } from "react";
import AuthPageContent from "@/components/auth/AuthPageContent";
import { Loader2 } from "lucide-react";

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-white">
          <Loader2 className="w-8 h-8 animate-spin text-[#044133]" />
        </div>
      }
    >
      <AuthPageContent initialMode="register" />
    </Suspense>
  );
}
