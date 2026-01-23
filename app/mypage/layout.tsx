import AuthGate from "@/components/AuthGate";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate>
      <main className="min-h-screen bg-gray-50">{children}</main>
    </AuthGate>
  );
}
