import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { getBookingHeatmapData } from "@/lib/dashboard/queries";
import { subDays } from "date-fns";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { role } = session.user;

  // Only Asset Manager and Admin can view booking heatmap
  if (role !== "ASSET_MANAGER" && role !== "ADMIN") {
    return NextResponse.json(
      { error: "Forbidden - insufficient permissions" },
      { status: 403 }
    );
  }

  // Parse query params
  const { searchParams } = new URL(request.url);
  const startDateStr = searchParams.get("startDate");
  const endDateStr = searchParams.get("endDate");

  // Default to last 30 days
  const endDate = endDateStr ? new Date(endDateStr) : new Date();
  const startDate = startDateStr ? new Date(startDateStr) : subDays(endDate, 30);

  try {
    const heatmapData = await getBookingHeatmapData({ startDate, endDate });
    return NextResponse.json(heatmapData);
  } catch (error) {
    console.error("Error fetching booking heatmap data:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking heatmap data" },
      { status: 500 }
    );
  }
}
