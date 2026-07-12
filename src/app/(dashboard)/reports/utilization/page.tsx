"use client";

import { useState, useEffect } from "react";
import { subDays, format } from "date-fns";
import UtilizationChart from "@/components/dashboard/charts/UtilizationChart";
import ExportButton from "../_components/ExportButton";
import { apiGet } from "@/lib/api-client";

export default function UtilizationReportPage() {
  const [startDate, setStartDate] = useState(
    format(subDays(new Date(), 30), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await apiGet<any[]>(
        `/api/reports/utilization?startDate=${startDate}&endDate=${endDate}`
      );

      if (result.error) {
        setError(result.error);
      } else {
        setData(result.data);
        setError(null);
      }
      setLoading(false);
    };

    fetchData();
  }, [startDate, endDate]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Asset Utilization Report
          </h1>
          <p className="text-gray-600">
            Track asset allocation percentage over time
          </p>
        </div>
        <ExportButton
          reportType="utilization"
          startDate={startDate}
          endDate={endDate}
        />
      </div>

      {/* Date Range Picker */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setStartDate(format(subDays(new Date(), 30), "yyyy-MM-dd"));
                setEndDate(format(new Date(), "yyyy-MM-dd"));
              }}
              className="px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Reset to Last 30 Days
            </button>
          </div>
        </div>
      </div>

      {/* Chart */}
      <UtilizationChart
        data={data}
        loading={loading}
        error={error}
        onRetry={() => window.location.reload()}
      />
    </div>
  );
}
