import { useState, useEffect } from "react";
import axios from 'axios';
import {
  MOCK_PRODUCTS,
  MOCK_CRAFTSMEN,
  MOCK_USERS,
  ORDER_STATUSES,
  API_URL
} from "../data/constants";

const INITIAL_ORDERS = [];

export function useAdminData(addToast) {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [craftsmen, setCraftsmen] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [uRes, pRes, cRes, oRes] = await Promise.all([
          axios.get(`${API_URL}/auth/users`).catch(() => ({ data: [] })),
          axios.get(`${API_URL}/products`).catch(() => ({ data: [] })),
          axios.get(`${API_URL}/auth/craftsmen`).catch(() => ({ data: [] })),
          axios.get(`${API_URL}/orders`).catch(() => ({ data: [] }))
        ]);
        
        setUsers(uRes.data);
        setProducts(pRes.data);
        setCraftsmen(cRes.data);
        setOrders(oRes.data);
      } catch (err) {
        console.error("Error fetching admin data:", err);
      }
    };
    fetchAdminData();
  }, []);

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
    const newStatus = u.status === 'active' ? 'banned' : 'active';
    try {
      await axios.put(`${API_URL}/auth/users/${userId}/status`, { status: newStatus });
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
      await axios.put(`${API_URL}/products/${prodId}/status`, { status: 'approved' });
      const updated = products.map(p =>
        (p._id === prodId || p.id === prodId) ? { ...p, status: 'approved' } : p
      );
      setProducts(updated);
      const p = products.find(p => p._id === prodId || p.id === prodId);
      addToast(`"${p?.title}" muvaffaqiyatli tasdiqlandi!`, 'success');
    } catch (err) {
      addToast('Mahsulotni tasdiqlashda xatolik', 'error');
    }
  };

  const handleRejectProduct = async (prodId) => {
    const reason = prompt('Rad etish sababini kiriting:');
    if (reason === null) return;
    if (!reason.trim()) { addToast("Rad etish sababi bo'sh bo'lishi mumkin emas!", 'error'); return; }
    try {
      await axios.put(`${API_URL}/products/${prodId}/status`, { status: 'rejected', rejectReason: reason });
      const updated = products.map(p =>
        (p._id === prodId || p.id === prodId) ? { ...p, status: 'rejected', rejectReason: reason } : p
      );
      setProducts(updated);
      const p = products.find(p => p._id === prodId || p.id === prodId);
      addToast(`"${p?.title}" rad etildi. Sababi: ${reason}`, 'info');
    } catch (err) {
      addToast('Rad etishda xatolik', 'error');
    }
  };

  const handleDeleteProduct = async (prodId) => {
    if (window.confirm("Haqiqatan ham ushbu mahsulotni platformadan o'chirmoqchisiz?")) {
      try {
        await axios.delete(`${API_URL}/products/${prodId}`);
        setProducts(products.filter(p => p._id !== prodId && p.id !== prodId));
        addToast("Mahsulot o'chirildi!", 'info');
      } catch (err) {
        addToast("O'chirishda xatolik yuz berdi", 'error');
      }
    }
  };

  const handleVerifyCraftsman = async (craftId) => {
    try {
      await axios.put(`${API_URL}/auth/craftsmen/${craftId}/verify`);
      const updated = craftsmen.map(c =>
        (c._id === craftId || c.id === craftId) ? { ...c, isVerified: true } : c
      );
      setCraftsmen(updated);
      const c = craftsmen.find(c => c._id === craftId || c.id === craftId);
      addToast(`"${c?.name}" muvaffaqiyatli tasdiqlandi!`, 'success');
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
