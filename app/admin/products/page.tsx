"use client";

import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

const sampleProducts: Product[] = [
  { id: "1", name: "Ручка гелева", price: 29, stock: 120 },
  { id: "2", name: "Зошит 96 арк.", price: 45, stock: 30 },
  { id: "3", name: "Олівець HB", price: 15, stock: 200 },
];

export default function AdminProducts() {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Керування товарами</h1>
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
          {sampleProducts.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50 cursor-default">
              <td className="border border-gray-300 p-2">{p.name}</td>
              <td className="border border-gray-300 p-2 text-right">
                {p.price}
              </td>
              <td className="border border-gray-300 p-2 text-right">
                {p.stock}
              </td>
              <td className="border border-gray-300 p-2 text-center space-x-2">
                <Link
                  href={`/admin/products/${p.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Редагувати
                </Link>
                <button
                  onClick={() => alert(`Видалити товар ${p.name}?`)}
                  className="text-red-600 hover:underline"
                >
                  Видалити
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
