import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";
import Navigation from "./components/Navigation";
import { CartProvider } from "./contexts/CartContext";
import { CartToast } from "./components/CartToast";

export const metadata: Metadata = {
  title: "Shop App",
  description: "Інтернет-магазин канцелярських товарів",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body className="bg-gray-100 text-gray-900 flex flex-col min-h-screen">
        <CartProvider>
          <CartToast />
          {/* 🔹 Глобальний Header */}
          <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow">
            <div className="container mx-auto flex items-center justify-between p-4">
              <Link href="/" className="text-2xl font-extrabold animate-pulse">
                🛒 Shop App
              </Link>
              <Navigation />
            </div>
            <div className="bg-black bg-opacity-20 text-center text-sm py-1">
              <Link href="/services" className="mx-3 hover:underline">
                Список послуг
              </Link>
              <Link href="/specials" className="mx-3 hover:underline">
                Спецпропозиції
              </Link>
            </div>
          </header>

          <main className="flex-1 container mx-auto p-6">{children}</main>

          {/* 🔹 Footer */}
          <footer className="bg-gray-800 text-gray-300 text-sm py-4 mt-auto">
            <div className="container mx-auto flex flex-col items-center">
              <div className="mb-2">
                <Link href="/" className="mx-2 hover:text-white">
                  Головна
                </Link>
                <Link href="/catalog" className="mx-2 hover:text-white">
                  Каталог
                </Link>
                <Link href="/about" className="mx-2 hover:text-white">
                  Про нас
                </Link>
                <Link href="/contact" className="mx-2 hover:text-white">
                  Контакти
                </Link>
              </div>
              <div className="mb-2">
                <span className="mx-2">© 2025 Shop App</span>
                <Link
                  href="https://facebook.com"
                  className="mx-2 hover:text-white"
                >
                  Facebook
                </Link>
                <Link
                  href="https://instagram.com"
                  className="mx-2 hover:text-white"
                >
                  Instagram
                </Link>
              </div>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
