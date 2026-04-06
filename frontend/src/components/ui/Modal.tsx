import { ReactNode, useEffect } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: number;
}

export function Modal({ open, onClose, title, children, width = 520 }: Props) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position:'fixed', inset:0, background:'rgba(0,0,0,0.72)',
        display:'flex', alignItems:'center', justifyContent:'center',
        zIndex:1000, backdropFilter:'blur(4px)', animation:'fadeInFast 0.2s ease',
        padding:24,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background:'var(--surface-raised)', border:'1px solid var(--ink-muted)',
          borderRadius:'var(--radius-lg)', width:'100%', maxWidth:width,
          boxShadow:'var(--shadow-lg)', animation:'slideUp 0.25s ease',
          maxHeight:'90vh', display:'flex', flexDirection:'column',
        }}
      >
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 24px', borderBottom:'1px solid var(--ink-muted)' }}>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:22, fontWeight:600, color:'var(--text-primary)' }}>{title}</h2>
          <button onClick={onClose} style={{ background:'none', color:'var(--text-muted)', fontSize:20, cursor:'pointer', padding:4, lineHeight:1, borderRadius:'var(--radius)', transition:'color var(--transition)' }}
            onMouseEnter={e => e.currentTarget.style.color='var(--text-primary)'}
            onMouseLeave={e => e.currentTarget.style.color='var(--text-muted)'}
          >✕</button>
        </div>
        <div style={{ padding:24, overflowY:'auto' }}>{children}</div>
      </div>
    </div>
  );
}