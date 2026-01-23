"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { statusLabel, statusBadgeClass } from "@/lib/orderStatus";

type OrderRow = {
  orderNo?: string;
  order_no?: string;
  status: string;
  grandTotal?: number;
  grand_total?: number;
  createdAt?: string;
  created_at?: string;
};

const pickOrderNo = (o: OrderRow) => o.orderNo || o.order_no || "";
const pickTotal = (o: OrderRow) => Number(o.grandTotal ?? o.grand_total ?? 0);
const pickCreated = (o: OrderRow) => o.createdAt || o.created_at || "";

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      setMsg("");
      const res = await apiFetch("/orders");
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg(data?.message || "주문 목록을 불러오지 못했어요.");
        setLoading(false);
        return;
      }
      setOrders(data.orders ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-5">
      {/* 🔹 상단 헤더 카드 */}
      <section className="rounded-2xl border bg-white p-5 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">주문 내역</h1>
          <p className="mt-1 text-sm text-gray-500">
            최근 주문하신 내역을 확인할 수 있어요
          </p>
        </div>

        <Link
          href="/mypage"
          className="inline-flex items-center rounded-xl border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          ← 마이페이지
        </Link>
      </section>

      {loading && <div className="text-gray-500">불러오는 중…</div>}
      {msg && <div className="text-rose-600 text-sm">{msg}</div>}

      {!loading && orders.length === 0 && (
        <div className="rounded-2xl border bg-white p-10 text-center text-gray-500">
          아직 주문 내역이 없어요.
        </div>
      )}

      {/* 🔹 주문 카드 리스트 */}
      <div className="space-y-3">
        {orders.map((o, idx) => {
          const orderNo = pickOrderNo(o);
          return (
            <Link
              key={idx}
              href={`/mypage/orders/${encodeURIComponent(orderNo)}`}
              className="block rounded-2xl border bg-white p-4 hover:bg-gray-50 transition"
            >
              <div className="flex justify-between items-start gap-4">
                <div>
                  <div className="font-medium text-gray-900">{orderNo}</div>
                  <div className="mt-1 text-xs text-gray-500">
                    {pickCreated(o)
                      ? new Date(pickCreated(o)).toLocaleString()
                      : ""}
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <div className="font-semibold text-gray-900">
                    {pickTotal(o).toLocaleString()}원
                  </div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ring-1 ${statusBadgeClass(
                      o.status
                    )}`}
                  >
                    {statusLabel(o.status)}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
