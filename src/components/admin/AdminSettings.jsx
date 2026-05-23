export default function AdminSettings({ settings, handleSaveSettings }) {
  return (
    <div className="animate-fadeIn">
      <div className="admin-header"><h1>Platform sozlamalari</h1></div>
      <div className="settings-grid" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        
        <form onSubmit={e => {
          e.preventDefault();
          handleSaveSettings(settings, 'Komissiya sozlamalari');
        }} className="admin-card" style={{padding:24}}>
          <h3 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:15,marginBottom:16}}>Komissiya sozlamalari</h3>
          <div className="form-group" style={{marginBottom:12}}>
            <label className="form-label">Standart komissiya (%)</label>
            <input 
              className="form-input" 
              value={settings.commissionStandard} 
              onChange={e => handleSaveSettings({ ...settings, commissionStandard: e.target.value }, 'Komissiya')} 
              required 
            />
          </div>
          <div className="form-group" style={{marginBottom:12}}>
            <label className="form-label">Premium komissiya (%)</label>
            <input 
              className="form-input" 
              value={settings.commissionPremium} 
              onChange={e => handleSaveSettings({ ...settings, commissionPremium: e.target.value }, 'Komissiya')} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary btn-sm">Saqlash</button>
        </form>

        <form onSubmit={e => {
          e.preventDefault();
          handleSaveSettings(settings, 'Yetkazib berish');
        }} className="admin-card" style={{padding:24}}>
          <h3 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:15,marginBottom:16}}>Yetkazib berish</h3>
          <div className="form-group" style={{marginBottom:12}}>
            <label className="form-label">Standart narx (so'm)</label>
            <input 
              className="form-input" 
              value={settings.shippingStandard} 
              onChange={e => handleSaveSettings({ ...settings, shippingStandard: e.target.value }, 'Yetkazib berish')} 
              required 
            />
          </div>
          <div className="form-group" style={{marginBottom:12}}>
            <label className="form-label">Bepul chegara (so'm)</label>
            <input 
              className="form-input" 
              value={settings.shippingFreeLimit} 
              onChange={e => handleSaveSettings({ ...settings, shippingFreeLimit: e.target.value }, 'Yetkazib berish')} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary btn-sm">Saqlash</button>
        </form>

        <form onSubmit={e => {
          e.preventDefault();
          handleSaveSettings(settings, 'Email sozlamalari');
        }} className="admin-card" style={{padding:24}}>
          <h3 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:15,marginBottom:16}}>Email sozlamalari</h3>
          <div className="form-group" style={{marginBottom:12}}>
            <label className="form-label">SMTP server</label>
            <input 
              className="form-input" 
              value={settings.smtpServer} 
              onChange={e => handleSaveSettings({ ...settings, smtpServer: e.target.value }, 'Email')} 
              required 
            />
          </div>
          <div className="form-group" style={{marginBottom:12}}>
            <label className="form-label">Port</label>
            <input 
              className="form-input" 
              value={settings.smtpPort} 
              onChange={e => handleSaveSettings({ ...settings, smtpPort: e.target.value }, 'Email')} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary btn-sm">Saqlash</button>
        </form>

        <form onSubmit={e => {
          e.preventDefault();
          handleSaveSettings(settings, 'SMS xabarnomalar');
        }} className="admin-card" style={{padding:24}}>
          <h3 style={{fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:15,marginBottom:16}}>SMS xabarnomalar</h3>
          <div className="form-group" style={{marginBottom:12}}>
            <label className="form-label">Eskiz API key</label>
            <input 
              className="form-input" 
              type="password" 
              value={settings.smsApiKey} 
              onChange={e => handleSaveSettings({ ...settings, smsApiKey: e.target.value }, 'SMS')} 
              required 
            />
          </div>
          <div className="form-group" style={{marginBottom:12}}>
            <label className="form-label">Sender nomi</label>
            <input 
              className="form-input" 
              value={settings.smsSenderName} 
              onChange={e => handleSaveSettings({ ...settings, smsSenderName: e.target.value }, 'SMS')} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary btn-sm">Saqlash</button>
        </form>

      </div>
    </div>
  );
}
