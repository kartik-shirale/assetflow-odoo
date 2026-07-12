import prisma from "@/lib/prisma";
import { differenceInDays, startOfDay, endOfDay, format } from "date-fns";

// KPI Queries
export async function getKpis(scope: { departmentId?: string | null }) {
  const where = scope.departmentId ? { departmentId: scope.departmentId } : {};

  const [total, allocated, underMaintenance, overdue] = await Promise.all([
    prisma.asset.count({ where }),
    prisma.asset.count({ where: { ...where, status: "ALLOCATED" } }),
    prisma.asset.count({ where: { ...where, status: "UNDER_MAINTENANCE" } }),
    prisma.allocation.count({
      where: {
        status: "ACTIVE",
        expectedReturnDate: { lt: new Date() },
        ...(scope.departmentId ? { departmentId: scope.departmentId } : {}),
      },
    }),
  ]);

  return {
    total,
    allocated,
    underMaintenance,
    overdue,
    utilizationPct: total ? Math.round((allocated / total) * 100) : 0,
  };
}

// Overdue Allocations
export async function getOverdueAllocations(scope: {
  departmentId?: string | null;
  employeeId?: string;
}) {
  return prisma.allocation.findMany({
    where: {
      status: "ACTIVE",
      expectedReturnDate: { lt: new Date() },
      ...(scope.departmentId ? { departmentId: scope.departmentId } : {}),
      ...(scope.employeeId ? { employeeId: scope.employeeId } : {}),
    },
    include: {
      asset: { select: { name: true, assetTag: true, id: true } },
      employee: { select: { name: true } },
    },
    orderBy: { expectedReturnDate: "asc" },
    take: 20,
  });
}

// Recent Activity Feed
export async function getRecentActivity(scope: {
  departmentId?: string | null;
  employeeId?: string;
  limit?: number;
}) {
  return prisma.activityLog.findMany({
    where: {
      ...(scope.employeeId ? { userId: scope.employeeId } : {}),
      // For department scoping, we'd need to join through the entities
      // For now, if departmentId is provided, we return org-wide for simplicity
    },
    include: {
      user: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: scope.limit || 10,
  });
}

// Utilization Report - allocations over time
export async function getUtilizationData(params: {
  startDate: Date;
  endDate: Date;
  departmentId?: string | null;
}) {
  const { startDate, endDate, departmentId } = params;

  // Get daily buckets
  const days: Date[] = [];
  let currentDay = startOfDay(startDate);
  const end = endOfDay(endDate);

  while (currentDay <= end) {
    days.push(new Date(currentDay));
    currentDay.setDate(currentDay.getDate() + 1);
  }

  // For each day, count allocated vs total assets
  const data = await Promise.all(
    days.map(async (day) => {
      const where = departmentId ? { departmentId } : {};
      const dayEnd = endOfDay(day);

      const [total, allocated] = await Promise.all([
        prisma.asset.count({
          where: {
            ...where,
            createdAt: { lte: dayEnd },
          },
        }),
        prisma.asset.count({
          where: {
            ...where,
            status: "ALLOCATED",
            createdAt: { lte: dayEnd },
          },
        }),
      ]);

      return {
        date: format(day, "yyyy-MM-dd"),
        utilizationPct: total ? Math.round((allocated / total) * 100) : 0,
        total,
        allocated,
      };
    })
  );

  return data;
}

// Maintenance Frequency by Category
export async function getMaintenanceFrequencyData(params: {
  startDate: Date;
  endDate: Date;
  departmentId?: string | null;
}) {
  const { startDate, endDate, departmentId } = params;

  const requests = await prisma.maintenanceRequest.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      ...(departmentId
        ? {
            asset: {
              departmentId,
            },
          }
        : {}),
    },
    include: {
      asset: {
        include: {
          category: true,
        },
      },
    },
  });

  // Group by category
  const grouped = requests.reduce(
    (acc, req) => {
      const categoryName = req.asset.category.name;
      if (!acc[categoryName]) {
        acc[categoryName] = 0;
      }
      acc[categoryName]++;
      return acc;
    },
    {} as Record<string, number>
  );

  return Object.entries(grouped).map(([category, count]) => ({
    category,
    count,
  }));
}

// Department Allocation
export async function getDepartmentAllocationData(params: {
  departmentId?: string | null;
}) {
  const where = params.departmentId ? { departmentId: params.departmentId } : {};

  const allocations = await prisma.allocation.findMany({
    where: {
      status: "ACTIVE",
      departmentId: where.departmentId,
    },
    include: {
      department: {
        select: { name: true },
      },
    },
  });

  // Group by department
  const grouped = allocations.reduce(
    (acc, alloc) => {
      const deptName = alloc.department?.name || "Unassigned";
      if (!acc[deptName]) {
        acc[deptName] = 0;
      }
      acc[deptName]++;
      return acc;
    },
    {} as Record<string, number>
  );

  return Object.entries(grouped).map(([department, count]) => ({
    department,
    count,
  }));
}

// Booking Heatmap - day of week × hour grid
export async function getBookingHeatmapData(params: {
  startDate: Date;
  endDate: Date;
}) {
  const { startDate, endDate } = params;

  const bookings = await prisma.booking.findMany({
    where: {
      startTime: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      startTime: true,
    },
  });

  // Initialize 7 days × 24 hours grid
  const grid: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));

  bookings.forEach((booking) => {
    const dayOfWeek = booking.startTime.getDay(); // 0 = Sunday
    const hour = booking.startTime.getHours();
    grid[dayOfWeek][hour]++;
  });

  return grid;
}

// Employee-specific queries
export async function getEmployeeAllocations(employeeId: string) {
  return prisma.allocation.findMany({
    where: {
      employeeId,
      status: "ACTIVE",
    },
    include: {
      asset: {
        select: { name: true, assetTag: true, id: true },
      },
    },
    orderBy: { allocationDate: "desc" },
    take: 10,
  });
}

export async function getEmployeeBookings(employeeId: string) {
  return prisma.booking.findMany({
    where: {
      bookedById: employeeId,
      status: { in: ["UPCOMING", "ONGOING"] },
    },
    include: {
      asset: {
        select: { name: true, assetTag: true },
      },
    },
    orderBy: { startTime: "asc" },
    take: 10,
  });
}

export async function getEmployeeMaintenanceRequests(employeeId: string) {
  return prisma.maintenanceRequest.findMany({
    where: {
      raisedById: employeeId,
      status: { in: ["PENDING", "APPROVED", "IN_PROGRESS"] },
    },
    include: {
      asset: {
        select: { name: true, assetTag: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
}

// Department Head specific
export async function getDepartmentStats(departmentId: string) {
  const [assetCount, employeeCount, pendingTransfers] = await Promise.all([
    prisma.asset.count({ where: { departmentId } }),
    prisma.user.count({ where: { departmentId, status: "ACTIVE" } }),
    prisma.transferRequest.count({
      where: {
        status: "REQUESTED",
        asset: { departmentId },
      },
    }),
  ]);

  return {
    assetCount,
    employeeCount,
    pendingTransfers,
  };
}

// Asset Manager / Admin specific
export async function getPendingApprovals() {
  const [maintenanceApprovals, transferApprovals] = await Promise.all([
    prisma.maintenanceRequest.count({
      where: { status: "PENDING" },
    }),
    prisma.transferRequest.count({
      where: { status: "REQUESTED" },
    }),
  ]);

  return {
    maintenanceApprovals,
    transferApprovals,
  };
}

export async function getActiveAuditCycles() {
  return prisma.auditCycle.findMany({
    where: {
      status: { in: ["PLANNED", "IN_PROGRESS"] },
    },
    select: {
      id: true,
      name: true,
      status: true,
      startDate: true,
      endDate: true,
    },
    orderBy: { startDate: "desc" },
    take: 5,
  });
}

export async function getDepartmentHealthList() {
  const departments = await prisma.department.findMany({
    where: { status: "ACTIVE" },
    include: {
      head: {
        select: { name: true },
      },
      _count: {
        select: {
          employees: true,
        },
      },
    },
  });

  return departments.map((dept) => ({
    id: dept.id,
    name: dept.name,
    headName: dept.head?.name || "No head assigned",
    employeeCount: dept._count.employees,
  }));
}
