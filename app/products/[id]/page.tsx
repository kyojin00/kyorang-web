import Header from "@/components/Header";
import AuthGate from "@/components/AuthGate";
import AddToCartButton from "@/components/AddToCartButton";

type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  sale_price: number | null;
  stock: number;
  thumbnail_url: string | null;
  category_name?: string | null;
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>; // ✅ Promise로 받기
}) {
  const { id } = await params;     // ✅ 여기서 unwrap
  const productId = Number(id);

  const API = "http://192.168.0.122:3001";

  const res = await fetch(`${API}/products/${productId}`, { cache: "no-store" });
  if (!res.ok) {
    return (
      <div>
        <Header />
        <main className="container">
          <div className="card" style={{ padding: 18 }}>
            상품을 찾을 수 없어요.
          </div>
        </main>
      </div>
    );
  }

  const data = (await res.json()) as { item: Product };
  const p = data.item;

  const finalPrice = p.sale_price ?? p.price;
  const soldOut = p.stock <= 0;

  return (
    <div>
      <Header />
      <AuthGate>
        <main className="container">
          <div
            className="card"
            style={{
              padding: 18,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 18,
            }}
          >
            <div
              style={{
                borderRadius: 16,
                overflow: "hidden",
                border: "1px solid var(--line)",
                background: "linear-gradient(135deg, #ffe3ef, #fff)",
                minHeight: 320,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {p.thumbnail_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.thumbnail_url}
                  alt={p.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div style={{ fontSize: 64 }}>🧸</div>
              )}
            </div>

            <div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span className="badge">🛍️ {p.category_name ?? "카테고리"}</span>
                {soldOut && <span className="badge">품절</span>}
              </div>

              <h1 style={{ margin: "12px 0 6px" }}>{p.name}</h1>

              <div style={{ marginTop: 6 }}>
                {p.sale_price ? (
                  <div style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
                    <div style={{ fontSize: 22, fontWeight: 900 }}>
                      {finalPrice.toLocaleString()}원
                    </div>
                    <div style={{ textDecoration: "line-through", opacity: 0.55 }}>
                      {p.price.toLocaleString()}원
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: 22, fontWeight: 900 }}>
                    {p.price.toLocaleString()}원
                  </div>
                )}
                <div style={{ marginTop: 6, opacity: 0.7, fontSize: 13 }}>
                  재고: {p.stock}
                </div>
              </div>

              <div style={{ marginTop: 14, opacity: 0.85, lineHeight: 1.7 }}>
                {p.description ?? "상품 설명이 준비 중이에요 🩷"}
              </div>

              <div style={{ marginTop: 18 }}>
                <AddToCartButton productId={p.id} disabled={soldOut} />
              </div>

              <div style={{ marginTop: 10 }}>
                <a
                  className="btn"
                  href="/cart"
                  style={{
                    width: "100%",
                    display: "block",
                    textAlign: "center",
                    textDecoration: "none",
                  }}
                >
                  장바구니로 가기
                </a>
              </div>
            </div>
          </div>
        </main>
      </AuthGate>
    </div>
  );
}
