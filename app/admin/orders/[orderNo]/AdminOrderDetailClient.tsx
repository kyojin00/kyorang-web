"use client";

import ShippingCard from "@/components/admin/ShippingCard";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type OrderItem = {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

type AdminOrder = {
  id: number;
  order_no: string;
  status: string;
  items_total: number;
  shipping_fee: number;
  grand_total: number;
  created_at: string;
  recipient_name: string;
  phone: string;
  zipcode: string;
  address1: string;
  address2: string | null;
  memo: string | null;

  user_email?: string;
  user_name?: string | null;

  courier?: string | null;
  tracking_no?: string | null;
  shipped_at?: string | null;
};

const STATUSES = [
  { v: "PENDING", label: "PENDING (주문접수)" },
  { v: "PAID", label: "PAID (결제완료)" },
  { v: "SHIPPED", label: "SHIPPED (배송중)" },
  { v: "DELIVERED", label: "DELIVERED (배송완료)" },
  { v: "CANCELED", label: "CANCELED (취소)" },
] as const;

function formatK(v?: string) {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleString("ko-KR");
}

function money(v: number) {
  return Number(v || 0).toLocaleString() + "원";
}

function statusLabelOf(v?: string) {
  const found = STATUSES.find((s) => s.v === v);
  return found ? found.label : v ?? "";
}

function StatusPill({ status }: { status: string }) {
  const s = (status || "").toUpperCase();

  const cls =
    s === "DELIVERED"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : s === "SHIPPED"
      ? "bg-violet-50 text-violet-700 ring-violet-200"
      : s === "PAID"
      ? "bg-blue-50 text-blue-700 ring-blue-200"
      : s === "CANCELED"
      ? "bg-rose-50 text-rose-700 ring-rose-200"
      : "bg-amber-50 text-amber-700 ring-amber-200";

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ${cls}`}>
      {statusLabelOf(s)}
    </span>
  );
}

function Card({
  title,
  desc,
  right,
  children,
}: {
  title: string;
  desc?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-gray-200/70 bg-white shadow-sm">
      <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-5 py-4">
        <div>
          <div className="text-base font-semibold text-gray-900">{title}</div>
          {desc ? <div className="mt-1 text-sm text-gray-500">{desc}</div> : null}
        </div>
        {right ? <div className="shrink-0">{right}</div> : null}
      </div>
      <div className="px-5 py-4">{children}</div>
    </section>
  );
}

export default function AdminOrderDetailClient() {
  const router = useRouter();
  const params = useParams<{ orderNo: string }>();
  const orderNo = params.orderNo;

  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);

  // 모달 상태
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string>("");

  const load = async () => {
    setLoading(true);
    setMsg("");

    const res = await apiFetch(`/admin/orders/${encodeURIComponent(orderNo)}`);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setMsg(data?.message || "주문 상세를 불러오지 못했어요.");
      setLoading(false);
      return;
    }

    setOrder(data.order ?? null);
    setItems(data.items ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderNo]);

  const openConfirm = (next: string) => {
    if (!order) return;
    if (next === order.status) return;
    setPendingStatus(next);
    setConfirmOpen(true);
  };

  const applyStatus = async () => {
    if (!order) return;

    const next = pendingStatus;
    setConfirmOpen(false);
    setMsg("");

    const res = await apiFetch(`/admin/orders/${encodeURIComponent(order.order_no)}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status: next }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setMsg(data?.message || "상태 변경 실패");
      return;
    }

    await load();
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-gray-200/70 bg-white p-6 shadow-sm">
        <div className="text-base font-semibold text-gray-900">불러오는 중…</div>
        <div className="mt-2 text-sm text-gray-500">주문 상세 정보를 가져오고 있어요 📦</div>
      </div>
    );
  }

  if (msg && !order) {
    return (
      <div className="rounded-2xl border border-gray-200/70 bg-white p-6 shadow-sm">
        <div className="text-rose-600 font-semibold">{msg}</div>
        <div className="mt-4 flex gap-2">
          <a
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm hover:bg-gray-50"
            href="/admin/orders"
            style={{ textDecoration: "none" }}
          >
            ← 주문 목록
          </a>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="space-y-5">
      {/* 상단 헤더 */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">주문 상세</h2>
          <p className="mt-1 text-sm text-gray-500">
            주문번호 <span className="font-medium text-gray-900">{order.order_no}</span> ·{" "}
            {order.created_at ? formatK(order.created_at) : ""}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <StatusPill status={order.status} />
          <button
            type="button"
            onClick={() => load()}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
          >
            새로고침
          </button>
        </div>
      </div>

      {/* 에러 메시지 */}
      {msg ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {msg}
        </div>
      ) : null}

      {/* 주문자/상태 변경 */}
      <Card
        title="주문자 / 상태 변경"
        desc="상태 변경은 실수 방지를 위해 확인 후 적용돼요."
        right={
          <div className="flex items-center gap-2">
            <button
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
              type="button"
              onClick={() => router.back()}
            >
              ← 뒤로
            </button>
            <a
              className="rounded-xl bg-gray-900 !text-white px-3 py-2 text-sm hover:bg-gray-900"
              href="/admin/orders"
              style={{ textDecoration: "none" }}
            >
              목록
            </a>
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-200/70 bg-gray-50/60 p-4">
            <div className="text-sm text-gray-500">주문자</div>
            <div className="mt-1 font-semibold text-gray-900">
              {order.user_name?.trim() ? order.user_name : "이름없음"}
            </div>
            <div className="mt-1 text-sm text-gray-600">{order.user_email}</div>
          </div>

          <div className="rounded-2xl border border-gray-200/70 bg-gray-50/60 p-4">
            <div className="text-sm text-gray-500">상태 변경</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s.v}
                  type="button"
                  disabled={s.v === order.status}
                  onClick={() => openConfirm(s.v)}
                  className={`rounded-xl px-3 py-2 text-sm border transition ${
                    s.v === order.status
                      ? "border-gray-200 bg-white text-gray-400 cursor-not-allowed"
                      : "border-gray-200 bg-white text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  {s.v}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* 주문 상품 */}
      <Card title="주문 상품" desc="상품/수량/금액을 확인하세요.">
        <div className="space-y-2">
          {items.map((it, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-gray-200/70 bg-white px-4 py-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold text-gray-900 truncate">{it.productName}</div>
                  <div className="mt-1 text-xs text-gray-500">
                    {Number(it.unitPrice).toLocaleString()}원 × {it.quantity}
                  </div>
                </div>
                <div className="shrink-0 font-semibold text-gray-900">
                  {Number(it.lineTotal).toLocaleString()}원
                </div>
              </div>
            </div>
          ))}

          {items.length === 0 ? (
            <div className="rounded-2xl border border-gray-200/70 bg-gray-50/60 p-6 text-sm text-gray-500 text-center">
              주문 상품이 없어요.
            </div>
          ) : null}
        </div>
      </Card>

      {/* 송장 / 택배사 */}
      <ShippingCard
        orderNo={order.order_no}
        initialCourier={order.courier}
        initialTrackingNo={order.tracking_no}
        initialShippedAt={order.shipped_at}
        onSaved={(next) => {
          setOrder((prev) =>
            prev
              ? {
                  ...prev,
                  courier: next.courier,
                  tracking_no: next.trackingNo,
                  shipped_at: next.shippedAt ?? prev.shipped_at,
                  status: next.status ?? prev.status,
                }
              : prev
          );
        }}
      />

      {/* 배송지 */}
      <Card title="배송지" desc="수령인 정보와 주소를 확인하세요.">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-200/70 bg-gray-50/60 p-4">
            <div className="text-sm text-gray-500">수령인</div>
            <div className="mt-1 font-semibold text-gray-900">
              {order.recipient_name} <span className="text-gray-500">/</span> {order.phone}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200/70 bg-gray-50/60 p-4">
            <div className="text-sm text-gray-500">주소</div>
            <div className="mt-1 text-sm text-gray-900">
              ({order.zipcode}) {order.address1} {order.address2 || ""}
            </div>
          </div>

          {order.memo ? (
            <div className="sm:col-span-2 rounded-2xl border border-gray-200/70 bg-gray-50/60 p-4">
              <div className="text-sm text-gray-500">메모</div>
              <div className="mt-1 text-sm text-gray-900">{order.memo}</div>
            </div>
          ) : null}
        </div>
      </Card>

      {/* 금액 */}
      <Card title="금액" desc="결제/배송비/총액 요약">
        <div className="space-y-2 text-sm">
          <Row label="상품 합계" value={money(order.items_total)} />
          <Row label="배송비" value={money(order.shipping_fee)} />
          <div className="h-px bg-gray-100" />
          <Row label="총 결제금액" value={money(order.grand_total)} strong />
        </div>
      </Card>

      {/* 확인 모달 */}
      {confirmOpen ? (
        <ConfirmModal
          title="주문 상태 변경"
          description={
            <>
              주문 <b>{order.order_no}</b> 상태를 <b>{order.status}</b> →{" "}
              <b>{pendingStatus}</b> 로 변경할까요?
              <div className="mt-2 text-xs text-gray-500">
                실수 방지를 위해 확인을 받고 있어요.
              </div>
            </>
          }
          onCancel={() => setConfirmOpen(false)}
          onConfirm={applyStatus}
        />
      ) : null}
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-gray-500">{label}</div>
      <div className={strong ? "font-semibold text-gray-900" : "font-medium text-gray-900"}>
        {value}
      </div>
    </div>
  );
}

function ConfirmModal({
  title,
  description,
  onCancel,
  onConfirm,
}: {
  title: string;
  description: React.ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white shadow-lg ring-1 ring-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5">
          <div className="text-base font-semibold text-gray-900">{title}</div>
          <div className="mt-3 text-sm text-gray-700">{description}</div>

          <div className="mt-5 flex items-center justify-end gap-2">
            <button
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm hover:bg-gray-50"
              type="button"
              onClick={onCancel}
            >
              취소
            </button>
            <button
              className="rounded-xl bg-gray-600 !text-white px-4 py-2 text-sm hover:bg-gray-900"
              type="button"
              onClick={onConfirm}
            >
              변경하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
