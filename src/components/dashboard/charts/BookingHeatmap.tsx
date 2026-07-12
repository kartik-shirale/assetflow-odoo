"use client";

import { Spinner } from "@/components/ui/Spinner";

interface BookingHeatmapProps {
  data: number[][]; // 7 days × 24 hours grid
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

function getHeatColor(value: number, max: number): string {
  if (value === 0) return "bg-gray-100";
  const intensity = Math.min(value / max, 1);
  if (intensity < 0.2) return "bg-blue-200";
  if (intensity < 0.4) return "bg-blue-300";
  if (intensity < 0.6) return "bg-blue-400";
  if (intensity < 0.8) return "bg-blue-500";
  return "bg-blue-600";
}

export default function BookingHeatmap({
  data,
  loading,
  error,
  onRetry,
}: BookingHeatmapProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Booking Heatmap (Day × Hour)
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
          Booking Heatmap (Day × Hour)
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

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Booking Heatmap (Day × Hour)
        </h3>
        <div className="text-center py-20">
          <p className="text-gray-500">No booking data available</p>
        </div>
      </div>
    );
  }

  // Find max value for color scaling
  const maxValue = Math.max(...data.flat());

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Booking Heatmap (Day × Hour)
      </h3>
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="flex">
            {/* Hour labels column */}
            <div className="flex flex-col">
              <div className="h-6" /> {/* Empty top-left corner */}
              {DAYS.map((day) => (
                <div
                  key={day}
                  className="h-8 w-12 flex items-center justify-end pr-2 text-xs font-medium text-gray-600"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Heatmap grid */}
            <div className="flex-1">
              {/* Hour headers */}
              <div className="flex">
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="h-6 flex-1 min-w-[20px] text-center text-xs text-gray-600"
                  >
                    {hour % 3 === 0 ? hour : ""}
                  </div>
                ))}
              </div>

              {/* Grid cells */}
              {data.map((dayData, dayIndex) => (
                <div key={dayIndex} className="flex">
                  {dayData.map((count, hourIndex) => {
                    const color = getHeatColor(count, maxValue);
                    return (
                      <div
                        key={hourIndex}
                        className={`h-8 flex-1 min-w-[20px] border border-gray-200 ${color} hover:ring-2 hover:ring-blue-400 transition-all cursor-pointer group relative`}
                        title={`${DAYS[dayIndex]} ${hourIndex}:00 - ${count} bookings`}
                      >
                        <div className="opacity-0 group-hover:opacity-100 absolute z-10 bg-gray-900 text-white text-xs rounded px-2 py-1 -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                          {count} bookings
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center justify-end gap-2 text-xs text-gray-600">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-4 h-4 bg-gray-100 border border-gray-200" />
              <div className="w-4 h-4 bg-blue-200 border border-gray-200" />
              <div className="w-4 h-4 bg-blue-300 border border-gray-200" />
              <div className="w-4 h-4 bg-blue-400 border border-gray-200" />
              <div className="w-4 h-4 bg-blue-500 border border-gray-200" />
              <div className="w-4 h-4 bg-blue-600 border border-gray-200" />
            </div>
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
