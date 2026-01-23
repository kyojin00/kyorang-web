export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELED"
  | "REFUNDED";

export function statusLabel(s?: string) {
  switch ((s || "").toUpperCase()) {
    case "PENDING":
      return "주문 접수";
    case "PAID":
      return "결제 완료";
    case "SHIPPED":
      return "배송 중";
    case "DELIVERED":
      return "배송 완료";
    case "CANCELED":
      return "취소";
    case "REFUNDED":
      return "환불 완료";
    default:
      return s || "-";
  }
}

export function statusBadgeClass(s?: string) {
  const v = (s || "").toUpperCase();
  // ✅ 버튼/글자 대비 확실하게 (밝은 톤 + 링)
  if (v === "DELIVERED") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (v === "SHIPPED") return "bg-violet-50 text-violet-700 ring-violet-200";
  if (v === "PAID") return "bg-blue-50 text-blue-700 ring-blue-200";
  if (v === "CANCELED") return "bg-rose-50 text-rose-700 ring-rose-200";
  if (v === "REFUNDED") return "bg-slate-50 text-slate-700 ring-slate-200";
  return "bg-amber-50 text-amber-700 ring-amber-200"; // PENDING 기본
}
