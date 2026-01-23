import { NextResponse } from "next/server";
import { headers } from "next/headers";

const API_BASE = process.env.API_BASE_URL!; // 예: http://127.0.0.1:3001

export async function POST(req: Request, { params }: { params: Promise<{ orderNo: string }> }) {
  const { orderNo } = await params;
  const h = await headers();
  const cookie = h.get("cookie") ?? "";

  const body = await req.json();

  const r = await fetch(`${API_BASE}/admin/orders/${encodeURIComponent(orderNo)}/shipping`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      cookie, // ✅ 세션 쿠키 전달
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const text = await r.text();
  try {
    return NextResponse.json(JSON.parse(text), { status: r.status });
  } catch {
    return NextResponse.json({ message: text || "Invalid response" }, { status: r.status });
  }
}
