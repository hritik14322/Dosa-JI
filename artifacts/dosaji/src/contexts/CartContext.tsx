import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
  menuItemId: number;
  selectedSize?: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

function cartKey(menuItemId: number, selectedSize?: string) {
  return `${menuItemId}:${selectedSize ?? ""}`;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (menuItemId: number, selectedSize?: string) => void;
  updateQty: (menuItemId: number, quantity: number, selectedSize?: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  subtotal: number;
  total: number;
  couponCode: string | null;
  couponDiscount: number;
  setCoupon: (code: string | null, discount: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [couponCode, setCouponCodeState] = useState<string | null>(() => {
    return localStorage.getItem("couponCode") || null;
  });
  const [couponDiscount, setCouponDiscountState] = useState<number>(() => {
    const stored = localStorage.getItem("couponDiscount");
    return stored ? parseFloat(stored) : 0;
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (couponCode) {
      localStorage.setItem("couponCode", couponCode);
      localStorage.setItem("couponDiscount", String(couponDiscount));
    } else {
      localStorage.removeItem("couponCode");
      localStorage.removeItem("couponDiscount");
    }
  }, [couponCode, couponDiscount]);

  const addItem = (item: Omit<CartItem, "quantity">) => {
    const key = cartKey(item.menuItemId, item.selectedSize);
    setItems((prev) => {
      const existing = prev.find((i) => cartKey(i.menuItemId, i.selectedSize) === key);
      if (existing) {
        return prev.map((i) =>
          cartKey(i.menuItemId, i.selectedSize) === key
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (menuItemId: number, selectedSize?: string) => {
    const key = cartKey(menuItemId, selectedSize);
    setItems((prev) => prev.filter((i) => cartKey(i.menuItemId, i.selectedSize) !== key));
  };

  const updateQty = (menuItemId: number, quantity: number, selectedSize?: string) => {
    const key = cartKey(menuItemId, selectedSize);
    if (quantity <= 0) {
      removeItem(menuItemId, selectedSize);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        cartKey(i.menuItemId, i.selectedSize) === key ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setCouponCodeState(null);
    setCouponDiscountState(0);
  };

  const setCoupon = (code: string | null, discount: number) => {
    setCouponCodeState(code);
    setCouponDiscountState(discount);
  };

  const cartTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = items.reduce((count, item) => count + item.quantity, 0);
  const subtotal = cartTotal;
  const total = Math.max(0, subtotal + 40 + subtotal * 0.05 - couponDiscount);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        cartTotal,
        cartCount,
        subtotal,
        total,
        couponCode,
        couponDiscount,
        setCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
