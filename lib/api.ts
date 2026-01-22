// // /lib/api.ts
// export const API = ""; // ✅ 같은 오리진 사용

// export async function apiFetch(path: string, init: RequestInit = {}) {
//   const url = path.startsWith("http") ? path : `/api${path}`;

//   const headers = new Headers(init.headers);
//   const hasBody = init.body !== undefined && init.body !== null;
//   if (hasBody && !headers.has("Content-Type")) {
//     headers.set("Content-Type", "application/json");
//   }

//   return fetch(url, {
//     ...init,
//     headers,
//     credentials: "include",
//   });
// }

// lib/api.ts
const BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:3001"; // 개발 fallback

export async function apiFetch(path: string, init: RequestInit = {}) {
  const url = path.startsWith("http") ? path : `${BASE}${path.startsWith("/") ? "" : "/"}${path}`;

  return fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    credentials: "include",
  });
}
