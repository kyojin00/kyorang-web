// components/admin/StatusBadge.tsx
type Props = {
  status: string;
  className?: string;
};

function cx(...args: Array<string | false | null | undefined>) {
  return args.filter(Boolean).join(" ");
}

const labelMap: Record<string, string> = {
  PENDING: "PENDING",
  PAID: "PAID",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
};

export default function StatusBadge({ status, className }: Props) {
  const s = (status || "").toUpperCase();

  const style =
    s === "DELIVERED"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : s === "SHIPPED"
      ? "bg-violet-50 text-violet-700 ring-violet-200"
      : s === "PAID"
      ? "bg-blue-50 text-blue-700 ring-blue-200"
      : s === "CANCELLED"
      ? "bg-rose-50 text-rose-700 ring-rose-200"
      : "bg-gray-100 text-gray-700 ring-gray-200";

  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ring-1",
        style,
        className
      )}
    >
      {labelMap[s] ?? s ?? "UNKNOWN"}
    </span>
  );
}
