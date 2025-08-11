"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Вхід успішний!");
        setEmail("");
        setPassword("");
        // Optionally redirect:
        window.location.href = "/";
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch {
      setMessage("⚠️ Помилка з'єднання");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Вхід
        </h1>

        {message && (
          <div className="mb-4 text-center text-sm font-medium">{message}</div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Пароль"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-purple-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Увійти
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Немає акаунта?{" "}
          <a href="/register" className="text-purple-600 hover:underline">
            Зареєструватися
          </a>
        </p>
      </div>
    </div>
  );
}
