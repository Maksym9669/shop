"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CatalogPage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  // 🔹 Категорії товарів
  const categories = [
    "Ручки та маркери",
    "Олівці та фломастери",
    "Зошити та блокноти",
    "Папір",
    "Папки та файли",
    "Клей та клейкі матеріали",
    "Органайзери та архівування",
    "Настільне приладдя",
    "Шкільне приладдя",
    "Офісна техніка та аксесуари",
  ];

  // 🔹 Опції сортування
  const sortOptions = [
    "За ціною (зрост.)",
    "За ціною (спад.)",
    "Популярні",
    "Новинки",
    "Знижки",
  ];

  // 🔹 Банери для крутилки
  const banners = [
    { color: "bg-blue-500", text: "Знижки на ручки" },
    { color: "bg-green-500", text: "Новинки в каталозі" },
    { color: "bg-purple-500", text: "Кращі пропозиції місяця" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 🔹 Тимчасові товари
  const products = [
    { id: 1, name: "Ручка синя", price: "25 грн" },
    { id: 2, name: "Зошит 48 арк.", price: "15 грн" },
    { id: 3, name: "Папір A4", price: "120 грн" },
    { id: 4, name: "Клей-олівець", price: "18 грн" },
  ];

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
            if (e.target.value) alert(`Сортування: ${e.target.value}`); // поки що просто алерт
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white shadow rounded p-4 hover:shadow-lg transition"
          >
            <div className="h-24 bg-gray-200 mb-3 flex items-center justify-center text-gray-500">
              Фото
            </div>
            <h3 className="font-bold">{p.name}</h3>
            <p className="text-blue-600">{p.price}</p>
            <button className="mt-2 w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700 transition">
              Додати в корзину
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
