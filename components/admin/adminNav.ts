// components/admin/adminNav.ts
export type AdminNavItem = {
  label: string;
  href: string;
  icon?: string;        // lucide 쓰면 나중에 교체 가능
  disabled?: boolean;
  badge?: string;       // "Soon" 같은 표시
};

export const adminNav: AdminNavItem[] = [
  { label: "주문 관리", href: "/admin/orders" },
  { label: "상품 관리", href: "/admin/products", disabled: true, badge: "Soon" },
  { label: "고객 문의", href: "/admin/support", disabled: true, badge: "Soon" },
  { label: "공지 관리", href: "/admin/notices", disabled: true, badge: "Soon" },
  { label: "설정", href: "/admin/settings", disabled: true, badge: "Soon" },
];
