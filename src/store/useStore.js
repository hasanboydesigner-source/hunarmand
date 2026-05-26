import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import i18n from '../i18n';

/* ─── Auth Store ─────────────────────────────────────────────── */
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => {
        localStorage.removeItem('i18nextLng');
        if (i18n && i18n.changeLanguage) {
          i18n.changeLanguage('uz');
        }
        set({ user: null, token: null, isAuthenticated: false });
      },
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
        const stockLimit = product.inStock !== undefined ? product.inStock : Infinity;

        if (existing) {
          set((s) => ({
            items: s.items.map((i) => {
              if (i.key === key) {
                const newQty = i.quantity + quantity;
                return { ...i, quantity: newQty > stockLimit ? stockLimit : newQty };
              }
              return i;
            })
          }));
        } else {
          const initialQty = quantity > stockLimit ? stockLimit : quantity;
          if (initialQty > 0) {
            set((s) => ({ items: [...s.items, { ...product, key, quantity: initialQty, variant }] }));
          }
        }
      },
      removeItem: (key) => set((s) => ({ items: s.items.filter((i) => i.key !== key) })),
      updateQuantity: (key, qty) => {
        if (qty <= 0) { get().removeItem(key); return; }
        set((s) => ({ items: s.items.map((i) => {
          if (i.key === key) {
            const stockLimit = i.inStock !== undefined ? i.inStock : Infinity;
            return { ...i, quantity: qty > stockLimit ? stockLimit : qty };
          }
          return i;
        }) }));
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
      
      const updateTheme = () => {
        document.documentElement.classList.add('disable-css-transitions');
        document.documentElement.setAttribute('data-theme', next);
      };

      if (document.startViewTransition) {
        const transition = document.startViewTransition(updateTheme);
        transition.ready.finally(() => {
          document.documentElement.classList.remove('disable-css-transitions');
        });
      } else {
        updateTheme();
        void document.documentElement.offsetHeight; // reflow
        document.documentElement.classList.remove('disable-css-transitions');
      }
      return { theme: next };
    }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false }),
  setProductsLoaded: (val) => set({ productsLoaded: val }),
}));
