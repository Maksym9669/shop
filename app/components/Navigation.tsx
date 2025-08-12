"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  email: string;
  role: string;
}

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });
        if (!res.ok) {
          setUser(null);
        } else {
          const data = await res.json();
          setUser(data);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  // Links to show regardless
  const commonLinks = [
    { href: "/", label: "Головна" },
    { href: "/catalog", label: "Каталог" },
    { href: "/about", label: "Про нас" },
    { href: "/contact", label: "Контакти" },
  ];

  if (loading) {
    // Optionally show loading or empty placeholder to avoid flicker
    return null;
  }

  return (
    <ul className="flex gap-4 text-base font-bold items-center">
      {commonLinks.map(({ href, label }) => (
        <li key={href}>
          <Link
            href={href}
            className={`transition-colors ${
              pathname === href
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-black hover:text-blue-600"
            }`}
          >
            {label}
          </Link>
        </li>
      ))}

      {!user && (
        <li>
          <button
            onClick={() => router.push("/auth/login")}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
          >
            Увійти
          </button>
        </li>
      )}

      {user && user.role === "customer" && (
        <li>
          <Link
            href="/cart"
            className={`transition-colors ${
              pathname === "/cart"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-black hover:text-blue-600"
            }`}
          >
            Корзина
          </Link>
        </li>
      )}

      {user && user.role === "admin" && (
        <li>
          <Link
            href="/admin"
            className={`transition-colors ${
              pathname === "/admin"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-black hover:text-blue-600"
            }`}
          >
            Адмін
          </Link>
        </li>
      )}
    </ul>
  );
}
