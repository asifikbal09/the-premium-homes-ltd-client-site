"use client";

import React, { useEffect, useRef, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchNotifications, type AppNotification } from "@/lib/client-dashboard";

const READ_KEY = "tphl_read_notifications";

function loadReadIds(): Set<string> {
  try {
    const raw = JSON.parse(localStorage.getItem(READ_KEY) || "[]");
    return new Set(Array.isArray(raw) ? raw.map(String) : []);
  } catch {
    return new Set();
  }
}

function timeAgo(ts: number): string {
  const mins = Math.floor((Date.now() - ts) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(ts).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function NotificationBell() {
  const [items, setItems] = useState<AppNotification[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Fetch once on page load
  useEffect(() => {
    setReadIds(loadReadIds());
    fetchNotifications()
      .then(setItems)
      .finally(() => setIsLoading(false));
  }, []);

  // Close on outside click / Escape
  useEffect(() => {
    if (!isOpen) return;
    const onMouseDown = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  // Persist only ids that still exist in the feed, so localStorage doesn't grow forever
  const saveReadIds = (next: Set<string>) => {
    const currentIds = new Set(items.map((n) => String(n.id)));
    const pruned = new Set(Array.from(next).filter((id) => currentIds.has(id)));
    setReadIds(pruned);
    localStorage.setItem(READ_KEY, JSON.stringify(Array.from(pruned)));
  };

  const markRead = (id: AppNotification["id"]) => {
    const key = String(id);
    if (readIds.has(key)) return;
    saveReadIds(new Set(readIds).add(key));
  };

  const markAllRead = () => {
    saveReadIds(new Set(items.map((n) => String(n.id))));
  };

  const unreadCount = items.filter((n) => !readIds.has(String(n.id))).length;

  return (
    <div ref={wrapperRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={`View notifications${unreadCount ? ` (${unreadCount} unread)` : ""}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={cn(
          "relative size-[44px] rounded-full border-[1.1px] border-[#eaecf0] bg-gradient-to-b from-white to-[#f8f9fc] active:scale-95 text-[#475467] flex items-center justify-center transition-all cursor-pointer",
          isOpen && "ring-2 ring-[#054b3c]/15",
        )}
      >
        <Bell className="size-[22px] stroke-[1.75] text-[#475467]" />
        {unreadCount > 0 && (
          <span className="absolute left-[20.9px] top-[6.6px] min-w-[17.6px] h-[17.6px] px-[4px] rounded-full bg-[#f04438] text-white text-[11px] font-semibold leading-none flex items-center justify-center border-[1.1px] border-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Notifications"
          className="absolute right-0 top-full mt-2 w-[340px] max-w-[calc(100vw-2rem)] bg-white rounded-xl border border-stone-200 shadow-[0_12px_32px_rgba(0,0,0,0.12)] overflow-hidden z-50"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
            <h3 className="text-sm font-semibold text-stone-900">
              Notifications
              {unreadCount > 0 && (
                <span className="ml-1.5 text-xs font-normal text-stone-400">
                  ({unreadCount} new)
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="flex items-center gap-1 text-xs font-medium text-[#044133] hover:text-[#d0a65b] transition-colors cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all as read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[380px] overflow-y-auto">
            {isLoading ? (
              <p className="px-4 py-8 text-center text-xs text-stone-400">
                Loading notifications...
              </p>
            ) : items.length === 0 ? (
              <p className="px-4 py-8 text-center text-xs text-stone-400">
                No notifications
              </p>
            ) : (
              <ul className="divide-y divide-stone-100">
                {items.map((n) => {
                  const isUnread = !readIds.has(String(n.id));
                  return (
                    <li key={n.id}>
                      <button
                        type="button"
                        onClick={() => markRead(n.id)}
                        className={cn(
                          "w-full flex items-start gap-3 px-4 py-3 text-left transition-colors cursor-pointer",
                          isUnread ? "bg-[#044133]/[0.04] hover:bg-[#044133]/[0.08]" : "hover:bg-stone-50"
                        )}
                      >
                        {n.image ? (
                          // Plain <img>: images come from an external ERP domain not configured for next/image
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={n.image}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover shrink-0 bg-stone-100"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
                            <Bell className="w-4 h-4 text-stone-400" />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <p
                            className={cn(
                              "text-[13px] leading-snug truncate",
                              isUnread ? "font-semibold text-stone-900" : "font-medium text-stone-600"
                            )}
                          >
                            {n.title}
                          </p>
                          <p className="text-xs text-stone-500 leading-snug mt-0.5 line-clamp-2">
                            {n.message}
                          </p>
                          <p className="text-[11px] text-stone-400 mt-1">
                            {timeAgo(n.timestamp)}
                          </p>
                        </div>

                        {isUnread && (
                          <span
                            className="w-2 h-2 rounded-full bg-[#044133] shrink-0 mt-1.5"
                            aria-label="Unread"
                          />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
