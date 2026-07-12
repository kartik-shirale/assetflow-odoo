"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Spinner } from "@/components/ui/Spinner";

interface UtilizationData {
  date: string;
  utilizationPct: number;
  total: number;
  allocated: number;
}

interface UtilizationChartProps {
  data: UtilizationData[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export default function UtilizationChart({
  data,
  loading,
  error,
  onRetry,
}: UtilizationChartProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Asset Utilization Over Time
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
          Asset Utilization Over Time
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
          Asset Utilization Over Time
        </h3>
        <div className="text-center py-20">
          <p className="text-gray-500">No utilization data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Asset Utilization Over Time
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getMonth() + 1}/${date.getDate()}`;
            }}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value: number, name: string) => {
              if (name === "utilizationPct") return [`${value}%`, "Utilization"];
              return [value, name];
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="utilizationPct"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Utilization %"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
