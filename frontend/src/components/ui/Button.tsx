import { ButtonHTMLAttributes, ReactNode } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
  fullWidth?: boolean;
}

const styles: Record<string, string> = {
  primary:   'background:var(--gold); color:var(--ink); border:1.5px solid var(--gold);',
  secondary: 'background:transparent; color:var(--gold); border:1.5px solid var(--gold-border);',
  ghost:     'background:transparent; color:var(--text-secondary); border:1.5px solid var(--ink-muted);',
  danger:    'background:transparent; color:var(--accent-red); border:1.5px solid rgba(224,92,92,0.35);',
  success:   'background:transparent; color:var(--accent-green); border:1.5px solid rgba(78,203,113,0.35);',
};

const sizes: Record<string, string> = {
  sm: 'padding:6px 14px; font-size:12px;',
  md: 'padding:10px 22px; font-size:14px;',
  lg: 'padding:14px 32px; font-size:15px;',
};

export function Button({ variant='primary', size='md', loading, children, fullWidth, style, ...props }: Props) {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      style={{
        display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8,
        borderRadius:'var(--radius)', fontFamily:'var(--font-body)', fontWeight:500,
        letterSpacing:'0.02em', cursor: loading || props.disabled ? 'not-allowed' : 'pointer',
        transition:'all var(--transition)', width: fullWidth ? '100%' : undefined,
        opacity: props.disabled && !loading ? 0.5 : 1,
        ...Object.fromEntries(
          styles[variant].split(';').filter(Boolean).map(s => {
            const [k,...v] = s.split(':');
            return [k.trim().replace(/-([a-z])/g, (_,c)=>c.toUpperCase()), v.join(':').trim()];
          })
        ),
        ...Object.fromEntries(
          sizes[size].split(';').filter(Boolean).map(s => {
            const [k,...v] = s.split(':');
            return [k.trim().replace(/-([a-z])/g, (_,c)=>c.toUpperCase()), v.join(':').trim()];
          })
        ),
        ...style as object,
      }}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
}

function Spinner() {
  return (
    <span style={{
      width:16, height:16, borderRadius:'50%',
      border:'2px solid currentColor', borderTopColor:'transparent',
      display:'inline-block', animation:'spin 0.7s linear infinite',
    }} />
  );
}