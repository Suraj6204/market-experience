import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast { id: string; message: string; type: ToastType; }

interface ToastContextType { toast: (message: string, type?: ToastType) => void; }

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3800);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div style={{ position:'fixed', bottom:24, right:24, zIndex:9999, display:'flex', flexDirection:'column', gap:10 }}>
        {toasts.map(t => <ToastItem key={t.id} toast={t} />)}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast }: { toast: Toast }) {
  const colors: Record<ToastType, string> = {
    success: 'var(--accent-green)',
    error:   'var(--accent-red)',
    warning: 'var(--accent-amber)',
    info:    'var(--gold)',
  };
  const icons: Record<ToastType, string> = {
    success:'✓', error:'✕', warning:'⚠', info:'◆'
  };
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:12,
      background:'var(--surface-raised)', border:`1px solid ${colors[toast.type]}44`,
      borderLeft:`3px solid ${colors[toast.type]}`,
      padding:'12px 18px', borderRadius:'var(--radius)',
      boxShadow:'var(--shadow)', minWidth:280, maxWidth:380,
      animation:'toastIn 0.3s ease forwards',
      fontFamily:'var(--font-body)', fontSize:14, color:'var(--text-primary)',
    }}>
      <span style={{ color: colors[toast.type], fontWeight:600, fontSize:16 }}>{icons[toast.type]}</span>
      <span>{toast.message}</span>
    </div>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};