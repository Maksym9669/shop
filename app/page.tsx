"use client";

import { useRef, useState } from "react";

export default function HomePage() {
  const greetingRef = useRef<HTMLDivElement>(null);
  const [showGreeting, setShowGreeting] = useState(false);

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
      {/* 📌 Широка шапка з градієнтом (ефект хамелеон) */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white h-64 flex flex-col justify-center items-center">
        <h1 className="text-4xl font-extrabold drop-shadow-lg">
          Ласкаво просимо в Shop App
        </h1>
        <p className="mt-2 text-lg">
          Ваш інтернет-магазин канцелярських товарів
        </p>

        {/* 📌 Внутрішня навігація (випадаючий список) */}
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
          </select>
        </div>

        {/* 📌 Кнопка Start */}
        <button
          onClick={scrollToGreeting}
          className="mt-6 px-6 py-3 bg-white text-blue-700 font-bold rounded-full shadow hover:bg-gray-100 transition"
        >
          Start
        </button>
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
    </div>
  );
}
