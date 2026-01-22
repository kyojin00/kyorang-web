// lib/api-server.ts
function normalizeBase(base: string) {
  return base.replace(/\/$/, "");
}

export function getApiBase() {
  // ✅ 운영: .env.production / 개발: .env.local
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (base && base.trim()) return normalizeBase(base.trim());

  // ✅ fallback (개발에서 env 안 넣었을 때만)
  return "http://127.0.0.1:3001";
}

export async function apiFetchServer(path: string, init: RequestInit = {}) {
  const base = getApiBase();
  const url = path.startsWith("http")
    ? path
    : `${base}${path.startsWith("/") ? "" : "/"}${path}`;

  return fetch(url, {
    cache: "no-store",
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
}
