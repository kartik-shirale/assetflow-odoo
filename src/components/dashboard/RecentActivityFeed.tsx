"use client";

import { formatDistanceToNow } from "date-fns";
import { Spinner } from "@/components/ui/Spinner";
import {  ArrowUpRightIcon, ArrowDownRightIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon } from "@heroicons/react/24/solid";


interface Activity {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  details?: Record<string, any> | null;
  createdAt: Date | string;
  user?: {
    name: string;
  } | null;
}

interface RecentActivityFeedProps {
  activities: Activity[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const actionIcons: Record<string, React.ReactNode> = {
  ASSET_ALLOCATED: '',
  BOOKING_CONFIRMED: <ArrowUpRightIcon className="w-5 h-5" />,
  MAINTENANCE_RESOLVED: <ArrowDownRightIcon className="w-5 h-5" />,
  TRANSFER_APPROVED: <ArrowTrendingUpIcon className="w-5 h-5" />,
  ASSET_RETURNED: <ArrowTrendingDownIcon className="w-5 h-5" />,
};

function getActivityMessage(activity: Activity): string {
  const details = activity.details as any;
  const userName = activity.user?.name || "Someone";

  switch (activity.action) {
    case "ASSET_ALLOCATED":
      return `${details?.assetTag || "Asset"} allocated to ${details?.employeeName || "employee"} – ${details?.departmentName || "Dept"}`;
    case "BOOKING_CONFIRMED":
      return `${details?.resourceName || "Resource"} booking confirmed – ${details?.time || ""}`;
    case "MAINTENANCE_RESOLVED":
      return `${details?.assetTag || "Asset"} maintenance resolved`;
    case "TRANSFER_APPROVED":
      return `${details?.assetTag || "Asset"} transfer approved`;
    case "ASSET_RETURNED":
      return `${details?.assetTag || "Asset"} returned by ${details?.employeeName || "employee"}`;
    default:
      return `${activity.action.replace(/_/g, " ").toLowerCase()}`;
  }
}

export default function RecentActivityFeed({
  activities,
  loading,
  error,
  onRetry,
}: RecentActivityFeedProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Activity
          </h3>
        </div>
        <div className="flex items-center justify-center py-8">
          <Spinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Activity
          </h3>
        </div>
        <div className="text-center py-8">
          <p className="text-red-600 mb-3">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Activity
          </h3>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-500">No recent activity</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <a
          href="/activity"
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          View all activity →
        </a>
      </div>
      <div className="space-y-3">
        {activities.map((activity) => {
          const icon = actionIcons[activity.action] || "📋";
          const message = getActivityMessage(activity);
          const timeAgo = formatDistanceToNow(new Date(activity.createdAt), {
            addSuffix: true,
          });

          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="text-2xl flex-shrink-0">{icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">{message}</p>
                <p className="text-xs text-gray-500 mt-1">{timeAgo}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
