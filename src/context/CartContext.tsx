import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../api";
import { useAuth } from "./AuthContext";
import type { CartItem } from "../types";
import type { Product } from "../types";

type CartContextType = {
  cart: CartItem[];
  refreshCart: () => Promise<void>;
  addToCart: (productId: string, product?: Product) => Promise<void>;
  updateQty: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

const GUEST_CART_KEY = "guest_cart_v1";

function loadGuestCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveGuestCart(items: CartItem[]) {
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  } catch {
    // ignore write errors (e.g. private mode)
  }
}

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { token, logout } = useAuth();
  const [serverCart, setServerCart] = useState<CartItem[]>([]);
  const [guestCart, setGuestCart] = useState<CartItem[]>(() => (typeof window === "undefined" ? [] : loadGuestCart()));

  // If we have a token but serverCart is empty (e.g. guest cart merge failed),
  // fall back to guestCart so checkout still works.
  const cart = token ? (serverCart.length ? serverCart : guestCart) : guestCart;

  const refreshCart = async () => {
    if (!token) {
      setServerCart([]);
      return;
    }
    try {
      const { data } = await api.get("/cart");
      setServerCart(data);
    } catch (err: unknown) {
      // If token is invalid/expired, don't let checkout crash.
      // We reset cart and sign out so future calls don't keep failing.
      setServerCart([]);
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const status = (err as any)?.response?.status;
        if (status === 401) logout();
      } catch {
        // ignore logout failures
      }
    }
  };

  useEffect(() => {
    void refreshCart();
  }, [token]);

  // Merge guest cart into server cart after login.
  useEffect(() => {
    const merge = async () => {
      if (!token) return;
      if (!guestCart.length) return;

      try {
        // Push guest quantities to server
        for (const item of guestCart) {
          await api.post("/cart", { productId: item.product._id, quantity: item.quantity });
        }
        // Clear guest cart and refresh server cart
        setGuestCart([]);
        saveGuestCart([]);
        await refreshCart();
      } catch {
        // If merge fails, keep guest cart so user doesn't lose items.
      }
    };

    void merge();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const addToCart = async (productId: string, product?: Product) => {
    if (token) {
      await api.post("/cart", { productId, quantity: 1 });
      await refreshCart();
      return;
    }

    const resolvedProduct =
      product ??
      (await api.get(`/products/${productId}`)).data;

    setGuestCart((prev) => {
      const existing = prev.find((x) => x.product._id === productId);
      if (!existing) {
        const next = [...prev, { product: resolvedProduct, quantity: 1 }];
        saveGuestCart(next);
        return next;
      }
      const next = prev.map((x) =>
        x.product._id === productId ? { ...x, quantity: x.quantity + 1 } : x
      );
      saveGuestCart(next);
      return next;
    });
  };
  const updateQty = async (productId: string, quantity: number) => {
    const qty = Math.max(1, quantity);
    if (token) {
      await api.patch(`/cart/${productId}`, { quantity: qty });
      await refreshCart();
      return;
    }

    setGuestCart((prev) => {
      const next = prev.map((x) => (x.product._id === productId ? { ...x, quantity: qty } : x));
      saveGuestCart(next);
      return next;
    });
  };
  const removeItem = async (productId: string) => {
    if (token) {
      await api.delete(`/cart/${productId}`);
      await refreshCart();
      return;
    }
    setGuestCart((prev) => {
      const next = prev.filter((x) => x.product._id !== productId);
      saveGuestCart(next);
      return next;
    });
  };

  const value = useMemo(() => ({ cart, refreshCart, addToCart, updateQty, removeItem }), [cart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
};
