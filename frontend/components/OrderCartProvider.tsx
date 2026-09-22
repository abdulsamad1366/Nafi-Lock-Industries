"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface OrderCartItem {
  productId: string;
  name: string;
  modelCode?: string;
  image?: string;
  unitPrice: number;
  minOrderQty: number;
  quantity: number;
}

interface OrderCartContextType {
  items: OrderCartItem[];
  addItem: (item: Omit<OrderCartItem, "quantity"> & { quantity?: number }) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const OrderCartContext = createContext<OrderCartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "nafi_distributor_cart";

export function OrderCartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<OrderCartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load cart from sessionStorage", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to sessionStorage on change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Failed to save cart to sessionStorage", e);
    }
  }, [items, isLoaded]);

  const addItem = (item: Omit<OrderCartItem, "quantity"> & { quantity?: number }) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      const initialQty = item.quantity || item.minOrderQty || 1;
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + initialQty }
            : i
        );
      }
      return [
        ...prev,
        {
          productId: item.productId,
          name: item.name,
          modelCode: item.modelCode,
          image: item.image,
          unitPrice: item.unitPrice,
          minOrderQty: item.minOrderQty || 1,
          quantity: Math.max(initialQty, item.minOrderQty || 1),
        },
      ];
    });
    setIsDrawerOpen(true);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.productId === productId) {
            // Must respect minOrderQty or allow 0 to remove
            if (quantity <= 0) return null;
            return { ...item, quantity };
          }
          return item;
        })
        .filter(Boolean) as OrderCartItem[]
    );
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <OrderCartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        subtotal,
        itemCount,
        isDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
      }}
    >
      {children}
    </OrderCartContext.Provider>
  );
}

export function useOrderCart() {
  const context = useContext(OrderCartContext);
  if (!context) {
    throw new Error("useOrderCart must be used within an OrderCartProvider");
  }
  return context;
}
