import { proxy } from "@/app/api/_proxy";

export async function POST(
  req: Request,
  { params }: { params: { orderNo: string } }
) {
  return proxy(
    req,
    `/admin/orders/${encodeURIComponent(params.orderNo)}/status`
  );
}

export async function PATCH(
  req: Request,
  { params }: { params: { orderNo: string } }
) {
  return proxy(
    req,
    `/admin/orders/${encodeURIComponent(params.orderNo)}/status`
  );
}
