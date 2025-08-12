// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { useState, useEffect } from "react";

// interface CartItem {
//   id: string;
//   name: string;
//   price: number;
//   quantity: number;
//   imageUrl: string;
// }

// export default function CartPage() {

//   const [cart, setCart] = useState<CartItem[]>([]);

//   // 🔹 Отримати дані з localStorage при першому рендері
//   useEffect(() => {
//     const stored = localStorage.getItem("cart");
//     if (stored) {
//       setCart(JSON.parse(stored));
//     }
//   }, []);

//   // 🔹 Зберігати зміни до localStorage
//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cart));
//   }, [cart]);

//   const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

//   const clearCart = () => setCart([]);

//   const increase = (id: string) => {
//     setCart((prev) =>
//       prev.map((item) =>
//         item.id === id ? { ...item, quantity: item.quantity + 1 } : item
//       )
//     );
//   };

//   const decrease = (id: string) => {
//     setCart((prev) =>
//       prev
//         .map((item) =>
//           item.id === id
//             ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
//             : item
//         )
//         .filter((item) => item.quantity > 0)
//     );
//   };

//   if (cart.length === 0) {
//     return (
//       <div className="text-center p-12">
//         <h1 className="text-3xl font-bold mb-4">Кошик порожній 🛒</h1>
//         <Link
//           href="/catalog"
//           className="inline-block mt-4 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//         >
//           Перейти до каталогу
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-5xl mx-auto p-6 bg-white rounded shadow">
//       <h1 className="text-3xl font-bold mb-6">Ваш кошик</h1>

//       <div className="space-y-4">
//         {cart.map((item) => (
//           <div
//             key={item.id}
//             className="flex items-center justify-between border-b pb-4"
//           >
//             <div className="flex items-center gap-4">
//               <Image
//                 src={item.imageUrl}
//                 alt={item.name}
//                 width={100}
//                 height={70}
//                 className="rounded border"
//               />
//               <div>
//                 <h2 className="text-lg font-semibold">{item.name}</h2>
//                 <p className="text-blue-600">{item.price} грн</p>
//               </div>
//             </div>

//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => decrease(item.id)}
//                 className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
//               >
//                 −
//               </button>
//               <span>{item.quantity}</span>
//               <button
//                 onClick={() => increase(item.id)}
//                 className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
//               >
//                 +
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
//         <p className="text-xl font-bold">
//           Сума: <span className="text-blue-600">{total} грн</span>
//         </p>

//         <div className="flex gap-4">
//           <button
//             onClick={clearCart}
//             className="px-5 py-2 border border-red-500 text-red-500 rounded hover:bg-red-100 transition"
//           >
//             Очистити кошик
//           </button>
//           <Link
//             href="/checkout"
//             className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
//           >
//             Оформити замовлення
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuthAndLoadCart() {
      try {
        // 1. Check authentication
        console.log("11111111111111");
        const res = await fetch("/api/auth/me", {
          credentials: "include", // send cookies
        });

        console.log("res: ", res);

        console.log("22222222222222222");

        if (!res.ok) throw new Error("Not authenticated");

        const user = await res.json();

        // 2. Check role
        console.log("user role: ", user.role);

        if (user.role !== "customer") {
          router.push("/");
          return;
        }

        // 3. Load cart from localStorage
        const storedCart = localStorage.getItem("cart");
        if (storedCart) {
          setCart(JSON.parse(storedCart));
        }
      } catch (error) {
        // If no valid token → go to login
        console.log("00000000");
        // router.push("/login");
      } finally {
        setLoading(false);
      }
    }

    checkAuthAndLoadCart();
  }, [router]);

  if (loading) {
    return <p className="p-4">Loading cart...</p>;
  }

  if (cart.length === 0) {
    return <p className="p-4">Your cart is empty.</p>;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      <ul className="space-y-2">
        {cart.map((item) => (
          <li key={item.id} className="border p-2 rounded">
            <div className="flex justify-between">
              <span>{item.name}</span>
              <span>
                {item.quantity} × ${item.price.toFixed(2)}
              </span>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4 font-bold">Total: ${total.toFixed(2)}</div>
      <button
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => router.push("/checkout")}
      >
        Proceed to Checkout
      </button>
    </div>
  );
}
