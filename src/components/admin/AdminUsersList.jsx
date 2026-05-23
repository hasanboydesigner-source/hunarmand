import { useState } from 'react';
import { Eye, XCircle } from 'lucide-react';
import { createPortal } from 'react-dom';

export default function AdminUsersList({ users, handleToggleUserStatus }) {
  const [userSearchQ, setUserSearchQ] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(userSearchQ.toLowerCase()) || u.email.toLowerCase().includes(userSearchQ.toLowerCase());
    const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    return matchesSearch && matchesRole;
  });

  const openUserDetail = (u) => {
    setSelectedUser(u);
    setShowUserModal(true);
  };

  return (
    <div className="animate-fadeIn">
      <div className="admin-header"><h1>Foydalanuvchilar</h1></div>
      <div className="admin-card">
        <div className="admin-card-toolbar">
          <input
            className="form-input"
            placeholder="Ism yoki email bo'yicha qidirish..."
            style={{maxWidth:280}}
            value={userSearchQ}
            onChange={e => setUserSearchQ(e.target.value)}
          />
          <select
            className="form-input form-select"
            style={{width:'auto'}}
            value={userRoleFilter}
            onChange={e => setUserRoleFilter(e.target.value)}
          >
            <option value="all">Barchasi</option>
            <option value="customer">Mijoz</option>
            <option value="craftsman">Hunarmand</option>
          </select>
        </div>
        <table className="table">
          <thead><tr><th>Ism</th><th>Email</th><th>Rol</th><th>Holat</th><th>Qo'shilgan</th><th>Amal</th></tr></thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr><td colSpan={6} style={{textAlign:'center',padding:40,color:'var(--text-muted)'}}>Foydalanuvchi topilmadi</td></tr>
            ) : filteredUsers.map(u=>(
              <tr key={u.id}>
                <td><div style={{display:'flex',alignItems:'center',gap:8}}><div className="avatar avatar-sm">{u.name[0]}</div><strong>{u.name}</strong></div></td>
                <td>{u.email}</td>
                <td><span className={`badge ${u.role==='craftsman'?'badge-brand':'badge-info'}`}>{u.role==='craftsman'?'Hunarmand':'Mijoz'}</span></td>
                <td><span className={`badge ${u.status==='active'?'badge-success':'badge-error'}`}>{u.status==='active'?'Aktiv':'Bloklangan'}</span></td>
                <td>{u.joined}</td>
                <td>
                  <div className="action-btns">
                    <button className="btn btn-ghost btn-sm" onClick={() => openUserDetail(u)}><Eye size={13}/></button>
                    <button className="btn btn-ghost btn-sm" style={{color: u.status === 'active' ? 'var(--error)' : 'var(--success)'}} onClick={() => handleToggleUserStatus(u.id)}>
                      <XCircle size={13}/>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── User Detail Modal ── */}
      {showUserModal && selectedUser && createPortal(
        <div className="admin-modal-overlay" onClick={() => setShowUserModal(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Foydalanuvchi ma'lumotlari</h3>
              <button className="admin-modal-close" onClick={() => setShowUserModal(false)}><XCircle size={18}/></button>
            </div>
            <div className="admin-modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="avatar avatar-md" style={{ width: 50, height: 50, fontSize: 20, display:'flex', alignItems:'center', justifyContent:'center', background:'var(--bg-secondary)', borderRadius:'50%' }}>{selectedUser.name[0]}</div>
                  <div>
                    <strong style={{ fontSize: 16 }}>{selectedUser.name}</strong>
                    <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>ID: {selectedUser.id}</p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
                  <div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Email</span>
                    <p style={{ fontWeight: 600, fontSize: 14 }}>{selectedUser.email}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Rol</span>
                    <p style={{ marginTop: 2 }}><span className={`badge ${selectedUser.role==='craftsman'?'badge-brand':'badge-info'}`}>{selectedUser.role==='craftsman'?'Hunarmand':'Mijoz'}</span></p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
                  <div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Holat</span>
                    <p style={{ marginTop: 2 }}><span className={`badge ${selectedUser.status==='active'?'badge-success':'badge-error'}`}>{selectedUser.status==='active'?'Faol':'Bloklangan'}</span></p>
                  </div>
                  <div>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Qo'shilgan sana</span>
                    <p style={{ fontWeight: 600, fontSize: 14 }}>{selectedUser.joined}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="admin-modal-footer">
              <button className="btn btn-secondary btn-sm" onClick={() => setShowUserModal(false)}>Yopish</button>
              <button className={`btn btn-${selectedUser.status === 'active' ? 'error' : 'success'} btn-sm`} onClick={() => { handleToggleUserStatus(selectedUser.id); setShowUserModal(false); }}>
                {selectedUser.status === 'active' ? 'Bloklash' : 'Blokdan chiqarish'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
