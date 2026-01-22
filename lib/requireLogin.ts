// /lib/requireLogin.ts
import { apiFetch } from "@/lib/api";

export async function isLoggedIn(): Promise<boolean> {
  const res = await apiFetch("/auth/me", { method: "GET" });
  return res.ok;
}
