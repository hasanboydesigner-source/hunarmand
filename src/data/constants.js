/* ─── Mock Data & Constants ─────────────────────────────────── */

export const CATEGORIES = [
  { id: 'keramika', label: 'Keramika', labelRu: 'Керамика', icon: 'GiPaintedPottery', color: '#e8a042' },
  { id: 'gilam', label: 'Gilam', labelRu: 'Ковры', icon: 'GiWool', color: '#059669' },
  { id: 'zargarlik', label: 'Zargarlik', labelRu: 'Ювелирные', icon: 'GiDiamondRing', color: '#7c3aed' },
  { id: 'yogoch', label: "Yog'och", labelRu: 'Дерево', icon: 'GiWoodBeam', color: '#92400e' },
  { id: 'toʻqimachilik', label: "To'qimachilik", labelRu: 'Ткачество', icon: 'GiSewingMachine', color: '#0891b2' },
  { id: 'naqqoshlik', label: 'Naqqoshlik', labelRu: 'Роспись', icon: 'GiPaintBrush', color: '#db2777' },
  { id: 'misgarlik', label: 'Misgarlik', labelRu: 'Медь', icon: 'GiAnvil', color: '#d97706' },
  { id: 'kandakorlik', label: 'Kandakorlik', labelRu: 'Резьба', icon: 'GiChisel', color: '#16a34a' },
];

export const REGIONS = [
  'Toshkent', 'Samarqand', 'Buxoro', 'Namangan', 'Andijon',
  'Fargʻona', 'Xorazm', 'Surxondaryo', 'Qashqadaryo', 'Jizzax',
  'Sirdaryo', 'Navoiy', 'Qoraqalpogʻiston',
];

export const ORDER_STATUSES = {
  pending: { label: 'Kutilmoqda', color: 'warning' },
  processing: { label: 'Jarayonda', color: 'info' },
  shipped: { label: 'Yuborildi', color: 'info' },
  delivered: { label: 'Yetkazildi', color: 'success' },
  cancelled: { label: 'Bekor qilindi', color: 'error' },
  returned: { label: 'Qaytarildi', color: 'error' },
};

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Eng yangi' },
  { value: 'popular', label: 'Mashhur' },
  { value: 'price_asc', label: "Narx: arzondan" },
  { value: 'price_desc', label: "Narx: qimmatdan" },
  { value: 'rating', label: 'Yuqori reyting' },
];

export const MOCK_USERS = [];

/* ─── Mock Products ─────────────────────────────────────────── */
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const MOCK_PRODUCTS = [];

/* ─── Mock Craftsmen ─────────────────────────────────────────── */
export const MOCK_CRAFTSMEN = [];

/* ─── Mock Reviews ───────────────────────────────────────────── */
export const MOCK_REVIEWS = [];

/* ─── Formatters ─────────────────────────────────────────────── */
export const formatPrice = (price) =>
  new Intl.NumberFormat('uz-UZ').format(price) + " so'm";

export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' });

export const getDiscount = (price, original) =>
  original ? Math.round((1 - price / original) * 100) : 0;

export const getInitials = (name) =>
  name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '??';
