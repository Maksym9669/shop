"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Not authenticated");

        const user = await res.json();
        if (user.role !== "admin") {
          router.push("/");
          return;
        }
      } catch (error) {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-700">Завантаження...</p>
      </div>
    );
  }

  const handlePageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const path = e.target.value;
    if (path) router.push(path);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar for desktop */}
      <div className="hidden md:block p-4 bg-white shadow h-full w-64">
        <select
          className="w-full p-2 border rounded"
          onChange={handlePageChange}
          defaultValue="/admin/"
        >
          <option value="/admin/">📊 Дашборд</option>
          <option value="/admin/products">📦 Товари</option>
          <option value="/admin/orders">🛒 Замовлення</option>
        </select>
      </div>

      {/* Dropdown above content for mobile */}
      <div className="block md:hidden p-4 bg-white shadow">
        <select
          className="w-full p-2 border rounded"
          onChange={handlePageChange}
          defaultValue="/admin/"
        >
          <option value="/admin/">📊 Дашборд</option>
          <option value="/admin/products">📦 Товари</option>
          <option value="/admin/orders">🛒 Замовлення</option>
        </select>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-6xl mx-auto p-6 bg-white rounded shadow m-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">
          Адмін-панель — Дашборд
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-100 p-6 rounded shadow text-gray-900">
            <h2 className="text-xl font-semibold mb-2">Товари</h2>
            <p>
              Загальна кількість: <strong>120</strong>
            </p>
            <p>
              Товарів з низьким запасом: <strong>8</strong>
            </p>
          </div>

          <div className="bg-green-100 p-6 rounded shadow text-gray-900">
            <h2 className="text-xl font-semibold mb-2">Замовлення</h2>
            <p>
              Нових замовлень: <strong>5</strong>
            </p>
            <p>
              В обробці: <strong>3</strong>
            </p>
          </div>

          <div className="bg-yellow-100 p-6 rounded shadow text-gray-900">
            <h2 className="text-xl font-semibold mb-2">Статистика</h2>
            <p>
              Продажі за місяць: <strong>50 000 грн</strong>
            </p>
            <p>
              Кількість клієнтів: <strong>1200</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
