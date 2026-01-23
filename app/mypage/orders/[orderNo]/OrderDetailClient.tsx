"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { statusLabel, statusBadgeClass } from "@/lib/orderStatus";

type OrderItem = {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export default function OrderDetailClient() {
  const router = useRouter();
  const params = useParams<{ orderNo: string }>();
  const orderNo = params.orderNo;

  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setMsg("");

      const res = await apiFetch(`/orders/${encodeURIComponent(orderNo)}`);
      if (res.status === 401) {
        router.push(`/login?next=/mypage/orders/${encodeURIComponent(orderNo)}`);
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg(data?.message || "주문 상세를 불러오지 못했어요.");
        setLoading(false);
        return;
      }

      setOrder(data.order || null);
      setItems(data.items || []);
      setLoading(false);
    })();
  }, [orderNo, router]);

  if (loading) {
    return <div className="mx-auto max-w-3xl p-6 text-gray-500">불러오는 중…</div>;
  }

  if (msg) {
    return (
      <div className="mx-auto max-w-3xl p-6 space-y-4">
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {msg}
        </div>
        <button
          onClick={() => router.push("/mypage/orders")}
          className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
        >
          ← 주문 목록
        </button>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-4">
      {/* 헤더 */}
      <section className="rounded-xl border bg-white p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold">주문 상세</h1>
            <div className="mt-1 text-sm text-gray-500">
              주문번호 <b className="text-gray-900">{order.order_no}</b>
            </div>
          </div>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusBadgeClass(
              order.status
            )}`}
          >
            {statusLabel(order.status)}
          </span>
        </div>
      </section>

      {/* 주문 상품 */}
      <section className="rounded-xl border bg-white p-5 space-y-3">
        <h2 className="font-semibold">주문 상품</h2>
        {items.map((it, idx) => (
          <div key={idx} className="flex justify-between gap-4 border-b pb-3 last:border-b-0 last:pb-0">
            <div>
              <div className="font-medium">{it.productName}</div>
              <div className="text-xs text-gray-500">
                {it.unitPrice.toLocaleString()}원 × {it.quantity}
              </div>
            </div>
            <div className="font-semibold">{it.lineTotal.toLocaleString()}원</div>
          </div>
        ))}
      </section>

      {/* 배송지 */}
      <section className="rounded-xl border bg-white p-5 space-y-2 text-sm">
        <h2 className="font-semibold">배송지</h2>
        <div>{order.recipient_name} / {order.phone}</div>
        <div className="text-gray-600">
          ({order.zipcode}) {order.address1} {order.address2 || ""}
        </div>
        {order.memo && <div className="text-xs text-gray-500">메모: {order.memo}</div>}
      </section>

      {/* 결제 요약 */}
      <section className="rounded-xl border bg-white p-5 space-y-2 text-sm">
        <h2 className="font-semibold">결제 요약</h2>
        <Row label="상품 합계" value={order.items_total} />
        <Row label="배송비" value={order.shipping_fee} />
        <div className="h-px bg-gray-100 my-2" />
        <Row label="총 결제금액" value={order.grand_total} strong />
      </section>

      {/* 하단 버튼 */}
      <div className="flex justify-end gap-2">
        <button
          onClick={() => router.push("/mypage/orders")}
          className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
        >
          ← 주문 목록
        </button>
        <button
          onClick={() => router.push("/products")}
          className="rounded-lg bg-pink-300 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-300"
        >
          계속 쇼핑하기
        </button>
      </div>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: number; strong?: boolean }) {
  return (
    <div className="flex justify-between">
      <div className="text-gray-500">{label}</div>
      <div className={strong ? "font-semibold text-gray-900" : "text-gray-900"}>
        {Number(value).toLocaleString()}원
      </div>
    </div>
  );
}
