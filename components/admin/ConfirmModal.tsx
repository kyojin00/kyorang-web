"use client";

// components/admin/ConfirmModal.tsx
type Props = {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

function cx(...args: Array<string | false | null | undefined>) {
  return args.filter(Boolean).join(" ");
}

export default function ConfirmModal({
  open,
  title,
  description,
  confirmText = "확인",
  cancelText = "취소",
  danger,
  onConfirm,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* panel */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl bg-white shadow-lg ring-1 ring-gray-200">
          <div className="p-5">
            <h3 className="text-base font-semibold text-gray-900">{title}</h3>
            {description ? (
              <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                {description}
              </p>
            ) : null}

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm hover:bg-gray-50"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className={cx(
                  "rounded-xl px-4 py-2 text-sm text-white hover:opacity-90",
                  danger ? "bg-rose-600" : "bg-gray-900"
                )}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
