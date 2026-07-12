import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { getRecentActivity } from "@/lib/dashboard/queries";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { role, departmentId, id: userId } = session.user;

  try {
    let scope: { departmentId?: string | null; employeeId?: string; limit?: number } = {
      limit: 10,
    };

    if (role === "EMPLOYEE") {
      // Employees see their own activity
      scope.employeeId = userId;
    } else if (role === "DEPARTMENT_HEAD" && departmentId) {
      // Department heads see their department's activity
      scope.departmentId = departmentId;
    }
    // Asset managers and admins see org-wide activity

    const activities = await getRecentActivity(scope);

    return NextResponse.json(activities);
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent activity" },
      { status: 500 }
    );
  }
}
