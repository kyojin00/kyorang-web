"use client";

import LoginRequiredModal from "@/components/LoginRequiredModal";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "@/lib/api";

export default function ProductCard({
  id,
  name,
  price,
  salePrice,
  stock,
  thumbnailUrl,
}: {
  id: number;
  name: string;
  price: number;
  salePrice?: number | null;
  stock?: number;
  thumbnailUrl?: string | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const current = `${pathname}${searchParams.toString() ? `?${searchParams}` : ""}`;

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

      // ✅ 로그인 안 됨이면 팝업 띄우기
      if (res.status === 401) {
        setLoginModalOpen(true);
        return;
      }

      if (!res.ok) {
        throw new Error(data?.message || "장바구니 담기 실패");
      }

      setMsg("장바구니에 담았어요 🩷");
    } catch (e: any) {
      setMsg(e?.message || "오류가 발생했어요");
    } finally {
      setLoading(false);
    }
  };

  const finalPrice = salePrice ?? price;
  const soldOut = stock !== undefined && stock <= 0;

  return (
    <>
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
            overflow: "hidden",
          }}
        >
          {thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnailUrl}
              alt={name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            "🧸"
          )}
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

        {soldOut && (
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
            disabled={loading || soldOut}
            style={{
              flex: 1,
              padding: "10px 0",
              borderRadius: 12,
              border: "none",
              background: loading || soldOut ? "#aaa" : "#111",
              color: "white",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "담는 중..." : soldOut ? "품절" : "담기"}
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

      {/* ✅ 로그인 필요 모달 */}
      <LoginRequiredModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onGoLogin={() => router.push(`/login?next=${encodeURIComponent(current)}`)}
      />
    </>
  );
}
