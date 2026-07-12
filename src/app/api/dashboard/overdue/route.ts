import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { getOverdueAllocations } from "@/lib/dashboard/queries";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { role, departmentId, id: userId } = session.user;

  try {
    let scope: { departmentId?: string | null; employeeId?: string } = {};

    if (role === "EMPLOYEE") {
      // Employees only see their own overdue items
      scope.employeeId = userId;
    } else if (role === "DEPARTMENT_HEAD" && departmentId) {
      // Department heads see their department's overdue items
      scope.departmentId = departmentId;
    }
    // Asset managers and admins see all (no scope)

    const overdueAllocations = await getOverdueAllocations(scope);

    return NextResponse.json(overdueAllocations);
  } catch (error) {
    console.error("Error fetching overdue allocations:", error);
    return NextResponse.json(
      { error: "Failed to fetch overdue allocations" },
      { status: 500 }
    );
  }
}
