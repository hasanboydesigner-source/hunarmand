export const MOCK_USERS = [
  {name:'Zulfiya Mamatova', email:'zulfiya@mail.uz', password:'password', role:'customer'},
  {name:'Akbar Nazarov',    email:'akbar@mail.uz',   password:'password', role:'craftsman', region: 'Rishton', bio: 'Rishton keramikasi ustasi', shopName: 'Akbar ustaxonasi', isVerified: true, specialty: 'keramika'},
  {name:'Jamshid Umarov',   email:'jamshid@mail.uz', password:'password', role:'craftsman', region: 'Samarqand', bio: 'Zargarlik ustasi', shopName: 'Jamshid ustaxonasi', isVerified: true, specialty: 'zargarlik'},
  {name:'Malohat Qodirov',  email:'malohat@mail.uz', password:'password', role:'craftsman', region: 'Buxoro', bio: 'Buxoro gilamchiligi san\'atini avloddan-avlodga o\'tkazib kelaman', shopName: 'Malohat gilamlari', isVerified: true, specialty: 'gilam'},
  {name:'Bobur Toshmatov',  email:'bobur@mail.uz',   password:'password', role:'customer'},
  {name:'Admin',            email:'admin@demo.com',  password:'password', role:'admin'}
];

export const MOCK_PRODUCTS = [
  {
    title: 'Rishton Keramika Piyola Set',
    category: 'keramika', price: 120000,
    rating: 4.8, sold: 340,
    image: 'https://images.uzum.uz/d4rrqtrtqdhgicat64k0/original.jpg',
    inStock: 15,
    craftsmanEmail: 'akbar@mail.uz'
  },
  {
    title: 'Buxoro Ipak Gilam (2×3m)',
    category: 'gilam', price: 2500000,
    rating: 5.0, sold: 12,
    image: 'https://uzbekistan.travel/storage/app/media/cropped-images/IMG_6257-0-0-0-0-1593152416.jpg',
    inStock: 3,
    craftsmanEmail: 'malohat@mail.uz'
  },
  {
    title: "Samarqand Kumush Uzuk",
    category: 'zargarlik', price: 380000,
    rating: 4.7, sold: 210,
    image: 'https://yuz.uz/imageproxy/1280x/https://yuz.uz/file/news/f302cdf67a9af55273fd527aa3fe1f42.jpg',
    inStock: 8,
    craftsmanEmail: 'jamshid@mail.uz'
  }
];
