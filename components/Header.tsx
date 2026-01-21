"use client";

import { useEffect, useMemo, useState } from "react";
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
    if (!e) return "";
    return e;
  }, [me]);

  useEffect(() => {
    // 로그인 상태
    apiFetch("/auth/me")
      .then(async (res) => {
        if (!res.ok) return setMe(null);
        const data = (await res.json()) as Me;
        setMe(data);
      })
      .catch(() => setMe(null));

    // 장바구니 개수(로그인 돼있을 때만)
    apiFetch("/cart")
      .then(async (res) => {
        if (!res.ok) return setCartCount(0);
        const data = await res.json();
        const items = Array.isArray(data?.items) ? data.items : [];
        const cnt = items.reduce((s: number, it: any) => s + (Number(it.quantity) || 0), 0);
        setCartCount(cnt);
      })
      .catch(() => setCartCount(0));
  }, []);

  return (
    <header className="headerWrap">
      {/* 상단 공지바 */}
      <div className="topNotice">
        <div className="container inner">
          <div>🎀 첫 구매 감사 쿠폰! | 3만원 이상 무료배송 | 당일출고(평일 2시 이전)</div>
          <div className="right">kyorang.shop</div>
        </div>
      </div>

      {/* 메인 헤더 */}
      <div className="headerMain">
        <div className="container headerGrid">
          {/* 로고 */}
          <a className="brand" href="/">
            <div className="logo">🐰</div>
            <div className="title">
              <b>교랑상점</b>
              <span>cute pastel goodies</span>
            </div>
          </a>

          {/* 검색 */}
          <div className="pill searchBar" role="search" aria-label="search">
            <input placeholder="스티커 / 캐릭터 / 키링 검색..." />
            <button className="searchBtn" type="button" aria-label="search">
              🔎
            </button>
          </div>

          {/* 우측 메뉴 */}
          <nav className="navRight">
            {me?.user ? (
              <>
                <span className="badge">🧸 {displayName}</span>
                <a className="navLink" href="/mypage">마이</a>
                <button
                  className="btn ghost"
                  type="button"
                  onClick={async () => {
                    await apiFetch("/auth/logout", { method: "POST" });
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
