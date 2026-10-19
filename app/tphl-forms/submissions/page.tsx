"use client";

import React, { Suspense } from "react";
import { FormResponses } from "@/components/forms/responses/FormResponses";
import { FormPortalShell } from "@/components/forms/layout/FormPortalShell";
import { Loader2 } from "lucide-react";

export default function TphlSubmissionsPage() {
  return (
    <FormPortalShell>
      <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full">
        <Suspense
          fallback={
            <div className="min-h-[400px] flex items-center justify-center text-stone-500">
              <Loader2 className="w-8 h-8 animate-spin text-[#044133]" />
            </div>
          }
        >
          <FormResponses />
        </Suspense>
      </div>
    </FormPortalShell>
  );
}
