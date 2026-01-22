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
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    setLoading(true);

    try {
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
    } catch {
      setError("네트워크 오류가 발생했어요. 잠시 후 다시 시도해줘.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="authPage">
      <section className="authCard">
        <header className="authHeader">
          <div className="authTitleRow">
            <div className="authIcon">🐰</div>
            <div className="authTitles">
              <b>로그인</b>
              <span>교랑상점 계정으로 로그인해줘 ✨</span>
            </div>
          </div>
        </header>

        <div className="authBody">
          {error && <div className="authError">⚠️ {error}</div>}

          <form onSubmit={onSubmit}>
            <div className="field">
              <div className="ico">✉️</div>
              <input
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                inputMode="email"
              />
            </div>

            <div className="field">
              <div className="ico">🔒</div>
              <input
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <div className="actions">
              <button className="btn pink btnFull" disabled={loading}>
                {loading ? "로그인 중..." : "로그인"}
              </button>

              <a className="btn ghost btnFull" href="/">
                홈으로
              </a>
            </div>

            <div className="metaRow">
              <a href={`/signup?next=${encodeURIComponent(next)}`}>회원가입</a>
            </div>

            <div className="smallHint">
              로그인 후 자동으로 <b>{next}</b> 로 이동해요
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
