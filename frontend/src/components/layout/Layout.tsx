import { ReactNode } from 'react';
import { Navbar } from './Navbar';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column' }}>
      <Navbar />
      <main style={{ flex:1 }}>{children}</main>
      <footer style={{ borderTop:'1px solid var(--ink-muted)', padding:'24px', textAlign:'center', color:'var(--text-muted)', fontSize:13, fontFamily:'var(--font-mono)' }}>
        © {new Date().getFullYear()} Yoliday — Experiences Marketplace
      </footer>
    </div>
  );
}