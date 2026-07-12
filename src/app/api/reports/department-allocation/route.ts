import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { getDepartmentAllocationData } from "@/lib/dashboard/queries";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { role, departmentId } = session.user;

  // Department heads see their department only
  if (role === "DEPARTMENT_HEAD") {
    if (!departmentId) {
      return NextResponse.json(
        { error: "Department not assigned" },
        { status: 400 }
      );
    }

    try {
      const allocationData = await getDepartmentAllocationData({ departmentId });
      return NextResponse.json(allocationData);
    } catch (error) {
      console.error("Error fetching department allocation data:", error);
      return NextResponse.json(
        { error: "Failed to fetch department allocation data" },
        { status: 500 }
      );
    }
  }

  // Asset Manager and Admin see all departments
  if (role !== "ASSET_MANAGER" && role !== "ADMIN") {
    return NextResponse.json(
      { error: "Forbidden - insufficient permissions" },
      { status: 403 }
    );
  }

  try {
    const allocationData = await getDepartmentAllocationData({});
    return NextResponse.json(allocationData);
  } catch (error) {
    console.error("Error fetching department allocation data:", error);
    return NextResponse.json(
      { error: "Failed to fetch department allocation data" },
      { status: 500 }
    );
  }
}
