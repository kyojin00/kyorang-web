// lib/api-server.ts
import { headers } from "next/headers";

async function getOriginFromHeaders() {
  const h = await headers(); // ✅ Next 15: headers()는 Promise

  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host");

  if (!host) return "http://localhost:3000";
  return `${proto}://${host}`;
}

/**
 * ✅ 서버 컴포넌트/서버 액션에서 호출하는 fetch
 * - 항상 같은 오리진의 /api 프록시로 호출
 */
export async function apiFetchServer(path: string, init: RequestInit = {}) {
  const origin = await getOriginFromHeaders(); // ✅ await

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${origin}/api${normalizedPath}`;

  return fetch(url, {
    cache: "no-store",
    ...init,
    headers: {
      ...(init.headers || {}),
    },
  });
}
