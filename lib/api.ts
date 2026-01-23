// lib/api.ts (client fetch helper)
const BASE =
  (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "") ||
  "http://127.0.0.1:3001";

// lib/api.ts (client fetch helper) ✅ same-origin only
export async function apiFetch(path: string, init: RequestInit = {}) {
  const url = path.startsWith("/api")
    ? path
    : `/api${path.startsWith("/") ? "" : "/"}${path}`;

  return fetch(url, {
    ...init,
    credentials: "include",
    headers: {
      ...(init.headers || {}),
      // body가 있을 때만 Content-Type 넣는 게 더 안전하지만,
      // 현재 JSON만 쓰면 아래처럼 둬도 OK
      "Content-Type": "application/json",
    },
  });
}

