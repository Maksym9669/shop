"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateProductPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category_id: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("quantity", form.quantity);
      formData.append("category_id", form.category_id);

      if (image) formData.append("image", image);

      const res = await fetch("/api/products", {
        method: "POST",
        body: formData, // sending as multipart/form-data
      });

      if (!res.ok) throw new Error("Failed to create product");

      router.push("/admin/products");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const handlePageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const path = e.target.value;
    if (path) router.push(path);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar / Dropdown */}
      <div className="p-4 bg-white shadow w-full md:w-64 h-auto md:h-full mb-4 md:mb-0">
        <label className="block mb-2 font-semibold text-gray-800">
          Перейти до:
        </label>
        <select
          className="w-full p-2 border rounded"
          onChange={handlePageChange}
          defaultValue="/admin/products/new"
        >
          <option value="/admin/">📊 Дашборд</option>
          <option value="/admin/products">📦 Товари</option>
          <option value="/admin/orders">🛒 Замовлення</option>
        </select>
      </div>

      {/* Main Content */}
      <div className="flex-1 w-full md:max-w-lg mx-auto mt-0 md:mt-8 p-6 bg-white shadow rounded">
        <h1 className="text-2xl font-bold mb-4">Створити товар</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Назва</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Опис</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Ціна</label>
            <input
              type="number"
              name="price"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Кількість</label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
              min="0"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">ID Категорії</label>
            <input
              type="number"
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Фото товару</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
            />
          </div>

          {error && <div className="text-red-500">{error}</div>}

          <button
            type="submit"
            disabled={saving}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {saving ? "Створення..." : "Створити товар"}
          </button>
        </form>
      </div>
    </div>
  );
}
