import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div style={{ minHeight:'calc(100vh - 130px)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', padding:24 }}>
      <div style={{ fontFamily:'var(--font-display)', fontSize:'clamp(80px,15vw,160px)', fontWeight:600, color:'var(--ink-muted)', lineHeight:1, marginBottom:16 }}>404</div>
      <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(22px,4vw,36px)', color:'var(--text-secondary)', fontWeight:300, marginBottom:12 }}>Page Not Found</h1>
      <p style={{ color:'var(--text-muted)', marginBottom:32 }}>The page you're looking for doesn't exist.</p>
      <Link to="/">
        <button style={{ padding:'12px 32px', background:'var(--gold)', color:'var(--ink)', borderRadius:'var(--radius)', fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'var(--font-body)', border:'none', transition:'all var(--transition)' }}
          onMouseEnter={e => e.currentTarget.style.background='var(--gold-light)'}
          onMouseLeave={e => e.currentTarget.style.background='var(--gold)'}
        >
          ← Back to Home
        </button>
      </Link>
    </div>
  );
}