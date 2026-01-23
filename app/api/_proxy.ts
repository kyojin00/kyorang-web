import { NextResponse } from "next/server";

const API_BASE = process.env.API_BASE_URL || "http://127.0.0.1:3001"; // 서버 내부에서만 사용 (하드코딩 금지 원칙은 프론트 호출에 적용)

export async function proxy(req: Request, upstreamPath: string) {
  const url = `${API_BASE}${upstreamPath}`;

  const headers: Record<string, string> = {};
  req.headers.forEach((v, k) => {
    // hop-by-hop 제외
    if (k.toLowerCase() === "host") return;
    headers[k] = v;
  });

  let body: BodyInit | undefined = undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    body = await req.text(); // 그대로 전달
  }

  let upstreamRes: Response;
  try {
    upstreamRes = await fetch(url, {
      method: req.method,
      headers,
      body,
      redirect: "manual",
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, message: "API 서버 연결 실패", detail: String(e?.message || e) },
      { status: 502 }
    );
  }

  const contentType = upstreamRes.headers.get("content-type") || "";

  // ✅ JSON이 아니면 텍스트로 읽어서 JSON 형태로 감싸 반환(프론트 res.json() 안전)
  if (!contentType.includes("application/json")) {
    const text = await upstreamRes.text().catch(() => "");
    return NextResponse.json(
      { ok: false, message: text || "Upstream returned non-JSON response" },
      { status: upstreamRes.status }
    );
  }

  // JSON이면 그대로 전달
  const data = await upstreamRes.json().catch(() => ({}));
  return NextResponse.json(data, { status: upstreamRes.status });
}
