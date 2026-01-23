import { proxy } from "@/app/api/_proxy";

export async function GET(req: Request) {
  return proxy(req, "/orders");
}
