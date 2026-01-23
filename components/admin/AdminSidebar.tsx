"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNav } from "./adminNav";

function cx(...args: Array<string | false | null | undefined>) {
  return args.filter(Boolean).join(" ");
}

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:w-64 lg:flex-col bg-white">
      {/* Header */}
      <div className="h-14 flex items-center px-4 border-b border-gray-200/70">
        <div className="font-semibold text-gray-900">교랑상점 Admin</div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {adminNav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");

          const base =
            "group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition";
          const enabledStyle = active
            ? "bg-gray-900 !text-white shadow-sm"
            : "text-gray-700 hover:bg-gray-100";
          const disabledStyle = "text-gray-400 cursor-not-allowed";

          if (item.disabled) {
            return (
              <div key={item.href} className={cx(base, disabledStyle)} aria-disabled="true">
                <span className="truncate">{item.label}</span>
                {item.badge ? (
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    {item.badge}
                  </span>
                ) : null}
              </div>
            );
          }

          return (
            <Link key={item.href} href={item.href} className={cx(base, enabledStyle)}>
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-200/70 text-xs text-gray-500">
        <div className="leading-5">세션 기반 관리자 콘솔</div>
        <div className="leading-5">/api 프록시 구조 유지</div>
      </div>
    </aside>
  );
}
