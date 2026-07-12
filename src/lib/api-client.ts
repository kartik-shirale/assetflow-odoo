// lib/api-client.ts
type ApiResult<T> = { data: T; error: null } | { data: null; error: string };

export async function apiPost<T>(url: string, body: unknown): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json.error ?? "Something went wrong" };
    }

    return { data: json, error: null };
  } catch {
    return { data: null, error: "Network error — please try again" };
  }
}
