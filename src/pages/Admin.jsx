import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, CheckCircle2, ShieldOff } from "lucide-react";
import { toast } from "react-toastify";
import "./Admin.css";

// Hook
import { useAdminData } from "../hooks/useAdminData";
import { useAuthStore } from "../store/useStore";

// Components
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminOverview from "../components/admin/AdminOverview";
import AdminUsersList from "../components/admin/AdminUsersList";
import AdminProductsMod from "../components/admin/AdminProductsMod";
import AdminCraftsmen from "../components/admin/AdminCraftsmen";
import AdminOrders from "../components/admin/AdminOrders";
import AdminSettings from "../components/admin/AdminSettings";

export default function AdminPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [active, setActive] = useState("overview");

  // Toasts via react-toastify
  const addToast = (message, type = "success") => {
    if (type === "success") {
      toast.success(message);
    } else if (type === "error") {
      toast.error(message);
    } else {
      toast.info(message);
    }
  };

  const adminData = useAdminData(addToast);

  // Guard: faqat admin roli bo'lgan foydalanuvchilar kira oladi
  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-primary, #0f0f0f)', gap: '16px'
      }}>
        <ShieldOff size={56} color="#e74c3c" />
        <h2 style={{ color: '#fff', fontSize: '24px', margin: 0 }}>Kirish taqiqlangan</h2>
        <p style={{ color: '#aaa', margin: 0 }}>Bu sahifa faqat Admin uchun mo'ljallangan.</p>
        <button
          onClick={() => navigate('/auth/login')}
          style={{
            marginTop: '8px', padding: '12px 28px', borderRadius: '8px',
            background: '#d4822a', color: '#fff', border: 'none',
            fontSize: '15px', cursor: 'pointer', fontWeight: 600
          }}
        >
          Admin sifatida kirish
        </button>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <AdminSidebar active={active} setActive={setActive} />

      <main className="admin-main">
        {active === "overview" && (
          <AdminOverview
            users={adminData.users}
            products={adminData.products}
            orders={adminData.orders}
            craftsmen={adminData.craftsmen}
          />
        )}

        {active === "users" && (
          <AdminUsersList
            users={adminData.users}
            handleToggleUserStatus={adminData.handleToggleUserStatus}
          />
        )}

        {active === "products" && (
          <AdminProductsMod
            products={adminData.products}
            handleApproveProduct={adminData.handleApproveProduct}
            handleRejectProduct={adminData.handleRejectProduct}
            handleDeleteProduct={adminData.handleDeleteProduct}
          />
        )}

        {active === "craftsmen" && (
          <AdminCraftsmen
            craftsmen={adminData.craftsmen}
            handleVerifyCraftsman={adminData.handleVerifyCraftsman}
          />
        )}

        {active === "orders" && (
          <AdminOrders
            orders={adminData.orders}
            handleUpdateOrderStatus={adminData.handleUpdateOrderStatus}
          />
        )}

        {active === "settings" && (
          <AdminSettings
            settings={adminData.settings}
            handleSaveSettings={adminData.handleSaveSettings}
          />
        )}
      </main>

      {/* Toasts rendered globally via ToastContainer */}
    </div>
  );
}
