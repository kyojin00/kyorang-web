"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { isLoggedIn } from "@/lib/isLoggedIn";
import LoginRequiredModal from "@/components/LoginRequiredModal";

export default function GoCartButton() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const current = `${pathname}${searchParams.toString() ? `?${searchParams}` : ""}`;

  const onClick = async () => {
    const ok = await isLoggedIn();
    if (!ok) {
      setOpen(true);
      return;
    }
    router.push("/cart");
  };

  return (
    <>
      <button className="btn" style={{ width: "100%" }} onClick={onClick}>
        장바구니로 가기
      </button>

      <LoginRequiredModal
        open={open}
        onClose={() => setOpen(false)}
        onGoLogin={() => router.push(`/login?next=${encodeURIComponent(current)}`)}
      />
    </>
  );
}
