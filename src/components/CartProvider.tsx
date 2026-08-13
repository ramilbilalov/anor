"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  totalCount: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "anor_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const syncedRef = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore malformed storage
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, loaded]);

  // Once after load, refresh cart items from the server so names, prices and
  // photos stay current, and drop items that were deleted or hidden.
  useEffect(() => {
    if (!loaded || syncedRef.current || items.length === 0) return;
    syncedRef.current = true;

    const ids = items.map((i) => i.id).join(",");
    let cancelled = false;

    fetch(`/api/products?ids=${encodeURIComponent(ids)}`)
      .then((r) => r.json())
      .then((data: { products?: Array<Omit<CartItem, "quantity"> & { isAvailable: boolean }> }) => {
        if (cancelled) return;
        const map = new Map((data.products ?? []).map((p) => [p.id, p]));
        setItems((cur) =>
          cur
            .filter((i) => map.get(i.id)?.isAvailable)
            .map((i) => {
              const p = map.get(i.id)!;
              return { ...i, name: p.name, price: p.price, imageUrl: p.imageUrl };
            })
        );
      })
      .catch(() => {
        // offline / error: keep the stored cart as-is
      });

    return () => {
      cancelled = true;
    };
  }, [loaded, items]);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.id === item.id);
        if (existing) {
          return prev.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
          );
        }
        return [...prev, { ...item, quantity }];
      });
    },
    []
  );

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const setQuantity = useCallback((id: string, quantity: number) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    return {
      items,
      totalCount,
      totalPrice,
      addItem,
      removeItem,
      setQuantity,
      clear,
    };
  }, [items, addItem, removeItem, setQuantity, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
