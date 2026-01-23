import { proxy } from "@/app/api/_proxy";

export async function POST(req: Request) {
  return proxy(req, "/orders/checkout");
}
