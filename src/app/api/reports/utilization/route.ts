import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { getUtilizationData } from "@/lib/dashboard/queries";
import { subDays } from "date-fns";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { role, departmentId } = session.user;

  // Parse query params
  const { searchParams } = new URL(request.url);
  const startDateStr = searchParams.get("startDate");
  const endDateStr = searchParams.get("endDate");

  // Default to last 30 days
  const endDate = endDateStr ? new Date(endDateStr) : new Date();
  const startDate = startDateStr ? new Date(startDateStr) : subDays(endDate, 30);

  try {
    // Department heads see their department only
    const scope =
      role === "DEPARTMENT_HEAD" && departmentId
        ? { departmentId, startDate, endDate }
        : { startDate, endDate };

    const utilizationData = await getUtilizationData(scope);

    return NextResponse.json(utilizationData);
  } catch (error) {
    console.error("Error fetching utilization data:", error);
    return NextResponse.json(
      { error: "Failed to fetch utilization data" },
      { status: 500 }
    );
  }
}
