"use client";

import { useState } from "react";

type Props = {
  orderNo: string;
  initialCourier?: string | null;
  initialTrackingNo?: string | null;
  initialShippedAt?: string | null;
  onSaved?: (next: { courier: string; trackingNo: string; shippedAt?: string; status?: string }) => void;
};

export default function ShippingCard({
  orderNo,
  initialCourier,
  initialTrackingNo,
  initialShippedAt,
  onSaved,
}: Props) {
  const [courier, setCourier] = useState(initialCourier ?? "");
  const [trackingNo, setTrackingNo] = useState(initialTrackingNo ?? "");
  const [saving, setSaving] = useState(false);
  const shippedLabel = initialShippedAt ? new Date(initialShippedAt).toLocaleString("ko-KR") : "";

  const save = async () => {
    const c = courier.trim();
    const t = trackingNo.trim();
    if (!c || !t) {
      alert("택배사와 송장번호를 입력해줘.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${encodeURIComponent(orderNo)}/shipping`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ courier: c, trackingNo: t, autoShip: true }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data?.message || "저장 실패");
        return;
      }

      onSaved?.({ courier: c, trackingNo: t, shippedAt: data?.shippedAt, status: data?.status });
      alert("송장 정보가 저장됐어요. (상태: SHIPPED)");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200/70 bg-white p-4 sm:p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-gray-900">송장 / 택배사</h3>
          <p className="mt-1 text-sm text-gray-500">
            저장하면 <b>shipped_at</b>이 기록되고, 기본 설정으로 상태가 <b>SHIPPED</b>로 바뀝니다.
          </p>
        </div>
        {shippedLabel ? (
          <div className="text-xs text-gray-500 text-right">
            발송일시<br />
            <span className="text-gray-700">{shippedLabel}</span>
          </div>
        ) : null}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="sm:col-span-1">
          <label className="text-xs text-gray-600">택배사</label>
          <input
            value={courier}
            onChange={(e) => setCourier(e.target.value)}
            placeholder="예) CJ대한통운"
            className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs text-gray-600">송장번호</label>
          <input
            value={trackingNo}
            onChange={(e) => setTrackingNo(e.target.value)}
            placeholder="예) 1234-5678-9012"
            className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="rounded-xl bg-gray-900 !text-white px-4 py-2 text-sm hover:bg-gray-900 disabled:opacity-60"
        >
          {saving ? "저장 중..." : "저장"}
        </button>
      </div>
    </div>
  );
}
