"use client";

import { useEffect, useMemo, useState } from "react";
import StatusBadge from "@/components/admin/StatusBadge";
import ConfirmModal from "@/components/admin/ConfirmModal";
import Toast, { ToastState } from "@/components/admin/Toast";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

type OrderRow = {
  orderNo: string;
  createdAt?: string; // ISO or text
  status: string;
  totalAmount: number;
  buyerName?: string;
  buyerPhone?: string;
  itemCount?: number;
  대표상품명?: string; // 혹시 백엔드가 이런 필드로 줄 수도 있어서 안전하게
  firstProductName?: string;
};

type OrdersResponse = {
  orders: OrderRow[];
  summary?: Record<string, number>; // {PENDING: 2, SHIPPED: 1 ...}
};

function cx(...args: Array<string | false | null | undefined>) {
  return args.filter(Boolean).join(" ");
}

function formatKRW(v: number) {
  try {
    return new Intl.NumberFormat("ko-KR").format(v) + "원";
  } catch {
    return `${v}원`;
  }
}

function formatKTime(v?: string) {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

const STATUS_OPTIONS = ["ALL", "PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"] as const;
type StatusFilter = (typeof STATUS_OPTIONS)[number];

export default function AdminOrdersPage() {
  const params = useSearchParams();
  const router = useRouter();

  const qFromUrl = params.get("q") ?? "";
  const statusFromUrl = (params.get("status") ?? "ALL").toUpperCase() as StatusFilter;

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [summary, setSummary] = useState<Record<string, number>>({});
  const [status, setStatus] = useState<StatusFilter>(
    STATUS_OPTIONS.includes(statusFromUrl) ? statusFromUrl : "ALL"
  );
  const [q, setQ] = useState(qFromUrl);

  const [toast, setToast] = useState<ToastState>({ open: false, message: "", type: "info" });

  // 상태 변경 모달
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmOrderNo, setConfirmOrderNo] = useState<string>("");
  const [confirmFrom, setConfirmFrom] = useState<string>("");
  const [confirmTo, setConfirmTo] = useState<string>("");

  const counts = useMemo(() => {
    const base = { PENDING: 0, PAID: 0, SHIPPED: 0, DELIVERED: 0, CANCELLED: 0 };
    return { ...base, ...summary };
  }, [summary]);

  const refresh = async (next?: { status?: StatusFilter; q?: string }) => {
    setLoading(true);
    try {
      const s = next?.status ?? status;
      const keyword = (next?.q ?? q).trim();

      const sp = new URLSearchParams();
      if (s && s !== "ALL") sp.set("status", s);
      if (keyword) sp.set("q", keyword);

      const res = await fetch(`/api/admin/orders?${sp.toString()}`, {
        method: "GET",
        credentials: "include",
      });

      // 401은 AdminGate가 막겠지만, UX 안전망
      if (res.status === 401) {
        setToast({ open: true, message: "관리자 권한이 필요해요.", type: "error" });
        setLoading(false);
        return;
      }

      const data = (await res.json()) as OrdersResponse;

      setOrders(Array.isArray(data.orders) ? data.orders : []);
      setSummary(data.summary ?? {});
    } catch (e) {
      setToast({ open: true, message: "주문 목록을 불러오지 못했어요.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // URL → state 반영
  useEffect(() => {
    setQ(qFromUrl);
    setStatus(STATUS_OPTIONS.includes(statusFromUrl) ? statusFromUrl : "ALL");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qFromUrl, statusFromUrl]);

  // 최초 로드 + URL 변경 시 refresh
  useEffect(() => {
    refresh({ status: statusFromUrl, q: qFromUrl });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qFromUrl, statusFromUrl]);

  const applyFiltersToUrl = (nextStatus: StatusFilter, nextQ: string) => {
    const sp = new URLSearchParams();
    if (nextStatus && nextStatus !== "ALL") sp.set("status", nextStatus);
    if (nextQ.trim()) sp.set("q", nextQ.trim());

    const qs = sp.toString();
    router.push(qs ? `/admin/orders?${qs}` : "/admin/orders");
  };

  const onSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    applyFiltersToUrl(status, q);
  };

  const onChangeStatusFilter = (v: StatusFilter) => {
    setStatus(v);
    applyFiltersToUrl(v, q);
  };

  const openConfirm = (orderNo: string, from: string, to: string) => {
    setConfirmOrderNo(orderNo);
    setConfirmFrom(from);
    setConfirmTo(to);
    setConfirmOpen(true);
  };

  const doChangeStatus = async () => {
    const orderNo = confirmOrderNo;
    const to = confirmTo;

    setConfirmOpen(false);

    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(orderNo)}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: to }),
      });

      const payload = await res.json().catch(() => ({} as any));

      if (!res.ok) {
        setToast({
          open: true,
          message: payload?.message || "상태 변경에 실패했어요.",
          type: "error",
        });
        return;
      }

      setToast({ open: true, message: `주문 상태가 ${to}(으)로 변경됐어요.`, type: "success" });

      // 로컬 즉시 반영 + 요약은 refresh로 정확히
      setOrders((prev) =>
        prev.map((o) => (o.orderNo === orderNo ? { ...o, status: to } : o))
      );
      refresh();
    } catch {
      setToast({ open: true, message: "네트워크 오류로 실패했어요.", type: "error" });
    }
  };

  // KPI 클릭 시 필터 변경
  const onClickKpi = (s: StatusFilter) => {
    onChangeStatusFilter(s);
  };

  return (
    <div className="space-y-5">
      {/* Header Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">주문/배송 관리</h2>
          <p className="mt-1 text-sm text-gray-500">
            상태 변경은 실수 방지를 위해 확인 후 적용돼요.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refresh()}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
          >
            새로고침
          </button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <KpiCard
          label="미처리"
          value={counts.PENDING ?? 0}
          active={status === "PENDING"}
          onClick={() => onClickKpi("PENDING")}
        />
        <KpiCard
          label="결제완료"
          value={counts.PAID ?? 0}
          active={status === "PAID"}
          onClick={() => onClickKpi("PAID")}
        />
        <KpiCard
          label="배송중"
          value={counts.SHIPPED ?? 0}
          active={status === "SHIPPED"}
          onClick={() => onClickKpi("SHIPPED")}
        />
        <KpiCard
          label="배송완료"
          value={counts.DELIVERED ?? 0}
          active={status === "DELIVERED"}
          onClick={() => onClickKpi("DELIVERED")}
        />
        <KpiCard
          label="취소"
          value={counts.CANCELLED ?? 0}
          active={status === "CANCELLED"}
          onClick={() => onClickKpi("CANCELLED")}
        />
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-gray-200/70 bg-white p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-600">상태</span>
            <select
              value={status}
              onChange={(e) => onChangeStatusFilter(e.target.value as StatusFilter)}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
            >
              <option value="ALL">전체</option>
              <option value="PENDING">PENDING</option>
              <option value="PAID">PAID</option>
              <option value="SHIPPED">SHIPPED</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>

          <form onSubmit={onSubmitSearch} className="flex items-center gap-2">
            <div className="flex items-center rounded-xl border border-gray-200 bg-white px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-gray-900/10">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="주문번호 / 전화 / 이름"
                className="w-full min-w-55 bg-transparent text-sm outline-none placeholder:text-gray-400"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-gray-900 text-white px-3 py-2 text-sm hover:opacity-90"
            >
              검색
            </button>
            {(q.trim() || status !== "ALL") && (
              <button
                type="button"
                onClick={() => applyFiltersToUrl("ALL", "")}
                className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
              >
                초기화
              </button>
            )}
          </form>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {loading ? (
          <SkeletonList />
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-gray-200/70 bg-white p-10 text-center text-sm text-gray-500">
            해당 조건의 주문이 없어요.
          </div>
        ) : (
          orders.map((o) => (
            <OrderCard
              key={o.orderNo}
              order={o}
              onRequestStatusChange={(to) => openConfirm(o.orderNo, o.status, to)}
            />
          ))
        )}
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        open={confirmOpen}
        title="주문 상태를 변경할까요?"
        description={`주문 ${confirmOrderNo}의 상태를 ${confirmFrom} → ${confirmTo} 로 변경합니다.`}
        confirmText="변경하기"
        cancelText="취소"
        onConfirm={doChangeStatus}
        onClose={() => setConfirmOpen(false)}
      />

      {/* Toast */}
      <Toast toast={toast} onClose={() => setToast({ open: false, message: "", type: "info" })} />
    </div>
  );
}

/** ---------- UI components (page-local) ---------- */

function KpiCard({
  label,
  value,
  active,
  onClick,
}: {
  label: string;
  value: number;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "text-left rounded-2xl border bg-white p-4 shadow-sm transition",
        active
          ? "border-gray-900 ring-2 ring-gray-900/10"
          : "border-gray-200/70 hover:bg-gray-50"
      )}
    >
      <div className="text-sm text-gray-600">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-gray-900">{value}</div>
    </button>
  );
}

function OrderCard({
  order,
  onRequestStatusChange,
}: {
  order: OrderRow;
  onRequestStatusChange: (to: string) => void;
}) {
  const firstName =
    order.firstProductName ??
    (order as any).대표상품명 ??
    "상품";

  const buyerLine = [order.buyerName, order.buyerPhone].filter(Boolean).join(" · ");

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-sm text-gray-500">주문번호</div>
            <div className="font-semibold text-gray-900">{order.orderNo}</div>
            <StatusBadge status={order.status} />
          </div>

          <div className="mt-2 text-sm text-gray-700">
            <span className="font-medium">{firstName}</span>
            {typeof order.itemCount === "number" && order.itemCount > 1 ? (
              <span className="text-gray-500"> 외 {order.itemCount - 1}건</span>
            ) : null}
          </div>

          <div className="mt-1 text-xs text-gray-500">
            {buyerLine ? <span>{buyerLine}</span> : null}
            {order.createdAt ? <span className="ml-2">· {formatKTime(order.createdAt)}</span> : null}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="text-lg font-semibold text-gray-900">
            {formatKRW(Number(order.totalAmount ?? 0))}
          </div>

          <div className="flex items-center gap-2">
            <select
              defaultValue=""
              onChange={(e) => {
                const v = e.target.value;
                if (!v) return;
                onRequestStatusChange(v);
                e.currentTarget.value = "";
              }}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
            >
              <option value="">상태 변경…</option>
              <option value="PENDING">PENDING</option>
              <option value="PAID">PAID</option>
              <option value="SHIPPED">SHIPPED</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>

            <Link
              href={`/admin/orders/${encodeURIComponent(order.orderNo)}`}
              className="rounded-xl bg-gray-900 !text-white px-3 py-2 text-sm hover:bg-indigo-700"
            >
              상세
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-gray-200/70 bg-white p-4 sm:p-5 shadow-sm"
        >
          <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="mt-3 h-4 w-72 bg-gray-200 rounded animate-pulse" />
          <div className="mt-2 h-3 w-56 bg-gray-200 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}
