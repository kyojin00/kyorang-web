import { proxy } from "@/app/api/_proxy";

export async function GET(
  req: Request,
  { params }: { params: { orderNo: string } }
) {
  return proxy(req, `/admin/orders/${params.orderNo}`);
}
