"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../hooks/useAuth";

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
    type: string;
    value: number;
  };
}

export default function SpecialsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { addToCart } = useCart();
  const { isAuthenticated, isCustomer, isAdmin } = useAuth();

  useEffect(() => {
    const fetchDiscountedProducts = async () => {
      try {
        const response = await fetch("/api/specials", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch discounted products");
        }

        const data = await response.json();
        setProducts(data.data || []);
      } catch (err) {
        console.error("Error fetching discounted products:", err);
        setError("Не вдалося завантажити товари зі знижками");
      } finally {
        setLoading(false);
      }
    };

    fetchDiscountedProducts();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Спеціальні пропозиції</h1>
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-gray-600">Завантаження товарів...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Спеціальні пропозиції</h1>
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Спробувати знову
          </button>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Спеціальні пропозиції</h1>
        <div className="text-center">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
            <p className="font-medium">На даний момент немає активних знижок</p>
            <p className="text-sm">
              Слідкуйте за оновленнями наших спеціальних пропозицій!
            </p>
          </div>
          <button
            onClick={() => router.push("/catalog")}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Переглянути весь каталог
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🔥 Спеціальні пропозиції</h1>
        <p className="text-gray-600">
          Товари зі знижками - встигніть скористатися вигідними пропозиціями!
        </p>
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-medium">
            ⏰ Знайдено {products.length} товар
            {products.length === 1 ? "" : products.length < 5 ? "и" : "ів"} зі
            знижками
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => {
          const isOutOfStock = product.quantity < 1;
          return (
            <div
              key={product.id}
              className={`bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer relative border-2 border-red-200 ${
                isOutOfStock ? "opacity-60" : ""
              }`}
              onClick={() => router.push(`/products/${product.id}`)}
            >
              {/* Discount Badge */}
              {product.discount_percentage && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded-full z-10">
                  -{product.discount_percentage}%
                </div>
              )}

              {/* Out of Stock Overlay */}
              {isOutOfStock && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg z-20">
                  <span className="bg-red-600 text-white px-3 py-1 rounded-lg font-bold text-sm">
                    Немає в наявності
                  </span>
                </div>
              )}

              {/* Product Image */}
              {product.image_url ? (
                <div className="relative w-full h-32 mb-3">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-contain rounded"
                  />
                </div>
              ) : (
                <div className="h-32 bg-gray-200 mb-3 flex items-center justify-center text-gray-500 rounded">
                  Фото
                </div>
              )}

              {/* Product Info */}
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2 line-clamp-2">
                  {product.name}
                </h3>

                {/* Discount Name */}
                {product.discount && (
                  <div className="mb-2">
                    <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                      🎯 {product.discount.name}
                    </span>
                  </div>
                )}

                {/* Price Section */}
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-blue-600 font-bold text-xl">
                      {(
                        (product.discounted_price || product.price) / 100
                      ).toFixed(2)}{" "}
                      грн
                    </span>
                  </div>
                  <div className="text-gray-500 line-through text-sm">
                    Була ціна: {(product.price / 100).toFixed(2)} грн
                  </div>
                  <div className="text-green-600 font-medium text-sm">
                    Економія:{" "}
                    {((product.discount_amount || 0) / 100).toFixed(2)} грн
                  </div>
                </div>

                {/* Stock Status */}
                {!isOutOfStock && (
                  <p className="text-green-600 text-sm font-medium mb-3">
                    В наявності ({product.quantity} шт.)
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => router.push(`/products/${product.id}`)}
                  className="w-full bg-gray-200 text-black py-2 rounded hover:bg-gray-300 transition text-sm"
                >
                  Деталі товару
                </button>

                {/* Add to cart button - only for customers */}
                {isCustomer && (
                  <button
                    onClick={() => {
                      if (!isOutOfStock) {
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
                    disabled={isOutOfStock}
                    className={`w-full py-2 rounded transition text-sm font-medium ${
                      isOutOfStock
                        ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                  >
                    {isOutOfStock ? "Немає в наявності" : "🛒 Додати в корзину"}
                  </button>
                )}

                {/* Login button - for unauthenticated users */}
                {!isAuthenticated && (
                  <button
                    onClick={() => router.push("/auth/login")}
                    className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition text-sm font-medium"
                  >
                    🛒 Додати в корзину
                  </button>
                )}

                {/* Admin users don't see any cart button */}
              </div>
            </div>
          );
        })}
      </div>

      {/* Back to Catalog */}
      <div className="mt-8 text-center">
        <button
          onClick={() => router.push("/catalog")}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          ← Повернутися до каталогу
        </button>
      </div>
    </div>
  );
}
