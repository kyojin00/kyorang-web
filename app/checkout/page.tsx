"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type CartItem = {
  cart_item_id: number;
  quantity: number;
  product_id: number;
  name: string;
  price: number;
  sale_price: number | null;
  stock: number;
  thumbnail_url: string | null;
};

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    recipientName: "",
    phone: "",
    zipcode: "",
    address1: "",
    address2: "",
    memo: "",
  });

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await apiFetch("/cart");
      if (res.status === 401) {
        router.push(`/login?next=/checkout`);
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg(data?.message || "장바구니 불러오기 실패");
        setLoading(false);
        return;
      }
      setItems(data.items ?? []);
      setLoading(false);
    })();
  }, [router]);

  const itemsTotal = useMemo(() => {
    return items.reduce((sum, it) => sum + (it.sale_price ?? it.price) * it.quantity, 0);
  }, [items]);

  const shippingFee = useMemo(() => (itemsTotal >= 30000 ? 0 : itemsTotal > 0 ? 3000 : 0), [itemsTotal]);
  const grandTotal = itemsTotal + shippingFee;

  const submit = async () => {
    setMsg("");
    const res = await apiFetch("/orders/checkout", {
      method: "POST",
      body: JSON.stringify(form),
    });
    const data = await res.json().catch(() => ({}));

    if (res.status === 401) {
      router.push(`/login?next=/checkout`);
      return;
    }
    if (!res.ok) {
      setMsg(data?.message || "주문 생성 실패");
      return;
    }

    router.push(`/order-success?orderNo=${encodeURIComponent(data.order.orderNo)}`);
  };

  if (loading) return <div style={{ padding: 18, opacity: 0.7 }}>불러오는 중…</div>;

  return (
    <div className="card" style={{ padding: 18, maxWidth: 720, margin: "0 auto" }}>
      <h1 style={{ marginTop: 0 }}>주문/결제</h1>

      {items.length === 0 ? (
        <div style={{ opacity: 0.7 }}>
          장바구니가 비어 있어요. <a href="/products">상품 보러가기</a>
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gap: 8 }}>
            <h3 style={{ margin: "10px 0 0" }}>배송지</h3>
            <input placeholder="받는 분" value={form.recipientName} onChange={(e) => setForm({ ...form, recipientName: e.target.value })} />
            <input placeholder="연락처" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <input placeholder="우편번호" value={form.zipcode} onChange={(e) => setForm({ ...form, zipcode: e.target.value })} />
            <input placeholder="주소" value={form.address1} onChange={(e) => setForm({ ...form, address1: e.target.value })} />
            <input placeholder="상세주소(선택)" value={form.address2} onChange={(e) => setForm({ ...form, address2: e.target.value })} />
            <input placeholder="배송 메모(선택)" value={form.memo} onChange={(e) => setForm({ ...form, memo: e.target.value })} />
          </div>

          <h3 style={{ marginTop: 16 }}>주문 상품</h3>
          <div style={{ display: "grid", gap: 10 }}>
            {items.map((it) => {
              const unit = it.sale_price ?? it.price;
              return (
                <div key={it.cart_item_id} className="card" style={{ padding: 12, display: "flex", justifyContent: "space-between" }}>
                  <div style={{ fontWeight: 800 }}>{it.name} × {it.quantity}</div>
                  <div style={{ fontWeight: 900 }}>{(unit * it.quantity).toLocaleString()}원</div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 16, display: "grid", gap: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ opacity: 0.7 }}>상품 합계</span>
              <b>{itemsTotal.toLocaleString()}원</b>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ opacity: 0.7 }}>배송비</span>
              <b>{shippingFee.toLocaleString()}원</b>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18 }}>
              <span>총 결제금액</span>
              <b>{grandTotal.toLocaleString()}원</b>
            </div>
          </div>

          {msg && <div style={{ marginTop: 10, color: "crimson" }}>{msg}</div>}

          <div style={{ marginTop: 14, display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button className="btn" onClick={() => router.push("/cart")}>장바구니로</button>
            <button className="btn pink" onClick={submit}>주문 생성</button>
          </div>
        </>
      )}
    </div>
  );
}
