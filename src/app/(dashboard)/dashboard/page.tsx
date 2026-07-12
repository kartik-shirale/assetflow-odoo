import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/authOptions";
import RoleDashboardSwitch from "./_components/RoleDashboardSwitch";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Today's Overview</h2>
        <p className="text-gray-600">A quick summary of your asset management</p>
      </div>

      <RoleDashboardSwitch
        role={session.user.role}
        userId={session.user.id}
        departmentId={session.user.departmentId}
      />
    </div>
  );
}
