"use client";

import { usePathname, useRouter } from "next/navigation";

export default function AdminNavigation() {
  const router = useRouter();
  const pathname = usePathname();

  const handlePageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const path = e.target.value;
    if (path && path !== pathname) router.push(path);
  };

  // Get current path or default to /admin/ if we're on the main admin page
  const getCurrentPath = () => {
    if (pathname === "/admin") return "/admin/";
    return pathname;
  };

  return (
    <>
      {/* Sidebar for desktop */}
      <div className="hidden md:block p-4 bg-white shadow min-h-screen w-64 flex-shrink-0">
        <select
          className="w-full p-2 border rounded"
          onChange={handlePageChange}
          value={getCurrentPath()}
        >
          <option value="/admin/">📊 Дашборд</option>
          <option value="/admin/products">📦 Товари</option>
          <option value="/admin/orders">🛒 Замовлення</option>
          <option value="/admin/discounts">🏷️ Знижки</option>
        </select>
      </div>

      {/* Dropdown above content for mobile */}
      <div className="block md:hidden p-4 bg-white shadow">
        <select
          className="w-full p-2 border rounded"
          onChange={handlePageChange}
          value={getCurrentPath()}
        >
          <option value="/admin/">📊 Дашборд</option>
          <option value="/admin/products">📦 Товари</option>
          <option value="/admin/orders">🛒 Замовлення</option>
          <option value="/admin/discounts">🏷️ Знижки</option>
        </select>
      </div>
    </>
  );
}
