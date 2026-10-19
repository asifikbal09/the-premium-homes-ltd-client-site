"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { useAdminAuth } from "@/context/AdminAuthContext";
import { toast } from "sonner";
import {
  Bell,
  RefreshCw,
  Loader2,
  Send,
  MessageSquare,
  Megaphone,
  AlertTriangle,
  XCircle,
  Trash2,
  Upload,
  X,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface NotificationItem {
  id: number | string;
  type?: string;
  title: string;
  message: string;
  image?: string | null;
  created_at?: string;
}

const ITEMS_PER_PAGE = 20;

export function NotificationsTab() {
  const { authFetch } = useAdminAuth();

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Form state
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Delete modal state
  const [notificationToDelete, setNotificationToDelete] = useState<NotificationItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const getBaseUrl = () => {
    return (
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://api.dpremiumhomes.com/api"
    ).replace(/\/+$/, "");
  };

  // 1. FETCH ALL NOTIFICATIONS
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const baseUrl = getBaseUrl();
      let res = await authFetch(`${baseUrl}/admin/notifications`, {
        method: "GET",
      });

      if (!res.ok && res.status === 404) {
        res = await authFetch(`${baseUrl}/notifications`, {
          method: "GET",
        });
      }

      if (res.ok) {
        const data = await res.json().catch(() => null);
        const list: NotificationItem[] = Array.isArray(data)
          ? data
          : data?.notifications || data?.data || [];
        setNotifications(list);
      } else {
        toast.error("Failed to load notifications");
      }
    } catch (err: any) {
      console.error("Error fetching notifications:", err);
      toast.error(err?.message || "Network error loading notifications");
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Image File selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 2. SEND CUSTOM NOTIFICATION
  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a notification title");
      return;
    }
    if (!message.trim()) {
      toast.error("Please enter a notification message");
      return;
    }

    try {
      setIsSending(true);
      const baseUrl = getBaseUrl();

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("message", message.trim());
      if (imageFile) {
        formData.append("image", imageFile);
      }

      let res = await authFetch(`${baseUrl}/admin/notifications`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok && res.status === 404) {
        res = await authFetch(`${baseUrl}/admin/notifications/send`, {
          method: "POST",
          body: formData,
        });
      }

      if (!res.ok && res.status === 404) {
        res = await authFetch(`${baseUrl}/notifications`, {
          method: "POST",
          body: formData,
        });
      }

      const data = await res.json().catch(() => null);
      if (res.ok) {
        toast.success(
          data?.message || "Notification broadcasted to all users successfully"
        );
        setTitle("");
        setMessage("");
        handleClearImage();
        fetchNotifications();
      } else {
        toast.error(data?.message || "Failed to send notification");
      }
    } catch (err: any) {
      console.error("Send notification error:", err);
      toast.error(err?.message || "Network error sending notification");
    } finally {
      setIsSending(false);
    }
  };

  // 3. DELETE NOTIFICATION
  const handleConfirmDelete = async () => {
    if (!notificationToDelete) return;

    try {
      setIsDeleting(true);
      const baseUrl = getBaseUrl();

      let res = await authFetch(
        `${baseUrl}/admin/notifications/${notificationToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok && res.status === 404) {
        res = await authFetch(
          `${baseUrl}/notifications/${notificationToDelete.id}`,
          {
            method: "DELETE",
          }
        );
      }

      const data = await res.json().catch(() => null);
      if (res.ok) {
        toast.success(data?.message || "Notification deleted successfully");
        setNotifications((prev) =>
          prev.filter((n) => n.id !== notificationToDelete.id)
        );
        setNotificationToDelete(null);
      } else {
        toast.error(data?.message || "Failed to delete notification");
      }
    } catch (err: any) {
      console.error("Delete notification error:", err);
      toast.error(err?.message || "Network error deleting notification");
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper for notification dates
  const formatNotificationDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Helper to render type-specific icons
  const renderNotificationIcon = (type?: string) => {
    const upper = (type || "").toUpperCase();
    if (upper.includes("LIVE") || upper.includes("UPCOMING")) {
      return (
        <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
          <Megaphone className="w-4 h-4" />
        </div>
      );
    }
    if (upper.includes("CANCEL")) {
      return (
        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100">
          <Bell className="w-4 h-4" />
        </div>
      );
    }
    return (
      <div className="w-9 h-9 rounded-xl bg-[#044133]/10 text-[#044133] flex items-center justify-center shrink-0 border border-[#044133]/15">
        <MessageSquare className="w-4 h-4" />
      </div>
    );
  };

  // Pagination calculation
  const totalPages = Math.ceil(notifications.length / ITEMS_PER_PAGE) || 1;
  const paginatedNotifications = notifications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="w-full space-y-6 font-sans font-normal animate-in fade-in duration-200">
      {/* Page Header matching screenshot */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#044133]" />
          <h1 className="text-xl sm:text-2xl text-stone-900 tracking-tight font-normal">
            Notifications
          </h1>
        </div>

        <button
          type="button"
          onClick={fetchNotifications}
          disabled={loading}
          className="p-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 transition-colors cursor-pointer shadow-xs disabled:opacity-50"
          title="Refresh notifications"
        >
          <RefreshCw
            className={cn("w-4 h-4", loading && "animate-spin text-[#044133]")}
          />
        </button>
      </div>

      {/* 1. SEND CUSTOM NOTIFICATION CARD (Matches Screenshot 2 top) */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#044133] text-white flex items-center justify-center shrink-0 shadow-xs">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm text-stone-900 font-normal">
              Send Custom Notification
            </h2>
            <p className="text-xs text-stone-400 font-normal mt-0.5">
              Push a notification to all app users
            </p>
          </div>
        </div>

        <form onSubmit={handleSendNotification} className="space-y-4 max-w-2xl">
          {/* Title */}
          <div>
            <label className="block text-xs text-stone-600 font-normal mb-1.5">
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. New Property Listed!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#044133] focus:ring-1 focus:ring-[#044133] font-normal"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs text-stone-600 font-normal mb-1.5">
              Message <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              placeholder="Write the notification message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#044133] focus:ring-1 focus:ring-[#044133] font-normal resize-y"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-xs text-stone-600 font-normal mb-1.5">
              Image (optional)
            </label>
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="notification-image-upload"
              />
              <label
                htmlFor="notification-image-upload"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-normal transition-colors cursor-pointer shadow-2xs"
              >
                <Upload className="w-3.5 h-3.5 text-stone-500" />
                <span>Choose Image</span>
              </label>

              {imagePreview && (
                <div className="relative flex items-center gap-2 p-1.5 rounded-xl border border-stone-200 bg-[#fcfbf9]">
                  <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <span className="text-[11px] text-stone-600 font-normal max-w-[150px] truncate">
                    {imageFile?.name || "Selected image"}
                  </span>
                  <button
                    type="button"
                    onClick={handleClearImage}
                    className="p-1 text-stone-400 hover:text-stone-700 rounded-md cursor-pointer"
                    title="Remove image"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSending}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#044133] hover:bg-[#033026] text-white text-xs font-normal transition-colors cursor-pointer shadow-sm disabled:opacity-50"
          >
            {isSending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send to All Users</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* 2. RECENT NOTIFICATIONS CARD (Matches Screenshot 2 bottom) */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
        <h2 className="text-sm text-stone-900 font-normal">
          Recent Notifications
        </h2>

        <div className="divide-y divide-stone-100">
          {loading ? (
            <div className="py-12 text-center text-stone-400 flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#044133]" />
              <span className="text-xs font-normal">Loading notifications...</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-12 text-center text-stone-400 flex flex-col items-center justify-center gap-2">
              <Bell className="w-8 h-8 text-stone-300" />
              <span className="text-xs font-normal">No recent notifications found</span>
            </div>
          ) : (
            paginatedNotifications.map((item) => (
              <div
                key={item.id}
                className="py-4 px-2 sm:px-3 flex items-start justify-between gap-4 hover:bg-[#fcfbf9] transition-colors rounded-xl"
              >
                {/* Left: Icon + Content */}
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  {renderNotificationIcon(item.type)}

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-stone-900 font-normal">
                        {item.title}
                      </span>
                      {item.type && (
                        <span className="text-[10px] tracking-wider font-mono uppercase px-2 py-0.5 rounded border border-stone-200 text-stone-500 bg-stone-50">
                          {item.type}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-stone-600 font-normal leading-relaxed line-clamp-2">
                      {item.message}
                    </p>

                    {item.created_at && (
                      <p className="text-[11px] text-stone-400 font-normal pt-0.5">
                        {formatNotificationDate(item.created_at)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Image thumbnail & Delete Action */}
                <div className="flex items-center gap-3 shrink-0 self-center">
                  {item.image && (
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-stone-200 bg-stone-100 shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title || "Notification image"}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setNotificationToDelete(item)}
                    className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 20 items Pagination Footer */}
        {notifications.length > 0 && (
          <div className="px-3 py-4 border-t border-stone-200 bg-[#fcfbf9] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-500 font-normal rounded-b-2xl mt-4">
            <div>
              Showing{" "}
              <span className="text-stone-800 font-normal">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              </span>{" "}
              to{" "}
              <span className="text-stone-800 font-normal">
                {Math.min(currentPage * ITEMS_PER_PAGE, notifications.length)}
              </span>{" "}
              of{" "}
              <span className="text-stone-800 font-normal">
                {notifications.length}
              </span>{" "}
              notifications
            </div>

            {totalPages > 1 && (
              <div className="flex items-center gap-1 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  aria-label="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      "w-7 h-7 rounded-lg text-xs font-normal transition-colors cursor-pointer",
                      currentPage === page
                        ? "bg-[#044133] text-white"
                        : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                    )}
                  >
                    {page}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  aria-label="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {notificationToDelete && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-stone-200 shadow-xl space-y-4 font-normal">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base text-stone-900 font-normal">
                Delete Notification?
              </h3>
              <p className="text-xs text-stone-500 font-normal">
                Are you sure you want to delete this notification? This action
                cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setNotificationToDelete(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl border border-stone-200 text-xs text-stone-700 hover:bg-stone-50 transition-colors font-normal cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-normal transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Delete</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
