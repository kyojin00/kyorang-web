// app/admin/layout.tsx
import type { Metadata } from "next";
import AdminGate from "@/components/AdminGate"; // 너 프로젝트 경로에 맞춰 수정
import AdminShell from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "교랑상점 관리자",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGate>
      <AdminShell>{children}</AdminShell>
    </AdminGate>
  );
}
