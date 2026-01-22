"use client";

import { useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import LoginRequiredModal from "@/components/LoginRequiredModal";

export default function AddToCartButton({
  productId,
  disabled,
}: {
  productId: number;
  disabled?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [open, setOpen] = useState(false);

  const current = `${pathname}${searchParams.toString() ? `?${searchParams}` : ""}`;

  const add = async () => {
    if (disabled || loading) return;

    setMsg("");

    // ✅ 1) 로그인 체크 (/auth/me)
    const me = await apiFetch("/auth/me", { method: "GET" });
    if (!me.ok) {
      setOpen(true); // 팝업 띄우기
      return;
    }

    // ✅ 2) 로그인 상태면 장바구니 담기 실행
    setLoading(true);
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
    <>
      <div style={{ display: "grid", gap: 8 }}>
        <button
          className="btn pink"  // ✅ 너 CSS 기준: pink가 예쁨 (primary가 있다면 primary로 바꿔도 됨)
          type="button"
          onClick={add}
          disabled={disabled || loading}
          style={{ width: "100%" }}
        >
          {disabled ? "품절" : loading ? "담는 중..." : "장바구니 담기"}
        </button>

        {msg && <div style={{ fontSize: 13, opacity: 0.75 }}>{msg}</div>}
      </div>

      <LoginRequiredModal
        open={open}
        onClose={() => setOpen(false)}
        onGoLogin={() => router.push(`/login?next=${encodeURIComponent(current)}`)}
      />
    </>
  );
}
