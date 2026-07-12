import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";
import { getKpis } from "@/lib/dashboard/queries";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { role, departmentId } = session.user;

  // Employee role doesn't get org-wide KPIs
  if (role === "EMPLOYEE") {
    return NextResponse.json(
      { error: "Forbidden - insufficient permissions" },
      { status: 403 }
    );
  }

  try {
    // Asset Manager and Admin see org-wide, Department Head sees their department only
    const scope =
      role === "DEPARTMENT_HEAD" && departmentId
        ? { departmentId }
        : {};

    const kpis = await getKpis(scope);

    return NextResponse.json(kpis);
  } catch (error) {
    console.error("Error fetching KPIs:", error);
    return NextResponse.json(
      { error: "Failed to fetch KPIs" },
      { status: 500 }
    );
  }
}
