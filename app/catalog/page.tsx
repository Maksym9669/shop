"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// 🔹 Опис інтерфейсу товару
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  image_url: string | null;
  quantity: number;
}

export default function CatalogPage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const ProductCategories = {
    "Ручки та маркери": 1,
    "Олівці та фломастери": 2,
    "Зошити та блокноти": 3,
    Папір: 4,
    "Папки та файли": 5,
    "Клей та клейкі матеріали": 6,
    "Органайзери та архівування": 7,
    "Настільне приладдя": 8,
    "Шкільне приладдя": 9,
    "Офісна техніка та аксесуари": 10,
  };

  console.log("XDDDD");
  console.log("XDDDDDD");

  // 🔹 Категорії товарів
  const categories = Object.keys(ProductCategories);

  // 🔹 Опції сортування
  const sortOptions = [
    "За ціною (зрост.)",
    "За ціною (спад.)",
    "Популярні",
    "Новинки",
    "Знижки",
  ];

  // 🔹 Банери
  const banners = [
    { color: "bg-blue-500", text: "Знижки на ручки" },
    { color: "bg-green-500", text: "Новинки в каталозі" },
    { color: "bg-purple-500", text: "Кращі пропозиції місяця" },
  ];

  // 🔹 Крутилка
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 🔹 Отримання товарів з бекенду
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Помилка завантаження товарів");
        const data: Product[] = await res.json(); // ✅ явно вказуємо тип
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div>
      {/* 🔹 Внутрішня навігація каталогу */}
      <div className="bg-gray-100 border-b border-gray-300 p-3 flex flex-col md:flex-row items-center gap-4">
        {/* Категорії */}
        <select
          className="px-3 py-2 rounded border bg-white text-black"
          onChange={(e) => {
            if (e.target.value)
              router.push(
                `/catalog?category=${encodeURIComponent(e.target.value)}`
              );
          }}
        >
          <option value="">Обрати категорію</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Фільтри / Сортування */}
        <select
          className="px-3 py-2 rounded border bg-white text-black"
          onChange={(e) => {
            if (e.target.value) alert(`Сортування: ${e.target.value}`);
          }}
        >
          <option value="">Сортувати</option>
          {sortOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* 🔹 Банерна крутилка */}
      <div className="relative h-48 overflow-hidden mb-6">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 flex items-center justify-center text-white text-2xl font-bold transition-opacity duration-700 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            } ${banner.color}`}
          >
            {banner.text}
          </div>
        ))}
      </div>

      {/* 🔹 Сітка товарів */}
      <h1 className="text-3xl font-bold mb-6">Каталог товарів</h1>

      {loading ? (
        <p>Завантаження товарів...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white shadow rounded p-4 hover:shadow-lg transition flex flex-col"
            >
              {p.image_url ? (
                <div className="relative w-full h-24 mb-3">
                  <Image
                    src={p.image_url}
                    alt={p.name}
                    fill
                    className="object-contain rounded"
                  />
                </div>
              ) : (
                <div className="h-24 bg-gray-200 mb-3 flex items-center justify-center text-gray-500">
                  Фото
                </div>
              )}
              <h3 className="font-bold">{p.name}</h3>
              <p className="text-blue-600">{(p.price / 100).toFixed(2)} грн</p>

              {/* Блок кнопок, який прилипає до низу */}
              <div className="mt-auto space-y-2">
                <button
                  onClick={() => router.push(`/products/${p.id}`)}
                  className="w-full bg-gray-200 text-black py-1 rounded hover:bg-gray-300 transition"
                >
                  Деталі товару
                </button>
                <button className="w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700 transition">
                  Додати в корзину
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
