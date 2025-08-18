"use client";

import { useCart } from "../contexts/CartContext";
import { useAuth } from "../hooks/useAuth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    clearCart,
    getTotalSavings,
    getOriginalTotal,
  } = useCart();
  const { isAuthenticated, isCustomer } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddressWarning, setShowAddressWarning] = useState(false);

  const handleCheckout = async () => {
    if (!isAuthenticated || !isCustomer) {
      router.push("/auth/login");
      return;
    }

    if (cartItems.length === 0) {
      alert("Корзина порожня!");
      return;
    }

    setIsSubmitting(true);
    try {
      // Check if user has shipping addresses
      const addressCheckResponse = await fetch(
        "/api/shipping-addresses/check",
        {
          credentials: "include",
        }
      );

      if (!addressCheckResponse.ok) {
        alert("Помилка перевірки адрес доставки");
        setIsSubmitting(false);
        return;
      }

      const { hasCompleteAddress } = await addressCheckResponse.json();

      if (!hasCompleteAddress) {
        setShowAddressWarning(true);
        setIsSubmitting(false);
        setTimeout(() => {
          router.push("/profile?from=cart");
        }, 2000);
        return;
      }

      // Create the order
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          total_amount: getCartTotal(),
        }),
      });

      if (!orderResponse.ok) {
        const error = await orderResponse.json();
        throw new Error(error.error);
      }

      const order = await orderResponse.json();

      console.log("DDDDDDDDDDDDDDDDDDDDDDD");

      // Then initiate payment with LiqPay
      const paymentResponse = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          order_id: order.id,
          amount: getCartTotal() / 100, // Convert from cents to hryvnias
          description: `Замовлення #${order.id} - ${cartItems.length} товарів`,
        }),
      });

      console.log("AAAAAAAAAAAAAAAAAAAAAaa");
      if (!paymentResponse.ok) {
        const error = await paymentResponse.json();
        throw new Error(error.error);
      }

      console.log("BBBBBBBBBBBBBBBBBBBBBBBBB");

      const paymentData = await paymentResponse.json();

      console.log("CCCCCCCCCCCCCCCCCCCCCCC");

      // Redirect to LiqPay payment page
      window.location.href = paymentData.payment_url;
    } catch (error) {
      console.error("Error during checkout:", error);
      alert(
        `Помилка при оформленні замовлення: ${
          error instanceof Error ? error.message : "Невідома помилка"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Корзина</h1>
          <p className="text-gray-600 mb-4">
            Для перегляду корзини потрібно увійти в систему
          </p>
          <button
            onClick={() => router.push("/auth/login")}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Увійти
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Корзина</h1>
        <div className="text-center">
          <p className="text-gray-600 mb-4">Ваша корзина порожня</p>
          <button
            onClick={() => router.push("/catalog")}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Перейти до каталогу
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Корзина</h1>

      {showAddressWarning && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
          <div className="flex items-center">
            <span className="text-yellow-500 mr-2">⚠️</span>
            <div>
              <p className="font-semibold">Потрібна повна адреса доставки</p>
              <p className="text-sm">
                Перед оформленням замовлення потрібно додати повну адресу
                доставки з усіма обов'язковими полями. Переходимо до профілю...
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className={`flex items-center p-4 border-b last:border-b-0 transition-opacity ${
              item.quantity === 0 ? "opacity-50" : ""
            }`}
          >
            {/* Product Image */}
            <div className="flex-shrink-0 w-20 h-20 mr-4">
              {item.image_url ? (
                <Image
                  src={item.image_url}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="object-contain rounded"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-sm">
                  Фото
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{item.name}</h3>
              <div className="space-y-1">
                <p className="text-blue-600 font-semibold">
                  {(item.price / 100).toFixed(2)} грн
                </p>
                {item.discount_amount && item.discount_amount > 0 && (
                  <div className="space-y-1">
                    <p className="text-gray-500 line-through text-sm">
                      Була ціна:{" "}
                      {((item.original_price || item.price) / 100).toFixed(2)}{" "}
                      грн
                    </p>
                    <p className="text-green-600 text-sm font-medium">
                      Знижка: {(item.discount_amount / 100).toFixed(2)} грн на
                      одиницю
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center space-x-2 mr-4">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300"
              >
                -
              </button>
              <span
                className={`w-12 text-center ${
                  item.quantity === 0 ? "text-gray-400" : ""
                }`}
              >
                {item.quantity}
              </span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                disabled={item.quantity >= item.stock_quantity}
                className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>

            {/* Total Price */}
            <div className="text-right mr-4">
              <p className="font-semibold">
                {((item.price * item.quantity) / 100).toFixed(2)} грн
              </p>
            </div>

            {/* Remove Button */}
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-600 hover:text-red-800"
            >
              Видалити
            </button>
          </div>
        ))}
      </div>

      {/* Cart Summary */}
      <div className="mt-6 bg-white shadow rounded-lg p-6">
        {getTotalSavings() > 0 && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Первинна сума:</span>
              <span className="text-sm text-gray-500 line-through">
                {(getOriginalTotal() / 100).toFixed(2)} грн
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-green-600">
                Ваша економія:
              </span>
              <span className="text-lg font-bold text-green-600">
                {(getTotalSavings() / 100).toFixed(2)} грн
              </span>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Загальна сума:</span>
          <span className="text-2xl font-bold text-blue-600">
            {(getCartTotal() / 100).toFixed(2)} грн
          </span>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={clearCart}
            className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition"
          >
            Очистити корзину
          </button>
          <button
            onClick={handleCheckout}
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Створення замовлення..." : "Оформити замовлення"}
          </button>
        </div>
      </div>
    </div>
  );
}
