"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * 현재 경로 기반 breadcrumb 생성
 * /admin/orders/XXXX → 관리자 / 주문 관리 / XXXX
 */
function buildBreadcrumb(pathname: string) {
  const parts = pathname.split("/").filter(Boolean); // ["admin","orders","123"]
  const rest = parts.slice(1);

  const crumbs: Array<{ label: string; href: string }> = [];
  let acc = "/admin";

  rest.forEach((p) => {
    acc += `/${p}`;

    const label =
      p === "orders"
        ? "주문 관리"
        : p === "products"
        ? "상품 관리"
        : p === "support"
        ? "고객 문의"
        : p === "notices"
        ? "공지 관리"
        : p === "settings"
        ? "설정"
        : p; // 주문번호 등

    crumbs.push({ label, href: acc });
  });

  return crumbs;
}

export default function AdminTopbar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // 검색어 (주문번호 / 전화 / 이름)
  const initialQ = searchParams.get("q") ?? "";
  const [q, setQ] = useState(initialQ);

  const crumbs = useMemo(() => buildBreadcrumb(pathname), [pathname]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = q.trim();

    if (!value) {
      router.push("/admin/orders");
      return;
    }

    router.push(`/admin/orders?q=${encodeURIComponent(value)}`);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-200/70">
      <div className="h-14 flex items-center gap-3 px-4 lg:pl-66">
        {/* Breadcrumb */}
        <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
          <span className="font-medium text-gray-900">관리자</span>
          {crumbs.map((c, idx) => (
            <div key={c.href} className="flex items-center gap-2">
              <span className="text-gray-300">/</span>
              <span
                className={
                  idx === crumbs.length - 1
                    ? "text-gray-900 font-medium"
                    : "text-gray-600"
                }
              >
                {c.label}
              </span>
            </div>
          ))}
        </div>

        <div className="flex-1" />

        {/* Search */}
        <form onSubmit={onSubmit} className="hidden sm:flex items-center gap-2">
          <div className="flex items-center rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-gray-900/10">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="주문번호 / 전화 / 이름 검색"
              className="w-65 bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-gray-900 text-white px-3 py-2 text-sm hover:opacity-90"
          >
            검색
          </button>
        </form>

        {/* Right actions */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
            title="쇼핑몰로 이동"
          >
            스토어
          </button>
        </div>
      </div>
    </header>
  );
}
