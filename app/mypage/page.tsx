import Header from "@/components/Header";
import AuthGate from "@/components/AuthGate";
import MypageClient from "./MypageClient";

export default function MyPage() {
  return (
    <div>
      <AuthGate>
        <main className="container" style={{ paddingTop: 18, paddingBottom: 40 }}>
          <MypageClient />
        </main>
      </AuthGate>
    </div>
  );
}
