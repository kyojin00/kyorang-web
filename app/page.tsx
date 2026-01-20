// app/page.tsx
import Image from "next/image";

const categories = [
  { name: "스티커", emoji: "🧸" },
  { name: "메모지", emoji: "🍓" },
  { name: "키링", emoji: "🎀" },
  { name: "다이어리", emoji: "📖" },
  { name: "문구세트", emoji: "🧁" },
  { name: "랜덤박스", emoji: "🎁" },
];

const products = Array.from({ length: 8 }).map((_, i) => ({
  id: String(i + 1),
  name: `교랑 추천 소품 ${i + 1}`,
  price: (3900 + i * 500).toLocaleString("ko-KR"),
  badge: i % 3 === 0 ? "NEW" : i % 3 === 1 ? "BEST" : "PICK",
}));

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50">
      {/* Top Notice */}
      <div className="w-full bg-pink-200/70 text-pink-900 text-sm">
        <div className="mx-auto max-w-6xl px-4 py-2 flex items-center justify-between">
          <p className="truncate">
            🎉 첫 구매 감사 쿠폰! | 3만원 이상 무료배송 | 당일출고(평일 2시 이전)
          </p>
          <span className="hidden sm:inline text-xs opacity-80">
            kyorang.shop
          </span>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur bg-white/75 border-b border-pink-100">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-pink-200 grid place-items-center shadow-sm">
              🐰
            </div>
            <div className="leading-tight">
              <div className="font-extrabold text-lg text-pink-700">
                교랑상점
              </div>
              <div className="text-xs text-pink-500 -mt-0.5">
                cute pastel goodies
              </div>
            </div>
          </div>

          <div className="flex-1 hidden md:block">
            <div className="relative">
              <input
                className="w-full rounded-2xl border border-pink-200 bg-white px-4 py-2.5 pr-10 text-sm outline-none focus:ring-2 focus:ring-pink-200"
                placeholder="스티커 / 캐릭터 / 키링 검색…"
              />
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-xl bg-pink-200/70 hover:bg-pink-200 grid place-items-center"
                aria-label="search"
              >
                🔎
              </button>
            </div>
          </div>

          <nav className="ml-auto flex items-center gap-2 text-sm">
            <button className="hidden sm:inline rounded-2xl px-3 py-2 hover:bg-pink-50">
              로그인
            </button>
            <button className="hidden sm:inline rounded-2xl px-3 py-2 hover:bg-pink-50">
              마이
            </button>
            <button className="rounded-2xl px-3 py-2 bg-pink-200/70 hover:bg-pink-200">
              🛒 장바구니
            </button>
          </nav>
        </div>

        {/* Mobile search */}
        <div className="md:hidden mx-auto max-w-6xl px-4 pb-4">
          <div className="relative">
            <input
              className="w-full rounded-2xl border border-pink-200 bg-white px-4 py-2.5 pr-10 text-sm outline-none focus:ring-2 focus:ring-pink-200"
              placeholder="검색…"
            />
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-xl bg-pink-200/70 hover:bg-pink-200 grid place-items-center"
              aria-label="search"
            >
              🔎
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-6">
        <div className="relative overflow-hidden rounded-[28px] border border-pink-100 bg-gradient-to-br from-pink-200/60 via-white to-pink-100 shadow-sm">
          <div className="grid md:grid-cols-2 gap-6 p-6 md:p-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-pink-100 px-3 py-1 text-xs text-pink-700">
                🎀 이번주 신상 업데이트
                <span className="h-1 w-1 rounded-full bg-pink-400" />
                빠르게 품절돼요!
              </div>
              <h1 className="mt-3 text-3xl md:text-4xl font-extrabold text-pink-800 leading-tight">
                귀여움이 배송되는 곳,
                <br />
                <span className="text-pink-600">교랑상점</span>
              </h1>
              <p className="mt-3 text-pink-700/80">
                스티커부터 키링까지, 매일 기분 좋아지는 소품을 모았어요. ✨
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <button className="rounded-2xl bg-pink-500 text-white px-5 py-3 text-sm font-semibold hover:bg-pink-600 shadow-sm">
                  신상 보러가기 →
                </button>
                <button className="rounded-2xl bg-white border border-pink-200 px-5 py-3 text-sm font-semibold text-pink-700 hover:bg-pink-50">
                  베스트 상품
                </button>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-2xl bg-white/70 border border-pink-100 py-3">
                  <div className="text-lg">🚚</div>
                  <div className="text-xs text-pink-700 mt-1">당일출고</div>
                </div>
                <div className="rounded-2xl bg-white/70 border border-pink-100 py-3">
                  <div className="text-lg">🎁</div>
                  <div className="text-xs text-pink-700 mt-1">포장옵션</div>
                </div>
                <div className="rounded-2xl bg-white/70 border border-pink-100 py-3">
                  <div className="text-lg">💗</div>
                  <div className="text-xs text-pink-700 mt-1">리뷰이벤트</div>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-[24px] bg-white/70 border border-pink-100 grid place-items-center overflow-hidden">
                <div className="absolute -top-8 -right-8 h-40 w-40 rounded-full bg-pink-200/70 blur-2xl" />
                <div className="absolute -bottom-10 -left-10 h-52 w-52 rounded-full bg-pink-100 blur-2xl" />

                <div className="relative z-10 text-center p-6">
                  <div className="text-6xl">🧸🎀🍓</div>
                  <p className="mt-3 text-sm text-pink-800/80">
                    (여기에 메인 배너 이미지 넣을 수 있어요)
                  </p>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <div className="h-2 flex-1 rounded-full bg-pink-200" />
                <div className="h-2 flex-1 rounded-full bg-pink-100" />
                <div className="h-2 flex-1 rounded-full bg-pink-100" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 mt-8">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-extrabold text-pink-800">
            카테고리
          </h2>
          <button className="text-sm text-pink-600 hover:underline">
            전체보기
          </button>
        </div>

        <div className="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-3">
          {categories.map((c) => (
            <button
              key={c.name}
              className="rounded-2xl bg-white border border-pink-100 hover:bg-pink-50 transition p-4 text-center shadow-[0_1px_0_rgba(0,0,0,0.02)]"
            >
              <div className="text-2xl">{c.emoji}</div>
              <div className="mt-2 text-sm font-semibold text-pink-800">
                {c.name}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="mx-auto max-w-6xl px-4 mt-10">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-extrabold text-pink-800">
            MD 추천
          </h2>
          <button className="text-sm text-pink-600 hover:underline">
            더보기
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <article
              key={p.id}
              className="group rounded-[22px] bg-white border border-pink-100 overflow-hidden hover:shadow-md transition"
            >
              <div className="relative aspect-square bg-pink-50 grid place-items-center">
                <span className="absolute left-3 top-3 text-xs font-bold px-2 py-1 rounded-full bg-pink-200 text-pink-800">
                  {p.badge}
                </span>
                <span className="text-5xl">🧁</span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-pink-900 line-clamp-2">
                  {p.name}
                </h3>
                <p className="mt-2 text-pink-700 font-extrabold">
                  {p.price}원
                </p>

                <div className="mt-3 flex gap-2">
                  <button className="flex-1 rounded-2xl bg-pink-500 text-white py-2 text-sm font-semibold hover:bg-pink-600">
                    담기
                  </button>
                  <button className="w-10 rounded-2xl bg-pink-100 text-pink-700 hover:bg-pink-200">
                    💗
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-12 border-t border-pink-100 bg-white/70">
        <div className="mx-auto max-w-6xl px-4 py-10 grid md:grid-cols-3 gap-8 text-sm">
          <div>
            <div className="font-extrabold text-pink-800">교랑상점</div>
            <p className="mt-2 text-pink-700/80">
              귀여운 소품으로 일상을 더 포근하게 ✨
            </p>
          </div>

          <div>
            <div className="font-bold text-pink-800">고객센터</div>
            <ul className="mt-2 space-y-1 text-pink-700/80">
              <li>운영시간: 평일 10:00 - 17:00</li>
              <li>점심시간: 12:00 - 13:00</li>
              <li>문의: DM / 이메일</li>
            </ul>
          </div>

          <div>
            <div className="font-bold text-pink-800">배송/교환</div>
            <ul className="mt-2 space-y-1 text-pink-700/80">
              <li>3만원 이상 무료배송</li>
              <li>단순변심 7일 이내 가능</li>
              <li>파손/오배송은 100% 교환</li>
            </ul>
          </div>
        </div>

        <div className="text-center text-xs text-pink-600/70 pb-6">
          © {new Date().getFullYear()} kyorang.shop
        </div>
      </footer>
    </div>
  );
}
