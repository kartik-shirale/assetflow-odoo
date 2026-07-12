"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { apiGet } from "@/lib/api-client";

interface KpiData {
  total: number;
  allocated: number;
  underMaintenance: number;
  overdue: number;
  utilizationPct: number;
}

export function useKpis() {
  const [data, setData] = useState<KpiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchKpis = useCallback(async () => {
    const result = await apiGet<KpiData>("/api/dashboard/kpis");

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
    fetchKpis();

    // Poll every 20 seconds
    intervalRef.current = setInterval(() => {
      fetchKpis();
    }, 20000);

    // Refetch on window focus
    const handleFocus = () => {
      fetchKpis();
    };
    window.addEventListener("focus", handleFocus);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchKpis]);

  return { data, loading, error, refetch: fetchKpis };
}
