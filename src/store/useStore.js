import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/* ─── Auth Store ─────────────────────────────────────────────── */
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      updateUser: (updates) => set((s) => ({ user: { ...s.user, ...updates } })),
    }),
    { name: 'hunarmand-auth' }
  )
);

/* ─── Cart Store ─────────────────────────────────────────────── */
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1, variant = null) => {
        const key = variant ? `${product.id}-${variant}` : product.id;
        const existing = get().items.find((i) => i.key === key);
        if (existing) {
          set((s) => ({
            items: s.items.map((i) =>
              i.key === key ? { ...i, quantity: i.quantity + quantity } : i
            ),
          }));
        } else {
          set((s) => ({ items: [...s.items, { ...product, key, quantity, variant }] }));
        }
      },
      removeItem: (key) => set((s) => ({ items: s.items.filter((i) => i.key !== key) })),
      updateQuantity: (key, qty) => {
        if (qty <= 0) { get().removeItem(key); return; }
        set((s) => ({ items: s.items.map((i) => (i.key === key ? { ...i, quantity: qty } : i)) }));
      },
      clearCart: () => set({ items: [] }),
      get total() {
        return get().items.reduce((s, i) => s + i.price * i.quantity, 0);
      },
      get count() {
        return get().items.reduce((s, i) => s + i.quantity, 0);
      },
    }),
    { name: 'hunarmand-cart' }
  )
);

/* ─── Wishlist Store ─────────────────────────────────────────── */
export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      toggle: (product) => {
        const pid = product._id || product.id;
        const exists = get().items.find((i) => (i._id || i.id) === pid);
        if (exists) set((s) => ({ items: s.items.filter((i) => (i._id || i.id) !== pid) }));
        else set((s) => ({ items: [...s.items, product] }));
      },
      has: (id) => get().items.some((i) => (i._id || i.id) === id),
    }),
    { name: 'hunarmand-wishlist' }
  )
);

/* ─── UI Store ───────────────────────────────────────────────── */
export const useUIStore = create((set) => ({
  theme: 'light',
  sidebarOpen: false,
  searchOpen: false,
  productsLoaded: false,
  toggleTheme: () =>
    set((s) => {
      const next = s.theme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      return { theme: next };
    }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false }),
  setProductsLoaded: (val) => set({ productsLoaded: val }),
}));
