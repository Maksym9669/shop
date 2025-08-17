"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "../../contexts/CartContext";

export default function OrderSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [orderStatus, setOrderStatus] = useState<string>("");
  const [orderId, setOrderId] = useState<string>("");
  const [isPolling, setIsPolling] = useState<boolean>(true);

  // Function to fetch order status from backend
  const fetchOrderStatus = async (orderIdToCheck: string) => {
    try {
      const response = await fetch(`/api/orders/${orderIdToCheck}/status`);

      console.log("Order status response:", response.status);

      if (response.ok) {
        const order = await response.json();
        console.log("Fetched order status:", order.status);

        if (order.status === "paid") {
          setOrderStatus("success");
          clearCart();
          setIsPolling(false);
          console.log("Cart cleared - order is paid!");
        } else if (order.status === "payment_failed") {
          setOrderStatus("failure");
          setIsPolling(false);
        }
      } else {
        const errorData = await response.json();
        console.error("Error response:", errorData);
      }
    } catch (error) {
      console.error("Error fetching order status:", error);
    }
  };

  useEffect(() => {
    // Get order status from URL parameters
    // LiqPay sends different parameters, let's check all possible ones
    const status = searchParams.get("status") || searchParams.get("result");
    const order_id =
      searchParams.get("order_id") || searchParams.get("orderId");

    console.log(
      "All URL parameters:",
      Object.fromEntries(searchParams.entries())
    );

    if (status) {
      setOrderStatus(status);
      // Clear cart immediately if URL shows success
      if (status === "success" || status === "ok") {
        clearCart();
        setIsPolling(false);
      }
    }
    if (order_id) {
      setOrderId(order_id);
    }
  }, [searchParams, clearCart]);

  // Poll order status every 3 seconds if we have an order ID and still polling
  useEffect(() => {
    if (!orderId || !isPolling) {
      console.log("Polling stopped:", { orderId, isPolling });
      return;
    }

    console.log("Starting polling for order:", orderId);

    const interval = setInterval(() => {
      console.log("Polling order status...");
      fetchOrderStatus(orderId);
    }, 3000);

    // Also fetch immediately
    console.log("Fetching order status immediately...");
    fetchOrderStatus(orderId);

    // Stop polling after 2 minutes
    const timeout = setTimeout(() => {
      console.log("Polling timeout reached, stopping...");
      setIsPolling(false);
    }, 120000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [orderId, isPolling]);

  const getStatusMessage = () => {
    switch (orderStatus) {
      case "success":
      case "ok":
        return {
          title: "Оплата успішна! 🎉",
          message: "Ваше замовлення було успішно оплачено.",
          color: "text-green-600",
        };
      case "failure":
      case "fail":
        return {
          title: "Помилка оплати ❌",
          message: "Виникла помилка при оплаті замовлення.",
          color: "text-red-600",
        };
      case "error":
        return {
          title: "Помилка системи ⚠️",
          message: "Виникла технічна помилка при обробці платежу.",
          color: "text-yellow-600",
        };
      case "pending":
      case "wait_accept":
        return {
          title: "Платіж в обробці ⏳",
          message: "Ваш платіж обробляється банком.",
          color: "text-blue-600",
        };
      default:
        return {
          title: "Обробка платежу ⏳",
          message: "Ваш платіж обробляється...",
          color: "text-blue-600",
        };
    }
  };

  const statusInfo = getStatusMessage();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="mb-6">
          <h1 className={`text-3xl font-bold mb-4 ${statusInfo.color}`}>
            {statusInfo.title}
          </h1>
          <p className="text-lg text-gray-600 mb-4">{statusInfo.message}</p>
          {orderId && (
            <p className="text-sm text-gray-500">
              Номер замовлення: <span className="font-mono">{orderId}</span>
            </p>
          )}
          {isPolling && orderId && (
            <p className="text-sm text-blue-500 animate-pulse">
              🔄 Перевіряємо статус платежу...
            </p>
          )}
        </div>

        <div className="space-y-4">
          {(orderStatus === "success" || orderStatus === "ok") && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800">Дякуємо за покупку!</p>
            </div>
          )}

          {(orderStatus === "failure" || orderStatus === "fail") && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">
                Спробуйте ще раз або зверніться до служби підтримки.
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/catalog"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Продовжити покупки
            </Link>
            <Link
              href="/"
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition"
            >
              На головну
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
