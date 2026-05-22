import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/useStore';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin, CheckCircle2 } from 'lucide-react';
import { FiUser, FiShield } from 'react-icons/fi';
import { GiPaintedPottery } from 'react-icons/gi';
import './Auth.css';

export default function AuthPage() {
  const [params] = useSearchParams();
  const defaultTab = params.get('tab') === 'register' ? 'register' : 'login';
  const defaultRole = params.get('role') || 'customer';
  const [tab, setTab] = useState(defaultTab);
  const [role, setRole] = useState(defaultRole);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const [loginForm, setLoginForm]     = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name:'', email:'', phone:'', password:'', region:'' });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) { toast.error("Barcha maydonlarni to'ldiring"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    // Mock login — in real app, call API
    const mockUser = { id:'u1', name:'Demo Foydalanuvchi', email: loginForm.email, role: loginForm.email.includes('admin')?'admin': loginForm.email.includes('craft')?'craftsman':'customer' };
    login(mockUser, 'mock-jwt-token');
    toast.success(`Xush kelibsiz, ${mockUser.name}!`);
    setLoading(false);
    navigate(mockUser.role === 'admin' ? '/admin' : mockUser.role === 'craftsman' ? '/dashboard' : '/');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!registerForm.name || !registerForm.email || !registerForm.password) { toast.error("Barcha maydonlarni to'ldiring"); return; }
    if (registerForm.password.length < 6) { toast.error("Parol kamida 6 ta belgi bo'lishi kerak"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    const mockUser = { id:'u2', name: registerForm.name, email: registerForm.email, role };
    login(mockUser, 'mock-jwt-token');
    toast.success("Muvaffaqiyatli ro'yxatdan o'tdingiz!");
    setLoading(false);
    navigate(role === 'craftsman' ? '/dashboard' : '/');
  };

  return (
    <div className="auth-page page-with-header">
      <div className="auth-layout">
        {/* Left panel */}
        <div className="auth-visual">
          <div className="auth-visual-content">
            <div className="auth-logo">
              <div className="logo-icon"><span>H</span></div>
              <span className="logo-primary">Hunarmand Bozor</span>
            </div>
            <h2>O'zbek hunarmandchiligini dunyoga tanishtiring</h2>
            <p>Minglab mijozlarga o'zingizning qo'l ishlaringizni taqdim eting</p>
            <div className="auth-features">
              {[
                "Bepul ro'yxatdan o'tish",
                "Xavfsiz to'lov tizimi",
                "24/7 qo'llab-quvvatlash",
                "Butun O'zbekiston bo'ylab yetkazib berish",
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
              <button className={`auth-tab ${tab==='login'?'active':''}`} onClick={()=>setTab('login')}>Kirish</button>
              <button className={`auth-tab ${tab==='register'?'active':''}`} onClick={()=>setTab('register')}>Ro'yxat</button>
            </div>

            {tab === 'login' ? (
              <form className="auth-form animate-fadeIn" onSubmit={handleLogin}>
                <h2>Xush kelibsiz!</h2>
                <p className="auth-subtitle">Hisobingizga kirish uchun ma'lumotlarni kiriting</p>

                <div className="form-group">
                  <label className="form-label">Email manzil</label>
                  <div className="input-icon-wrap">
                    <Mail size={16} className="input-icon"/>
                    <input className="form-input input-with-icon" type="email" placeholder="email@example.com"
                      value={loginForm.email} onChange={e=>setLoginForm({...loginForm,email:e.target.value})}/>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Parol</label>
                  <div className="input-icon-wrap">
                    <Lock size={16} className="input-icon"/>
                    <input className="form-input input-with-icon" type={showPass?'text':'password'} placeholder="Parolingiz"
                      value={loginForm.password} onChange={e=>setLoginForm({...loginForm,password:e.target.value})}/>
                    <button type="button" className="input-toggle" onClick={()=>setShowPass(!showPass)}>
                      {showPass ? <EyeOff size={15}/> : <Eye size={15}/>}
                    </button>
                  </div>
                </div>

                <div className="auth-options">
                  <label className="remember-me"><input type="checkbox"/> Eslab qolish</label>
                  <Link to="/auth/forgot-password" className="forgot-link">Parolni unutdingizmi?</Link>
                </div>

                <button className="btn btn-primary btn-lg auth-submit" type="submit" disabled={loading}>
                  {loading ? <span className="spinner"/> : 'Kirish'}
                </button>

                <div className="auth-divider"><span>yoki</span></div>

                <div className="social-logins">
                  <button type="button" className="social-btn google">
                    <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
                    Google orqali kirish
                  </button>
                </div>

                <p className="auth-switch">
                  Hisobingiz yo'qmi? <button type="button" onClick={()=>setTab('register')}>Ro'yxatdan o'ting</button>
                </p>

                {/* Demo hints */}
                <div className="demo-hints">
                  <p className="demo-hint-title">Demo kirish:</p>
                  <button type="button" className="demo-btn" onClick={()=>setLoginForm({email:'user@demo.com',password:'demo123'})}><FiUser size={13}/> Mijoz</button>
                  <button type="button" className="demo-btn" onClick={()=>setLoginForm({email:'craft@demo.com',password:'demo123'})}><GiPaintedPottery size={13}/> Hunarmand</button>
                  <button type="button" className="demo-btn" onClick={()=>setLoginForm({email:'admin@demo.com',password:'demo123'})}><FiShield size={13}/> Admin</button>
                </div>
              </form>
            ) : (
              <form className="auth-form animate-fadeIn" onSubmit={handleRegister}>
                <h2>Ro'yxatdan o'tish</h2>
                <p className="auth-subtitle">Platformamizga qo'shiling</p>

                {/* Role selector */}
                <div className="role-selector">
                  <button type="button" className={`role-btn ${role==='customer'?'active':''}`} onClick={()=>setRole('customer')}>
                    <span className="role-icon"><FiUser size={28} /></span><strong>Xaridor</strong><span>Mahsulot sotib olish</span>
                  </button>
                  <button type="button" className={`role-btn ${role==='craftsman'?'active':''}`} onClick={()=>setRole('craftsman')}>
                    <span className="role-icon"><GiPaintedPottery size={28} /></span><strong>Hunarmand</strong><span>Mahsulot sotish</span>
                  </button>
                </div>

                <div className="form-group">
                  <label className="form-label">To'liq ism *</label>
                  <div className="input-icon-wrap">
                    <User size={16} className="input-icon"/>
                    <input className="form-input input-with-icon" placeholder="Ism Familiya"
                      value={registerForm.name} onChange={e=>setRegisterForm({...registerForm,name:e.target.value})}/>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <div className="input-icon-wrap">
                    <Mail size={16} className="input-icon"/>
                    <input className="form-input input-with-icon" type="email" placeholder="email@example.com"
                      value={registerForm.email} onChange={e=>setRegisterForm({...registerForm,email:e.target.value})}/>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Telefon</label>
                  <div className="input-icon-wrap">
                    <Phone size={16} className="input-icon"/>
                    <input className="form-input input-with-icon" placeholder="+998 XX XXX XX XX"
                      value={registerForm.phone} onChange={e=>setRegisterForm({...registerForm,phone:e.target.value})}/>
                  </div>
                </div>
                {role==='craftsman' && (
                  <div className="form-group">
                    <label className="form-label">Viloyat</label>
                    <div className="input-icon-wrap">
                      <MapPin size={16} className="input-icon"/>
                      <select className="form-input form-select input-with-icon"
                        value={registerForm.region} onChange={e=>setRegisterForm({...registerForm,region:e.target.value})}>
                        <option value="">Tanlang</option>
                        {['Toshkent','Samarqand','Buxoro','Namangan','Andijon'].map(r=><option key={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>
                )}
                <div className="form-group">
                  <label className="form-label">Parol *</label>
                  <div className="input-icon-wrap">
                    <Lock size={16} className="input-icon"/>
                    <input className="form-input input-with-icon" type={showPass?'text':'password'} placeholder="Kamida 6 ta belgi"
                      value={registerForm.password} onChange={e=>setRegisterForm({...registerForm,password:e.target.value})}/>
                    <button type="button" className="input-toggle" onClick={()=>setShowPass(!showPass)}>
                      {showPass ? <EyeOff size={15}/> : <Eye size={15}/>}
                    </button>
                  </div>
                </div>

                <button className="btn btn-primary btn-lg auth-submit" type="submit" disabled={loading}>
                  {loading ? <span className="spinner"/> : "Ro'yxatdan o'tish"}
                </button>

                <p className="auth-terms">Ro'yxatdan o'tish orqali siz <Link to="/terms">Foydalanish shartlari</Link> va <Link to="/privacy">Maxfiylik siyosati</Link>ga rozilik bildirasiz.</p>
                <p className="auth-switch">
                  Hisobingiz bormi? <button type="button" onClick={()=>setTab('login')}>Kirish</button>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
