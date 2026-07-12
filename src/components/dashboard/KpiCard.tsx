import Link from "next/link";
import { ReactNode } from "react";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from "@heroicons/react/24/outline";

interface KpiCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    direction: "up" | "down";
    value: number;
  };
  icon?: ReactNode;
  href?: string;
  variant?: "default" | "success" | "warning" | "danger" | "purple";
}

export default function KpiCard({
  label,
  value,
  subtitle,
  trend,
  icon,
  href,
  variant = "default",
}: KpiCardProps) {
  const variantClasses = {
    default: "bg-indigo-100 text-indigo-600",
    success: "bg-green-100 text-green-600",
    warning: "bg-orange-100 text-orange-600",
    danger: "bg-red-100 text-red-600",
    purple: "bg-purple-100 text-purple-600",
  };

  const content = (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-200 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
          {trend && (
            <div
              className={`flex items-center gap-1 mt-3 text-sm font-medium ${
                trend.direction === "up" ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend.direction === "up" ? (
                <ArrowTrendingUpIcon className="w-4 h-4" />
              ) : (
                <ArrowTrendingDownIcon className="w-4 h-4" />
              )}
              <span>{trend.value}%</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`p-3.5 rounded-xl ${variantClasses[variant]} transition-transform group-hover:scale-110`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
