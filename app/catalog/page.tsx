"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../contexts/CartContext";

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

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ProductsResponse {
  data: Product[];
  pagination: PaginationInfo;
}

export default function CatalogPage() {
  const router = useRouter();
  const { isAuthenticated, isCustomer, isAdmin } = useAuth();
  const { addToCart } = useCart();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSort, setSelectedSort] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);

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
    { label: "За ціною (зрост.)", value: "price_asc" },
    { label: "За ціною (спад.)", value: "price_desc" },
    { label: "Новинки", value: "created_at_desc" },
    { label: "Старі товари", value: "created_at_asc" },
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

  // 🔹 Скидання сторінки при зміні фільтрів
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedSort]);

  // 🔹 Отримання товарів з бекенду
  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);

        // Build query parameters
        const params = new URLSearchParams();
        if (selectedCategory) {
          const categoryId =
            ProductCategories[
              selectedCategory as keyof typeof ProductCategories
            ];
          if (categoryId) {
            params.append("category_id", categoryId.toString());
          }
        }
        if (selectedSort) {
          params.append("sort_by", selectedSort);
        }
        params.append("page", currentPage.toString());
        params.append("limit", "20");

        const queryString = params.toString();
        const url = queryString
          ? `/api/products?${queryString}`
          : "/api/products";

        const res = await fetch(url);
        if (!res.ok) throw new Error("Помилка завантаження товарів");
        const response: ProductsResponse = await res.json();
        setProducts(response.data);
        setPagination(response.pagination);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [selectedCategory, selectedSort, currentPage]);

  return (
    <div>
      {/* 🔹 Внутрішня навігація каталогу */}
      <div className="bg-gray-100 border-b border-gray-300 p-3 flex flex-col md:flex-row items-center gap-4">
        {/* Категорії */}
        <select
          className="px-3 py-2 rounded border bg-white text-black"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
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
          value={selectedSort}
          onChange={(e) => setSelectedSort(e.target.value)}
        >
          <option value="">Сортувати</option>
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
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
              className="bg-white shadow rounded p-4 hover:shadow-lg transition flex flex-col cursor-pointer"
              onClick={() => router.push(`/products/${p.id}`)}
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
              <div
                className="mt-auto space-y-2"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => router.push(`/products/${p.id}`)}
                  className="w-full bg-gray-200 text-black py-1 rounded hover:bg-gray-300 transition"
                >
                  Деталі товару
                </button>
                {isCustomer && (
                  <button
                    onClick={() =>
                      addToCart({
                        id: p.id,
                        name: p.name,
                        price: p.price,
                        image_url: p.image_url,
                        stock_quantity: p.quantity,
                      })
                    }
                    disabled={p.quantity === 0}
                    className="w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Додати в корзину
                  </button>
                )}
                {!isAuthenticated && (
                  <button
                    onClick={() => router.push("/auth/login")}
                    className="w-full bg-blue-600 text-white py-1 rounded hover:bg-blue-700 transition"
                  >
                    Додати в корзину
                  </button>
                )}
                {/* Admin users don't see any cart button */}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🔹 Пагінація */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2">
            {/* Кнопка "Попередня" */}
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-100 disabled:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-500"
            >
              Попередня
            </button>

            {/* Номери сторінок */}
            <div className="flex gap-1">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter((pageNum) => {
                  // Показуємо максимум 5 сторінок навколо поточної
                  return (
                    pageNum === 1 ||
                    pageNum === pagination.totalPages ||
                    Math.abs(pageNum - currentPage) <= 2
                  );
                })
                .map((pageNum, index, array) => {
                  // Додаємо "..." якщо є пропуски
                  const showEllipsis =
                    index > 0 && pageNum - array[index - 1] > 1;

                  return (
                    <div key={pageNum} className="flex items-center">
                      {showEllipsis && (
                        <span className="px-2 text-gray-500">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(pageNum)}
                        className={`px-3 py-2 border rounded hover:bg-gray-100 ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-gray-300"
                        }`}
                      >
                        {pageNum}
                      </button>
                    </div>
                  );
                })}
            </div>

            {/* Кнопка "Наступна" */}
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
              className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-100 disabled:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-500"
            >
              Наступна
            </button>
          </div>
        </div>
      )}

      {/* 🔹 Інформація про кількість товарів */}
      {pagination && (
        <div className="mt-4 text-center text-gray-600">
          Показано {(currentPage - 1) * 20 + 1}-
          {Math.min(currentPage * 20, pagination.total)} з {pagination.total}{" "}
          товарів
        </div>
      )}
    </div>
  );
}
