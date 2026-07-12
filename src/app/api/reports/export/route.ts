import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import {
  getUtilizationData,
  getMaintenanceFrequencyData,
  getDepartmentAllocationData,
  getBookingHeatmapData,
} from "@/lib/dashboard/queries";
import { subDays, format } from "date-fns";

function arrayToCSV(data: any[], headers: string[]): string {
  const headerRow = headers.join(",");
  const rows = data.map((row) =>
    headers.map((header) => {
      const value = row[header];
      // Escape commas and quotes
      if (typeof value === "string" && (value.includes(",") || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value ?? "";
    }).join(",")
  );
  return [headerRow, ...rows].join("\n");
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { role, departmentId } = session.user;
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const format_param = searchParams.get("format") || "csv";

  if (format_param !== "csv") {
    return NextResponse.json(
      { error: "Only CSV format is supported" },
      { status: 400 }
    );
  }

  // Date range
  const endDate = new Date();
  const startDate = subDays(endDate, 30);

  try {
    let csvData = "";
    let filename = "";

    switch (type) {
      case "utilization": {
        const scope =
          role === "DEPARTMENT_HEAD" && departmentId
            ? { departmentId, startDate, endDate }
            : { startDate, endDate };
        const data = await getUtilizationData(scope);
        csvData = arrayToCSV(data, ["date", "utilizationPct", "total", "allocated"]);
        filename = `utilization-${format(new Date(), "yyyy-MM-dd")}.csv`;
        break;
      }

      case "maintenance-frequency": {
        if (role !== "ASSET_MANAGER" && role !== "ADMIN") {
          return NextResponse.json(
            { error: "Forbidden - insufficient permissions" },
            { status: 403 }
          );
        }
        const data = await getMaintenanceFrequencyData({
          startDate,
          endDate,
          departmentId: null,
        });
        csvData = arrayToCSV(data, ["category", "count"]);
        filename = `maintenance-frequency-${format(new Date(), "yyyy-MM-dd")}.csv`;
        break;
      }

      case "department-allocation": {
        const scope =
          role === "DEPARTMENT_HEAD" && departmentId
            ? { departmentId }
            : {};
        const data = await getDepartmentAllocationData(scope);
        csvData = arrayToCSV(data, ["department", "count"]);
        filename = `department-allocation-${format(new Date(), "yyyy-MM-dd")}.csv`;
        break;
      }

      case "booking-heatmap": {
        if (role !== "ASSET_MANAGER" && role !== "ADMIN") {
          return NextResponse.json(
            { error: "Forbidden - insufficient permissions" },
            { status: 403 }
          );
        }
        const data = await getBookingHeatmapData({ startDate, endDate });
        // Flatten the 2D array into rows
        const flatData = data.flatMap((dayData, dayIndex) =>
          dayData.map((count, hourIndex) => ({
            day: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][
              dayIndex
            ],
            hour: hourIndex,
            count,
          }))
        );
        csvData = arrayToCSV(flatData, ["day", "hour", "count"]);
        filename = `booking-heatmap-${format(new Date(), "yyyy-MM-dd")}.csv`;
        break;
      }

      default:
        return NextResponse.json(
          { error: "Invalid report type" },
          { status: 400 }
        );
    }

    return new NextResponse(csvData, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error generating CSV export:", error);
    return NextResponse.json(
      { error: "Failed to generate export" },
      { status: 500 }
    );
  }
}
