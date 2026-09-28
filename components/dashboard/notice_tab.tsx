"use client";

import React from "react";
import { Bell, Calendar, ChevronRight } from "lucide-react";
import { DEFAULT_NOTICES } from "./dashboard_data";

export function NoticeTab() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl sm:text-[32px] font-bold text-[#044133] tracking-tight">
          Notices & Official Circulars
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Stay informed on project announcements, society bulletins, and holiday schedules.
        </p>
      </div>

      <div className="space-y-4">
        {DEFAULT_NOTICES.map((notice) => (
          <div
            key={notice.id}
            className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs hover:shadow-sm transition-all space-y-2.5"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#044133]/10 text-[#044133]">
                  {notice.category}
                </span>
                {notice.isUnread && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                    NEW
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-stone-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>{notice.date}</span>
              </div>
            </div>

            <h3 className="font-bold text-base text-stone-900 leading-snug">
              {notice.title}
            </h3>

            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              {notice.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
