import { useState, useEffect } from "react";
import axios from 'axios';
import {
  MOCK_PRODUCTS,
  MOCK_CRAFTSMEN,
  MOCK_USERS,
  ORDER_STATUSES,
  API_URL
} from "../data/constants";

import { useAuthStore } from "../store/useStore";

const INITIAL_ORDERS = [];

export function useAdminData(addToast) {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [craftsmen, setCraftsmen] = useState([]);
  const [orders, setOrders] = useState([]);
  
  const token = useAuthStore((state) => state.token);
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    const fetchAdminData = async () => {
      if (!token) return;
      try {
        const [uRes, pRes, oRes] = await Promise.all([
          axios.get(`${API_URL}/admin/users`, config).catch(() => ({ data: [] })),
          axios.get(`${API_URL}/admin/products`, config).catch(() => ({ data: [] })),
          axios.get(`${API_URL}/orders`, config).catch(() => ({ data: [] }))
        ]);
        
        setUsers(uRes.data);
        setProducts(pRes.data);
        // Extract craftsmen from users for the Craftsmen tab
        setCraftsmen(uRes.data.filter(u => u.role === 'craftsman'));
        setOrders(oRes.data);
      } catch (err) {
        console.error("Error fetching admin data:", err);
      }
    };
    fetchAdminData();
  }, [token]);

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("hunarmand_admin_settings");
    return saved
      ? JSON.parse(saved)
      : {
          commissionStandard: "8",
          commissionPremium: "5",
          shippingStandard: "30000",
          shippingFreeLimit: "500000",
          smtpServer: "smtp.gmail.com",
          smtpPort: "587",
          smsApiKey: "****",
          smsSenderName: "HUNARMAND",
        };
  });

  const handleToggleUserStatus = async (userId) => {
    const u = users.find(u => u._id === userId || u.id === userId);
    if (!u) return;
    try {
      await axios.put(`${API_URL}/admin/users/${userId}/status`, {}, config);
      const newStatus = u.status === 'active' ? 'banned' : 'active';
      const updated = users.map(usr =>
        (usr._id === userId || usr.id === userId) ? { ...usr, status: newStatus } : usr
      );
      setUsers(updated);
      addToast(
        newStatus === 'banned' ? `${u.name} bloklandi!` : `${u.name} blokdan chiqarildi!`,
        newStatus === 'banned' ? 'error' : 'success'
      );
    } catch (err) {
      addToast('Foydalanuvchi holatini yangilashda xatolik', 'error');
    }
  };

  const handleApproveProduct = async (prodId) => {
    try {
      // Assuming we have this endpoint in the product routes or we can just use regular PUT /products/:id
      // but let's just use the regular PUT for products or we could add it to admin routes
      addToast(`Mahsulotni tasdiqlash hozircha qo'shilmagan (Barchasi avtomatik tasdiqlanadi)`, 'info');
    } catch (err) {
      addToast('Mahsulotni tasdiqlashda xatolik', 'error');
    }
  };

  const handleRejectProduct = async (prodId) => {
    addToast(`Mahsulotni rad etish hozircha qo'shilmagan`, 'info');
  };

  const handleDeleteProduct = async (prodId) => {
    if (window.confirm("Haqiqatan ham ushbu mahsulotni platformadan o'chirmoqchisiz?")) {
      try {
        await axios.delete(`${API_URL}/admin/products/${prodId}`, config);
        setProducts(products.filter(p => p._id !== prodId && p.id !== prodId));
        addToast("Mahsulot o'chirildi!", 'info');
      } catch (err) {
        addToast("O'chirishda xatolik yuz berdi", 'error');
      }
    }
  };

  const handleVerifyCraftsman = async (craftId) => {
    try {
      await axios.put(`${API_URL}/admin/users/${craftId}/verify`, {}, config);
      
      // Update both craftsmen and users array
      const c = craftsmen.find(c => c._id === craftId || c.id === craftId);
      const isVerifiedNow = !c.isVerified;
      
      const updatedCraftsmen = craftsmen.map(cr =>
        (cr._id === craftId || cr.id === craftId) ? { ...cr, isVerified: isVerifiedNow } : cr
      );
      setCraftsmen(updatedCraftsmen);
      
      const updatedUsers = users.map(u => 
        (u._id === craftId || u.id === craftId) ? { ...u, isVerified: isVerifiedNow } : u
      );
      setUsers(updatedUsers);
      
      addToast(`"${c?.name}" sertifikati o'zgartirildi!`, 'success');
    } catch (err) {
      addToast('Hunarmandni tasdiqlashda xatolik', 'error');
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`${API_URL}/orders/${orderId}/status`, { status: newStatus });
      const updated = orders.map((o) =>
        o._id === orderId || o.id === orderId ? { ...o, status: newStatus } : o,
      );
      setOrders(updated);
      addToast(
        `Buyurtma holati yangilandi: ${ORDER_STATUSES[newStatus]?.label}`,
        "success",
      );
    } catch(err) {
      addToast("Xatolik yuz berdi", "error");
    }
  };

  const handleSaveSettings = (newSettings, section) => {
    setSettings(newSettings);
    localStorage.setItem(
      "hunarmand_admin_settings",
      JSON.stringify(newSettings),
    );
    addToast(`"${section}" muvaffaqiyatli saqlandi!`, "success");
  };

  return {
    users,
    handleToggleUserStatus,
    products,
    handleApproveProduct,
    handleRejectProduct,
    handleDeleteProduct,
    craftsmen,
    handleVerifyCraftsman,
    orders,
    handleUpdateOrderStatus,
    settings,
    handleSaveSettings,
  };
}
