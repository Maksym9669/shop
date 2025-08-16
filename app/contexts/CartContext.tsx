"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image_url: string | null;
  quantity: number;
  stock_quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Omit<CartItem, "quantity">) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  showToast: (message: string) => void;
  hideToast: () => void;
  toastMessage: string;
  isToastVisible: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [toastMessage, setToastMessage] = useState("");
  const [isToastVisible, setIsToastVisible] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
        setCartItems([]);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Omit<CartItem, "quantity">) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        // Update quantity if item already exists
        const newQuantity = existingItem.quantity + 1;
        if (newQuantity <= product.stock_quantity) {
          showToast(`Кількість "${product.name}" оновлено в корзині`);
          return prevItems.map((item) =>
            item.id === product.id ? { ...item, quantity: newQuantity } : item
          );
        }
        return prevItems; // Don't exceed stock
      } else {
        // Add new item
        showToast(`"${product.name}" додано до корзини`);
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 0) {
      return; // Don't allow negative quantities
    }

    setCartItems((prevItems) => {
      const item = prevItems.find((item) => item.id === productId);
      if (!item) return prevItems;

      if (quantity > item.stock_quantity) {
        return prevItems; // Don't exceed stock
      }

      return prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setIsToastVisible(true);
  };

  const hideToast = () => {
    setIsToastVisible(false);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        showToast,
        hideToast,
        toastMessage,
        isToastVisible,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
