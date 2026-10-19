"use client";

import React, { Suspense, use } from "react";
import { PublicFormView } from "@/components/forms/public/PublicFormView";
import { Loader2 } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function FormContent({ params }: PageProps) {
  const resolvedParams = use(params);
  return <PublicFormView slug={resolvedParams.slug} />;
}

export default function PublicFormPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f8faf9] text-stone-500">
          <Loader2 className="w-8 h-8 animate-spin text-[#044133]" />
        </div>
      }
    >
      <FormContent params={params} />
    </Suspense>
  );
}
