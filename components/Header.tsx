"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { apiFetch } from "@/lib/api";

type Me = {
  user?: { id: number; email: string; name?: string | null; role?: string };
};

export default function Header() {
  const [me, setMe] = useState<Me | null>(null);
  const [cartCount, setCartCount] = useState<number>(0);

  const displayName = useMemo(() => {
    const n = me?.user?.name?.trim();
    if (n) return n;
    const e = me?.user?.email;
    return e ?? "";
  }, [me]);

  const load = useCallback(async () => {
    try {
      // 1) 로그인 확인
      const meRes = await apiFetch("/auth/me");
      if (!meRes.ok) {
        setMe(null);
        setCartCount(0);
        return;
      }

      const meData = (await meRes.json()) as Me;
      setMe(meData);

      // 2) 로그인일 때만 장바구니 호출
      const cartRes = await apiFetch("/cart");
      if (!cartRes.ok) {
        setCartCount(0);
        return;
      }

      const cartData = await cartRes.json();
      const items = Array.isArray(cartData?.items) ? cartData.items : [];
      const cnt = items.reduce((s: number, it: any) => s + (Number(it.quantity) || 0), 0);
      setCartCount(cnt);
    } catch {
      setMe(null);
      setCartCount(0);
    }
  }, []);

  useEffect(() => {
    load(); // 최초 1회

    // ✅ 로그인/로그아웃 직후 즉시 반영
    const onAuthChanged = () => load();
    window.addEventListener("auth-changed", onAuthChanged);
    return () => window.removeEventListener("auth-changed", onAuthChanged);
  }, [load]);

  return (
    <header className="headerWrap">
      <div className="topNotice">
        <div className="container inner">
          <div>🎀 첫 구매 감사 쿠폰! | 5만원 이상 무료배송 | 당일출고(평일 2시 이전)</div>
          <div className="right">kyorang.shop</div>
        </div>
      </div>

      <div className="headerMain">
        <div className="container headerGrid">
          <a className="brand" href="/">
            <div className="logo">🐰</div>
            <div className="title">
              <b>교랑상점</b>
              <span>cute pastel goodies</span>
            </div>
          </a>

          <div className="pill searchBar" role="search" aria-label="search">
            <input placeholder="스티커 / 캐릭터 / 키링 검색..." />
            <button className="searchBtn" type="button" aria-label="search">
              🔎
            </button>
          </div>

          <nav className="navRight">
            {me?.user ? (
              <>
                <span className="badge">🧸 {displayName}</span>
                <a className="navLink" href="/mypage">마이페이지</a>
                <button
                  className="btn ghost"
                  type="button"
                  onClick={async () => {
                    await apiFetch("/auth/logout", { method: "POST" });
                    window.dispatchEvent(new Event("auth-changed"));
                    location.href = "/";
                  }}
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <a className="navLink" href="/login">로그인</a>
                <a className="navLink" href="/signup">회원가입</a>
              </>
            )}

            <a className="pill cartPill" href="/cart">
              🛒 장바구니 <span className="cartCount">{cartCount}</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
