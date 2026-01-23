import { proxy } from "@/app/api/_proxy";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  return proxy(req, `/admin/orders`);
}
