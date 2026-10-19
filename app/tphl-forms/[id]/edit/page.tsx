"use client";

import React, { Suspense, use } from "react";
import { FormBuilder } from "@/components/forms/builder/FormBuilder";
import { Loader2 } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

function FormEditContent({ params }: PageProps) {
  const resolvedParams = use(params);
  return <FormBuilder id={resolvedParams.id} />;
}

export default function TphlFormsDirectEditPage({ params }: PageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f8faf9] text-stone-500">
          <Loader2 className="w-8 h-8 animate-spin text-[#044133]" />
        </div>
      }
    >
      <FormEditContent params={params} />
    </Suspense>
  );
}
