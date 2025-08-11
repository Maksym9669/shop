"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// export default function AdminProducts() {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);

//   return (
//     <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-gray-900">Керування товарами</h1>
//         <Link
//           href="/admin/products/new"
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
//         >
//           Додати товар
//         </Link>
//       </div>

//       <table className="w-full border-collapse border border-gray-300 text-gray-900">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="border border-gray-300 p-2 text-left">Назва</th>
//             <th className="border border-gray-300 p-2 text-right">
//               Ціна (грн)
//             </th>
//             <th className="border border-gray-300 p-2 text-right">Залишок</th>
//             <th className="border border-gray-300 p-2">Дії</th>
//           </tr>
//         </thead>
//         <tbody>
//           {sampleProducts.map((p) => (
//             <tr key={p.id} className="hover:bg-gray-50 cursor-default">
//               <td className="border border-gray-300 p-2">{p.name}</td>
//               <td className="border border-gray-300 p-2 text-right">
//                 {p.price}
//               </td>
//               <td className="border border-gray-300 p-2 text-right">
//                 {p.stock}
//               </td>
//               <td className="border border-gray-300 p-2 text-center space-x-2">
//                 <Link
//                   href={`/admin/products/${p.id}`}
//                   className="text-blue-600 hover:underline"
//                 >
//                   Редагувати
//                 </Link>
//                 <button
//                   onClick={() => alert(`Видалити товар ${p.name}?`)}
//                   className="text-red-600 hover:underline"
//                 >
//                   Видалити
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return <div className="p-6">Завантаження...</div>;
  }

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
