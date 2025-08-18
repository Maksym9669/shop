"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavigation from "../../components/AdminNavigation";
import Pagination from "../../components/Pagination";

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
  {
    id: "1004",
    customer: "Анна Коваленко",
    total: 890,
    status: "Відвантажено",
    date: "2025-07-30",
  },
  {
    id: "1005",
    customer: "Петро Мельник",
    total: 450,
    status: "Очікує",
    date: "2025-07-29",
  },
  {
    id: "1006",
    customer: "Марія Іваненко",
    total: 1750,
    status: "В обробці",
    date: "2025-07-28",
  },
  {
    id: "1007",
    customer: "Андрій Білий",
    total: 320,
    status: "Виконано",
    date: "2025-07-27",
  },
  {
    id: "1008",
    customer: "Тетяна Левченко",
    total: 680,
    status: "Відвантажено",
    date: "2025-07-26",
  },
  {
    id: "1009",
    customer: "Олексій Ткач",
    total: 1150,
    status: "В обробці",
    date: "2025-07-25",
  },
  {
    id: "1010",
    customer: "Світлана Гриценко",
    total: 480,
    status: "Очікує",
    date: "2025-07-24",
  },
];

export default function AdminOrders() {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Orders per page
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

  // Calculate pagination for sample data
  const totalItems = sampleOrders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = sampleOrders.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <AdminNavigation />

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
            {currentOrders.map((o) => (
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

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
        />
      </div>
    </div>
  );
}
