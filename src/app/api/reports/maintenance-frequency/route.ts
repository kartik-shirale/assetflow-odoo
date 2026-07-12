import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { getMaintenanceFrequencyData } from "@/lib/dashboard/queries";
import { subDays } from "date-fns";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { role, departmentId } = session.user;

  // Only Asset Manager and Admin can view maintenance frequency
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
    const maintenanceData = await getMaintenanceFrequencyData({
      startDate,
      endDate,
      departmentId: null,
    });

    return NextResponse.json(maintenanceData);
  } catch (error) {
    console.error("Error fetching maintenance frequency data:", error);
    return NextResponse.json(
      { error: "Failed to fetch maintenance frequency data" },
      { status: 500 }
    );
  }
}
