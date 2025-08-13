"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Order {
  id: string;
  customer: string;
  total: number;
  status: "Очікує" | "В обробці" | "Відвантажено" | "Виконано";
  date: string;
}

const sampleOrders: Order[] = [
  {
    id: "1001",
    customer: "Іван Іванов",
    total: 1200,
    status: "В обробці",
    date: "2025-08-04",
  },
  {
    id: "1002",
    customer: "Олена Петрівна",
    total: 560,
    status: "Очікує",
    date: "2025-08-03",
  },
  {
    id: "1003",
    customer: "Михайло Сидоренко",
    total: 350,
    status: "Виконано",
    date: "2025-08-01",
  },
];

export default function AdminOrders() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          router.push("/login");
          return;
        }

        const user = await res.json();
        if (user.role !== "admin") {
          router.push("/");
          return;
        }

        setLoading(false);
      } catch (err) {
        console.error("Auth check failed:", err);
        router.push("/login");
      }
    }

    checkAuth();
  }, [router]);

  if (loading) return <div className="p-6">⏳ Перевірка доступу...</div>;

  const handlePageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const path = e.target.value;
    if (path) router.push(path);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar for desktop (md+) */}
      <div className="hidden md:block p-4 bg-white shadow h-full w-64">
        <select
          className="w-full p-2 border rounded"
          onChange={handlePageChange}
          defaultValue="/admin/orders"
        >
          <option value="/admin/dashboard">📊 Дашборд</option>
          <option value="/admin/products">📦 Товари</option>
          <option value="/admin/orders">🛒 Замовлення</option>
        </select>
      </div>

      {/* Dropdown above content on mobile (<md) */}
      <div className="block md:hidden p-4 bg-white shadow">
        <select
          className="w-full p-2 border rounded"
          onChange={handlePageChange}
          defaultValue="/admin/orders"
        >
          <option value="/admin/dashboard">📊 Дашборд</option>
          <option value="/admin/products">📦 Товари</option>
          <option value="/admin/orders">🛒 Замовлення</option>
        </select>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-6xl mx-auto p-6 bg-white rounded shadow m-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">
          Перегляд замовлень
        </h1>

        <table className="w-full border-collapse border border-gray-300 text-gray-900">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">№ Замовлення</th>
              <th className="border border-gray-300 p-2">Клієнт</th>
              <th className="border border-gray-300 p-2 text-right">
                Сума (грн)
              </th>
              <th className="border border-gray-300 p-2">Статус</th>
              <th className="border border-gray-300 p-2">Дата</th>
            </tr>
          </thead>
          <tbody>
            {sampleOrders.map((o) => (
              <tr key={o.id} className="hover:bg-gray-50 cursor-pointer">
                <td className="border border-gray-300 p-2">{o.id}</td>
                <td className="border border-gray-300 p-2">{o.customer}</td>
                <td className="border border-gray-300 p-2 text-right">
                  {o.total}
                </td>
                <td className="border border-gray-300 p-2">{o.status}</td>
                <td className="border border-gray-300 p-2">{o.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
