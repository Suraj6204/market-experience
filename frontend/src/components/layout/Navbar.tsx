import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../ui/Badge';
import type { Role } from '../../types';

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav style={{
      position:'sticky', top:0, zIndex:100,
      background:'rgba(17,21,35,0.92)', backdropFilter:'blur(12px)',
      borderBottom:'1px solid var(--ink-muted)',
    }}>
      <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 24px', height:64, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        {/* Logo */}
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{
            width:32, height:32, borderRadius:'var(--radius)',
            background:'linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 100%)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:16, fontWeight:700, color:'var(--ink)',
          }}>Y</div>
          <span style={{ fontFamily:'var(--font-display)', fontSize:22, fontWeight:600, color:'var(--text-primary)', letterSpacing:'0.02em' }}>
            Yoliday
          </span>
        </Link>

        {/* Nav Links */}
        <div style={{ display:'flex', alignItems:'center', gap:4 }}>
          <NavLink to="/" label="Experiences" active={isActive('/')} />
          {isAuthenticated && (user?.role === 'host' || user?.role === 'admin') && (
            <NavLink to="/dashboard" label="Dashboard" active={isActive('/dashboard')} />
          )}
        </div>

        {/* Right Side */}
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          {isAuthenticated && user ? (
            <div style={{ position:'relative' }}>
              <button
                onClick={() => setMenuOpen(o => !o)}
                style={{
                  display:'flex', alignItems:'center', gap:10,
                  background:'var(--surface-raised)', border:'1.5px solid var(--ink-muted)',
                  borderRadius:'var(--radius)', padding:'7px 14px',
                  color:'var(--text-primary)', cursor:'pointer',
                  transition:'border-color var(--transition)',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor='var(--gold-border)'}
                onMouseLeave={e => e.currentTarget.style.borderColor='var(--ink-muted)'}
              >
                <div style={{ width:28, height:28, borderRadius:'50%', background:'var(--gold-dim)', border:'1.5px solid var(--gold-border)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, color:'var(--gold)', fontFamily:'var(--font-mono)', fontWeight:600 }}>
                  {user.role === 'admin' ? 'A' : user.role === 'host' ? 'H' : 'U'}
                </div>
                <Badge variant={user.role as Role} />
                <span style={{ fontSize:12, color:'var(--text-muted)' }}>▾</span>
              </button>

              {menuOpen && (
                <div onClick={() => setMenuOpen(false)} style={{ position:'fixed', inset:0, zIndex:98 }} />
              )}
              {menuOpen && (
                <div style={{
                  position:'absolute', right:0, top:'calc(100% + 8px)', zIndex:99,
                  background:'var(--surface-raised)', border:'1px solid var(--ink-muted)',
                  borderRadius:'var(--radius-lg)', boxShadow:'var(--shadow-lg)',
                  minWidth:200, overflow:'hidden', animation:'fadeIn 0.15s ease',
                }}>
                  <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--ink-muted)' }}>
                    <div style={{ fontSize:11, fontFamily:'var(--font-mono)', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.08em' }}>Signed in as</div>
                    <div style={{ fontSize:13, color:'var(--text-primary)', marginTop:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                      ID: {user.id.slice(0, 8)}…
                    </div>
                  </div>
                  <button onClick={handleLogout} style={{
                    width:'100%', padding:'12px 16px', background:'transparent',
                    color:'var(--accent-red)', fontSize:14, textAlign:'left', cursor:'pointer',
                    transition:'background var(--transition)', fontFamily:'var(--font-body)',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background='rgba(224,92,92,0.08)'}
                    onMouseLeave={e => e.currentTarget.style.background='transparent'}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login">
                <button style={{ background:'transparent', border:'1.5px solid var(--ink-muted)', borderRadius:'var(--radius)', padding:'8px 18px', color:'var(--text-secondary)', fontSize:14, cursor:'pointer', fontFamily:'var(--font-body)', transition:'all var(--transition)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='var(--gold-border)'; e.currentTarget.style.color='var(--text-primary)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='var(--ink-muted)'; e.currentTarget.style.color='var(--text-secondary)'; }}
                >
                  Sign In
                </button>
              </Link>
              <Link to="/signup">
                <button style={{ background:'var(--gold)', border:'1.5px solid var(--gold)', borderRadius:'var(--radius)', padding:'8px 18px', color:'var(--ink)', fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'var(--font-body)', transition:'all var(--transition)' }}
                  onMouseEnter={e => e.currentTarget.style.background='var(--gold-light)'}
                  onMouseLeave={e => e.currentTarget.style.background='var(--gold)'}
                >
                  Get Started
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, label, active }: { to: string; label: string; active: boolean }) {
  return (
    <Link to={to}>
      <button style={{
        background:'transparent', border:'none', padding:'7px 14px',
        color: active ? 'var(--gold)' : 'var(--text-secondary)',
        fontSize:14, cursor:'pointer', borderRadius:'var(--radius)',
        fontFamily:'var(--font-body)', fontWeight: active ? 500 : 400,
        transition:'color var(--transition)',
        borderBottom: active ? '1.5px solid var(--gold)' : '1.5px solid transparent',
      }}
        onMouseEnter={e => { if (!active) e.currentTarget.style.color='var(--text-primary)'; }}
        onMouseLeave={e => { if (!active) e.currentTarget.style.color='var(--text-secondary)'; }}
      >
        {label}
      </button>
    </Link>
  );
}