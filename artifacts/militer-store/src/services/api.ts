/**
 * services/api.ts
 *
 * Centralises the API base URL so it never needs to be computed in components.
 * Every fetch call should use `apiUrl(path)`.
 */

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

/**
 * Build a full API URL for the given path.
 * @example apiUrl("/auth/login") → "/api/auth/login"
 */
export function apiUrl(path: string): string {
  return `${BASE}/api${path}`;
}

/**
 * Thin wrapper around fetch that:
 * - Always sends/receives JSON
 * - Always sends credentials (session cookie)
 * - Throws an Error with `error` field from response body on non-2xx
 */
export async function apiFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(apiUrl(path), {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    credentials: "include",
    ...init,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `API error ${res.status}`);
  }

  return res.json() as Promise<T>;
}
