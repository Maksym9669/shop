"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminNavigation from "../../components/AdminNavigation";
import Pagination from "../../components/Pagination";

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteName, setDeleteName] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10); // Items per page
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndLoad = async () => {
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

        const data = await fetch(
          `/api/products?page=${currentPage}&limit=${itemsPerPage}`,
          {
            credentials: "include",
          }
        );
        if (!data.ok) throw new Error("Failed to fetch products");

        const response = await data.json();
        setProducts(response.data || []);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotalItems(response.pagination?.total || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoad();
  }, [router, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  async function handleDeleteConfirm() {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/products/${deleteId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Не вдалося видалити товар");

      setProducts((prev) => prev.filter((p) => p.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      console.error(err);
      alert("Помилка при видаленні товару");
    }
  }

  if (loading) {
    return <div className="p-6">Завантаження...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <AdminNavigation />

      {/* Main Content */}
      {/* Main Content */}
      <div className="flex-1 max-w-6xl mx-auto p-6 bg-white rounded shadow m-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-3">
          <h1 className="text-3xl font-bold text-gray-900">
            Керування товарами
          </h1>
          <Link
            href="/admin/products/new"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Додати товар
          </Link>
        </div>

        <table className="w-full border-collapse border border-gray-300 text-gray-900">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Назва</th>
              <th className="border border-gray-300 p-2 text-right">
                Ціна (грн)
              </th>
              <th className="border border-gray-300 p-2 text-right">Залишок</th>
              <th className="border border-gray-300 p-2">Дії</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 cursor-default">
                <td className="border border-gray-300 p-2">{p.name}</td>
                <td className="border border-gray-300 p-2 text-right">
                  {p.price}
                </td>
                <td className="border border-gray-300 p-2 text-right">
                  {p.quantity}
                </td>
                <td className="border border-gray-300 p-2 text-center space-x-2">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Редагувати
                  </Link>
                  <button
                    onClick={() => {
                      setDeleteId(p.id);
                      setDeleteName(p.name);
                    }}
                    className="text-red-600 hover:underline"
                  >
                    Видалити
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Confirmation Modal */}
        {deleteId && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
              <h2 className="text-xl font-bold mb-4">
                Підтвердження видалення
              </h2>
              <p className="mb-6">
                Ви дійсно хочете видалити товар{" "}
                <span className="font-semibold">{deleteName}</span>?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
                >
                  Скасувати
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                >
                  Видалити
                </button>
              </div>
            </div>
          </div>
        )}

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
