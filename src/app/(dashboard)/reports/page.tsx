import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth/authOptions";
import Link from "next/link";

export default async function ReportsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const { role } = session.user;

  // Employee role doesn't have access to reports
  if (role === "EMPLOYEE") {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Reports Not Available
        </h1>
        <p className="text-gray-600">
          You don't have permission to access reports. Contact your administrator
          for more information.
        </p>
      </div>
    );
  }

  const reports = [
    {
      name: "Asset Utilization",
      description: "Track asset allocation trends over time",
      href: "/reports/utilization",
      icon: "📊",
      roles: ["DEPARTMENT_HEAD", "ASSET_MANAGER", "ADMIN"],
    },
    {
      name: "Maintenance Frequency",
      description: "Maintenance requests by asset category",
      href: "/reports/maintenance-frequency",
      icon: "🔧",
      roles: ["ASSET_MANAGER", "ADMIN"],
    },
    {
      name: "Department Allocation",
      description: "Asset distribution across departments",
      href: "/reports/department-allocation",
      icon: "🏢",
      roles: ["DEPARTMENT_HEAD", "ASSET_MANAGER", "ADMIN"],
    },
    {
      name: "Booking Heatmap",
      description: "Resource booking patterns by day and hour",
      href: "/reports/booking-heatmap",
      icon: "📅",
      roles: ["ASSET_MANAGER", "ADMIN"],
    },
  ];

  const availableReports = reports.filter((report) =>
    report.roles.includes(role)
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports</h1>
        <p className="text-gray-600">
          Access analytics and insights about asset management
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {availableReports.map((report) => (
          <Link
            key={report.href}
            href={report.href}
            className="block p-6 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">{report.icon}</div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {report.name}
                </h3>
                <p className="text-sm text-gray-600">{report.description}</p>
              </div>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
