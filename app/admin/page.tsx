"use client";

export default function AdminDashboard() {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        Адмін-панель — Дашборд
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-100 p-6 rounded shadow text-gray-900">
          <h2 className="text-xl font-semibold mb-2">Товари</h2>
          <p>
            Загальна кількість: <strong>120</strong>
          </p>
          <p>
            Товарів з низьким запасом: <strong>8</strong>
          </p>
        </div>

        <div className="bg-green-100 p-6 rounded shadow text-gray-900">
          <h2 className="text-xl font-semibold mb-2">Замовлення</h2>
          <p>
            Нових замовлень: <strong>5</strong>
          </p>
          <p>
            В обробці: <strong>3</strong>
          </p>
        </div>

        <div className="bg-yellow-100 p-6 rounded shadow text-gray-900">
          <h2 className="text-xl font-semibold mb-2">Статистика</h2>
          <p>
            Продажі за місяць: <strong>50 000 грн</strong>
          </p>
          <p>
            Кількість клієнтів: <strong>1200</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
