import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { authApi } from '@/api/auth';

export function LoginPage() {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState<{email?:string; password?:string}>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email = 'Valid email required';
    if (!password || password.length < 6) e.password = 'Password min 6 characters';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await authApi.login(email, password);
      login(data.token, data.user);
      toast('Welcome back!', 'success');
      navigate('/');
    } catch (e: any) {
      toast(e.message, 'error');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'calc(100vh - 65px)', display:'flex', alignItems:'center', justifyContent:'center', padding:24, position:'relative', overflow:'hidden' }}>
      <BgDecor />
      <div style={{
        width:'100%', maxWidth:420, background:'var(--surface-raised)',
        border:'1px solid var(--ink-muted)', borderRadius:'var(--radius-lg)',
        padding:'40px 36px', boxShadow:'var(--shadow-lg)', animation:'slideUp 0.4s ease',
        position:'relative', zIndex:1,
      }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ fontFamily:'var(--font-display)', fontSize:42, color:'var(--gold)', fontStyle:'italic', marginBottom:8 }}>Welcome</div>
          <p style={{ color:'var(--text-muted)', fontSize:14 }}>Sign in to continue to Yoliday</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:18 }}>
          <Input label="Email Address" type="email" value={email} onChange={e => { setEmail(e.target.value); setErrors(p=>({...p,email:undefined})); }} error={errors.email} placeholder="you@example.com" icon="✉" autoComplete="email" />
          <Input label="Password" type="password" value={password} onChange={e => { setPassword(e.target.value); setErrors(p=>({...p,password:undefined})); }} error={errors.password} placeholder="••••••••" icon="🔒" autoComplete="current-password" />
          <Button fullWidth loading={loading} size="lg" style={{ marginTop:8 }}>Sign In</Button>
        </form>

        <p style={{ textAlign:'center', marginTop:24, color:'var(--text-muted)', fontSize:14 }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color:'var(--gold)', fontWeight:500 }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

function BgDecor() {
  return (
    <>
      <div style={{ position:'absolute', top:-100, right:-100, width:400, height:400, background:'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)', borderRadius:'50%', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:-80, left:-80, width:300, height:300, background:'radial-gradient(circle, rgba(74,125,255,0.05) 0%, transparent 70%)', borderRadius:'50%', pointerEvents:'none' }} />
    </>
  );
}