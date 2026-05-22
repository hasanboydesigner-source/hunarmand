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

/* ─── Mock Products ─────────────────────────────────────────── */
export const MOCK_PRODUCTS = [
  {
    id: 'p1', title: 'Rishton Keramika Piyola Set',
    category: 'keramika', price: 120000, originalPrice: 150000,
    rating: 4.8, reviewCount: 124, sold: 340,
    image: 'https://images.uzum.uz/d4rrqtrtqdhgicat64k0/original.jpg',
    images: [
      'https://images.uzum.uz/d4rrqtrtqdhgicat64k0/original.jpg',
      'https://holiday-golightly.com/wp-content/uploads/2023/08/DSC0207-1024x683.jpg',
      'https://holiday-golightly.com/wp-content/uploads/2023/08/DSC0207-1024x683.jpg',
    ],
    craftsman: { id: 'c1', name: 'Akbar Nazarov', region: 'Rishton', rating: 4.9, avatar: null },
    description: "Qo'lda yasalgan an'anaviy Rishton keramika piyola to'plami. Har bir piyola o'ziga xos naqshlar bilan bezatilgan.",
    materials: "Loy, tabiiy bo'yoqlar",
    inStock: 15, sku: 'RK-001',
    featured: true, isNew: false,
    dimensions: '8cm × 8cm × 6cm', weight: '200g',
    productionTime: '7-10 kun',
  },
  {
    id: 'p2', title: 'Buxoro Ipak Gilam (2×3m)',
    category: 'gilam', price: 2500000, originalPrice: null,
    rating: 5.0, reviewCount: 31, sold: 12,
    image: 'https://uzbekistan.travel/storage/app/media/cropped-images/IMG_6257-0-0-0-0-1593152416.jpg',
    images: [
      'https://uzbekistan.travel/storage/app/media/cropped-images/IMG_6257-0-0-0-0-1593152416.jpg',
      'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/26/e8/ee/caption.jpg?w=1200&h=900&s=1',
    ],
    craftsman: { id: 'c2', name: 'Malohat Qodirov', region: 'Buxoro', rating: 5.0, avatar: null },
    description: "100% tabiiy ipakdan to'qilgan Buxoro gilamchiligi namunasi. An'anaviy naqshlar bilan bezatilgan.",
    materials: "100% tabiiy ipak",
    inStock: 3, sku: 'BG-002',
    featured: true, isNew: true,
    dimensions: '200cm × 300cm', weight: '8kg',
    productionTime: '3-6 oy',
  },
  {
    id: 'p3', title: "Samarqand Kumush Uzuk",
    category: 'zargarlik', price: 380000, originalPrice: 450000,
    rating: 4.7, reviewCount: 89, sold: 210,
    image: 'https://yuz.uz/imageproxy/1280x/https://yuz.uz/file/news/f302cdf67a9af55273fd527aa3fe1f42.jpg ',
    images: [
      'https://yuz.uz/imageproxy/1280x/https://yuz.uz/file/news/f302cdf67a9af55273fd527aa3fe1f42.jpg  ',
      'https://yuz.uz/imageproxy/1280x/https://yuz.uz/file/news/f302cdf67a9af55273fd527aa3fe1f42.jpg',
    ],
    craftsman: { id: 'c3', name: 'Jamshid Umarov', region: 'Samarqand', rating: 4.8, avatar: null },
    description: "925 namunadagi kumushdan qo'lda yasalgan an'anaviy Samarqand uzugi. Firuza toshi bilan bezatilgan.",
    materials: "925 kumush, firuza toshi",
    inStock: 8, sku: 'SU-003',
    featured: false, isNew: false,
    dimensions: '2cm diametr', weight: '5g',
    productionTime: '3-5 kun',
  },
  {
    id: 'p4', title: "Qo'qon Yog'och O'ymakor Panel",
    category: 'yogoch', price: 850000, originalPrice: null,
    rating: 4.9, reviewCount: 45, sold: 67,
    image: 'https://oyina.uz/storage/funnies/April2022/13.png',
    images: [
      'https://oyina.uz/storage/funnies/April2022/13.png',
      'https://images.unsplash.com/photo-1526827655408-c43c44785e80?w=800&q=80',
    ],
    craftsman: { id: 'c4', name: 'Sherzod Tursunov', region: "Qo'qon", rating: 4.9, avatar: null },
    description: "Qo'lda o'yilgan an'anaviy O'zbek naqshlari bilan bezatilgan yong'oq yog'ochidan yasalgan devoriy panel.",
    materials: "Yong'oq yog'ochi, tabiiy moy",
    inStock: 5, sku: 'QY-004',
    featured: true, isNew: true,
    dimensions: '60cm × 90cm', weight: '3kg',
    productionTime: '2-3 hafta',
  },
  {
    id: 'p5', title: "Atlas Adras Ko'ylak Mato (3m)",
    category: 'toʻqimachilik', price: 420000, originalPrice: 480000,
    rating: 4.6, reviewCount: 167, sold: 430,
    image: 'https://images.uzum.uz/d2qt9334eu2h0tmq2smg/original.jpg',
    images: [
      'https://images.uzum.uz/d2qt9334eu2h0tmq2smg/original.jpg',
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80',
    ],
    craftsman: { id: 'c5', name: 'Nilufar Xasanova', region: "Marg'ilon", rating: 4.7, avatar: null },
    description: "Margilon atlas ustaxonasida tabiiy ipakdan to'qilgan an'anaviy Atlas adras mato. Rang-barang naqshlar.",
    materials: "100% tabiiy ipak",
    inStock: 20, sku: 'AA-005',
    featured: false, isNew: true,
    dimensions: '100cm × 300cm', weight: '400g',
    productionTime: '5-7 kun',
  },
  {
    id: 'p6', title: 'Chust Mis Samovar (3L)',
    category: 'misgarlik', price: 980000, originalPrice: 1100000,
    rating: 4.8, reviewCount: 28, sold: 45,
    image: 'https://api.society.uz/media/news/BQ8A4028.webp',
    images: [
      'https://api.society.uz/media/news/BQ8A4028.webp',
      'https://api.society.uz/media/news/BQ8A4028.webp',
    ],
    craftsman: { id: 'c6', name: 'Hamid Yusupov', region: 'Chust', rating: 4.8, avatar: null },
    description: "Qo'lda ishlangan an'anaviy mis samovar. Chust misgarlik an'analarini saqlab kelgan usta tomonidan yasalgan.",
    materials: "Mis, bronza",
    inStock: 4, sku: 'CM-006',
    featured: true, isNew: false,
    dimensions: '30cm × 20cm', weight: '2.5kg',
    productionTime: '3-4 hafta',
  },
  {
    id: 'p7', title: 'Buxoro Miniatura Rasm',
    category: 'naqqoshlik', price: 650000, originalPrice: null,
    rating: 5.0, reviewCount: 19, sold: 22,
    image: 'https://www.advantour.com/img/uzbekistan/bukhara/ustoz-shogird-miniature-workshop3.jpg',
    images: [
      'https://www.advantour.com/img/uzbekistan/bukhara/ustoz-shogird-miniature-workshop3.jpg',
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80',
    ],
    craftsman: { id: 'c7', name: 'Dilshod Razzaqov', region: 'Buxoro', rating: 5.0, avatar: null },
    description: "Qog'oz ustiga tabiiy bo'yoqlar bilan chizilgan an'anaviy Buxoro miniatura rasmi. Unikal san'at asari.",
    materials: "Qog'oz, tabiiy mineral bo'yoqlar, oltin siyoh",
    inStock: 2, sku: 'BM-007',
    featured: false, isNew: false,
    dimensions: '15cm × 20cm', weight: '50g',
    productionTime: '2-4 hafta',
  },
  {
    id: 'p8', title: "Xiva Kandakori Sandiqcha",
    category: 'kandakorlik', price: 320000, originalPrice: 380000,
    rating: 4.5, reviewCount: 56, sold: 120,
    image: 'https://silkgranat.uz/wp-content/uploads/2025/01/uzbekskaya-reznaya-shkatulka-uzbek-carved-box.webp',
    images: [
      'https://silkgranat.uz/wp-content/uploads/2025/01/uzbekskaya-reznaya-shkatulka-uzbek-carved-box.webp',
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&q=80',
    ],
    craftsman: { id: 'c8', name: "Barno Ergasheva", region: 'Xiva', rating: 4.6, avatar: null },
    description: "Xiva ustaxonalarida tayyorlangan naqshli sandiqcha. Zargarlik buyumlari va qimmatbaho narsalar uchun.",
    materials: "Tut yog'ochi, ganchkorlik",
    inStock: 12, sku: 'XK-008',
    featured: false, isNew: true,
    dimensions: '20cm × 30cm × 15cm', weight: '1.2kg',
    productionTime: '1-2 hafta',
  },
];

/* ─── Mock Craftsmen ─────────────────────────────────────────── */
export const MOCK_CRAFTSMEN = [
  {
    id: 'c1', name: 'Akbar Nazarov', slug: 'akbar-nazarov',
    specialty: 'keramika', region: 'Rishton', city: 'Rishton',
    rating: 4.9, reviewCount: 312, totalSales: 1240, yearsExp: 25,
    responseTime: '< 1 soat', totalProducts: 48,
    bio: "Rishton keramikasi ustasi. 25 yillik tajriba. An'anaviy usullar bilan zamonaviy dizaynni birlashtirib, noyob buyumlar yarataman.",
    coverImage: 'https://holiday-golightly.com/wp-content/uploads/2023/08/DSC0207-1024x683.jpg',
    isVerified: true, joinedDate: '2020-03-15',
    whatsapp: '+998901234567',
  },
  {
    id: 'c2', name: 'Malohat Qodirov', slug: 'malohat-qodirov',
    specialty: 'gilam', region: 'Buxoro', city: 'Buxoro',
    rating: 5.0, reviewCount: 89, totalSales: 156, yearsExp: 30,
    responseTime: '< 3 soat', totalProducts: 12,
    bio: "Buxoro gilamchiligi san'atini avloddan-avlodga o'tkazib kelaman. Har bir gilam — bu qo'l mehnati va sevgining mahsuli.",
    coverImage: 'https://central-asia.guide/wp-content/uploads/2024/12/Uzbek-carpet-veawing-1024x682.jpg',
    isVerified: true, joinedDate: '2021-01-20',
    whatsapp: '+998902345678',
  },
  {
    id: 'c3', name: 'Jamshid Umarov', slug: 'jamshid-umarov',
    specialty: 'zargarlik', region: 'Samarqand', city: 'Samarqand',
    rating: 4.8, reviewCount: 201, totalSales: 890, yearsExp: 18,
    responseTime: '< 2 soat', totalProducts: 64,
    bio: "Samarqand zargarlik maktabining vakili. Kumush va oltin bilan ishlash bo'yicha yuqori malakali usta.",
    coverImage: 'https://api.society.uz/media/news/photo_2024-05-06_12-35-19_2.webp',
    isVerified: true, joinedDate: '2019-07-10',
    whatsapp: '+998903456789',
  },
  {
    id: 'c4', name: 'Sherzod Tursunov', slug: 'sherzod-tursunov',
    specialty: 'yogoch', region: "Qo'qon", city: "Qo'qon",
    rating: 4.9, reviewCount: 112, totalSales: 345, yearsExp: 22,
    responseTime: '< 4 soat', totalProducts: 29,
    bio: "Yog'ochdan noyob san'at asarlari yarataydigan usta. Har bir buyum o'zining tarixi va ma'nosiga ega.",
    coverImage: 'https://minio.tbcbank.uz/web-tbcbank-uz-strapi-admin-cms/uploads/1-kokand.jpeg',
    isVerified: false, joinedDate: '2022-05-01',
    whatsapp: '+998904567890',
  },
];

/* ─── Mock Reviews ───────────────────────────────────────────── */
export const MOCK_REVIEWS = [
  {
    id: 'r1', productId: 'p1', rating: 5,
    author: 'Zulfiya M.', date: '2026-04-15', verified: true,
    text: "Juda chiroyli va sifatli. Sovg'a sifatida oldim, do'stim juda xursand bo'ldi!",
    helpful: 24, images: [],
  },
  {
    id: 'r2', productId: 'p1', rating: 5,
    author: 'Bobur T.', date: '2026-03-28', verified: true,
    text: "An'anaviy keramika g'oyat go'zal. Ustaning mahorati ajoyib. Yana buyurtma beraman.",
    helpful: 18, images: [],
  },
  {
    id: 'r3', productId: 'p1', rating: 4,
    author: 'Kamola R.', date: '2026-03-10', verified: true,
    text: "Yaxshi sifat, faqat yetkazib berish biroz kechikdi. Lekin buyumning o'zi juda yoqdi.",
    helpful: 9, images: [],
  },
];

/* ─── Formatters ─────────────────────────────────────────────── */
export const formatPrice = (price) =>
  new Intl.NumberFormat('uz-UZ').format(price) + " so'm";

export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('uz-UZ', { year: 'numeric', month: 'long', day: 'numeric' });

export const getDiscount = (price, original) =>
  original ? Math.round((1 - price / original) * 100) : 0;

export const getInitials = (name) =>
  name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '??';
