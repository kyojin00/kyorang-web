import Header from "@/components/Header";
import AuthGate from "@/components/AuthGate";
import ProductCard from "@/components/ProductCard";

type Product = {
  id: number;
  name: string;
  price: number;
  sale_price: number | null;
  stock: number;
  thumbnail_url: string | null;
};

export default async function HomePage() {
  // ✅ 서버 컴포넌트에서 API 주소는 "실제로 접근 가능한 값"으로
  const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

  const res = await fetch(`${API}/products?featured=1`, { cache: "no-store" });
  const data = (await res.json()) as { items: Product[] };
  const items = data.items ?? [];

  const categories = [
    { label: "스티커", icon: "🐻", href: "/?cat=sticker" },
    { label: "메모지", icon: "🍓", href: "/?cat=memo" },
    { label: "마테", icon: "🎀", href: "/?cat=masking-tape" },
    { label: "굿즈", icon: "🎁", href: "/?cat=goods" },
    { label: "다이어리", icon: "📘", href: "/?cat=diary" },
    { label: "문구세트", icon: "🧃", href: "/?cat=set" },
  ];

  return (
    <div>
      <Header />

      <AuthGate>
        <main className="container" style={{ paddingTop: 18, paddingBottom: 40 }}>
          {/* ✅ HERO */}
          <section
            className="pill"
            style={{
              borderRadius: 26,
              padding: 18,
              boxShadow: "var(--shadow)",
              background:
                "linear-gradient(135deg, rgba(255,225,240,.95), rgba(255,255,255,.75))",
              border: "1px solid rgba(0,0,0,.06)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.2fr 1fr",
                gap: 16,
                alignItems: "stretch",
              }}
            >
              <div style={{ padding: 10 }}>
                <span className="badge">🎀 이번 주 신상 업데이트 · 빠르게 품절돼요!</span>

                <h1 style={{ margin: "12px 0 6px", fontSize: 34, letterSpacing: -0.6, lineHeight: 1.12 }}>
                  귀여움이 배송되는 곳,
                  <br />
                  <span style={{ color: "var(--pink)" }}>교랑상점</span>
                </h1>

                <p style={{ margin: 0, color: "var(--muted)", fontWeight: 800, lineHeight: 1.6 }}>
                  스티커부터 키링까지, 매일 기분 좋아지는 소품을 모았어요 ✨
                  <br />
                  오늘의 MD 추천을 구경해보세요.
                </p>

                <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
                  <a className="btn pink" href="/products" style={{ textDecoration: "none" }}>
                    신상 보러가기 →
                  </a>
                  <a className="btn" href="/products?featured=1" style={{ textDecoration: "none" }}>
                    베스트 상품
                  </a>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginTop: 14 }}>
                  <div className="pill" style={{ padding: 10, textAlign: "center" }}>
                    <div style={{ fontSize: 18 }}>🚚</div>
                    <div style={{ fontSize: 12, fontWeight: 1000 }}>당일출고</div>
                    <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 800 }}>평일 2시 이전</div>
                  </div>
                  <div className="pill" style={{ padding: 10, textAlign: "center" }}>
                    <div style={{ fontSize: 18 }}>🎁</div>
                    <div style={{ fontSize: 12, fontWeight: 1000 }}>포장옵션</div>
                    <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 800 }}>선물용 OK</div>
                  </div>
                  <div className="pill" style={{ padding: 10, textAlign: "center" }}>
                    <div style={{ fontSize: 18 }}>💗</div>
                    <div style={{ fontSize: 12, fontWeight: 1000 }}>리뷰이벤트</div>
                    <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 800 }}>쿠폰/적립</div>
                  </div>
                </div>
              </div>

              {/* 오른쪽 큰 일러스트 카드 */}
              <div
                className="pill"
                style={{
                  borderRadius: 22,
                  padding: 16,
                  background:
                    "radial-gradient(220px 160px at 50% 45%, rgba(255,79,163,.18), rgba(255,255,255,.75) 70%)",
                  border: "1px solid rgba(0,0,0,.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 260,
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 54, lineHeight: 1 }}>🐻 🎀 🍓</div>
                  <div style={{ marginTop: 8, fontSize: 12, fontWeight: 900, color: "var(--pink)" }}>
                    (여기에 메인 배너 이미지 넣을 수 있어요)
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ✅ 카테고리 */}
          <section style={{ marginTop: 22 }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
              <h2 style={{ margin: 0, fontSize: 18, letterSpacing: -0.2 }}>카테고리</h2>
              <a href="/categories" style={{ fontSize: 12, fontWeight: 900, color: "var(--pink)" }}>
                전체보기
              </a>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10, marginTop: 12 }}>
              {categories.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  className="pill"
                  style={{
                    textDecoration: "none",
                    padding: "12px 10px",
                    textAlign: "center",
                    borderRadius: 18,
                    background: "rgba(255,255,255,.78)",
                    boxShadow: "0 10px 20px rgba(0,0,0,.04)",
                  }}
                >
                  <div style={{ fontSize: 20 }}>{c.icon}</div>
                  <div style={{ marginTop: 6, fontSize: 12, fontWeight: 1000 }}>{c.label}</div>
                </a>
              ))}
            </div>
          </section>

          {/* ✅ MD 추천 */}
          <section style={{ marginTop: 26 }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
              <h2 style={{ margin: 0, fontSize: 18, letterSpacing: -0.2 }}>MD 추천</h2>
              <a href="/products?featured=1" style={{ fontSize: 12, fontWeight: 900, color: "var(--pink)" }}>
                더보기
              </a>
            </div>

            <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
              {items.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  price={p.price}
                  salePrice={p.sale_price}
                  stock={p.stock}
                  thumbnailUrl={p.thumbnail_url}
                />
              ))}
            </div>
          </section>

          <footer style={{ marginTop: 40, padding: "22px 0", color: "var(--muted)", fontWeight: 900, fontSize: 12 }}>
            © {new Date().getFullYear()} kyorang.shop
          </footer>
        </main>
      </AuthGate>
    </div>
  );
}
