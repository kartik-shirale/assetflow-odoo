"use client";

import { useState, useEffect } from "react";
import { subDays, format } from "date-fns";
import BookingHeatmap from "@/components/dashboard/charts/BookingHeatmap";
import ExportButton from "../_components/ExportButton";
import { apiGet } from "@/lib/api-client";

export default function BookingHeatmapReportPage() {
  const [startDate, setStartDate] = useState(
    format(subDays(new Date(), 30), "yyyy-MM-dd")
  );
  const [endDate, setEndDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [data, setData] = useState<number[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await apiGet<number[][]>(
        `/api/reports/booking-heatmap?startDate=${startDate}&endDate=${endDate}`
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
            Booking Heatmap Report
          </h1>
          <p className="text-gray-600">
            Resource booking patterns by day and hour
          </p>
        </div>
        <ExportButton
          reportType="booking-heatmap"
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

      {/* Heatmap */}
      <BookingHeatmap
        data={data}
        loading={loading}
        error={error}
        onRetry={() => window.location.reload()}
      />

      {/* Insights */}
      {!loading && !error && data.length > 0 && (
        <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Key Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-600 font-medium mb-1">
                Peak Day
              </div>
              <div className="text-2xl font-bold text-blue-900">
                {
                  ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][
                    data.findIndex((day) => day.reduce((sum, h) => sum + h, 0) === Math.max(...data.map((d) => d.reduce((s, h) => s + h, 0))))
                  ]
                }
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-green-600 font-medium mb-1">
                Peak Hour
              </div>
              <div className="text-2xl font-bold text-green-900">
                {data.flat().indexOf(Math.max(...data.flat())) % 24}:00
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-sm text-purple-600 font-medium mb-1">
                Total Bookings
              </div>
              <div className="text-2xl font-bold text-purple-900">
                {data.flat().reduce((sum, count) => sum + count, 0)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
