"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function AuthGate({
  children,
  redirectTo = "/login",
}: {
  children: React.ReactNode;
  redirectTo?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const res = await apiFetch("/auth/me");
        if (!res.ok) {
          // ✅ 로그인 안 됨 → 로그인 페이지로
          const next = encodeURIComponent(pathname || "/");
          router.replace(`${redirectTo}?next=${next}`);
          return;
        }
      } catch {
        const next = encodeURIComponent(pathname || "/");
        router.replace(`${redirectTo}?next=${next}`);
        return;
      } finally {
        if (alive) setChecking(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [router, redirectTo, pathname]);

  if (checking) {
    return (
      <div className="container">
        <div className="card soft">
          <div className="skeleton title" />
          <div className="skeleton line" />
          <div className="skeleton line" />
          <div className="skeleton grid" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
