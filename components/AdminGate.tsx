"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function AdminGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    let alive = true;

    (async () => {
      const res = await apiFetch("/auth/me");
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        router.replace(`/login?next=${encodeURIComponent(pathname)}`);
        return;
      }

      const role = data?.user?.role;
      if (role !== "ADMIN") {
        router.replace("/");
        return;
      }

      if (alive) setOk(true);
    })();

    return () => {
      alive = false;
    };
  }, [pathname, router]);

  if (!ok) {
    return (
      <div className="pill" style={{ padding: 18, boxShadow: "var(--shadow)" }}>
        <div style={{ fontWeight: 1000 }}>관리자 확인 중…</div>
        <div style={{ marginTop: 8, opacity: 0.7, fontWeight: 800, fontSize: 13 }}>
          관리자 권한을 확인하고 있어요 🔐
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
