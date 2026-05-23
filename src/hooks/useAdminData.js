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

  const handleToggleUserStatus = (userId) => {
    const updated = users.map((u) => {
      if (u.id === userId) {
        const newStatus = u.status === "active" ? "banned" : "active";
        addToast(
          newStatus === "banned"
            ? `${u.name} bloklandi!`
            : `${u.name} blokdan chiqarildi!`,
          newStatus === "banned" ? "error" : "success",
        );
        return { ...u, status: newStatus };
      }
      return u;
    });
    setUsers(updated);
    localStorage.setItem("hunarmand_users", JSON.stringify(updated));
  };

  const handleApproveProduct = (prodId) => {
    const updated = products.map((p) => {
      if (p.id === prodId) {
        addToast(`"${p.title}" muvaffaqiyatli tasdiqlandi!`, "success");
        return { ...p, status: "approved" };
      }
      return p;
    });
    setProducts(updated);
    localStorage.setItem("hunarmand_products", JSON.stringify(updated));
  };

  const handleRejectProduct = (prodId) => {
    const reason = prompt("Rad etish sababini kiriting:");
    if (reason === null) return;
    if (!reason.trim()) {
      addToast("Rad etish sababi bo'sh bo'lishi mumkin emas!", "error");
      return;
    }
    const updated = products.map((p) => {
      if (p.id === prodId) {
        addToast(`"${p.title}" rad etildi. Sababi: ${reason}`, "info");
        return { ...p, status: "rejected", rejectReason: reason };
      }
      return p;
    });
    setProducts(updated);
    localStorage.setItem("hunarmand_products", JSON.stringify(updated));
  };

  const handleDeleteProduct = (prodId) => {
    if (
      window.confirm(
        "Haqiqatan ham ushbu mahsulotni platformadan o'chirmoqchisiz?",
      )
    ) {
      const updated = products.filter((p) => p.id !== prodId);
      setProducts(updated);
      localStorage.setItem("hunarmand_products", JSON.stringify(updated));
      addToast("Mahsulot o'chirildi!", "info");
    }
  };

  const handleVerifyCraftsman = (craftId) => {
    const updated = craftsmen.map((c) => {
      if (c.id === craftId) {
        addToast(`"${c.name}" muvaffaqiyatli tasdiqlandi!`, "success");
        return { ...c, isVerified: true };
      }
      return c;
    });
    setCraftsmen(updated);
    localStorage.setItem("hunarmand_craftsmen", JSON.stringify(updated));
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
