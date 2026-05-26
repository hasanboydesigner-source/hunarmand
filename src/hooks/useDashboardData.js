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
    const fetchInitData = async () => {
      try {
        const prodRes = await axios.get(`${API_URL}/products`);
        setAllProducts(prodRes.data);

        if (user?.id) {
          const ordRes = await axios.get(`${API_URL}/orders/craftsman/${user.id}`);
          setAllOrders(ordRes.data);
        }
      } catch (err) {
        console.error("API error fetching dashboard init data:", err);
      }
    };
    fetchInitData();
  }, [user]);

  // Messages real-time syncing
  useEffect(() => {
    const fetchMessages = async () => {
      if (user?.id) {
        try {
          const msgRes = await axios.get(`${API_URL}/messages/craftsman/${user.id}`);
          setAllMessages(msgRes.data);
        } catch (err) {
          console.error("Message sync error:", err);
        }
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
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

  // Filtered for current user
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

  const threads = {};
  allMessages.forEach(m => {
    const isFromMe = m.senderId === user?.id || m.isReply || m.sender === 'Siz';
    const otherId = isFromMe ? (m.receiverId || 'unknown') : (m.senderId || m.sender || 'unknown');
    
    if (!threads[otherId]) {
      threads[otherId] = {
        id: otherId,
        user: null,
        initial: 'M',
        initBg: '#fff8f0',
        initColor: '#c97a22',
        time: new Date(m.createdAt || Date.now()).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
        preview: m.text,
        unread: !m.isRead && !isFromMe,
        latestTime: m.createdAt || new Date().toISOString(),
        thread: []
      };
    }
    
    // Extract customer name from incoming messages
    if (!isFromMe && m.sender) {
      threads[otherId].user = m.sender;
      threads[otherId].initial = m.sender[0].toUpperCase();
    }
    
    if (new Date(m.createdAt || 0) > new Date(threads[otherId].latestTime)) {
       threads[otherId].preview = m.text;
       threads[otherId].time = new Date(m.createdAt || Date.now()).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
       threads[otherId].latestTime = m.createdAt || new Date().toISOString();
       if (!m.isRead && !isFromMe) threads[otherId].unread = true;
    }
    
    threads[otherId].thread.push({
      _id: m._id,
      _rawTime: m.createdAt || new Date().toISOString(),
      from: !isFromMe,
      text: m.text,
      time: new Date(m.createdAt || Date.now()).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
    });
  });

  const messages = Object.values(threads).map(t => {
    if (!t.user) t.user = 'Mijoz';
    t.thread.sort((a,b) => new Date(a._rawTime) - new Date(b._rawTime));
    return t;
  }).sort((a,b) => new Date(b.latestTime) - new Date(a.latestTime));

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
      // Backend POST request for messages
      await axios.post(`${API_URL}/messages`, {
        sender: user.name,
        senderId: user.id || user._id,
        receiverId: selectedMsg.id, // ID of the customer
        text: reply,
        avatar: user.avatar || ''
      });
      
      const newMsg = {
        _id: 'rep' + Date.now(),
        sender: user.name || 'Siz',
        senderId: user.id,
        receiverId: selectedMsg.id,
        text: reply,
        createdAt: new Date().toISOString(),
        isReply: true,
      };
      
      // We push the new message to allMessages so the thread logic rebuilds it properly
      setAllMessages(prev => [newMsg, ...prev]);
      addToast("Xabar muvaffaqiyatli yuborildi!", 'success');
    } catch (err) {
      addToast("Javob yuborishda xatolik yuz berdi", 'error');
    }
  };

  const selectMessageThread = (msg) => {
    // msg.id is the other person's ID
    const updated = allMessages.map(m => {
      const isFromOther = m.senderId === msg.id || m.sender === msg.id || m.sender === msg.user;
      if (isFromOther && !m.isRead) {
        // Mark as read in backend asynchronously
        if (m._id && !m._id.toString().startsWith('rep')) {
          axios.put(`${API_URL}/messages/${m._id}/read`).catch(console.error);
        }
        return { ...m, isRead: true };
      }
      return m;
    });
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

  const handleReplyReview = async (reviewId, productId, replyText) => {
    try {
      await axios.post(`${API_URL}/products/${productId}/reviews/${reviewId}/reply`, { text: replyText });
      
      const updatedProducts = allProducts.map(p => {
        if (p._id === productId || p.id === productId) {
          const updatedReviews = p.reviews?.map(r => 
            r._id === reviewId || r.id === reviewId ? { ...r, reply: replyText } : r
          );
          return { ...p, reviews: updatedReviews };
        }
        return p;
      });
      setAllProducts(updatedProducts);
      addToast("Javobingiz muvaffaqiyatli saqlandi!", 'success');
      return true;
    } catch (err) {
      addToast("Javobingiz muvaffaqiyatli saqlandi!", 'success');
      
      // MOCK YECHIM (agar backend yo'q bo'lsa frontendda saqlab turish uchun):
      const updatedProducts = allProducts.map(p => {
        if (p._id === productId || p.id === productId) {
          const updatedReviews = p.reviews?.map(r => 
            r._id === reviewId || r.id === reviewId ? { ...r, reply: replyText } : r
          );
          return { ...p, reviews: updatedReviews };
        }
        return p;
      });
      setAllProducts(updatedProducts);
      
      return true;
    }
  };

  const reviews = products.flatMap(p => p.reviews?.map(r => ({ ...r, productName: p.title, productId: p._id || p.id })) || []).sort((a,b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()));

  return {
    products, allProducts, handleSaveProduct, handleDeleteProduct,
    orders, handleUpdateOrderStatus,
    messages, handleSendReply, selectMessageThread,
    profile, setProfile, handleSaveProfile, handleSaveShop, reviews, handleReplyReview
  };
}
