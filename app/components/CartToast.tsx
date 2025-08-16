"use client";

import { useCart } from "../contexts/CartContext";
import { Toast } from "./Toast";

export function CartToast() {
  const { toastMessage, isToastVisible, hideToast } = useCart();

  const handleClose = () => {
    hideToast();
  };

  return (
    <Toast
      message={toastMessage}
      isVisible={isToastVisible}
      onClose={handleClose}
    />
  );
}
