// app/cart/page.tsx
import Header from "@/components/Header";
import AuthGate from "@/components/AuthGate";
import CartClient from "./CartClient";
import { Suspense } from "react";

export default function CartPage() {
  return (
    <div>
      <Header />
      <AuthGate>
        <main className="container">
          <Suspense
            fallback={
              <div className="card" style={{ padding: 18 }}>
                <h1 style={{ marginTop: 0 }}>장바구니</h1>
                <div style={{ opacity: 0.7 }}>불러오는 중…</div>
              </div>
            }
          >
            <CartClient />
          </Suspense>
        </main>
      </AuthGate>
    </div>
  );
}
