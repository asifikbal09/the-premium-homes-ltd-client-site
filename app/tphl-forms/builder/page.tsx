"use client";

import React, { Suspense } from "react";
import { FormBuilder } from "@/components/forms/builder/FormBuilder";
import { Loader2 } from "lucide-react";

export default function TphlFormsCreatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f8faf9] text-stone-500">
          <Loader2 className="w-8 h-8 animate-spin text-[#044133]" />
        </div>
      }
    >
      <FormBuilder />
    </Suspense>
  );
}
