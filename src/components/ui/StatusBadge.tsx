interface StatusBadgeProps {
  status: string;
  colorMap: Record<string, { bg: string; text: string; dot: string }>;
}

export function StatusBadge({ status, colorMap }: StatusBadgeProps) {
  const colors =
    colorMap[status] || { bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-500" };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      {status}
    </span>
  );
}

// Predefined color maps for common status types
export const STATUS_COLORS = {
  ACTIVE: { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
  INACTIVE: { bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-500" },
};

export const ASSET_STATUS_COLORS = {
  AVAILABLE: { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
  ALLOCATED: { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
  RESERVED: { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500" },
  UNDER_MAINTENANCE: { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" },
  LOST: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
  RETIRED: { bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-500" },
  DISPOSED: { bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-500" },
};

export const ALLOCATION_STATUS_COLORS = {
  ACTIVE: { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
  RETURNED: { bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-500" },
};

// Category colors (pill style, non-status based)
export const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Electronics: { bg: "bg-indigo-100", text: "text-indigo-700" },
  Furniture: { bg: "bg-cyan-100", text: "text-cyan-700" },
  Vehicles: { bg: "bg-purple-100", text: "text-purple-700" },
  Software: { bg: "bg-pink-100", text: "text-pink-700" },
  Equipment: { bg: "bg-orange-100", text: "text-orange-700" },
};

export function CategoryBadge({ category }: { category: string }) {
  const colors = CATEGORY_COLORS[category] || { bg: "bg-gray-100", text: "text-gray-700" };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}
    >
      {category}
    </span>
  );
}
