"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { apiGet } from "@/lib/api-client";
import { formatDistanceToNow } from "date-fns";
import { BellIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

interface Notification {
  id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  relatedEntityType?: string | null;
  relatedEntityId?: string | null;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showPanel, setShowPanel] = useState(false);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchNotifications = useCallback(async () => {
    const result = await apiGet<Notification[]>("/api/notifications");
    if (result.data) {
      setNotifications(result.data);
      setUnreadCount(result.data.filter((n) => !n.isRead).length);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchNotifications();

    // Poll every 20 seconds
    intervalRef.current = setInterval(() => {
      fetchNotifications();
    }, 20000);

    // Refetch on window focus
    const handleFocus = () => {
      fetchNotifications();
    };
    window.addEventListener("focus", handleFocus);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchNotifications]);

  const markAsRead = async (notificationId: string) => {
    // Optimistically update UI
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    // Send API request
    await fetch(`/api/notifications/${notificationId}/read`, {
      method: "POST",
    });
  };

  const markAllAsRead = async () => {
    setLoading(true);
    await fetch("/api/notifications/read-all", { method: "POST" });
    await fetchNotifications();
    setLoading(false);
  };

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, string> = {
      ASSET_ASSIGNED: "📦",
      MAINTENANCE_APPROVED: "✅",
      MAINTENANCE_REJECTED: "❌",
      BOOKING_CONFIRMED: "📅",
      BOOKING_CANCELLED: "🚫",
      BOOKING_REMINDER: "⏰",
      TRANSFER_APPROVED: "🔄",
      OVERDUE_RETURN: "⚠️",
      AUDIT_DISCREPANCY: "🔍",
    };
    return icons[type] || "🔔";
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
      >
        <BellIcon className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {showPanel && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowPanel(false)}
          />
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-20 max-h-[600px] flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  disabled={loading}
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notifications list */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <BellIcon className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.isRead ? "bg-indigo-50" : ""
                      }`}
                      onClick={() => {
                        if (!notification.isRead) {
                          markAsRead(notification.id);
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-2xl flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDistanceToNow(
                              new Date(notification.createdAt),
                              { addSuffix: true }
                            )}
                          </p>
                        </div>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-indigo-600 rounded-full flex-shrink-0 mt-1" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-200">
              <a
                href="/notifications"
                className="flex items-center justify-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                onClick={() => setShowPanel(false)}
              >
                <span>View all notifications</span>
                <ArrowRightIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
