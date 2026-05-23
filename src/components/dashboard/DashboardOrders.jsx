import { useState } from 'react';
import { Eye, RefreshCw, Truck, CheckCircle2, XCircle, Clock, RotateCcw } from 'lucide-react';
import { formatPrice, ORDER_STATUSES } from '../../data/constants';

const FILTERS = [
  { key: 'all',        label: 'Barchasi' },
  { key: 'pending',    label: 'Kutilmoqda' },
  { key: 'processing', label: 'Jarayonda' },
  { key: 'shipped',    label: 'Yuborildi' },
  { key: 'delivered',  label: 'Yetkazildi' },
  { key: 'cancelled',  label: 'Bekor qilindi' },
  { key: 'returned',   label: 'Qaytarildi' },
];

const STATUS_META = {
  pending:    { bg: '#fef9c3', color: '#854d0e', label: 'Kutilmoqda',    icon: <Clock size={12}/> },
  processing: { bg: '#dbeafe', color: '#1e40af', label: 'Jarayonda',     icon: <RefreshCw size={12}/> },
  shipped:    { bg: '#ede9fe', color: '#5b21b6', label: 'Yuborildi',     icon: <Truck size={12}/> },
  delivered:  { bg: '#dcfce7', color: '#15803d', label: 'Yetkazildi',    icon: <CheckCircle2 size={12}/> },
  cancelled:  { bg: '#fee2e2', color: '#dc2626', label: 'Bekor qilindi', icon: <XCircle size={12}/> },
  returned:   { bg: '#f3f4f6', color: '#374151', label: 'Qaytarildi',    icon: <RotateCcw size={12}/> },
};

export default function DashboardOrders({ orders, openOrderDetails }) {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? (orders || [])
    : (orders || []).filter(o => o.status === filter);

  const countByStatus = (key) =>
    key === 'all' ? (orders || []).length : (orders || []).filter(o => o.status === key).length;

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#111', margin: 0, letterSpacing: '-0.4px' }}>Buyurtmalar</h1>
        <span style={{ fontSize: 13, color: '#888', fontWeight: 500 }}>
          {orders?.length || 0} ta buyurtma
        </span>
      </div>

      {/* Filter pills */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: '6px 14px', borderRadius: 99, fontSize: 13, fontWeight: 500,
              border: '1.5px solid',
              borderColor: filter === f.key ? '#c97a22' : '#e5e7eb',
              background: filter === f.key ? '#c97a22' : '#fff',
              color: filter === f.key ? '#fff' : '#555',
              cursor: 'pointer', transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            {f.label}
            <span style={{
              background: filter === f.key ? 'rgba(255,255,255,0.25)' : '#f3f4f6',
              color: filter === f.key ? '#fff' : '#888',
              borderRadius: 99, fontSize: 11, fontWeight: 700,
              padding: '1px 6px', minWidth: 18, textAlign: 'center',
            }}>
              {countByStatus(f.key)}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="dash-card">
        <div className="dash-table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>MAHSULOT</th>
                <th>MIJOZ</th>
                <th>SANA</th>
                <th>HOLAT</th>
                <th>SUMMA</th>
                <th>AMAL</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="dash-empty-state" style={{ padding: '40px 20px', border: 'none', background: 'transparent' }}>
                      <div className="empty-icon">🧾</div>
                      <p style={{ color: '#aaa', fontSize: 14 }}>Bu holat bo'yicha buyurtmalar topilmadi.</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.map(o => {
                const st = STATUS_META[o.status] || STATUS_META.pending;
                return (
                  <tr key={o._id || o.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: 12.5, color: '#666', fontWeight: 600 }}>{o.id || o.orderNumber}</td>
                    <td style={{ fontWeight: 500, color: '#111' }}>{o.product || (o.items && o.items[0]?.title)}</td>
                    <td style={{ color: '#555' }}>{typeof o.customer === 'object' ? o.customer?.name : o.customer}</td>
                    <td style={{ color: '#888', fontSize: 13 }}>{o.date || (o.createdAt ? new Date(o.createdAt).toLocaleDateString('uz-UZ') : '')}</td>
                    <td>
                      <span style={{
                        background: st.bg, color: st.color,
                        padding: '4px 10px', borderRadius: 99,
                        fontSize: 12, fontWeight: 600,
                        display: 'inline-flex', alignItems: 'center', gap: 5
                      }}>
                        {st.icon} {st.label}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, color: '#111' }}>{formatPrice(o.amount || o.totalAmount)}</td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => openOrderDetails(o)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12 }}
                      >
                        Ko'rish
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
