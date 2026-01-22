"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiFetch } from "@/lib/api";

export default function SignupClient() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) return setError("이메일을 입력해줘.");
    if (!password || password.length < 8)
      return setError("비밀번호는 8자 이상이어야 해.");
    if (password !== password2)
      return setError("비밀번호가 서로 달라.");

    setLoading(true);
    try {
      const res = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          email: email.trim(),
          password,
          name: name.trim() || undefined,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.message || "회원가입 실패");
        return;
      }

      router.replace("/login");
    } catch {
      setError("서버 연결 오류");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container" style={{ maxWidth: 420, marginTop: 80 }}>
      <section
        className="pill"
        style={{
          padding: 22,
          borderRadius: 22,
          boxShadow: "var(--shadow)",
          background:
            "linear-gradient(135deg, rgba(255,225,240,.95), rgba(255,255,255,.85))",
          border: "1px solid rgba(0,0,0,.06)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 36 }}>🎀</div>
          <h1 style={{ margin: "6px 0 4px" }}>회원가입</h1>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: "var(--muted)" }}>
            교랑상점에 오신 걸 환영해요 💗
          </p>
        </div>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
          <input
            className="pill"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            style={{ padding: 12, fontWeight: 800 }}
          />

          <input
            className="pill"
            placeholder="이름 (선택)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            style={{ padding: 12, fontWeight: 800 }}
          />

          <input
            className="pill"
            type="password"
            placeholder="비밀번호 (8자 이상)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            style={{ padding: 12, fontWeight: 800 }}
          />

          <input
            className="pill"
            type="password"
            placeholder="비밀번호 확인"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            autoComplete="new-password"
            style={{ padding: 12, fontWeight: 800 }}
          />

          <button
            type="submit"
            className="btn pink"
            disabled={loading}
            style={{ marginTop: 6, padding: 12, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "처리 중..." : "회원가입"}
          </button>

          {error && (
            <div
              style={{
                marginTop: 6,
                fontSize: 13,
                fontWeight: 900,
                color: "crimson",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}
        </form>

        <div
          style={{
            marginTop: 14,
            fontSize: 13,
            fontWeight: 900,
            textAlign: "center",
            opacity: 0.8,
          }}
        >
          이미 계정이 있어?{" "}
          <a href="/login" style={{ textDecoration: "underline" }}>
            로그인
          </a>
        </div>
      </section>
    </main>
  );
}
