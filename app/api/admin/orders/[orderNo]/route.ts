import { proxy } from "@/app/api/_proxy";
import { NextRequest } from "next/server";

type Ctx = { params: Promise<{ orderNo: string }> };

export async function GET(req: NextRequest, { params }: Ctx) {
  const { orderNo } = await params;
  return proxy(req, `/admin/orders/${orderNo}`);
}
