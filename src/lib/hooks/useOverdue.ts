"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { apiGet } from "@/lib/api-client";

interface OverdueAllocation {
  id: string;
  expectedReturnDate: string;
  asset: {
    id: string;
    name: string;
    assetTag: string;
  };
  employee: {
    name: string;
  } | null;
}

export function useOverdue() {
  const [data, setData] = useState<OverdueAllocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchOverdue = useCallback(async () => {
    const result = await apiGet<OverdueAllocation[]>("/api/dashboard/overdue");

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setData(result.data);
      setError(null);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Initial fetch
    fetchOverdue();

    // Poll every 20 seconds
    intervalRef.current = setInterval(() => {
      fetchOverdue();
    }, 20000);

    // Refetch on window focus
    const handleFocus = () => {
      fetchOverdue();
    };
    window.addEventListener("focus", handleFocus);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchOverdue]);

  return { data, loading, error, refetch: fetchOverdue };
}
