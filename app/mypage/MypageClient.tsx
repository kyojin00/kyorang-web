"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

type Me = {
  user: {
    id: number;
    email: string;
    name?: string | null;
    role?: string;
  };
};

type ApiError = { message?: string };

export default function MypageClient() {
  const router = useRouter();
  const [me, setMe] = useState<Me["user"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const res = await apiFetch("/auth/me");
        const data = (await res.json().catch(() => ({}))) as Partial<Me> & ApiError;

        if (!res.ok) {
          throw new Error(data.message || "로그인이 필요해요.");
        }

        if (alive) setMe((data as Me).user);
      } catch {
        router.replace("/login?next=/mypage");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [router]);

  const logout = async () => {
    setMsg("");
    try {
      const res = await apiFetch("/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error("로그아웃 실패");
      router.replace("/");
      router.refresh();
    } catch {
      setMsg("로그아웃 중 오류가 발생했어요.");
    }
  };

  if (loading) {
    return (
      <div className="pill" style={{ padding: 18, boxShadow: "var(--shadow)" }}>
        <div style={{ fontWeight: 1000 }}>불러오는 중...</div>
        <div style={{ marginTop: 8, opacity: 0.7, fontWeight: 800, fontSize: 13 }}>
          마이페이지 정보를 가져오고 있어요 🐰
        </div>
      </div>
    );
  }

  if (!me) return null;

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <section
        className="pill"
        style={{
          padding: 18,
          borderRadius: 22,
          boxShadow: "var(--shadow)",
          background:
            "linear-gradient(135deg, rgba(255,225,240,.95), rgba(255,255,255,.85))",
          border: "1px solid rgba(0,0,0,.06)",
        }}
      >
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #ffe1f0, #fff)",
              border: "1px solid rgba(0,0,0,.06)",
              boxShadow: "0 14px 22px rgba(255,79,163,.12)",
              fontSize: 22,
            }}
          >
            🐰
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 1000, letterSpacing: -0.2 }}>
              {me.name?.trim() ? `${me.name}님` : "교랑상점 고객님"}
            </div>
            <div style={{ marginTop: 4, fontSize: 13, fontWeight: 900, color: "var(--muted)" }}>
              {me.email}
            </div>
            <div style={{ marginTop: 8, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {me.role && <span className="badge">🔐 {me.role}</span>}
            </div>
          </div>

          <button className="btn pink" type="button" onClick={logout}>
            로그아웃
          </button>
        </div>

        {msg && (
          <div style={{ marginTop: 10, color: "crimson", fontWeight: 900, fontSize: 13 }}>
            {msg}
          </div>
        )}
      </section>

      <section
        className="pill"
        style={{
          padding: 14,
          borderRadius: 22,
          boxShadow: "var(--shadow)",
          background: "rgba(255,255,255,.75)",
        }}
      >
        <div style={{ fontWeight: 1000, marginBottom: 10 }}>빠른 메뉴</div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
          <a className="btn ghost" href="/cart" style={{ textDecoration: "none", textAlign: "center" }}>
            🛒 장바구니
          </a>
          <a className="btn ghost" href="/products" style={{ textDecoration: "none", textAlign: "center" }}>
            🛍️ 상품 보러가기
          </a>
          <a className="btn ghost" href="/mypage/orders" style={{ textDecoration: "none", textAlign: "center" }}>
            📦 주문내역
          </a>
          <a className="btn ghost" href="/mypage/edit" style={{ textDecoration: "none", textAlign: "center" }}>
            ✍️ 내 정보 수정
          </a>
        </div>
      </section>
    </div>
  );
}
