import { useState } from "react";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import "./Admin.css";

// Hook
import { useAdminData } from "../hooks/useAdminData";

// Components
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminOverview from "../components/admin/AdminOverview";
import AdminUsersList from "../components/admin/AdminUsersList";
import AdminProductsMod from "../components/admin/AdminProductsMod";
import AdminCraftsmen from "../components/admin/AdminCraftsmen";
import AdminOrders from "../components/admin/AdminOrders";
import AdminSettings from "../components/admin/AdminSettings";

export default function AdminPage() {
  const [active, setActive] = useState("overview");

  // Toast notification state
  const [toasts, setToasts] = useState([]);
  const addToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const adminData = useAdminData(addToast);

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

      {/* ── Toasts Container ── */}
      <div className="toasts-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            {t.type === "success" && (
              <CheckCircle2 size={16} color="var(--success)" />
            )}
            {t.type === "error" && (
              <AlertTriangle size={16} color="var(--error)" />
            )}
            {t.type === "info" && (
              <CheckCircle2 size={16} color="var(--info)" />
            )}
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
