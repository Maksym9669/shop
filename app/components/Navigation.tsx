"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Головна" },
    { href: "/catalog", label: "Каталог" },
    { href: "/about", label: "Про нас" },
    { href: "/contact", label: "Контакти" },
    { href: "/cart", label: "Корзина" },
    { href: "/admin", label: "Адмін" },
  ];

  return (
    <ul className="flex gap-4 text-base font-bold">
      {links.map(({ href, label }) => (
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
    </ul>
  );
}
