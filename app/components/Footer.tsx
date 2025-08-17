import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Shop App</h3>
            <p className="text-gray-300 mb-4">
              Ваш надійний постачальник канцелярських товарів для офісу, школи
              та дому.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition"
              >
                📘 Facebook
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition"
              >
                📷 Instagram
              </a>
              <a
                href="https://telegram.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition"
              >
                📱 Telegram
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Швидкі посилання</h3>
            <div className="space-y-2">
              <Link
                href="/"
                className="text-gray-300 hover:text-white transition block"
              >
                Головна
              </Link>
              <Link
                href="/catalog"
                className="text-gray-300 hover:text-white transition block"
              >
                Каталог товарів
              </Link>
              <Link
                href="/about"
                className="text-gray-300 hover:text-white transition block"
              >
                Про нас
              </Link>
              <Link
                href="/contact"
                className="text-gray-300 hover:text-white transition block"
              >
                Контакти
              </Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Послуги</h3>
            <div className="space-y-2">
              <Link
                href="/contact"
                className="text-gray-300 hover:text-white transition block"
              >
                📞 Зворотний дзвінок
              </Link>
              <Link
                href="/contact"
                className="text-gray-300 hover:text-white transition block"
              >
                📝 Подати заявку
              </Link>
              <Link
                href="/contact"
                className="text-gray-300 hover:text-white transition block"
              >
                🚚 Доставка
              </Link>
              <Link
                href="/contact"
                className="text-gray-300 hover:text-white transition block"
              >
                🔄 Повернення товарів
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Контакти</h3>
            <div className="space-y-2 text-gray-300">
              <p>📞 +38 (050) 123-45-67</p>
              <p>📧 info@shop.ua</p>
              <p>📍 м. Київ, вул. Хрещатик, 1</p>
              <p>🕒 Пн-Пт: 10:00-19:00</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-300 mb-4 md:mb-0">
              © {currentYear} Shop App. Всі права захищені.
            </div>

            {/* Tag-style Navigation */}
            <div className="flex flex-wrap gap-2">
              <Link
                href="/catalog"
                className="bg-gray-700 text-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-600 transition"
              >
                #каталог
              </Link>
              <Link
                href="/about"
                className="bg-gray-700 text-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-600 transition"
              >
                #про_нас
              </Link>
              <Link
                href="/contact"
                className="bg-gray-700 text-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-600 transition"
              >
                #контакти
              </Link>
              <Link
                href="/profile"
                className="bg-gray-700 text-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-600 transition"
              >
                #профіль
              </Link>
              <Link
                href="/cart"
                className="bg-gray-700 text-gray-300 px-3 py-1 rounded text-sm hover:bg-gray-600 transition"
              >
                #корзина
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
