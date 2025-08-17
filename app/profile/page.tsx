"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  age?: number;
  phone_number?: string;
  created_at: string;
}

interface ShippingAddress {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  company?: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
  phone_number?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [addresses, setAddresses] = useState<ShippingAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<ShippingAddress | null>(
    null
  );

  const [profileForm, setProfileForm] = useState({
    email: "",
    full_name: "",
    age: "",
    phone_number: "",
  });

  const [addressForm, setAddressForm] = useState({
    first_name: "",
    last_name: "",
    company: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "Ukraine",
    phone_number: "",
    is_default: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchProfile();
    fetchAddresses();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/profile", {
        credentials: "include",
      });

      if (response.status === 401) {
        router.push("/auth/login");
        return;
      }

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setProfileForm({
          email: userData.email || "",
          full_name: userData.full_name || "",
          age: userData.age || "",
          phone_number: userData.phone_number || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await fetch("/api/shipping-addresses", {
        credentials: "include",
      });

      if (response.ok) {
        const addressData = await response.json();
        setAddresses(addressData);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setErrors({});
    setSuccessMessage("");

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: profileForm.email,
          full_name: profileForm.full_name,
          age: profileForm.age ? parseInt(profileForm.age) : null,
          phone_number: profileForm.phone_number || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data);
        setSuccessMessage("Профіль успішно оновлено!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrors({ general: data.error || "Помилка оновлення профілю" });
      }
    } catch (error) {
      setErrors({ general: "Помилка з'єднання з сервером" });
    } finally {
      setUpdating(false);
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setErrors({});

    try {
      const url = editingAddress
        ? `/api/shipping-addresses/${editingAddress.id}`
        : "/api/shipping-addresses";
      const method = editingAddress ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(addressForm),
      });

      const data = await response.json();

      if (response.ok) {
        await fetchAddresses();
        setShowAddressForm(false);
        setEditingAddress(null);
        resetAddressForm();
        setSuccessMessage(
          editingAddress ? "Адреса успішно оновлена!" : "Адреса успішно додана!"
        );
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setErrors({ address: data.error || "Помилка збереження адреси" });
      }
    } catch (error) {
      setErrors({ address: "Помилка з'єднання з сервером" });
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm("Ви впевнені, що хочете видалити цю адресу?")) return;

    try {
      const response = await fetch(`/api/shipping-addresses/${addressId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        await fetchAddresses();
        setSuccessMessage("Адреса видалена!");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  const startEditingAddress = (address: ShippingAddress) => {
    setEditingAddress(address);
    setAddressForm({
      first_name: address.first_name,
      last_name: address.last_name,
      company: address.company || "",
      address_line_1: address.address_line_1,
      address_line_2: address.address_line_2 || "",
      city: address.city,
      state: address.state || "",
      postal_code: address.postal_code,
      country: address.country,
      phone_number: address.phone_number || "",
      is_default: address.is_default,
    });
    setShowAddressForm(true);
  };

  const resetAddressForm = () => {
    setAddressForm({
      first_name: "",
      last_name: "",
      company: "",
      address_line_1: "",
      address_line_2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "Ukraine",
      phone_number: "",
      is_default: false,
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">Завантаження...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center text-red-600">
          Помилка завантаження профілю
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Мій профіль</h1>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      {errors.general && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {errors.general}
        </div>
      )}

      {/* Profile Information */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Особиста інформація</h2>
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Повне ім'я *
              </label>
              <input
                type="text"
                value={profileForm.full_name}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, full_name: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email *
              </label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, email: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Вік
              </label>
              <input
                type="number"
                min="13"
                max="120"
                value={profileForm.age}
                onChange={(e) =>
                  setProfileForm({ ...profileForm, age: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Номер телефону
              </label>
              <input
                type="tel"
                value={profileForm.phone_number}
                onChange={(e) =>
                  setProfileForm({
                    ...profileForm,
                    phone_number: e.target.value,
                  })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="+380123456789"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={updating}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {updating ? "Збереження..." : "Зберегти зміни"}
          </button>
        </form>
      </div>

      {/* Shipping Addresses */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Адреси доставки</h2>
          <button
            onClick={() => {
              setShowAddressForm(true);
              setEditingAddress(null);
              resetAddressForm();
            }}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            Додати адресу
          </button>
        </div>

        {addresses.length === 0 ? (
          <p className="text-gray-500">
            У вас ще немає збережених адрес доставки
          </p>
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`border rounded-lg p-4 ${
                  address.is_default
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    {address.is_default && (
                      <span className="inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded mb-2">
                        За замовчуванням
                      </span>
                    )}
                    <div className="space-y-1">
                      <p className="font-medium">
                        {address.first_name} {address.last_name}
                      </p>
                      {address.company && (
                        <p className="text-gray-600">{address.company}</p>
                      )}
                      <p className="text-gray-600">{address.address_line_1}</p>
                      {address.address_line_2 && (
                        <p className="text-gray-600">
                          {address.address_line_2}
                        </p>
                      )}
                      <p className="text-gray-600">
                        {address.city}
                        {address.state && `, ${address.state}`}{" "}
                        {address.postal_code}
                      </p>
                      <p className="text-gray-600">{address.country}</p>
                      {address.phone_number && (
                        <p className="text-gray-600">{address.phone_number}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEditingAddress(address)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Редагувати
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(address.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Видалити
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Address Form Modal */}
      {showAddressForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingAddress ? "Редагувати адресу" : "Додати нову адресу"}
              </h3>
              <button
                onClick={() => {
                  setShowAddressForm(false);
                  setEditingAddress(null);
                  setErrors({});
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {errors.address && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {errors.address}
              </div>
            )}

            <form onSubmit={handleAddressSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ім'я *
                  </label>
                  <input
                    type="text"
                    value={addressForm.first_name}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        first_name: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Прізвище *
                  </label>
                  <input
                    type="text"
                    value={addressForm.last_name}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        last_name: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Компанія
                  </label>
                  <input
                    type="text"
                    value={addressForm.company}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        company: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Адреса (рядок 1) *
                  </label>
                  <input
                    type="text"
                    value={addressForm.address_line_1}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        address_line_1: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Адреса (рядок 2)
                  </label>
                  <input
                    type="text"
                    value={addressForm.address_line_2}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        address_line_2: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Місто *
                  </label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, city: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Область/Регіон
                  </label>
                  <input
                    type="text"
                    value={addressForm.state}
                    onChange={(e) =>
                      setAddressForm({ ...addressForm, state: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Поштовий індекс *
                  </label>
                  <input
                    type="text"
                    value={addressForm.postal_code}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        postal_code: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Країна *
                  </label>
                  <select
                    value={addressForm.country}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        country: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="Ukraine">Україна</option>
                    <option value="Poland">Польща</option>
                    <option value="Germany">Німеччина</option>
                    <option value="United States">США</option>
                    <option value="United Kingdom">Великобританія</option>
                    <option value="Canada">Канада</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Номер телефону
                  </label>
                  <input
                    type="tel"
                    value={addressForm.phone_number}
                    onChange={(e) =>
                      setAddressForm({
                        ...addressForm,
                        phone_number: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={addressForm.is_default}
                      onChange={(e) =>
                        setAddressForm({
                          ...addressForm,
                          is_default: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">
                      Зробити цю адресу за замовчуванням
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddressForm(false);
                    setEditingAddress(null);
                    setErrors({});
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Скасувати
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {updating
                    ? "Збереження..."
                    : editingAddress
                    ? "Оновити адресу"
                    : "Додати адресу"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
