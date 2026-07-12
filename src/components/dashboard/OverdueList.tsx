"use client";

import { differenceInDays } from "date-fns";
import Link from "next/link";
import { Spinner } from "@/components/ui/Spinner";

interface OverdueAllocation {
  id: string;
  expectedReturnDate: Date | string;
  asset: {
    id: string;
    name: string;
    assetTag: string;
  };
  employee: {
    name: string;
  } | null;
}

interface OverdueListProps {
  allocations: OverdueAllocation[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export default function OverdueList({
  allocations,
  loading,
  error,
  onRetry,
}: OverdueListProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Overdue Returns
        </h3>
        <div className="flex items-center justify-center py-8">
          <Spinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Overdue Returns
        </h3>
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

  if (allocations.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Overdue Returns
        </h3>
        <div className="text-center py-8">
          <p className="text-gray-500">No overdue returns 🎉</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Overdue Returns
      </h3>
      <div className="space-y-3">
        {allocations.map((allocation) => {
          const daysOverdue = differenceInDays(
            new Date(),
            new Date(allocation.expectedReturnDate)
          );

          return (
            <Link
              key={allocation.id}
              href={`/assets/${allocation.asset.id}`}
              className="block p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">
                      {allocation.asset.assetTag}
                    </span>
                    <span className="text-sm text-gray-600">
                      {allocation.asset.name}
                    </span>
                  </div>
                  {allocation.employee && (
                    <p className="text-sm text-gray-500 mt-1">
                      Held by: {allocation.employee.name}
                    </p>
                  )}
                </div>
                <div
                  className={`text-sm font-semibold px-2 py-1 rounded ${
                    daysOverdue > 7
                      ? "bg-red-100 text-red-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {daysOverdue}d overdue
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
