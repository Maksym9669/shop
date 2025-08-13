"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  email: string;
  role: string;
  fullName: string;
  id: number;
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

  const commonLinks = [
    { href: "/", label: "Головна" },
    { href: "/catalog", label: "Каталог" },
    { href: "/about", label: "Про нас" },
    { href: "/contact", label: "Контакти" },
  ];

  if (loading) return null;

  return (
    <ul className="flex gap-4 font-bold items-center text-base sm:text-sm xs:text-xs">
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
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition text-base sm:text-sm xs:text-xs"
          >
            Увійти
          </button>
        </li>
      )}

      {user && user.role === "customer" && (
        <li>
          <Link
            href="/cart"
            className={`transition-colors text-base sm:text-sm xs:text-xs ${
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
            className={`transition-colors text-base sm:text-sm xs:text-xs ${
              pathname === "/admin"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-black hover:text-blue-600"
            }`}
          >
            Адмін
          </Link>
        </li>
      )}

      {user && (
        <li className="text-black text-base sm:text-sm xs:text-xs">
          Ласкаво просимо,&nbsp;{user.fullName}
        </li>
      )}
    </ul>
  );
}
