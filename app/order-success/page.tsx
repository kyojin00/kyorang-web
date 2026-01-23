"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

type Order = {
  order_no: string;
  status: string;
  items_total: number;
  shipping_fee: number;
  grand_total: number;
  recipient_name: string;
  phone: string;
  zipcode: string;
  address1: string;
  address2: string | null;
  memo: string | null;
  created_at: string;
};

type OrderItem = {
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export default function OrderSuccessPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const orderNo = sp.get("orderNo") || "";

  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    if (!orderNo) {
      setMsg("주문번호가 없어요.");
      setLoading(false);
      return;
    }

    (async () => {
      setLoading(true);
      setMsg("");

      const res = await apiFetch(`/orders/${encodeURIComponent(orderNo)}`);
      if (res.status === 401) {
        router.push(`/login?next=/order-success?orderNo=${encodeURIComponent(orderNo)}`);
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg(data?.message || "주문 정보를 불러오지 못했어요.");
        setLoading(false);
        return;
      }

      // 백엔드가 orders row 그대로 주면 snake_case, 가공해서 주면 camelCase일 수 있음
      // 일단 snake_case 기준으로 처리 (필요하면 여기만 조정)
      setOrder(data.order || null);
      setItems(data.items || []);
      setLoading(false);
    })();
  }, [orderNo, router]);

  const summary = useMemo(() => {
    const count = items.reduce((s, it) => s + Number(it.quantity || 0), 0);
    const name = items[0]?.productName;
    return { count, firstName: name };
  }, [items]);

  if (loading) {
    return (
      <div className="card" style={{ padding: 18, maxWidth: 720, margin: "0 auto" }}>
        <div style={{ opacity: 0.7 }}>주문 정보를 불러오는 중…</div>
      </div>
    );
  }

  if (msg) {
    return (
      <div className="card" style={{ padding: 18, maxWidth: 720, margin: "0 auto" }}>
        <h1 style={{ marginTop: 0 }}>주문 확인</h1>
        <div style={{ color: "crimson" }}>{msg}</div>
        <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
          <a className="btn" href="/" style={{ textDecoration: "none" }}>홈으로</a>
          <a className="btn pink" href="/cart" style={{ textDecoration: "none" }}>장바구니</a>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="card" style={{ padding: 18, maxWidth: 720, margin: "0 auto" }}>
        <div style={{ opacity: 0.7 }}>주문이 없어요.</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
      <div className="card" style={{ padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ margin: 0 }}>주문이 접수됐어요 🎀</h1>
            <div style={{ marginTop: 8, opacity: 0.75 }}>
              주문번호 <b>{order.order_no}</b>
            </div>
            <div style={{ marginTop: 6, fontSize: 13, opacity: 0.65 }}>
              {summary.firstName
                ? `${summary.firstName}${summary.count > 1 ? ` 외 ${summary.count - 1}개` : ""}`
                : ""}
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 13, opacity: 0.7 }}>총 결제금액</div>
            <div style={{ fontSize: 22, fontWeight: 900 }}>
              {Number(order.grand_total).toLocaleString()}원
            </div>
            <div style={{ marginTop: 6, fontSize: 12, opacity: 0.65 }}>
              상태: <b>{order.status}</b>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
          <div className="card" style={{ padding: 14 }}>
            <div style={{ fontWeight: 900, marginBottom: 8 }}>배송지</div>
            <div style={{ display: "grid", gap: 4, fontSize: 14 }}>
              <div><b>{order.recipient_name}</b> / {order.phone}</div>
              <div>({order.zipcode}) {order.address1} {order.address2 || ""}</div>
              {order.memo ? <div style={{ opacity: 0.75 }}>메모: {order.memo}</div> : null}
            </div>
          </div>

          <div className="card" style={{ padding: 14 }}>
            <div style={{ fontWeight: 900, marginBottom: 8 }}>주문 상품</div>

            <div style={{ display: "grid", gap: 8 }}>
              {items.map((it, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: 10,
                    alignItems: "center",
                    padding: "8px 0",
                    borderBottom: idx === items.length - 1 ? "none" : "1px solid var(--line)",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800 }}>{it.productName}</div>
                    <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>
                      {Number(it.unitPrice).toLocaleString()}원 × {it.quantity}
                    </div>
                  </div>
                  <div style={{ fontWeight: 900 }}>
                    {Number(it.lineTotal).toLocaleString()}원
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: 14 }}>
            <div style={{ fontWeight: 900, marginBottom: 8 }}>결제 요약</div>
            <Row label="상품 합계" value={`${Number(order.items_total).toLocaleString()}원`} />
            <Row label="배송비" value={`${Number(order.shipping_fee).toLocaleString()}원`} />
            <div style={{ height: 1, background: "var(--line)", margin: "10px 0" }} />
            <Row label="총 결제금액" value={`${Number(order.grand_total).toLocaleString()}원`} strong />
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", flexWrap: "wrap" }}>
            <a className="btn" href="/" style={{ textDecoration: "none" }}>
              홈으로
            </a>
            <a className="btn" href="/products" style={{ textDecoration: "none" }}>
              계속 쇼핑하기
            </a>
            <a className="btn pink" href="/mypage" style={{ textDecoration: "none" }}>
              주문 확인(마이페이지)
            </a>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 10, fontSize: 12, opacity: 0.6, textAlign: "center" }}>
        주문 관련 문의는 마이페이지에서 주문번호와 함께 남겨주면 더 빨라요.
      </div>
    </div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ opacity: 0.75 }}>{label}</div>
      <div style={{ fontWeight: strong ? 900 : 800 }}>{value}</div>
    </div>
  );
}
