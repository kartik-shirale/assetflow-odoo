"use client";

import { useState, useEffect } from "react";
import DepartmentAllocationChart from "@/components/dashboard/charts/DepartmentAllocationChart";
import ExportButton from "../_components/ExportButton";
import { apiGet } from "@/lib/api-client";

export default function DepartmentAllocationReportPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await apiGet<any[]>("/api/reports/department-allocation");

      if (result.error) {
        setError(result.error);
      } else {
        setData(result.data);
        setError(null);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Department Allocation Report
          </h1>
          <p className="text-gray-600">
            Asset distribution across departments
          </p>
        </div>
        <ExportButton reportType="department-allocation" />
      </div>

      {/* Chart */}
      <DepartmentAllocationChart
        data={data}
        loading={loading}
        error={error}
        onRetry={() => window.location.reload()}
      />

      {/* Summary Table */}
      {!loading && !error && data.length > 0 && (
        <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Summary by Department
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Allocated Assets
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((dept, index) => {
                  const total = data.reduce((sum, d) => sum + d.count, 0);
                  const percentage = ((dept.count / total) * 100).toFixed(1);

                  return (
                    <tr key={index}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {dept.department}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {dept.count}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {percentage}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
