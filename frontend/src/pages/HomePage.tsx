import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { experiencesApi } from '../api/experiences';
import { ExperienceCard } from '../components/experiences/ExperienceCard';
import { FilterBar } from '../components/experiences/FilterBar';
import { ExperienceCardSkeleton } from '../components/ui/Skeleton';
import type { Experience, ListParams } from '../types';

export function HomePage() {
  const { isAuthenticated } = useAuth();
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading]         = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [page, setPage]               = useState(1);
  const [hasMore, setHasMore]         = useState(true);
  const [currentParams, setCurrentParams] = useState<ListParams>({ sort:'asc', page:1, limit:12 });
  const LIMIT = 12;

  const fetchExperiences = useCallback(async (params: ListParams, append = false) => {
    if (!append) setLoading(true); else setFilterLoading(true);
    try {
      const data = await experiencesApi.list(params);
      setExperiences(append ? prev => [...prev, ...data] : data);
      setHasMore(data.length === LIMIT);
    } catch {
      setExperiences([]);
    } finally { setLoading(false); setFilterLoading(false); }
  }, []);

  useEffect(() => { fetchExperiences(currentParams); }, []);

  const handleFilter = (params: ListParams) => {
    const p = { ...params, page:1, limit:LIMIT };
    setCurrentParams(p);
    setPage(1);
    fetchExperiences(p);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    const p = { ...currentParams, page:nextPage };
    fetchExperiences(p, true);
  };

  const handleUpdate = (updated: Experience) => {
    setExperiences(prev => prev.map(e => e.id === updated.id ? updated : e).filter(e => e.status === 'published'));
  };

  return (
    <div style={{ maxWidth:1200, margin:'0 auto', padding:'40px 24px' }}>
      {/* Hero */}
      <div style={{ marginBottom:48, animation:'fadeIn 0.5s ease' }}>
        <div style={{ fontFamily:'var(--font-display)', fontSize:'clamp(36px,5vw,64px)', fontWeight:300, lineHeight:1.15, color:'var(--text-primary)', marginBottom:16 }}>
          Discover Extraordinary
          <span style={{ display:'block', color:'var(--gold)', fontStyle:'italic' }}>Experiences</span>
        </div>
        <p style={{ color:'var(--text-secondary)', fontSize:16, maxWidth:520 }}>
          Handpicked adventures, treks, and cultural journeys hosted by passionate locals across India.
        </p>
      </div>

      {/* Filters */}
      <div style={{ marginBottom:32 }}>
        <FilterBar onFilter={handleFilter} loading={filterLoading} />
      </div>

      {/* Stats Bar */}
      {!loading && (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, animation:'fadeIn 0.3s ease' }}>
          <span style={{ color:'var(--text-muted)', fontSize:13, fontFamily:'var(--font-mono)' }}>
            {experiences.length} experience{experiences.length !== 1 ? 's' : ''} found
          </span>
          {!isAuthenticated && (
            <span style={{ fontSize:12, color:'var(--text-muted)', background:'var(--surface-raised)', border:'1px solid var(--ink-muted)', padding:'4px 12px', borderRadius:99, fontFamily:'var(--font-mono)' }}>
              Sign in to book
            </span>
          )}
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:24 }}>
          {Array.from({length:6}).map((_,i) => <ExperienceCardSkeleton key={i} />)}
        </div>
      ) : experiences.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:24 }}>
            {experiences.map((exp, i) => (
              <div key={exp.id} style={{ animationDelay:`${i * 0.05}s` }}>
                <ExperienceCard experience={exp} onUpdate={handleUpdate} showActions={isAuthenticated} />
              </div>
            ))}
          </div>

          {hasMore && (
            <div style={{ display:'flex', justifyContent:'center', marginTop:40 }}>
              <button onClick={handleLoadMore} disabled={filterLoading} style={{
                padding:'12px 36px', background:'transparent',
                border:'1.5px solid var(--gold-border)', borderRadius:'var(--radius)',
                color:'var(--gold)', fontSize:14, fontFamily:'var(--font-mono)',
                cursor:'pointer', transition:'all var(--transition)',
                opacity: filterLoading ? 0.5 : 1,
              }}
                onMouseEnter={e => e.currentTarget.style.background='var(--gold-dim)'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}
              >
                {filterLoading ? 'Loading…' : 'Load More →'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{ textAlign:'center', padding:'80px 0', animation:'fadeIn 0.4s ease' }}>
      <div style={{ fontSize:56, marginBottom:16 }}>🗺️</div>
      <h3 style={{ fontFamily:'var(--font-display)', fontSize:28, color:'var(--text-secondary)', fontWeight:400, marginBottom:8 }}>No Experiences Found</h3>
      <p style={{ color:'var(--text-muted)', fontSize:14 }}>Try adjusting your filters or check back later.</p>
    </div>
  );
}