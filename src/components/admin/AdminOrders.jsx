import { useState } from 'react';
import { XCircle } from 'lucide-react';
import { createPortal } from 'react-dom';
import { formatPrice, ORDER_STATUSES } from '../../data/constants';

export default function AdminOrders({ orders, handleUpdateOrderStatus }) {
  const [orderSearchQ, setOrderSearchQ] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.product.toLowerCase().includes(orderSearchQ.toLowerCase()) || o.customer.toLowerCase().includes(orderSearchQ.toLowerCase()) || o.id.toLowerCase().includes(orderSearchQ.toLowerCase());
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="animate-fadeIn">
      <div className="admin-header">
        <h1>Buyurtmalar boshqaruvi</h1>
        <span className="dash-count">{filteredOrders.length} ta buyurtma</span>
      </div>
      <div className="admin-card">
        <div className="admin-card-toolbar">
          <input
            className="form-input"
            placeholder="Buyurtma yoki mijozni qidirish..."
            style={{maxWidth:280}}
            value={orderSearchQ}
            onChange={e => setOrderSearchQ(e.target.value)}
          />
          <select
            className="form-input form-select"
            style={{width:'auto'}}
            value={orderStatusFilter}
            onChange={e => setOrderStatusFilter(e.target.value)}
          >
            <option value="all">Barcha holatlar</option>
            {Object.entries(ORDER_STATUSES).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Mijoz</th>
              <th>Mahsulot</th>
              <th>Sana</th>
              <th>Holat</th>
              <th>Summa</th>
              <th>Amal</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr><td colSpan={7} style={{textAlign:'center',padding:40,color:'var(--text-muted)'}}>Sorov bo'yicha buyurtma topilmadi</td></tr>
            ) : filteredOrders.map(o => (
              <tr key={o.id}>
                <td className="order-id">{o.id}</td>
                <td><strong>{o.customer}</strong></td>
                <td>{o.product}</td>
                <td>{o.date}</td>
                <td>
                  <span className={`status-badge status-${o.status}`}>
                    {ORDER_STATUSES[o.status]?.label || o.status}
                  </span>
                </td>
                <td><strong>{formatPrice(o.amount)}</strong></td>
                <td>
                  <div className="action-btns">
                    <button className="btn btn-secondary btn-sm" onClick={() => { setSelectedOrder(o); setShowOrderModal(true); }}>Ko'rish</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Order Detail Modal ── */}
      {showOrderModal && selectedOrder && createPortal(
        <div className="admin-modal-overlay" onClick={() => setShowOrderModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Buyurtma tafsilotlari - {selectedOrder.id}</h3>
              <button className="admin-modal-close" onClick={() => setShowOrderModal(false)}><XCircle size={18}/></button>
            </div>
            <div className="admin-modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                  <div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Mijoz</span>
                    <p style={{ fontWeight: 600, fontSize: 14 }}>{selectedOrder.customer}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sana</span>
                    <p style={{ fontWeight: 600, fontSize: 14 }}>{selectedOrder.date}</p>
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Mahsulot</span>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>{selectedOrder.product}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', borderBottom: '1px solid var(--border-light)', paddingBottom: '12px' }}>
                  <div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Summa</span>
                    <p style={{ fontWeight: 800, fontSize: 16, color: 'var(--brand-600)' }}>{formatPrice(selectedOrder.amount)}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Joriy Holat</span>
                    <div style={{ marginTop: 4 }}>
                      <span className={`status-badge status-${selectedOrder.status}`}>
                        {ORDER_STATUSES[selectedOrder.status]?.label || selectedOrder.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: '8px' }}>Holatni yangilash:</span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {Object.entries(ORDER_STATUSES).map(([key, val]) => (
                      <button
                        key={key}
                        type="button"
                        className={`order-filter-btn ${selectedOrder.status === key ? 'active' : ''}`}
                        onClick={() => {
                          handleUpdateOrderStatus(selectedOrder.id, key);
                          setSelectedOrder(prev => ({ ...prev, status: key }));
                        }}
                      >
                        {val.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="btn btn-primary btn-sm" onClick={() => setShowOrderModal(false)}>Yopish</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
