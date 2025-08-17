"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      setTimeout(() => setSubmitStatus(null), 5000);
    }, 1000);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Контакти</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Ми завжди готові допомогти вам
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-8">
              Зв'яжіться з нами
            </h2>

            {/* Contact Cards */}
            <div className="space-y-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-full mr-4">
                    📞
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Телефон
                  </h3>
                </div>
                <p className="text-gray-600 mb-2">
                  <a
                    href="tel:+380501234567"
                    className="text-blue-600 hover:underline"
                  >
                    +38 (050) 123-45-67
                  </a>
                </p>
                <p className="text-gray-600">
                  <a
                    href="tel:+380671234567"
                    className="text-blue-600 hover:underline"
                  >
                    +38 (067) 123-45-67
                  </a>
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Щоденно з 9:00 до 21:00
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 text-green-600 p-3 rounded-full mr-4">
                    📧
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Email</h3>
                </div>
                <p className="text-gray-600 mb-2">
                  <a
                    href="mailto:info@shop.ua"
                    className="text-blue-600 hover:underline"
                  >
                    info@shop.ua
                  </a>
                </p>
                <p className="text-gray-600">
                  <a
                    href="mailto:support@shop.ua"
                    className="text-blue-600 hover:underline"
                  >
                    support@shop.ua
                  </a>
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Відповідаємо протягом 2 годин
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 text-purple-600 p-3 rounded-full mr-4">
                    📍
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Адреса
                  </h3>
                </div>
                <p className="text-gray-600 mb-2">
                  м. Київ, вул. Хрещатик, 1<br />
                  офіс 100, 2-й поверх
                </p>
                <p className="text-sm text-gray-500">
                  Пн-Пт: 10:00-19:00
                  <br />
                  Сб: 10:00-16:00
                  <br />
                  Нд: вихідний
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full mr-4">
                    💬
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Месенджери
                  </h3>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <a
                      href="https://t.me/shopua"
                      className="text-blue-600 hover:underline"
                    >
                      📱 Telegram: @shopua
                    </a>
                  </p>
                  <p className="text-gray-600">
                    <a
                      href="viber://chat?number=+380501234567"
                      className="text-blue-600 hover:underline"
                    >
                      📞 Viber: +38 (050) 123-45-67
                    </a>
                  </p>
                  <p className="text-gray-600">
                    <a
                      href="https://wa.me/380501234567"
                      className="text-blue-600 hover:underline"
                    >
                      💬 WhatsApp: +38 (050) 123-45-67
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Корисні посилання
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Link href="/catalog" className="text-blue-600 hover:underline">
                  📦 Каталог товарів
                </Link>
                <Link href="/profile" className="text-blue-600 hover:underline">
                  👤 Особистий кабінет
                </Link>
                <Link href="/about" className="text-blue-600 hover:underline">
                  ℹ️ Про компанію
                </Link>
                <Link href="/cart" className="text-blue-600 hover:underline">
                  🛒 Корзина
                </Link>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Напишіть нам
              </h2>

              {submitStatus === "success" && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                  <div className="flex items-center">
                    <span className="mr-2">✅</span>
                    Ваше повідомлення надіслано! Ми зв'яжемося з вами найближчим
                    часом.
                  </div>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                  <div className="flex items-center">
                    <span className="mr-2">❌</span>
                    Помилка відправлення повідомлення. Спробуйте ще раз.
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ім'я *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Ваше ім'я"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Телефон
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+38 (0__) ___-__-__"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Тема
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Оберіть тему</option>
                      <option value="order">Питання про замовлення</option>
                      <option value="product">Питання про товар</option>
                      <option value="delivery">Доставка</option>
                      <option value="payment">Оплата</option>
                      <option value="return">Повернення товару</option>
                      <option value="cooperation">Співпраця</option>
                      <option value="other">Інше</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Повідомлення *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                    placeholder="Опишіть своє питання або пропозицію..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {isSubmitting ? "Надсилання..." : "Надіслати повідомлення"}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-500 text-center">
                  Надсилаючи форму, ви погоджуєтеся з{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    політикою конфіденційності
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Часті питання
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                🚚 Як відбувається доставка?
              </h3>
              <p className="text-gray-600">
                Ми доставляємо товари по всій Україні через "Нову Пошту" та
                "УкрПошту". Термін доставки: 1-3 робочі дні. Вартість доставки
                розраховується автоматично при оформленні замовлення.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                💳 Які способи оплати ви приймаєте?
              </h3>
              <p className="text-gray-600">
                Ми приймаємо оплату банківськими картами (Visa, MasterCard),
                через LiqPay, готівкою при отриманні та банківським переказом.
                Усі платежі захищені SSL-шифруванням.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                🔄 Чи можна повернути товар?
              </h3>
              <p className="text-gray-600">
                Так, ви можете повернути товар протягом 14 днів без пояснення
                причин, якщо товар збережений у первісному стані. Кошти
                повертаються протягом 5-7 робочих днів.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                📦 Як відстежити моє замовлення?
              </h3>
              <p className="text-gray-600">
                Після відправлення товару ви отримаєте SMS та email з номером
                для відстеження. Також ви можете переглянути статус замовлення в
                особистому кабінеті на нашому сайті.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="mt-16 text-center bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-12">
          <h2 className="text-3xl font-bold mb-4">Не знайшли відповідь?</h2>
          <p className="text-xl mb-8 opacity-90">
            Наша команда підтримки готова допомогти вам 24/7
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+380501234567"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              📞 Подзвонити зараз
            </a>
            <a
              href="mailto:support@shop.ua"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
            >
              📧 Написати email
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
