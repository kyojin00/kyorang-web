"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";

export default function AddToCartButton({
  productId,
  disabled,
}: {
  productId: number;
  disabled?: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const add = async () => {
    setLoading(true);
    setMsg("");
    try {
      const res = await apiFetch("/cart/items", {
        method: "POST",
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "담기 실패");
      setMsg("장바구니에 담았어요 🩷");
    } catch (e: any) {
      setMsg(e?.message || "오류");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <button
        className="btn primary"
        type="button"
        onClick={add}
        disabled={disabled || loading}
        style={{ width: "100%" }}
      >
        {disabled ? "품절" : loading ? "담는 중..." : "장바구니 담기"}
      </button>
      {msg && <div style={{ fontSize: 13, opacity: 0.75 }}>{msg}</div>}
    </div>
  );
}
