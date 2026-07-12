"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Spinner } from "@/components/ui/Spinner";

interface MaintenanceData {
  category: string;
  count: number;
}

interface MaintenanceFrequencyChartProps {
  data: MaintenanceData[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export default function MaintenanceFrequencyChart({
  data,
  loading,
  error,
  onRetry,
}: MaintenanceFrequencyChartProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Maintenance Frequency by Category
        </h3>
        <div className="flex items-center justify-center h-80">
          <Spinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Maintenance Frequency by Category
        </h3>
        <div className="text-center py-20">
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

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Maintenance Frequency by Category
        </h3>
        <div className="text-center py-20">
          <p className="text-gray-500">No maintenance requests yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Maintenance Frequency by Category
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#3b82f6" name="Maintenance Requests" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
