"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem, Product, PromoCode } from "@/lib/types";

const STORAGE_KEY = "maison-cart-v1";

interface CartState {
  items: CartItem[];
  promo: PromoCode | null;
}

interface CartContextValue extends CartState {
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, size: string, quantity?: number) => void;
  removeItem: (slug: string, size: string) => void;
  updateQuantity: (slug: string, size: string, quantity: number) => void;
  applyPromo: (code: string) => Promise<{ success: boolean; message: string }>;
  removePromo: () => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  discount: number;
  total: number;
}

const CartContext = createContext<CartContextValue | null>(null);

function readStoredState(): CartState {
  if (typeof window === "undefined") return { items: [], promo: null };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [], promo: null };
    const parsed = JSON.parse(raw) as CartState;
    return { items: parsed.items ?? [], promo: parsed.promo ?? null };
  } catch {
    return { items: [], promo: null };
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CartState>({ items: [], promo: null });
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Reads from localStorage (an external system) to hydrate state that
    // must render empty on the server for a matching first paint.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(readStoredState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback((product: Product, size: string, quantity = 1) => {
    setState((prev) => {
      const existing = prev.items.find(
        (i) => i.slug === product.slug && i.size === size
      );
      if (existing) {
        return {
          ...prev,
          items: prev.items.map((i) =>
            i.slug === product.slug && i.size === size
              ? { ...i, quantity: i.quantity + quantity }
              : i
          ),
        };
      }
      const newItem: CartItem = {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        price: product.price,
        size,
        quantity,
        swatch: product.swatch,
        tone: product.tone,
        image: product.images?.[0],
      };
      return { ...prev, items: [...prev.items, newItem] };
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((slug: string, size: string) => {
    setState((prev) => ({
      ...prev,
      items: prev.items.filter((i) => !(i.slug === slug && i.size === size)),
    }));
  }, []);

  const updateQuantity = useCallback((slug: string, size: string, quantity: number) => {
    setState((prev) => ({
      ...prev,
      items:
        quantity <= 0
          ? prev.items.filter((i) => !(i.slug === slug && i.size === size))
          : prev.items.map((i) =>
              i.slug === slug && i.size === size ? { ...i, quantity } : i
            ),
    }));
  }, []);

  const applyPromo = useCallback(async (code: string) => {
    const normalized = code.trim().toUpperCase();
    try {
      const res = await fetch(`/api/promo-codes/validate?code=${encodeURIComponent(normalized)}`);
      const data = (await res.json()) as { valid: boolean; promo?: PromoCode; message?: string };
      if (!data.valid || !data.promo) {
        return { success: false, message: data.message || "Code promo invalide." };
      }
      setState((prev) => ({ ...prev, promo: data.promo! }));
      return { success: true, message: data.promo.description };
    } catch {
      return { success: false, message: "Impossible de vérifier ce code pour le moment." };
    }
  }, []);

  const removePromo = useCallback(() => {
    setState((prev) => ({ ...prev, promo: null }));
  }, []);

  const clearCart = useCallback(() => {
    setState({ items: [], promo: null });
  }, []);

  const itemCount = useMemo(
    () => state.items.reduce((sum, i) => sum + i.quantity, 0),
    [state.items]
  );

  const subtotal = useMemo(
    () => state.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [state.items]
  );

  const discount = useMemo(() => {
    if (!state.promo) return 0;
    if (state.promo.type === "percent") return subtotal * (state.promo.value / 100);
    return Math.min(state.promo.value, subtotal);
  }, [state.promo, subtotal]);

  const total = Math.max(subtotal - discount, 0);

  const value: CartContextValue = {
    ...state,
    isOpen,
    openCart,
    closeCart,
    addItem,
    removeItem,
    updateQuantity,
    applyPromo,
    removePromo,
    clearCart,
    itemCount,
    subtotal,
    discount,
    total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
