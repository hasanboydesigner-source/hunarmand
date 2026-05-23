import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/useStore';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, CheckCircle2, X } from 'lucide-react';
import { FiUser, FiShield } from 'react-icons/fi';
import { GiPaintedPottery } from 'react-icons/gi';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { MOCK_USERS, MOCK_CRAFTSMEN, API_URL } from '../data/constants';
import './Auth.css';

export default function AuthPage() {
  const { t } = useTranslation();
  const [params] = useSearchParams();
  const defaultTab = params.get('tab') === 'register' ? 'register' : 'login';
  const defaultRole = params.get('role') || 'customer';
  const [tab, setTab] = useState(defaultTab);
  const [role, setRole] = useState(defaultRole);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const [loginForm, setLoginForm]     = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name:'', email:'', phone:'', password:'', region:'' });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) { toast.error(t('auth.fill_fields')); return; }
    setLoading(true);
    
    try {
      // ─── Haqiqiy API orqali kirish ───
      const { data } = await axios.post(`${API_URL}/auth/login`, loginForm);
      
      const loggedUser = { id: data._id, name: data.name, email: data.email, role: data.role };
      login(loggedUser, data.token);
      toast.success(`${t('auth.welcome')}, ${data.name}!`);
      
      navigate(data.role === 'admin' ? '/admin' : data.role === 'craftsman' ? '/dashboard?tab=settings' : '/');
    } catch (error) {
      console.error("API xatosi:", error);
      toast.error(error.response?.data?.message || t('auth.login_error') || "Tizimga kirishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!registerForm.name || !registerForm.email || !registerForm.password) { toast.error(t('auth.fill_fields')); return; }
    if (registerForm.password.length < 6) { toast.error(t('auth.pass_length')); return; }
    setLoading(true);
    
    try {
      // ─── Haqiqiy API orqali ro'yxatdan o'tish ───
      const { data } = await axios.post(`${API_URL}/auth/register`, {
        name: registerForm.name,
        email: registerForm.email,
        password: registerForm.password,
        phone: registerForm.phone,
        region: registerForm.region,
        role: role
      });

      const loggedUser = { id: data._id, name: data.name, email: data.email, role: data.role };
      login(loggedUser, data.token);

      toast.success(t('auth.reg_success'));
      navigate(role === 'craftsman' ? '/dashboard?tab=settings' : '/');
    } catch (error) {
      console.error("API xatosi:", error);
      toast.error(error.response?.data?.message || t('auth.reg_error') || "Ro'yxatdan o'tishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page page-with-header">
      <div className="auth-layout">
        {/* Left panel */}
        <div className="auth-visual">
          <div className="auth-visual-content">
            <div className="auth-logo">
              <div className="logo-icon"><span>E</span></div>
              <span className="logo-primary">E-Hunarmand</span>
            </div>
            <h2>{t('auth.title_visual')}</h2>
            <p>{t('auth.desc_visual')}</p>
            <div className="auth-features">
              {[
                t('auth.feat1'),
                t('auth.feat2'),
                t('auth.feat3'),
                t('auth.feat4'),
              ].map(f => (
                <div key={f} className="auth-feature-item">
                  <CheckCircle2 size={16} /> <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="auth-visual-bg">
            <img src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80" alt="Crafts" />
            <div className="auth-visual-overlay" />
          </div>
        </div>

        {/* Right: Form */}
        <div className="auth-form-panel">
          <div className="auth-form-wrap">
            <div className="auth-tabs">
              <button className={`auth-tab ${tab==='login'?'active':''}`} onClick={()=>setTab('login')}>{t('auth.tab_login')}</button>
              <button className={`auth-tab ${tab==='register'?'active':''}`} onClick={()=>setTab('register')}>{t('auth.tab_register')}</button>
            </div>

            {tab === 'login' ? (
              <form className="auth-form animate-fadeIn" onSubmit={handleLogin}>
                <h2>{t('auth.login_title')}</h2>
                <p className="auth-subtitle">{t('auth.login_sub')}</p>

                <div className="form-group">
                  <label className="form-label">{t('auth.email')}</label>
                  <div className="input-icon-wrap">
                    <Mail size={16} className="input-icon"/>
                    <input className="form-input input-with-icon" type="email" placeholder="email@example.com"
                      value={loginForm.email} onChange={e=>setLoginForm({...loginForm,email:e.target.value})}/>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">{t('auth.password')}</label>
                  <div className="input-icon-wrap">
                    <Lock size={16} className="input-icon"/>
                    <input className="form-input input-with-icon" type={showPass?'text':'password'} placeholder={t('auth.password_placeholder')}
                      value={loginForm.password} onChange={e=>setLoginForm({...loginForm,password:e.target.value})}/>
                    <button type="button" className="input-toggle" onClick={()=>setShowPass(!showPass)}>
                      {showPass ? <EyeOff size={15}/> : <Eye size={15}/>}
                    </button>
                  </div>
                </div>

                <div className="auth-options">
                  <label className="remember-me"><input type="checkbox"/> {t('auth.remember')}</label>
                  <button type="button" className="forgot-link" style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', outline: 'none' }} onClick={() => setShowForgotModal(true)}>{t('auth.forgot')}</button>
                </div>

                <button className="btn btn-primary btn-lg auth-submit" type="submit" disabled={loading}>
                  {loading ? <span className="spinner"/> : t('auth.login_btn')}
                </button>

                <div className="auth-divider"><span>{t('auth.or')}</span></div>

                <div className="social-logins">
                  <button type="button" className="social-btn google">
                    <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
                    {t('auth.google')}
                  </button>
                </div>

                <p className="auth-switch">
                  {t('auth.no_account')} <button type="button" onClick={()=>setTab('register')}>{t('auth.register_link')}</button>
                </p>

              </form>
            ) : (
              <form className="auth-form animate-fadeIn" onSubmit={handleRegister}>
                <h2>{t('auth.reg_title')}</h2>
                <p className="auth-subtitle">{t('auth.reg_sub')}</p>

                {/* Role selector */}
                <div className="role-selector">
                  <button type="button" className={`role-btn ${role==='customer'?'active':''}`} onClick={()=>setRole('customer')}>
                    <span className="role-icon"><FiUser size={28} /></span><strong>{t('auth.role_buyer')}</strong><span>{t('auth.role_buyer_desc')}</span>
                  </button>
                  <button type="button" className={`role-btn ${role==='craftsman'?'active':''}`} onClick={()=>setRole('craftsman')}>
                    <span className="role-icon"><GiPaintedPottery size={28} /></span><strong>{t('auth.role_craftsman')}</strong><span>{t('auth.role_craftsman_desc')}</span>
                  </button>
                </div>

                <div className="form-group">
                  <label className="form-label">{t('auth.fullname')}</label>
                  <div className="input-icon-wrap">
                    <User size={16} className="input-icon"/>
                    <input className="form-input input-with-icon" placeholder=""
                      value={registerForm.name} onChange={e=>setRegisterForm({...registerForm,name:e.target.value})}/>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">{t('auth.email')}</label>
                  <div className="input-icon-wrap">
                    <Mail size={16} className="input-icon"/>
                    <input className="form-input input-with-icon" type="email" placeholder="email@example.com"
                      value={registerForm.email} onChange={e=>setRegisterForm({...registerForm,email:e.target.value})}/>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">{t('auth.phone')}</label>
                  <div className="input-icon-wrap">
                    <Phone size={16} className="input-icon"/>
                    <input className="form-input input-with-icon" placeholder="+998 XX XXX XX XX"
                      value={registerForm.phone} onChange={e=>setRegisterForm({...registerForm,phone:e.target.value})}/>
                  </div>
                </div>
                {role==='craftsman' && (
                  <div className="form-group">
                    <label className="form-label">{t('auth.region')}</label>
                    <div className="input-icon-wrap">
                      <MapPin size={16} className="input-icon"/>
                      <select className="form-input form-select input-with-icon"
                        value={registerForm.region} onChange={e=>setRegisterForm({...registerForm,region:e.target.value})}>
                        <option value="">{t('auth.select')}</option>
                        {['Toshkent','Samarqand','Buxoro','Namangan','Andijon'].map(r=><option key={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">{t('auth.password')}</label>
                  <div className="input-icon-wrap">
                    <Lock size={16} className="input-icon"/>
                    <input className="form-input input-with-icon" type={showPass?'text':'password'} placeholder={t('auth.reg_pass_placeholder')}
                      value={registerForm.password} onChange={e=>setRegisterForm({...registerForm,password:e.target.value})}/>
                    <button type="button" className="input-toggle" onClick={()=>setShowPass(!showPass)}>
                      {showPass ? <EyeOff size={15}/> : <Eye size={15}/>}
                    </button>
                  </div>
                </div>

                <button className="btn btn-primary btn-lg auth-submit" type="submit" disabled={loading}>
                  {loading ? <span className="spinner"/> : t('auth.reg_btn')}
                </button>

                <p className="auth-terms">{t('auth.terms1')} <Link to="/terms">{t('auth.terms2')}</Link> {t('auth.terms3')} <Link to="/privacy">{t('auth.terms4')}</Link>{t('auth.terms5')}</p>
                <p className="auth-switch">
                  {t('auth.have_account')} <button type="button" onClick={()=>setTab('login')}>{t('auth.login_link')}</button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
      
      {showForgotModal && (
        <div className="modal-overlay" onClick={() => setShowForgotModal(false)}>
          <div className="modal-content animate-scaleIn" style={{ maxWidth: 400, padding: 24 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header" style={{ marginBottom: 16 }}>
              <h3 style={{ fontSize: 20, margin: 0, fontFamily: 'Inter, sans-serif' }}>{t('auth.reset_title')}</h3>
              <button className="modal-close" onClick={() => setShowForgotModal(false)}><X size={20}/></button>
            </div>
            <div className="modal-body">
              <p style={{marginBottom: 20, color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.5}}>
                {t('auth.reset_desc')}
              </p>
              <div className="form-group" style={{ marginBottom: 20 }}>
                <label className="form-label">{t('auth.email')}</label>
                <div className="input-icon-wrap">
                  <Mail size={16} className="input-icon"/>
                  <input className="form-input input-with-icon" type="email" placeholder="email@example.com"
                    value={forgotEmail} onChange={e=>setForgotEmail(e.target.value)}/>
                </div>
              </div>
              <button 
                className="btn btn-primary" 
                style={{width: '100%', justifyContent: 'center'}}
                onClick={() => {
                  if(!forgotEmail) { toast.error(t('auth.enter_email')); return; }
                  if(!forgotEmail.includes('@')) { toast.error(t('auth.invalid_email')); return; }
                  toast.success(t('auth.reset_sent'));
                  setShowForgotModal(false);
                  setForgotEmail('');
                }}
              >
                {t('auth.send')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
