"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavigation from "../components/AdminNavigation";

interface DashboardData {
  products: {
    total: number;
    lowStock: number;
  };
  orders: {
    total: number;
    new: number;
    processing: number;
    weeklyRevenue: number;
  };
  discounts: {
    active: number;
    averagePercentage: number;
  };
  customers: {
    total: number;
  };
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
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

        // Fetch dashboard data
        const dashboardRes = await fetch("/api/admin/dashboard", {
          credentials: "include",
        });
        let data;
        if (dashboardRes.ok) {
          data = await dashboardRes.json();
          setDashboardData(data);
        }

        console.log("Dashboard data: ", data);
      } catch (error) {
        console.error("Error loading dashboard:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoadData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-700">Завантаження...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <AdminNavigation />

      {/* Main Content */}
      <div className="flex-1 max-w-6xl mx-auto p-6 bg-white rounded shadow m-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">
          Адмін-панель — Дашборд
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-blue-100 p-6 rounded shadow text-gray-900">
            <h2 className="text-xl font-semibold mb-2">Товари</h2>
            <p>
              Загальна кількість:{" "}
              <strong>{dashboardData?.products.total || 0}</strong>
            </p>
            <p>
              Товарів з низьким запасом:{" "}
              <strong>{dashboardData?.products.lowStock || 0}</strong>
            </p>
          </div>

          <div className="bg-green-100 p-6 rounded shadow text-gray-900">
            <h2 className="text-xl font-semibold mb-2">Замовлення</h2>
            <p>
              За останній тиждень:{" "}
              <strong>{dashboardData?.orders.total || 0}</strong>
            </p>
            <p>
              Нових замовлень: <strong>{dashboardData?.orders.new || 0}</strong>
            </p>
          </div>

          <div className="bg-purple-100 p-6 rounded shadow text-gray-900">
            <h2 className="text-xl font-semibold mb-2">Знижки</h2>
            <p>
              Активних знижок:{" "}
              <strong>{dashboardData?.discounts.active || 0}</strong>
            </p>
            <p>
              Середня знижка:{" "}
              <strong>
                {dashboardData?.discounts.averagePercentage || 0}%
              </strong>
            </p>
          </div>

          <div className="bg-yellow-100 p-6 rounded shadow text-gray-900">
            <h2 className="text-xl font-semibold mb-2">Статистика</h2>
            <p>
              Продажі за тиждень:{" "}
              <strong>
                {dashboardData?.orders.weeklyRevenue
                  ? (dashboardData.orders.weeklyRevenue / 100).toFixed(2)
                  : "0.00"}{" "}
                грн
              </strong>
            </p>
            <p>
              Кількість клієнтів:{" "}
              <strong>{dashboardData?.customers.total || 0}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
