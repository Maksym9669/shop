"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    payment: "cash",
    delivery: "nova_poshta",
  });

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCart(JSON.parse(stored));
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) {
      alert("Будь ласка, заповніть всі обов’язкові поля.");
      return;
    }

    // 🔹 Імітація створення замовлення
    console.log("Замовлення:", { form, cart });
    alert("Замовлення оформлено успішно!");

    // Очистити корзину
    localStorage.removeItem("cart");
    router.push("/thank-you");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h1 className="text-2xl text-black font-bold mb-6">
        Оформлення замовлення
      </h1>

      {cart.length === 0 ? (
        <p className="text-gray-500">
          Кошик порожній. Додайте товари перед оформленням.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Ім’я*</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Телефон*</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Адреса доставки*</label>
            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Спосіб доставки</label>
            <select
              name="delivery"
              value={form.delivery}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="nova_poshta">Нова Пошта</option>
              <option value="ukrposhta">Укрпошта</option>
              <option value="pickup">Самовивіз</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Оплата</label>
            <select
              name="payment"
              value={form.payment}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            >
              <option value="cash">Готівка при отриманні</option>
              <option value="card">Оплата карткою</option>
            </select>
          </div>

          <div className="text-lg font-semibold mt-6">
            Загальна сума: <span className="text-blue-600">{total} грн</span>
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
          >
            Підтвердити замовлення
          </button>
        </form>
      )}
    </div>
  );
}
