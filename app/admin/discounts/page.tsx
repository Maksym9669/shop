"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import ConfirmModal from "../../components/ConfirmModal";
import AdminNavigation from "../../components/AdminNavigation";
import Pagination from "../../components/Pagination";

interface Discount {
  id: number;
  name: string;
  description: string;
  type: "percentage" | "fixed";
  value: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  min_amount?: number;
  max_amount?: number;
  usage_limit?: number;
  usage_count: number;
  product_discounts: Array<{
    product_id: number;
    products: {
      id: number;
      name: string;
    };
  }>;
}

interface Product {
  id: number;
  name: string;
  price: number;
}

export default function AdminDiscounts() {
  const { user, loading, isAdmin } = useAuth();
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [discountToDelete, setDiscountToDelete] = useState<number | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Discounts per page

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "percentage" as "percentage" | "fixed",
    value: "",
    start_date: "",
    end_date: "",
    min_amount: "",
    max_amount: "",
    usage_limit: "",
    is_active: true,
    product_ids: [] as number[],
  });

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      window.location.href = "/";
      return;
    }

    if (isAdmin) {
      fetchDiscounts();
      fetchProducts();
    }
  }, [user, loading, isAdmin]);

  const fetchDiscounts = async () => {
    try {
      const response = await fetch("/api/discounts?admin=true", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setDiscounts(data);
      }
    } catch (error) {
      console.error("Error fetching discounts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      if (response.ok) {
        const data = await response.json();
        setProducts(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const submitData = {
      ...formData,
      value: parseFloat(formData.value),
      min_amount: formData.min_amount
        ? parseInt(formData.min_amount) * 100
        : null, // Convert to kopecks
      max_amount: formData.max_amount
        ? parseInt(formData.max_amount) * 100
        : null, // Convert to kopecks
      usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
    };

    try {
      const url = editingDiscount
        ? `/api/discounts/${editingDiscount.id}`
        : "/api/discounts";
      const method = editingDiscount ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        fetchDiscounts();
        resetForm();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error saving discount:", error);
      alert("Error saving discount");
    }
  };

  const handleEdit = (discount: Discount) => {
    setEditingDiscount(discount);
    setFormData({
      name: discount.name,
      description: discount.description || "",
      type: discount.type,
      value: discount.value.toString(),
      start_date: discount.start_date.split("T")[0],
      end_date: discount.end_date.split("T")[0],
      min_amount: discount.min_amount
        ? (discount.min_amount / 100).toString()
        : "",
      max_amount: discount.max_amount
        ? (discount.max_amount / 100).toString()
        : "",
      usage_limit: discount.usage_limit?.toString() || "",
      is_active: discount.is_active,
      product_ids: discount.product_discounts.map((pd) => pd.product_id),
    });
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!discountToDelete) return;

    try {
      const response = await fetch(`/api/discounts/${discountToDelete}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        fetchDiscounts();
        setShowDeleteModal(false);
        setDiscountToDelete(null);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Error deleting discount:", error);
      alert("Error deleting discount");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      type: "percentage",
      value: "",
      start_date: "",
      end_date: "",
      min_amount: "",
      max_amount: "",
      usage_limit: "",
      is_active: true,
      product_ids: [],
    });
    setEditingDiscount(null);
    setShowForm(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("uk-UA");
  };

  const formatCurrency = (amount: number) => {
    return (amount / 100).toFixed(2);
  };

  if (loading || isLoading) return <div>Завантаження...</div>;

  if (!isAdmin) {
    return <div>Доступ заборонено</div>;
  }

  // Calculate pagination for discounts
  const totalItems = discounts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDiscounts = discounts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <AdminNavigation />

      {/* Main Content */}
      <div className="flex-1 max-w-6xl mx-auto p-6 bg-white rounded shadow m-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Управління знижками</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Додати знижку
          </button>
        </div>

        {/* Discount Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">
                {editingDiscount ? "Редагувати знижку" : "Додати нову знижку"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Назва
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Опис</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Тип знижки
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          type: e.target.value as "percentage" | "fixed",
                        })
                      }
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="percentage">Відсоток (%)</option>
                      <option value="fixed">Фіксована сума (грн)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Значення{" "}
                      {formData.type === "percentage" ? "(%)" : "(грн)"}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.value}
                      onChange={(e) =>
                        setFormData({ ...formData, value: e.target.value })
                      }
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Дата початку
                    </label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) =>
                        setFormData({ ...formData, start_date: e.target.value })
                      }
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Дата закінчення
                    </label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) =>
                        setFormData({ ...formData, end_date: e.target.value })
                      }
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Мін. сума замовлення (грн)
                    </label>
                    <input
                      type="number"
                      value={formData.min_amount}
                      onChange={(e) =>
                        setFormData({ ...formData, min_amount: e.target.value })
                      }
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Макс. знижка (грн)
                    </label>
                    <input
                      type="number"
                      value={formData.max_amount}
                      onChange={(e) =>
                        setFormData({ ...formData, max_amount: e.target.value })
                      }
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Ліміт використання
                    </label>
                    <input
                      type="number"
                      value={formData.usage_limit}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          usage_limit: e.target.value,
                        })
                      }
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Товари
                  </label>
                  <div className="border rounded p-3 max-h-40 overflow-y-auto">
                    {products.map((product) => (
                      <label
                        key={product.id}
                        className="flex items-center space-x-2 mb-2"
                      >
                        <input
                          type="checkbox"
                          checked={formData.product_ids.includes(product.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                product_ids: [
                                  ...formData.product_ids,
                                  product.id,
                                ],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                product_ids: formData.product_ids.filter(
                                  (id) => id !== product.id
                                ),
                              });
                            }
                          }}
                        />
                        <span className="text-sm">{product.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_active: e.target.checked,
                        })
                      }
                    />
                    <span>Активна</span>
                  </label>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-100"
                  >
                    Скасувати
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  >
                    {editingDiscount ? "Оновити" : "Створити"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Discounts Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Назва
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Тип
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Значення
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Період
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Статус
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Товари
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дії
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentDiscounts.map((discount) => (
                <tr key={discount.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {discount.name}
                      </div>
                      {discount.description && (
                        <div className="text-sm text-gray-500">
                          {discount.description}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {discount.type === "percentage" ? "Відсоток" : "Фіксована"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {discount.type === "percentage"
                      ? `${discount.value}%`
                      : `${formatCurrency(discount.value * 100)} грн`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>{formatDate(discount.start_date)}</div>
                    <div>{formatDate(discount.end_date)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        discount.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {discount.is_active ? "Активна" : "Неактивна"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {discount.product_discounts.length} товарів
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(discount)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Редагувати
                    </button>
                    <button
                      onClick={() => {
                        setDiscountToDelete(discount.id);
                        setShowDeleteModal(true);
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      Видалити
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {discounts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Знижки не знайдено
            </div>
          )}
        </div>

        {/* Pagination */}
        {discounts.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={totalItems}
          />
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setDiscountToDelete(null);
          }}
          onConfirm={handleDelete}
          title="Видалити знижку"
          message="Ви впевнені, що хочете видалити цю знижку? Цю дію неможливо скасувати."
          confirmText="Видалити"
          cancelText="Скасувати"
          type="danger"
        />
      </div>
    </div>
  );
}
