import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import type { Role } from '../types';

export function SignupPage() {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate  = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole]         = useState<'user'|'host'>('user');
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState<{email?:string; password?:string}>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) e.email = 'Valid email required';
    if (!password || password.length < 6) e.password = 'Min 6 characters';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await authApi.signup(email, password, role as Role);
      const data = await authApi.login(email, password);
      login(data.token, data.user);
      toast('Account created!', 'success');
      navigate(role === 'host' ? '/dashboard' : '/');
    } catch (e: any) {
      toast(e.message, 'error');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'calc(100vh - 65px)', display:'flex', alignItems:'center', justifyContent:'center', padding:24, position:'relative', overflow:'hidden' }}>
      <BgDecor />
      <div style={{
        width:'100%', maxWidth:460, background:'var(--surface-raised)',
        border:'1px solid var(--ink-muted)', borderRadius:'var(--radius-lg)',
        padding:'40px 36px', boxShadow:'var(--shadow-lg)', animation:'slideUp 0.4s ease',
        position:'relative', zIndex:1,
      }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ fontFamily:'var(--font-display)', fontSize:40, color:'var(--gold)', fontStyle:'italic', marginBottom:8 }}>Join Yoliday</div>
          <p style={{ color:'var(--text-muted)', fontSize:14 }}>Create your account to get started</p>
        </div>

        {/* Role Selector */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:24 }}>
          {(['user','host'] as const).map(r => (
            <button key={r} onClick={() => setRole(r)} style={{
              padding:'14px 16px', borderRadius:'var(--radius)', cursor:'pointer',
              border:`1.5px solid ${role===r ? 'var(--gold)' : 'var(--ink-muted)'}`,
              background: role===r ? 'var(--gold-dim)' : 'var(--surface-overlay)',
              transition:'all var(--transition)', textAlign:'center',
            }}>
              <div style={{ fontSize:22, marginBottom:4 }}>{r==='user' ? '🌍' : '🏕️'}</div>
              <div style={{ fontSize:13, fontWeight:600, color: role===r ? 'var(--gold)' : 'var(--text-primary)', fontFamily:'var(--font-mono)', textTransform:'uppercase', letterSpacing:'0.06em' }}>{r}</div>
              <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:2 }}>
                {r==='user' ? 'Browse & book experiences' : 'Create & host experiences'}
              </div>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:18 }}>
          <Input label="Email Address" type="email" value={email} onChange={e => { setEmail(e.target.value); setErrors(p=>({...p,email:undefined})); }} error={errors.email} placeholder="you@example.com" icon="✉" />
          <Input label="Password" type="password" value={password} onChange={e => { setPassword(e.target.value); setErrors(p=>({...p,password:undefined})); }} error={errors.password} placeholder="Min 6 characters" icon="🔒" />
          <Button fullWidth loading={loading} size="lg" style={{ marginTop:8 }}>Create Account</Button>
        </form>

        <p style={{ textAlign:'center', marginTop:24, color:'var(--text-muted)', fontSize:14 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color:'var(--gold)', fontWeight:500 }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}

function BgDecor() {
  return (
    <>
      <div style={{ position:'absolute', top:-80, left:-80, width:350, height:350, background:'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)', borderRadius:'50%', pointerEvents:'none' }} />
      <div style={{ position:'absolute', bottom:-60, right:-60, width:280, height:280, background:'radial-gradient(circle, rgba(78,203,113,0.05) 0%, transparent 70%)', borderRadius:'50%', pointerEvents:'none' }} />
    </>
  );
}