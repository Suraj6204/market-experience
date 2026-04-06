type Variant = 'draft' | 'published' | 'blocked' | 'confirmed' | 'cancelled' | 'admin' | 'host' | 'user';

const config: Record<Variant, { bg: string; color: string; label: string }> = {
  draft:     { bg:'rgba(90,97,128,0.2)',   color:'var(--text-secondary)', label:'Draft' },
  published: { bg:'rgba(78,203,113,0.15)', color:'var(--accent-green)',   label:'Published' },
  blocked:   { bg:'rgba(224,92,92,0.15)',  color:'var(--accent-red)',     label:'Blocked' },
  confirmed: { bg:'rgba(74,125,255,0.15)', color:'var(--accent-blue)',    label:'Confirmed' },
  cancelled: { bg:'rgba(224,92,92,0.15)',  color:'var(--accent-red)',     label:'Cancelled' },
  admin:     { bg:'rgba(201,168,76,0.2)',  color:'var(--gold)',           label:'Admin' },
  host:      { bg:'rgba(74,125,255,0.15)', color:'var(--accent-blue)',    label:'Host' },
  user:      { bg:'rgba(90,97,128,0.2)',   color:'var(--text-secondary)', label:'User' },
};

export function Badge({ variant }: { variant: Variant }) {
  const { bg, color, label } = config[variant];
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:5,
      padding:'3px 10px', borderRadius:99, fontSize:11,
      fontWeight:600, fontFamily:'var(--font-mono)',
      letterSpacing:'0.06em', textTransform:'uppercase',
      background: bg, color,
    }}>
      <span style={{ width:5, height:5, borderRadius:'50%', background: color, display:'inline-block' }} />
      {label}
    </span>
  );
}