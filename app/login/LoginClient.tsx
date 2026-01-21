"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "@/lib/api";

export default function LoginClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const next = searchParams.get("next") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data?.message || "로그인 실패");
      return;
    }

    router.replace(next);
  };

  return (
    <main style={{ maxWidth: 420, margin: "80px auto" }}>
      <h1 style={{ marginBottom: 16 }}>로그인</h1>

      <form onSubmit={onSubmit}>
        <input
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", padding: 12, marginBottom: 10 }}
        />

        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", padding: 12, marginBottom: 10 }}
        />

        <button style={{ width: "100%", padding: 12 }}>
          로그인
        </button>

        {error && (
          <div style={{ marginTop: 10, color: "crimson" }}>{error}</div>
        )}
      </form>
    </main>
  );
}

