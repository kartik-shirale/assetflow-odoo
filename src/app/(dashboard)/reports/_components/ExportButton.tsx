"use client";

import { useState } from "react";

interface ExportButtonProps {
  reportType: string;
  startDate?: string;
  endDate?: string;
}

export default function ExportButton({
  reportType,
  startDate,
  endDate,
}: ExportButtonProps) {
  const [exporting, setExporting] = useState(false);

  const handleExport = () => {
    setExporting(true);

    const params = new URLSearchParams({
      type: reportType,
      format: "csv",
    });

    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const url = `/api/reports/export?${params.toString()}`;

    // Use a link to trigger browser download
    const link = document.createElement("a");
    link.href = url;
    link.download = `${reportType}-export.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Reset after a delay
    setTimeout(() => setExporting(false), 1000);
  };

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      {exporting ? "Exporting..." : "Export CSV"}
    </button>
  );
}
