"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";

export default function ProductCard({
  id,
  name,
  price,
  salePrice,
  stock,
}: {
  id: number;
  name: string;
  price: number;
  salePrice?: number | null;
  stock?: number;
  thumbnailUrl?: string | null; // ✅ 추가
}) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const onAddToCart = async () => {
    if (stock !== undefined && stock <= 0) {
      setMsg("품절 상품이에요 🥲");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      const res = await apiFetch("/cart/items", {
        method: "POST",
        body: JSON.stringify({ productId: id, quantity: 1 }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || "장바구니 담기 실패");
      }

      setMsg("장바구니에 담았어요 🩷");
    } catch (e: any) {
      if (e.message === "not logged in") {
        setMsg("로그인이 필요해요!");
      } else {
        setMsg(e.message || "오류가 발생했어요");
      }
    } finally {
      setLoading(false);
    }
  };

  const finalPrice = salePrice ?? price;

  return (
    <article
      style={{
        border: "1px solid #eee",
        borderRadius: 18,
        padding: 14,
        background: "white",
        boxShadow: "0 8px 22px rgba(0,0,0,0.04)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          height: 150,
          borderRadius: 14,
          background: "linear-gradient(135deg, #ffe3ef, #fff6fb)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 34,
        }}
      >
        🧸
      </div>

      <div style={{ marginTop: 10, fontWeight: 800 }}>{name}</div>

      <div style={{ marginTop: 6 }}>
        {salePrice ? (
          <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
            <span style={{ fontWeight: 900 }}>
              {finalPrice.toLocaleString()}원
            </span>
            <span
              style={{
                textDecoration: "line-through",
                opacity: 0.5,
                fontSize: 13,
              }}
            >
              {price.toLocaleString()}원
            </span>
          </div>
        ) : (
          <span style={{ opacity: 0.75 }}>{price.toLocaleString()}원</span>
        )}
      </div>

      {stock !== undefined && stock <= 0 && (
        <div style={{ marginTop: 6, fontSize: 12, color: "crimson" }}>
          품절
        </div>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <a
          href={`/products/${id}`}
          style={{
            flex: 1,
            textAlign: "center",
            padding: "10px 0",
            borderRadius: 12,
            border: "1px solid #ddd",
            textDecoration: "none",
            color: "#111",
          }}
        >
          상세보기
        </a>

        <button
          type="button"
          onClick={onAddToCart}
          disabled={loading || (stock !== undefined && stock <= 0)}
          style={{
            flex: 1,
            padding: "10px 0",
            borderRadius: 12,
            border: "none",
            background:
              loading || (stock !== undefined && stock <= 0)
                ? "#aaa"
                : "#111",
            color: "white",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "담는 중..." : "담기"}
        </button>
      </div>

      {msg && (
        <div
          style={{
            marginTop: 8,
            fontSize: 12,
            opacity: 0.8,
            textAlign: "center",
          }}
        >
          {msg}
        </div>
      )}
    </article>
  );
}
