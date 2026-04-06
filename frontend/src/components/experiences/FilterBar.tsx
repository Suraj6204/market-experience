import { useState } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import type { ListParams } from '../../types';

interface Props { onFilter: (p: ListParams) => void; loading?: boolean; }

export function FilterBar({ onFilter, loading }: Props) {
  const [location, setLocation] = useState('');
  const [from, setFrom]         = useState('');
  const [to, setTo]             = useState('');
  const [sort, setSort]         = useState<'asc'|'desc'>('asc');

  const apply = () => onFilter({ location: location.trim() || undefined, from: from ? new Date(from).toISOString() : undefined, to: to ? new Date(to).toISOString() : undefined, sort, page:1, limit:12 });
  const reset = () => { setLocation(''); setFrom(''); setTo(''); setSort('asc'); onFilter({ sort:'asc', page:1, limit:12 }); };

  return (
    <div style={{
      background:'var(--surface-raised)', border:'1px solid var(--ink-muted)',
      borderRadius:'var(--radius-lg)', padding:20, display:'flex',
      flexWrap:'wrap', gap:14, alignItems:'flex-end',
    }}>
      <div style={{ flex:'1', minWidth:160 }}>
        <Input label="Location" value={location} onChange={e => setLocation(e.target.value)} placeholder="Filter by city..." icon="📍" />
      </div>
      <div style={{ flex:'1', minWidth:160 }}>
        <Input label="From Date" type="date" value={from} onChange={e => setFrom(e.target.value)} />
      </div>
      <div style={{ flex:'1', minWidth:160 }}>
        <Input label="To Date" type="date" value={to} onChange={e => setTo(e.target.value)} />
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        <label style={{ fontSize:12, fontWeight:500, color:'var(--text-secondary)', letterSpacing:'0.08em', textTransform:'uppercase', fontFamily:'var(--font-mono)' }}>Sort</label>
        <div style={{ display:'flex', gap:6 }}>
          {(['asc','desc'] as const).map(s => (
            <button key={s} onClick={() => setSort(s)} style={{
              padding:'10px 16px', borderRadius:'var(--radius)', fontSize:13, fontFamily:'var(--font-mono)',
              border:`1.5px solid ${sort===s ? 'var(--gold)' : 'var(--ink-muted)'}`,
              background: sort===s ? 'var(--gold-dim)' : 'transparent',
              color: sort===s ? 'var(--gold)' : 'var(--text-secondary)',
              cursor:'pointer', transition:'all var(--transition)',
            }}>{s === 'asc' ? '↑ Earliest' : '↓ Latest'}</button>
          ))}
        </div>
      </div>
      <div style={{ display:'flex', gap:8 }}>
        <Button variant="ghost" size="md" onClick={reset}>Reset</Button>
        <Button size="md" loading={loading} onClick={apply}>Apply</Button>
      </div>
    </div>
  );
}