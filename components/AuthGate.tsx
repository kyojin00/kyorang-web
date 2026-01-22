"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      const current = `${pathname}${searchParams.toString() ? `?${searchParams}` : ""}`;

      // ✅ login 페이지에서는 Gate가 돌면 루프 생김 → 방지
      if (pathname?.startsWith("/login")) {
        if (alive) setChecking(false);
        return;
      }

      try {
        const res = await apiFetch("/auth/me");
        if (!res.ok) {
          router.replace(`${redirectTo}?next=${encodeURIComponent(current)}`);
          return;
        }
      } catch {
        router.replace(`${redirectTo}?next=${encodeURIComponent(current)}`);
        return;
      } finally {
        if (alive) setChecking(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [router, redirectTo, pathname, searchParams]);

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
