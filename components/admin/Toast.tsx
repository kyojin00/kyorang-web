"use client";

// components/admin/Toast.tsx
import { useEffect } from "react";

export type ToastState = {
  open: boolean;
  message: string;
  type?: "success" | "error" | "info";
};

type Props = {
  toast: ToastState;
  onClose: () => void;
};

function cx(...args: Array<string | false | null | undefined>) {
  return args.filter(Boolean).join(" ");
}

export default function Toast({ toast, onClose }: Props) {
  useEffect(() => {
    if (!toast.open) return;
    const t = setTimeout(onClose, 2400);
    return () => clearTimeout(t);
  }, [toast.open, onClose]);

  if (!toast.open) return null;

  const style =
    toast.type === "success"
      ? "bg-emerald-600"
      : toast.type === "error"
      ? "bg-rose-600"
      : "bg-gray-900";

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div
        className={cx(
          "rounded-2xl px-4 py-3 text-sm text-white shadow-lg",
          style
        )}
      >
        {toast.message}
      </div>
    </div>
  );
}
