"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import AuthGate from "@/components/AuthGate";
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

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const load = async () => {
    setLoading(true);
    setMsg("");
    try {
      const res = await apiFetch("/cart");
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "장바구니 불러오기 실패");
      setItems(data.items ?? []);
    } catch (e: any) {
      setMsg(e?.message || "오류");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const total = useMemo(() => {
    return items.reduce((sum, it) => {
      const unit = it.sale_price ?? it.price;
      return sum + unit * it.quantity;
    }, 0);
  }, [items]);

  const updateQty = async (cartItemId: number, quantity: number) => {
    setMsg("");
    const res = await apiFetch(`/cart/items/${cartItemId}`, {
      method: "PATCH",
      body: JSON.stringify({ quantity }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMsg(data?.message || "수량 변경 실패");
      return;
    }
    load();
  };

  const removeItem = async (cartItemId: number) => {
    setMsg("");
    const res = await apiFetch(`/cart/items/${cartItemId}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMsg(data?.message || "삭제 실패");
      return;
    }
    load();
  };

  return (
    <div>
      <Header />
      <AuthGate>
        <main className="container">
          <div className="card" style={{ padding: 18 }}>
            <h1 style={{ marginTop: 0 }}>장바구니</h1>

            {loading ? (
              <div style={{ opacity: 0.7 }}>불러오는 중…</div>
            ) : items.length === 0 ? (
              <div style={{ opacity: 0.7 }}>장바구니가 비어 있어요.</div>
            ) : (
              <div style={{ display: "grid", gap: 12 }}>
                {items.map((it) => {
                  const unit = it.sale_price ?? it.price;
                  return (
                    <div
                      key={it.cart_item_id}
                      className="card"
                      style={{
                        padding: 14,
                        display: "grid",
                        gridTemplateColumns: "100px 1fr auto",
                        gap: 12,
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          width: 100,
                          height: 100,
                          borderRadius: 14,
                          overflow: "hidden",
                          border: "1px solid var(--line)",
                          background: "linear-gradient(135deg, #ffe3ef, #fff)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {it.thumbnail_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={it.thumbnail_url}
                            alt={it.name}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                        ) : (
                          <span style={{ fontSize: 28 }}>🧸</span>
                        )}
                      </div>

                      <div>
                        <div style={{ fontWeight: 900 }}>{it.name}</div>
                        <div style={{ opacity: 0.75, marginTop: 6 }}>
                          {unit.toLocaleString()}원
                          {it.sale_price && (
                            <span style={{ marginLeft: 8, textDecoration: "line-through", opacity: 0.55 }}>
                              {it.price.toLocaleString()}원
                            </span>
                          )}
                        </div>

                        <div style={{ display: "flex", gap: 8, marginTop: 10, alignItems: "center" }}>
                          <button className="btn" onClick={() => updateQty(it.cart_item_id, it.quantity - 1)}>
                            -
                          </button>
                          <div style={{ minWidth: 28, textAlign: "center", fontWeight: 900 }}>
                            {it.quantity}
                          </div>
                          <button
                            className="btn"
                            onClick={() => updateQty(it.cart_item_id, it.quantity + 1)}
                            disabled={it.quantity >= it.stock}
                          >
                            +
                          </button>
                          <span style={{ fontSize: 12, opacity: 0.6 }}>재고 {it.stock}</span>
                        </div>
                      </div>

                      <div style={{ display: "grid", gap: 8, justifyItems: "end" }}>
                        <div style={{ fontWeight: 900 }}>
                          {(unit * it.quantity).toLocaleString()}원
                        </div>
                        <button className="btn" onClick={() => removeItem(it.cart_item_id)}>
                          삭제
                        </button>
                        <a className="btn primary" href={`/products/${it.product_id}`} style={{ textDecoration: "none" }}>
                          상세
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ opacity: 0.75 }}>합계</div>
              <div style={{ fontSize: 20, fontWeight: 900 }}>{total.toLocaleString()}원</div>
            </div>

            {msg && <div style={{ marginTop: 10, color: "crimson" }}>{msg}</div>}

            <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
              <a className="btn" href="/" style={{ textDecoration: "none" }}>
                계속 쇼핑하기
              </a>
              <button className="btn pink" type="button" onClick={() => alert("다음 단계: 주문/결제 연결!")}>
                결제하기
              </button>
            </div>
          </div>
        </main>
      </AuthGate>
    </div>
  );
}
