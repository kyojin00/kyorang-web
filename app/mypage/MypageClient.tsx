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

// ✅ 주문 목록 타입(백엔드 응답이 snake/camel 섞여도 대응)
type OrderRow = {
  orderNo?: string;
  order_no?: string;
  status: string;
  grandTotal?: number;
  grand_total?: number;
  createdAt?: string;
  created_at?: string;
  firstItemName?: string;
  totalQty?: number;
};

function pickOrderNo(o: OrderRow) {
  return o.orderNo || o.order_no || "";
}
function pickGrandTotal(o: OrderRow) {
  return Number(o.grandTotal ?? o.grand_total ?? 0);
}
function pickCreatedAt(o: OrderRow) {
  return o.createdAt || o.created_at || "";
}

function statusLabel(s: string) {
  const map: Record<string, string> = {
    PENDING: "주문접수",
    PAID: "결제완료",
    CANCELED: "취소",
    SHIPPED: "배송중",
    DELIVERED: "배송완료",
    REFUNDED: "환불",
  };
  return map[s] || s;
}

export default function MypageClient() {
  const router = useRouter();
  const [me, setMe] = useState<Me["user"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  // ✅ 최근 주문 미리보기 상태
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersMsg, setOrdersMsg] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const res = await apiFetch("/auth/me");
        const data = (await res.json().catch(() => ({}))) as Partial<Me> & ApiError;

        if (!res.ok) throw new Error(data.message || "로그인이 필요해요.");

        if (alive) setMe((data as Me).user);

        // ✅ 로그인 확인 성공 후에 최근 주문도 같이 로드
        setOrdersLoading(true);
        setOrdersMsg("");
        const oRes = await apiFetch("/orders");
        const oData = await oRes.json().catch(() => ({}));
        if (oRes.ok && alive) {
          const list = (oData.orders ?? []) as OrderRow[];
          setOrders(list.slice(0, 3)); // 최근 3개만 미리보기
        } else if (!oRes.ok && alive) {
          // 주문 목록 실패는 마이페이지 자체를 막지 않음(UX)
          setOrdersMsg(oData?.message || "주문 내역을 불러오지 못했어요.");
        }
      } catch {
        router.replace("/login?next=/mypage");
      } finally {
        if (alive) {
          setLoading(false);
          setOrdersLoading(false);
        }
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
      {/* ✅ 프로필 */}
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

      {/* ✅ 최근 주문 미리보기 */}
      <section
        className="pill"
        style={{
          padding: 14,
          borderRadius: 22,
          boxShadow: "var(--shadow)",
          background: "rgba(255,255,255,.75)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
          <div style={{ fontWeight: 1000 }}>최근 주문</div>
          <a className="btn ghost" href="/mypage/orders" style={{ textDecoration: "none", padding: "8px 10px" }}>
            전체보기 →
          </a>
        </div>

        {ordersLoading ? (
          <div style={{ marginTop: 10, opacity: 0.7, fontWeight: 800, fontSize: 13 }}>불러오는 중…</div>
        ) : ordersMsg ? (
          <div style={{ marginTop: 10, color: "crimson", fontWeight: 900, fontSize: 13 }}>{ordersMsg}</div>
        ) : orders.length === 0 ? (
          <div style={{ marginTop: 10, opacity: 0.7, fontWeight: 800, fontSize: 13 }}>주문 내역이 없어요.</div>
        ) : (
          <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
            {orders.map((o, idx) => {
              const orderNo = pickOrderNo(o);
              const total = pickGrandTotal(o);
              const created = pickCreatedAt(o);

              const title =
                o.firstItemName
                  ? `${o.firstItemName}${(o.totalQty ?? 0) > 1 ? ` 외 ${(o.totalQty ?? 0) - 1}개` : ""}`
                  : `주문 ${orderNo}`;

              return (
                <a
                  key={idx}
                  href={`/mypage/orders/${encodeURIComponent(orderNo)}`}
                  className="btn ghost"
                  style={{
                    textDecoration: "none",
                    display: "grid",
                    gap: 4,
                    padding: 12,
                    borderRadius: 18,
                    textAlign: "left",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ fontWeight: 1000 }}>{title}</div>
                    <div style={{ fontWeight: 1000 }}>{total.toLocaleString()}원</div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: 12, opacity: 0.7 }}>
                    <div>📦 {statusLabel(o.status)}</div>
                    <div style={{ opacity: 0.7 }}>
                      {created ? new Date(created).toLocaleDateString() : ""}
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </section>

      {/* ✅ 빠른 메뉴 */}
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
          <a className="btn ghost" href="/" style={{ textDecoration: "none", textAlign: "center" }}>
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
