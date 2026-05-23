import { useState } from 'react';
import { Plus, Eye, Edit2, Trash2, Search } from 'lucide-react';
import { formatPrice } from '../../data/constants';

export default function DashboardProducts({ products, handleDeleteProduct, openAddProduct, openEditProduct }) {
  const [q, setQ] = useState('');

  const filtered = (products || []).filter(p =>
    p.title?.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#111', margin: 0, letterSpacing: '-0.4px' }}>Mahsulotlarim</h1>
        <button className="btn btn-primary" onClick={openAddProduct} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <Plus size={16}/> Mahsulot qo'shish
        </button>
      </div>

      {/* Filters row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div className="dash-search-wrap">
          <Search size={14} className="dash-search-icon"/>
          <input
            type="text"
            className="dash-search-input"
            placeholder="Mahsulot qidirish..."
            value={q}
            onChange={e => setQ(e.target.value)}
          />
        </div>
        <span style={{ fontSize: 13, color: '#888', fontWeight: 500 }}>
          {filtered.length} ta mahsulot
        </span>
      </div>

      {/* Table */}
      <div className="dash-card">
        <div className="dash-table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>MAHSULOT</th>
                <th>KATEGORIYA</th>
                <th>NARX</th>
                <th>ZAXIRA</th>
                <th>SOTUV</th>
                <th>HOLAT</th>
                <th>AMAL</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="dash-empty-state" style={{ padding: '48px 20px' }}>
                      <div className="empty-icon">📦</div>
                      <h3>Mahsulot topilmadi</h3>
                      <p>Hali birorta mahsulot qo'shilmagan.</p>
                      <button className="btn btn-primary" onClick={openAddProduct} style={{ marginTop: 14 }}>
                        Birinchi mahsulotni qo'shish
                      </button>
                    </div>
                  </td>
                </tr>
              ) : filtered.map(p => (
                <tr key={p._id || p.id}>
                  {/* Product name + image */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <img
                        src={p.image || 'https://via.placeholder.com/36'}
                        alt={p.title}
                        style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover', flexShrink: 0, background: '#f5f4f2' }}
                      />
                      <span style={{ fontWeight: 500, color: '#111', fontSize: 13.5 }}>{p.title}</span>
                    </div>
                  </td>
                  {/* Category */}
                  <td>
                    <span style={{
                      background: '#f5f4f2', color: '#666',
                      padding: '3px 10px', borderRadius: 99,
                      fontSize: 12, fontWeight: 500
                    }}>
                      {p.category || '—'}
                    </span>
                  </td>
                  {/* Price */}
                  <td style={{ fontWeight: 600, color: '#111' }}>{formatPrice(p.price)}</td>
                  {/* Stock */}
                  <td>
                    <span style={{
                      background: p.inStock > 5 ? '#dcfce7' : p.inStock > 0 ? '#fef9c3' : '#fee2e2',
                      color: p.inStock > 5 ? '#15803d' : p.inStock > 0 ? '#854d0e' : '#dc2626',
                      padding: '3px 10px', borderRadius: 99,
                      fontSize: 12, fontWeight: 600
                    }}>
                      {p.inStock} ta
                    </span>
                  </td>
                  {/* Sold */}
                  <td style={{ color: '#555', fontWeight: 500 }}>{p.sold || 0}</td>
                  {/* Status */}
                  <td>
                    <span style={{
                      background: p.inStock > 0 ? '#dcfce7' : '#fee2e2',
                      color: p.inStock > 0 ? '#15803d' : '#dc2626',
                      padding: '3px 10px', borderRadius: 99,
                      fontSize: 12, fontWeight: 600
                    }}>
                      {p.inStock > 0 ? 'Aktiv' : 'Tugagan'}
                    </span>
                  </td>
                  {/* Actions */}
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn-icon-only edit" onClick={() => openEditProduct(p)} title="Tahrirlash">
                        <Edit2 size={14}/>
                      </button>
                      <button className="btn-icon-only delete" onClick={() => handleDeleteProduct(p._id || p.id)} title="O'chirish">
                        <Trash2 size={14}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
