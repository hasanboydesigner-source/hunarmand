import { useState } from 'react';
import { CheckCircle2, XCircle, Trash2 } from 'lucide-react';
import { formatPrice } from '../../data/constants';

export default function AdminProductsMod({ products, handleApproveProduct, handleRejectProduct, handleDeleteProduct }) {
  const [productSearchQ, setProductSearchQ] = useState('');

  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(productSearchQ.toLowerCase())
  );

  return (
    <div className="animate-fadeIn">
      <div className="admin-header"><h1>Mahsulotlar moderatsiyasi</h1></div>
      <div className="admin-card">
        <div className="admin-card-toolbar">
          <input
            className="form-input"
            placeholder="Mahsulot nomini qidirish..."
            style={{maxWidth:280}}
            value={productSearchQ}
            onChange={e => setProductSearchQ(e.target.value)}
          />
        </div>
        <table className="table">
          <thead><tr><th>Mahsulot</th><th>Hunarmand</th><th>Narx</th><th>Holat</th><th>Amal</th></tr></thead>
          <tbody>
            {filteredProducts.length === 0 ? (
              <tr><td colSpan={5} style={{textAlign:'center',padding:40,color:'var(--text-muted)'}}>Mahsulot topilmadi</td></tr>
            ) : filteredProducts.map(p=>(
              <tr key={p.id}>
                <td><div className="product-cell"><img src={p.image} alt={p.title} className="product-cell-img"/>{p.title}</div></td>
                <td>{p.craftsman?.name || 'Noma\'lum'}</td>
                <td>{formatPrice(p.price)}</td>
                <td>
                  <span className={`badge ${p.status === 'rejected' ? 'badge-error' : 'badge-success'}`}>
                    {p.status === 'rejected' ? 'Rad etilgan' : 'Tasdiqlangan'}
                  </span>
                </td>
                <td>
                  <div className="action-btns">
                    <button className="btn btn-ghost btn-sm" onClick={() => handleApproveProduct(p.id)} title="Tasdiqlash"><CheckCircle2 size={13} color="var(--success)"/></button>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleRejectProduct(p.id)} title="Rad etish"><XCircle size={13} color="var(--error)"/></button>
                    <button className="btn btn-ghost btn-sm" onClick={() => handleDeleteProduct(p.id)} title="O'chirish"><Trash2 size={13} color="var(--error)"/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
