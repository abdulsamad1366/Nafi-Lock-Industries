"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItemProduct {
  id: string;
  name: string;
  sku: string;
  basePrice: number;
  dealerPrice: number;
  finish: string;
  images: string;
  stock: number;
}

export interface CartItem {
  product: CartItemProduct;
  qty: number;
  finish: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: CartItemProduct, qty?: number, finish?: string) => void;
  removeFromCart: (productId: string, finish: string) => void;
  updateQty: (productId: string, finish: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  getTotals: (isDealer: boolean) => { subtotal: number; total: number; savings: number };
  buildWhatsAppInquiryUrl: (isDealer: boolean, customNotes?: string) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("nafi_cart");
      if (saved) {
        setCart(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load cart", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("nafi_cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart", e);
    }
  }, [cart]);

  const addToCart = (product: CartItemProduct, qty = 1, finish?: string) => {
    const selectedFinish = finish || product.finish;
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.finish === selectedFinish
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].qty += qty;
        return next;
      }

      return [...prev, { product, qty, finish: selectedFinish }];
    });
  };

  const removeFromCart = (productId: string, finish: string) => {
    setCart((prev) => prev.filter((item) => !(item.product.id === productId && item.finish === finish)));
  };

  const updateQty = (productId: string, finish: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId, finish);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId && item.finish === finish ? { ...item, qty } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  const getTotals = (isDealer: boolean) => {
    let subtotal = 0;
    let total = 0;

    cart.forEach((item) => {
      const unitPrice = isDealer ? item.product.dealerPrice : item.product.basePrice;
      const baseTotal = item.product.basePrice * item.qty;
      subtotal += baseTotal;
      total += unitPrice * item.qty;
    });

    const savings = isDealer ? subtotal - total : 0;

    return { subtotal, total, savings };
  };

  const buildWhatsAppInquiryUrl = (isDealer: boolean, customNotes = "") => {
    const phone = "919876543210";
    const userRoleText = isDealer ? "[DEALER BULK INQUIRY]" : "[RETAIL INQUIRY]";

    let message = `Hello NAFI Lock Industries,\n\nI would like to place an order/inquiry ${userRoleText}:\n\n`;

    cart.forEach((item, index) => {
      const price = isDealer ? item.product.dealerPrice : item.product.basePrice;
      message += `${index + 1}. ${item.product.name} (SKU: ${item.product.sku})\n`;
      message += `   Finish: ${item.finish} | Qty: ${item.qty} | Rate: ₹${price.toLocaleString("en-IN")}\n\n`;
    });

    const { total, savings } = getTotals(isDealer);
    message += `Total Estimated Value: ₹${total.toLocaleString("en-IN")}\n`;
    if (isDealer && savings > 0) {
      message += `Dealer Savings Applied: ₹${savings.toLocaleString("en-IN")}\n`;
    }

    if (customNotes) {
      message += `\nAdditional Notes: ${customNotes}`;
    }

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        totalItems,
        getTotals,
        buildWhatsAppInquiryUrl,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
