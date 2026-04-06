export function Skeleton({ width = '100%', height = 20, radius = 6 }: { width?: string | number; height?: number; radius?: number }) {
  return (
    <div style={{
      width, height, borderRadius: radius,
      background: 'linear-gradient(90deg, var(--ink-muted) 25%, var(--surface-overlay) 50%, var(--ink-muted) 75%)',
      backgroundSize: '800px 100%',
      animation: 'shimmer 1.4s infinite linear',
    }} />
  );
}

export function ExperienceCardSkeleton() {
  return (
    <div style={{ background:'var(--surface-raised)', borderRadius:'var(--radius-lg)', border:'1px solid var(--ink-muted)', padding:24, display:'flex', flexDirection:'column', gap:14 }}>
      <Skeleton height={160} radius={8} />
      <Skeleton height={22} width="70%" />
      <Skeleton height={14} width="45%" />
      <div style={{ display:'flex', gap:8 }}>
        <Skeleton height={14} width={80} />
        <Skeleton height={14} width={100} />
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', marginTop:8 }}>
        <Skeleton height={32} width={100} />
        <Skeleton height={32} width={120} />
      </div>
    </div>
  );
}