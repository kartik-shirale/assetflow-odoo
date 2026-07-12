"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Squares2X2Icon,
  BuildingOfficeIcon,
  CubeIcon,
  ArrowsRightLeftIcon,
  CalendarIcon,
  WrenchScrewdriverIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  BellIcon,
  LifebuoyIcon,
} from "@heroicons/react/24/outline";
import {
  Squares2X2Icon as Squares2X2IconSolid,
  BuildingOfficeIcon as BuildingOfficeIconSolid,
  CubeIcon as CubeIconSolid,
  ArrowsRightLeftIcon as ArrowsRightLeftIconSolid,
  CalendarIcon as CalendarIconSolid,
  WrenchScrewdriverIcon as WrenchScrewdriverIconSolid,
  ShieldCheckIcon as ShieldCheckIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  BellIcon as BellIconSolid,
} from "@heroicons/react/24/solid";

interface SidebarProps {
  role: string;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<any>;
  iconSolid: React.ComponentType<any>;
  roles: string[];
}

const navItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: Squares2X2Icon,
    iconSolid: Squares2X2IconSolid,
    roles: ["EMPLOYEE", "DEPARTMENT_HEAD", "ASSET_MANAGER", "ADMIN"],
  },
  {
    href: "/organization",
    label: "Organization Setup",
    icon: BuildingOfficeIcon,
    iconSolid: BuildingOfficeIconSolid,
    roles: ["ADMIN"],
  },
  {
    href: "/assets",
    label: "Assets",
    icon: CubeIcon,
    iconSolid: CubeIconSolid,
    roles: ["EMPLOYEE", "DEPARTMENT_HEAD", "ASSET_MANAGER", "ADMIN"],
  },
  {
    href: "/allocations",
    label: "Allocation & Transfer",
    icon: ArrowsRightLeftIcon,
    iconSolid: ArrowsRightLeftIconSolid,
    roles: ["DEPARTMENT_HEAD", "ASSET_MANAGER", "ADMIN"],
  },
  {
    href: "/bookings",
    label: "Resource Booking",
    icon: CalendarIcon,
    iconSolid: CalendarIconSolid,
    roles: ["EMPLOYEE", "DEPARTMENT_HEAD", "ASSET_MANAGER", "ADMIN"],
  },
  {
    href: "/maintenance",
    label: "Maintenance",
    icon: WrenchScrewdriverIcon,
    iconSolid: WrenchScrewdriverIconSolid,
    roles: ["EMPLOYEE", "DEPARTMENT_HEAD", "ASSET_MANAGER", "ADMIN"],
  },
  {
    href: "/audit",
    label: "Audit",
    icon: ShieldCheckIcon,
    iconSolid: ShieldCheckIconSolid,
    roles: ["ASSET_MANAGER", "ADMIN"],
  },
  {
    href: "/reports",
    label: "Reports",
    icon: ChartBarIcon,
    iconSolid: ChartBarIconSolid,
    roles: ["DEPARTMENT_HEAD", "ASSET_MANAGER", "ADMIN"],
  },
  {
    href: "/notifications",
    label: "Notifications",
    icon: BellIcon,
    iconSolid: BellIconSolid,
    roles: ["EMPLOYEE", "DEPARTMENT_HEAD", "ASSET_MANAGER", "ADMIN"],
  },
];

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const visibleItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white transition-transform group-hover:scale-105">
            <CubeIconSolid className="w-6 h-6" />
          </div>
          <span className="text-xl font-bold text-gray-900">AssetFlow</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {visibleItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            const IconComponent = isActive ? item.iconSolid : item.icon;
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 font-medium shadow-sm"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Help section */}
      <div className="p-4 border-t border-gray-200">
        <Link
          href="/help"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 group"
        >
          <LifebuoyIcon className="w-5 h-5 text-indigo-600" />
          <div className="text-sm">
            <div className="font-medium">Need help?</div>
            <div className="text-xs text-gray-500 group-hover:text-indigo-600">Contact support</div>
          </div>
        </Link>
      </div>
    </aside>
  );
}
