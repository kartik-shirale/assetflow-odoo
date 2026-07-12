"use client";

import { useEffect, useState } from "react";
import KpiCard from "@/components/dashboard/KpiCard";
import OverdueList from "@/components/dashboard/OverdueList";
import RecentActivityFeed from "@/components/dashboard/RecentActivityFeed";
import { useKpis } from "@/lib/hooks/useKpis";
import { useOverdue } from "@/lib/hooks/useOverdue";
import { apiGet } from "@/lib/api-client";
import {
  PackageIcon,
  AlertCircleIcon,
  Calendar03Icon,
  PieChartSquareIcon,
  Settings02Icon,
  CheckmarkCircle02Icon,
  FileSecurityIcon,
} from "hugeicons-react";

interface RoleDashboardSwitchProps {
  role: string;
  userId: string;
  departmentId?: string | null;
}

export default function RoleDashboardSwitch({
  role,
  userId,
  departmentId,
}: RoleDashboardSwitchProps) {
  if (role === "EMPLOYEE") {
    return <EmployeeDashboard userId={userId} />;
  }

  if (role === "DEPARTMENT_HEAD") {
    return <DepartmentHeadDashboard departmentId={departmentId} />;
  }

  if (role === "ASSET_MANAGER") {
    return <AssetManagerDashboard />;
  }

  if (role === "ADMIN") {
    return <AdminDashboard />;
  }

  return null;
}

// EMPLOYEE Dashboard
function EmployeeDashboard({ userId }: { userId: string }) {
  const { data: overdue, loading: overdueLoading, error: overdueError, refetch: refetchOverdue } = useOverdue();
  const [allocations, setAllocations] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [allocRes, bookingsRes] = await Promise.all([
        apiGet<any[]>("/api/employee/allocations"),
        apiGet<any[]>("/api/employee/bookings"),
      ]);

      if (allocRes.data) setAllocations(allocRes.data);
      if (bookingsRes.data) setBookings(bookingsRes.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard
          label="My Assets"
          value={allocations.length}
          subtitle="Currently allocated"
          icon={<PackageIcon size={24} />}
          variant="default"
        />
        <KpiCard
          label="Overdue Returns"
          value={overdue.length}
          subtitle={overdue.length > 0 ? "Need attention" : "All clear"}
          icon={<AlertCircleIcon size={24} />}
          variant={overdue.length > 0 ? "warning" : "success"}
        />
        <KpiCard
          label="Upcoming Bookings"
          value={bookings.length}
          subtitle="Scheduled"
          icon={<Calendar03Icon size={24} />}
          variant="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OverdueList
          allocations={overdue}
          loading={overdueLoading}
          error={overdueError}
          onRetry={refetchOverdue}
        />
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            My Upcoming Bookings
          </h3>
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No upcoming bookings
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="p-3 border border-gray-200 rounded-lg"
                >
                  <div className="font-medium text-gray-900">
                    {booking.asset?.name}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {new Date(booking.startTime).toLocaleString()} -{" "}
                    {new Date(booking.endTime).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <a
          href="/bookings/new"
          className="p-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
        >
          <div className="text-3xl mb-2">📅</div>
          <div className="font-semibold">Book Resource</div>
          <div className="text-sm opacity-90">Reserve a resource</div>
        </a>
        <a
          href="/maintenance/new"
          className="p-6 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors text-center"
        >
          <div className="text-3xl mb-2">🔧</div>
          <div className="font-semibold text-gray-900">Raise Requests</div>
          <div className="text-sm text-gray-600">Submit a new request</div>
        </a>
        <a
          href="/assets"
          className="p-6 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors text-center"
        >
          <div className="text-3xl mb-2">📦</div>
          <div className="font-semibold text-gray-900">View Assets</div>
          <div className="text-sm text-gray-600">Browse asset catalog</div>
        </a>
      </div>
    </div>
  );
}

// DEPARTMENT_HEAD Dashboard
function DepartmentHeadDashboard({ departmentId }: { departmentId?: string | null }) {
  const { data: kpis, loading: kpisLoading, error: kpisError, refetch: refetchKpis } = useKpis();
  const { data: overdue, loading: overdueLoading, error: overdueError, refetch: refetchOverdue } = useOverdue();
  const [activities, setActivities] = useState<any[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activityError, setActivityError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivity = async () => {
      const result = await apiGet<any[]>("/api/dashboard/recent-activity");
      if (result.error) {
        setActivityError(result.error);
      } else {
        setActivities(result.data);
      }
      setActivityLoading(false);
    };

    fetchActivity();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {kpisLoading ? (
          <div className="col-span-4 text-center py-8">Loading KPIs...</div>
        ) : kpisError ? (
          <div className="col-span-4 text-center py-8 text-red-600">
            {kpisError}
            <button onClick={refetchKpis} className="ml-2 text-blue-600">Retry</button>
          </div>
        ) : kpis ? (
          <>
            <KpiCard
              label="Total Assets"
              value={kpis.total}
              icon={<span className="text-2xl">📦</span>}
              variant="default"
            />
            <KpiCard
              label="Allocated"
              value={`${kpis.utilizationPct}%`}
              icon={<span className="text-2xl">📊</span>}
              variant="success"
            />
            <KpiCard
              label="Under Maintenance"
              value={kpis.underMaintenance}
              icon={<span className="text-2xl">🔧</span>}
              variant="warning"
            />
            <KpiCard
              label="Overdue"
              value={kpis.overdue}
              icon={<span className="text-2xl">⚠️</span>}
              variant={kpis.overdue > 0 ? "danger" : "success"}
            />
          </>
        ) : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OverdueList
          allocations={overdue}
          loading={overdueLoading}
          error={overdueError}
          onRetry={refetchOverdue}
        />
        <RecentActivityFeed
          activities={activities}
          loading={activityLoading}
          error={activityError}
          onRetry={() => window.location.reload()}
        />
      </div>
    </div>
  );
}

// ASSET_MANAGER Dashboard
function AssetManagerDashboard() {
  const { data: kpis, loading: kpisLoading, error: kpisError, refetch: refetchKpis } = useKpis();
  const { data: overdue, loading: overdueLoading, error: overdueError, refetch: refetchOverdue } = useOverdue();
  const [activities, setActivities] = useState<any[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activityError, setActivityError] = useState<string | null>(null);
  const [approvals, setApprovals] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [activityRes, approvalsRes] = await Promise.all([
        apiGet<any[]>("/api/dashboard/recent-activity"),
        apiGet<any>("/api/dashboard/pending-approvals"),
      ]);

      if (activityRes.error) {
        setActivityError(activityRes.error);
      } else {
        setActivities(activityRes.data);
      }

      if (approvalsRes.data) {
        setApprovals(approvalsRes.data);
      }

      setActivityLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {kpisLoading ? (
          <div className="col-span-5 text-center py-8">Loading KPIs...</div>
        ) : kpisError ? (
          <div className="col-span-5 text-center py-8 text-red-600">
            {kpisError}
            <button onClick={refetchKpis} className="ml-2 text-blue-600">Retry</button>
          </div>
        ) : kpis ? (
          <>
            <KpiCard
              label="Total Assets"
              value={kpis.total}
              icon={<span className="text-2xl">📦</span>}
              variant="default"
            />
            <KpiCard
              label="Allocated"
              value={`${kpis.utilizationPct}%`}
              icon={<span className="text-2xl">📊</span>}
              variant="success"
            />
            <KpiCard
              label="Under Maintenance"
              value={kpis.underMaintenance}
              icon={<span className="text-2xl">🔧</span>}
              variant="warning"
            />
            <KpiCard
              label="Overdue"
              value={kpis.overdue}
              subtitle="Need follow-up"
              icon={<AlertCircleIcon size={24} />}
              variant={kpis.overdue > 0 ? "danger" : "success"}
            />
            <KpiCard
              label="Pending Approvals"
              value={approvals ? approvals.maintenanceApprovals + approvals.transferApprovals : 0}
              subtitle="Awaiting review"
              icon={<CheckmarkCircle02Icon size={24} />}
              variant="purple"
            />
          </>
        ) : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OverdueList
          allocations={overdue}
          loading={overdueLoading}
          error={overdueError}
          onRetry={refetchOverdue}
        />
        <RecentActivityFeed
          activities={activities}
          loading={activityLoading}
          error={activityError}
          onRetry={() => window.location.reload()}
        />
      </div>

      {/* Quick links for asset manager */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <a
          href="/assets/new"
          className="p-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
        >
          <div className="text-3xl mb-2">➕</div>
          <div className="font-semibold">Register Asset</div>
          <div className="text-sm opacity-90">Add a new asset</div>
        </a>
        <a
          href="/maintenance/approvals"
          className="p-6 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors text-center"
        >
          <div className="text-3xl mb-2">✅</div>
          <div className="font-semibold text-gray-900">Approvals</div>
          <div className="text-sm text-gray-600">
            {approvals?.maintenanceApprovals || 0} pending
          </div>
        </a>
        <a
          href="/transfers"
          className="p-6 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors text-center"
        >
          <div className="text-3xl mb-2">🔄</div>
          <div className="font-semibold text-gray-900">Transfers</div>
          <div className="text-sm text-gray-600">
            {approvals?.transferApprovals || 0} pending
          </div>
        </a>
        <a
          href="/reports"
          className="p-6 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-300 transition-colors text-center"
        >
          <div className="text-3xl mb-2">📈</div>
          <div className="font-semibold text-gray-900">Reports</div>
          <div className="text-sm text-gray-600">View analytics</div>
        </a>
      </div>
    </div>
  );
}

// ADMIN Dashboard (similar to Asset Manager but with extra admin widgets)
function AdminDashboard() {
  const { data: kpis, loading: kpisLoading, error: kpisError, refetch: refetchKpis } = useKpis();
  const { data: overdue, loading: overdueLoading, error: overdueError, refetch: refetchOverdue } = useOverdue();
  const [activities, setActivities] = useState<any[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activityError, setActivityError] = useState<string | null>(null);
  const [approvals, setApprovals] = useState<any>(null);
  const [auditCycles, setAuditCycles] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [activityRes, approvalsRes, auditRes] = await Promise.all([
        apiGet<any[]>("/api/dashboard/recent-activity"),
        apiGet<any>("/api/dashboard/pending-approvals"),
        apiGet<any[]>("/api/dashboard/audit-cycles"),
      ]);

      if (activityRes.error) {
        setActivityError(activityRes.error);
      } else {
        setActivities(activityRes.data);
      }

      if (approvalsRes.data) {
        setApprovals(approvalsRes.data);
      }

      if (auditRes.data) {
        setAuditCycles(auditRes.data);
      }

      setActivityLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {kpisLoading ? (
          <div className="col-span-5 text-center py-8">Loading KPIs...</div>
        ) : kpisError ? (
          <div className="col-span-5 text-center py-8 text-red-600">
            {kpisError}
            <button onClick={refetchKpis} className="ml-2 text-blue-600">Retry</button>
          </div>
        ) : kpis ? (
          <>
            <KpiCard
              label="Total Assets"
              value={kpis.total}
              icon={<span className="text-2xl">📦</span>}
              variant="default"
            />
            <KpiCard
              label="Allocated"
              value={`${kpis.utilizationPct}%`}
              icon={<span className="text-2xl">📊</span>}
              variant="success"
            />
            <KpiCard
              label="Under Maintenance"
              value={kpis.underMaintenance}
              icon={<span className="text-2xl">🔧</span>}
              variant="warning"
            />
            <KpiCard
              label="Overdue"
              value={kpis.overdue}
              icon={<span className="text-2xl">⚠️</span>}
              variant={kpis.overdue > 0 ? "danger" : "success"}
            />
            <KpiCard
              label="Active Audits"
              value={auditCycles.length}
              subtitle="Ongoing cycles"
              icon={<FileSecurityIcon size={24} />}
              variant="purple"
            />
          </>
        ) : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OverdueList
          allocations={overdue}
          loading={overdueLoading}
          error={overdueError}
          onRetry={refetchOverdue}
        />
        <RecentActivityFeed
          activities={activities}
          loading={activityLoading}
          error={activityError}
          onRetry={() => window.location.reload()}
        />
      </div>

      {/* Admin-specific section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Active Audit Cycles
        </h3>
        {auditCycles.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No active audit cycles
          </div>
        ) : (
          <div className="space-y-3">
            {auditCycles.map((audit) => (
              <div
                key={audit.id}
                className="p-3 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium text-gray-900">{audit.name}</div>
                  <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded">
                    {audit.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {new Date(audit.startDate).toLocaleDateString()} -{" "}
                  {new Date(audit.endDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
