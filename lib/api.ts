export const API =
  process.env.NEXT_PUBLIC_API_URL ?? "http://192.168.0.122:3001";

export async function apiFetch(path: string, init: RequestInit = {}) {
  const url = path.startsWith("http") ? path : `${API}${path}`;

  const headers = new Headers(init.headers);

  // body가 있을 때만 Content-Type 넣기 (preflight 최소화)
  const hasBody = init.body !== undefined && init.body !== null;
  if (hasBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(url, {
    ...init,
    headers,
    credentials: "include", // ✅ 세션 쿠키 필수
  });
}
