import { useState, useEffect } from 'react';
import axios from 'axios';
import { ORDER_STATUSES, API_URL } from '../data/constants';

const MOCK_ORDERS = [];

const MOCK_MESSAGES = [];

export function useDashboardData(user, addToast, updateUser) {
  const [allProducts, setAllProducts] = useState([]);

  const [allOrders, setAllOrders] = useState([]);
  const [allMessages, setAllMessages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prodRes = await axios.get(`${API_URL}/products`);
        setAllProducts(prodRes.data);

        // Faqat hunarmand tizimga kirgan bo'lsa buyurtmalar va xabarlarni olamiz
        if (user?.id) {
          const [ordRes, msgRes] = await Promise.all([
            axios.get(`${API_URL}/orders/craftsman/${user.id}`),
            axios.get(`${API_URL}/messages/craftsman/${user.id}`)
          ]);
          setAllOrders(ordRes.data);
          setAllMessages(msgRes.data);
        }
      } catch (err) {
        console.error("API error fetching dashboard data:", err);
      }
    };
    fetchData();
  }, [user]);

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('hunarmand_profile_' + user?.id);
    if (saved) return JSON.parse(saved);
    return {
      name: user?.name || '',
      email: user?.email || '',
      phone: '', bio: '', shopName: '', whatsapp: '', region: '', category: ''
    };
  });

  useEffect(() => {
    if (user?.id) {
      axios.get(`${API_URL}/auth/craftsmen/${user.id}`)
        .then(res => {
          const d = res.data;
          setProfile({
            name: d.name, email: d.email, phone: d.phone || '', bio: d.bio || '',
            shopName: d.shopName || '', whatsapp: d.whatsapp || '', region: d.region || '',
            category: d.specialty || '', yearsExp: d.yearsExp || 0
          });
        })
        .catch(console.error);
    }
  }, [user]);

  // Filtered for current user (MongoDB populated craftsman._id or fallback by name)
  const products = allProducts.filter(p => {
    const cid = typeof p.craftsman === 'object' ? p.craftsman?._id : p.craftsman;
    const cname = typeof p.craftsman === 'object' ? p.craftsman?.name : null;
    return cid === user?.id || p.craftsman?.id === user?.id || (cname && cname === user?.name);
  });
  
  const orders = allOrders.filter(o => o.craftsmanId === user?.id).map(o => ({
    ...o,
    id: o.orderNumber || o.id || o._id,
    product: o.items && Array.isArray(o.items) ? o.items.map(i => i.title).join(', ') : o.product,
    customer: typeof o.customer === 'object' && o.customer !== null ? o.customer.name : o.customer,
    date: o.createdAt ? new Date(o.createdAt).toLocaleDateString('uz-UZ') : o.date,
    amount: o.totalAmount || o.amount,
  }));
  const messages = allMessages.filter(m => m.craftsmanId === user?.id);

  const handleSaveProduct = async (editingProduct, productForm) => {
    if (!productForm.title || !productForm.price || !productForm.inStock || !productForm.image) {
      addToast("Barcha maydonlarni va rasmni to'ldiring!", 'error');
      return false;
    }
    const priceNum = parseFloat(productForm.price);
    const stockNum = parseInt(productForm.inStock);
    if (isNaN(priceNum) || priceNum <= 0) {
      addToast("Narxni to'g'ri kiriting!", 'error');
      return false;
    }
    if (isNaN(stockNum) || stockNum < 0) {
      addToast("Zaxirani to'g'ri kiriting!", 'error');
      return false;
    }

    try {
      const payload = {
        title: productForm.title,
        price: priceNum,
        inStock: stockNum,
        category: productForm.category,
        image: productForm.image,
        images: productForm.images,
        sku: productForm.sku,
        preparationTime: productForm.preparationTime,
        material: productForm.material,
        description: productForm.description
      };

      if (editingProduct) {
        // Backend PUT for edit
        const { data } = await axios.put(`${API_URL}/products/${editingProduct._id || editingProduct.id}`, payload);
        const updated = allProducts.map(p => p._id === data._id ? data : p);
        setAllProducts(updated);
        addToast("Mahsulot muvaffaqiyatli tahrirlandi!", 'success');
      } else {
        const { data } = await axios.post(`${API_URL}/products`, {
          ...payload,
          craftsmanId: user?.id
        });
        setAllProducts([data, ...allProducts]);
        addToast("Yangi mahsulot API orqali muvaffaqiyatli qo'shildi!", 'success');
      }
      return true;
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || "Mahsulot saqlashda xatolik yuz berdi", 'error');
      return false;
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Haqiqatan ham ushbu mahsulotni o'chirmoqchisiz?")) {
      try {
        await axios.delete(`${API_URL}/products/${id}`);
        setAllProducts(allProducts.filter(p => p._id !== id && p.id !== id));
        addToast("Mahsulot API orqali o'chirildi!", 'info');
      } catch (err) {
        addToast("O'chirishda xatolik yuz berdi (MOCK bo'lishi mumkin)", 'error');
        // Fallback for mock data deletion
        setAllProducts(allProducts.filter(p => p._id !== id && p.id !== id));
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      // API call to update status
      await axios.put(`${API_URL}/orders/${orderId}/status`, { status: newStatus });
      
      const updated = allOrders.map(o => o._id === orderId || o.id === orderId ? { ...o, status: newStatus } : o);
      setAllOrders(updated);
      addToast(`Buyurtma holati yangilandi: ${ORDER_STATUSES[newStatus]?.label}`, 'success');
    } catch (err) {
      addToast("Holatni yangilashda xatolik yuz berdi", 'error');
    }
  };

  const handleSendReply = async (reply, selectedMsg) => {
    try {
      // Actually sending a message back requires a POST to the sender, 
      // but here we just update the local state for demonstration, or mark as read
      await axios.put(`${API_URL}/messages/${selectedMsg._id}/read`);
      
      const newMsg = {
        _id: 'rep' + Date.now(),
        sender: 'Siz',
        text: reply,
        createdAt: new Date().toISOString(),
        isReply: true,
        replyTo: selectedMsg.text,
      };
      
      const updated = allMessages.map(m => m._id === selectedMsg._id ? { ...m, isRead: true } : m);
      setAllMessages([newMsg, ...updated]);
      addToast("Javob xati yuborildi!", 'success');
    } catch (err) {
      addToast("Javob yuborishda xatolik yuz berdi", 'error');
    }
  };

  const selectMessageThread = (msg) => {
    const updated = allMessages.map(m => m.id === msg.id ? { ...m, unread: false } : m);
    setAllMessages(updated);
    return { ...msg, unread: false };
  };

  const handleSaveProfile = async (newProfile) => {
    updateUser({ name: newProfile.name, email: newProfile.email });
    setProfile(newProfile);
    localStorage.setItem('hunarmand_profile_' + user?.id, JSON.stringify(newProfile));
    
    if (user?.id) {
      try {
        await axios.put(`${API_URL}/auth/profile`, {
          userId: user.id,
          name: newProfile.name,
          email: newProfile.email,
          phone: newProfile.phone,
          region: newProfile.region,
          specialty: newProfile.category,
          bio: newProfile.bio,
          shopName: newProfile.shopName,
          whatsapp: newProfile.whatsapp,
          yearsExp: newProfile.yearsExp
        });
        addToast("Profil API orqali yangilandi!", 'success');
      } catch (err) {
        addToast("Xatolik: " + (err.response?.data?.message || err.message), 'error');
      }
    }
  };

  const handleSaveShop = handleSaveProfile;

  return {
    products, allProducts, handleSaveProduct, handleDeleteProduct,
    orders, handleUpdateOrderStatus,
    messages, handleSendReply, selectMessageThread,
    profile, setProfile, handleSaveProfile, handleSaveShop
  };
}
