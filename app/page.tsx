"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";

export default function HomePage() {
  const greetingRef = useRef<HTMLDivElement>(null);
  const [showGreeting, setShowGreeting] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [
    {
      title: "Канцелярські товари для офісу",
      description: "Широкий асортимент якісних канцелярських товарів",
      color: "from-blue-600 to-purple-600",
    },
    {
      title: "Спеціальні пропозиції",
      description: "Знижки до 30% на обраний асортимент",
      color: "from-green-600 to-blue-600",
    },
    {
      title: "Швидка доставка",
      description: "Доставка по всій Україні за 1-3 дні",
      color: "from-purple-600 to-pink-600",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const scrollToGreeting = () => {
    if (greetingRef.current) {
      const y =
        greetingRef.current.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: y, behavior: "smooth" });
      setShowGreeting(true);
    }
  };

  return (
    <div>
      {/* 📌 Банерна крутилка */}
      <div className="relative h-80 overflow-hidden">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-gradient-to-r ${
              banner.color
            } text-white transition-transform duration-1000 ease-in-out ${
              index === currentSlide
                ? "translate-x-0"
                : index < currentSlide
                ? "-translate-x-full"
                : "translate-x-full"
            }`}
          >
            <div className="h-full flex flex-col justify-center items-center px-6">
              <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg text-center">
                {banner.title}
              </h1>
              <p className="mt-4 text-xl md:text-2xl text-center opacity-90">
                {banner.description}
              </p>

              <div className="flex gap-4 mt-8">
                <Link
                  href="/catalog"
                  className="bg-white text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
                >
                  Каталог товарів
                </Link>
                <button
                  onClick={scrollToGreeting}
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-gray-800 transition"
                >
                  Start
                </button>
              </div>
            </div>

            {/* 📌 Внутрішня навігація (випадаючий список) */}
            {index === currentSlide && (
              <div className="absolute top-4 left-4">
                <select
                  className="bg-white text-black px-3 py-2 rounded shadow"
                  onChange={(e) => {
                    if (e.target.value) window.location.href = e.target.value;
                  }}
                >
                  <option value="">Розділи сайту</option>
                  <option value="/catalog">Каталог</option>
                  <option value="/about">Про нас</option>
                  <option value="/contact">Контакти</option>
                  <option value="/profile">Профіль</option>
                </select>
              </div>
            )}
          </div>
        ))}

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition ${
                index === currentSlide ? "bg-white" : "bg-white bg-opacity-50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* 📌 Контентна область (fade-in) */}
      <div
        ref={greetingRef}
        className={`p-8 bg-gray-50 text-center transition-opacity duration-1000 ease-in-out ${
          showGreeting ? "opacity-100" : "opacity-0"
        }`}
      >
        <h2 className="text-3xl font-bold text-gray-800">Привіт!</h2>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Ми пропонуємо широкий асортимент канцелярських товарів для дому та
          офісу. З нашого сайту ви можете легко замовити все необхідне, обрати
          зручну доставку та оплату.
        </p>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          Почніть знайомство з нашим магазином, переглянувши каталог товарів або
          дізнавшись більше про нас.
        </p>
      </div>

      {/* 📌 Спеціальні пропозиції */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Спеціальні пропозиції
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-8 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Знижка -30%</h3>
                  <p className="mb-4 opacity-90">На всі ручки та олівці</p>
                  <Link
                    href="/catalog"
                    className="bg-white text-red-600 px-6 py-2 rounded font-semibold hover:bg-gray-100 transition"
                  >
                    Дивитися товари
                  </Link>
                </div>
                <div className="text-6xl opacity-50">✏️</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-8 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">
                    Безкоштовна доставка
                  </h3>
                  <p className="mb-4 opacity-90">При замовленні від 500 грн</p>
                  <Link
                    href="/catalog"
                    className="bg-white text-blue-600 px-6 py-2 rounded font-semibold hover:bg-gray-100 transition"
                  >
                    Почати покупки
                  </Link>
                </div>
                <div className="text-6xl opacity-50">📦</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 📌 Зворотний дзвінок та подати заявку */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Потрібна допомога?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Наша команда завжди готова допомогти вам з вибором товарів та
            оформленням замовлення
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              📞 Зворотний дзвінок
            </Link>
            <Link
              href="/contact"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              📝 Подати заявку
            </Link>
            <Link
              href="/catalog"
              className="border-2 border-gray-600 text-gray-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-600 hover:text-white transition"
            >
              🛍️ Почати покупки
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
