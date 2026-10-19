"use client";

import React from "react";
import { FormUserSidebar } from "./FormUserSidebar";

export function FormPortalShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f8faf9] flex flex-col lg:flex-row text-[#1f2723]">
      <FormUserSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
