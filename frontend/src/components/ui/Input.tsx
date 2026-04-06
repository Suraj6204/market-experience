import { InputHTMLAttributes, forwardRef } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: string;
}

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, hint, icon, style, ...props }, ref) => (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      {label && (
        <label style={{ fontSize:12, fontWeight:500, color:'var(--text-secondary)', letterSpacing:'0.08em', textTransform:'uppercase', fontFamily:'var(--font-mono)' }}>
          {label}
        </label>
      )}
      <div style={{ position:'relative' }}>
        {icon && (
          <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', fontSize:16, pointerEvents:'none' }}>
            {icon}
          </span>
        )}
        <input
          ref={ref}
          {...props}
          style={{
            width:'100%', padding: icon ? '11px 14px 11px 42px' : '11px 14px',
            background:'var(--surface-raised)', border:`1.5px solid ${error ? 'var(--accent-red)' : 'var(--ink-muted)'}`,
            borderRadius:'var(--radius)', color:'var(--text-primary)',
            fontSize:14, fontFamily:'var(--font-body)',
            transition:'border-color var(--transition)',
            ...style as object,
          }}
          onFocus={e => { e.currentTarget.style.borderColor = error ? 'var(--accent-red)' : 'var(--gold)'; }}
          onBlur={e => { e.currentTarget.style.borderColor = error ? 'var(--accent-red)' : 'var(--ink-muted)'; }}
        />
      </div>
      {error && <span style={{ fontSize:12, color:'var(--accent-red)', fontFamily:'var(--font-mono)' }}>{error}</span>}
      {hint && !error && <span style={{ fontSize:12, color:'var(--text-muted)' }}>{hint}</span>}
    </div>
  )
);