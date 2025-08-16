"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function ProductPage() {
  const { id } = useParams();

  // 🔹 Тимчасові фейкові дані (заміниш на fetch з API пізніше)
  const product = {
    id,
    name: "Ручка гелева синя",
    price: "29 грн",
    description: "Зручна гелева ручка з м’яким грипом та змінним стержнем.",
    imageUrl: "https://via.placeholder.com/300x200?text=Фото+товару",
    available: true,
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Фото */}
        <div className="flex-shrink-0">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={300}
            height={200}
            className="rounded border"
          />
        </div>

        {/* Інформація про товар */}
        <div className="flex flex-col justify-between flex-1">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {product.name}
            </h1>
            <p className="text-xl text-blue-600 font-semibold mb-4">
              {product.price}
            </p>
            <p className="text-gray-600 mb-6">{product.description}</p>
            <p
              className={`font-medium ${
                product.available ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.available ? "В наявності" : "Немає в наявності"}
            </p>
          </div>

          {/* Кнопки */}
          <div className="mt-6 flex gap-4">
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              disabled={!product.available}
            >
              Додати в кошик
            </button>
            <Link
              href="/catalog"
              className="px-6 py-2 border text-black border-gray-300 rounded hover:bg-gray-100 transition"
            >
              Назад до каталогу
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
