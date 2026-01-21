"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams(); // ✅
  const next = searchParams.get("next") || "/"; // ✅ 여기서 안전하게 읽힘

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(data?.message ?? "로그인 실패");

      router.replace(next); // ✅ 로그인 성공 후 next로 이동
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? "로그인 오류");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "60px auto" }}>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>교랑상점 로그인</h1>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일"
          type="email"
          required
          style={{ padding: 10, border: "1px solid #ddd", borderRadius: 10 }}
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          type="password"
          required
          style={{ padding: 10, border: "1px solid #ddd", borderRadius: 10 }}
        />
        <button type="submit" disabled={loading} style={{ padding: 12, borderRadius: 12, border: "none" }}>
          {loading ? "로그인 중..." : "로그인"}
        </button>

        {error && <p style={{ color: "crimson", margin: 0 }}>{error}</p>}
      </form>
    </div>
  );
}
