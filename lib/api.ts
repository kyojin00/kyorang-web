// lib/api.ts (client fetch helper)
const BASE =
  (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "") ||
  "http://127.0.0.1:3001";

export async function apiFetch(path: string, init: RequestInit = {}) {
  const url = path.startsWith("http")
    ? path
    : `${BASE}${path.startsWith("/") ? "" : "/"}${path}`;

  return fetch(url, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
}
