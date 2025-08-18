"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../hooks/useAuth";

// 🔹 Опис інтерфейсу товару
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  image_url: string | null;
  quantity: number;
  discounted_price?: number;
  discount_amount?: number;
  discount_percentage?: number;
  discount?: {
    id: number;
    name: string;
    type: "percentage" | "fixed";
    value: number;
  };
}

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const { isAuthenticated, isCustomer, isAdmin } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Отримання товару з API
  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Товар не знайдено");
          }
          throw new Error("Помилка завантаження товару");
        }
        const data: Product = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Невідома помилка");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <p className="text-lg">Завантаження товару...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">
            {error || "Товар не знайдено"}
          </p>
          <Link
            href="/catalog"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Повернутися до каталогу
          </Link>
        </div>
      </div>
    );
  }

  const isAvailable = product.quantity > 0;

  return (
    <div
      className={`max-w-4xl mx-auto p-6 bg-white shadow-md rounded relative ${
        !isAvailable ? "opacity-75" : ""
      }`}
    >
      {!isAvailable && (
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center rounded z-10 pointer-events-none">
          <span className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold text-lg shadow-lg">
            НЕМАЄ В НАЯВНОСТІ
          </span>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Фото */}
        <div className="flex-shrink-0 relative">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              width={300}
              height={200}
              className={`rounded border ${!isAvailable ? "grayscale" : ""}`}
            />
          ) : (
            <div
              className={`w-[300px] h-[200px] bg-gray-200 rounded border flex items-center justify-center text-gray-500 ${
                !isAvailable ? "bg-gray-300" : ""
              }`}
            >
              Фото товару
            </div>
          )}
        </div>

        {/* Інформація про товар */}
        <div className="flex flex-col justify-between flex-1">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {product.name}
            </h1>

            {/* Price with discount display */}
            <div className="mb-4">
              {product.discount_amount && product.discount_amount > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl text-blue-600 font-bold">
                      {(
                        (product.discounted_price || product.price) / 100
                      ).toFixed(2)}{" "}
                      грн
                    </span>
                    <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                      -{product.discount_percentage}% знижка
                    </span>
                  </div>
                  <div className="text-gray-500 line-through text-lg">
                    Була ціна: {(product.price / 100).toFixed(2)} грн
                  </div>
                  <div className="text-green-600 font-medium">
                    Ви економите:{" "}
                    {((product.discount_amount || 0) / 100).toFixed(2)} грн
                  </div>
                  {product.discount && (
                    <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      📢 {product.discount.name}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-2xl text-blue-600 font-bold">
                  {(product.price / 100).toFixed(2)} грн
                </p>
              )}
            </div>
            <p className="text-gray-600 mb-6">{product.description}</p>
            <p
              className={`font-medium ${
                isAvailable ? "text-green-600" : "text-red-600"
              }`}
            >
              {isAvailable
                ? `В наявності (${product.quantity} шт.)`
                : "Немає в наявності"}
            </p>
          </div>

          {/* Кнопки */}
          <div className="mt-6 flex gap-4">
            {isCustomer && (
              <button
                onClick={() => {
                  if (isAvailable) {
                    addToCart({
                      id: product.id,
                      name: product.name,
                      price: product.discounted_price || product.price,
                      original_price: product.price,
                      discount_amount: product.discount_amount || 0,
                      image_url: product.image_url,
                      stock_quantity: product.quantity,
                    });
                  }
                }}
                disabled={!isAvailable}
                className={`px-6 py-2 rounded transition ${
                  !isAvailable
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {!isAvailable ? "Немає в наявності" : "Додати в кошик"}
              </button>
            )}
            {!isAuthenticated && (
              <button
                onClick={() => router.push("/auth/login")}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              >
                Увійти для покупок
              </button>
            )}
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
