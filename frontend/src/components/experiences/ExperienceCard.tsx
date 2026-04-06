import { useState } from 'react';
import type { Experience } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { experiencesApi } from '../../api/experiences';
import { bookingsApi } from '../../api/bookings';
import { useToast } from '../../context/ToastContext';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';

interface Props {
  experience: Experience;
  onUpdate?: (exp: Experience) => void;
  showActions?: boolean;
}

const LOCATION_IMAGES: Record<string, string> = {
  default: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
  manali:  'https://images.unsplash.com/photo-1617450365226-9bf28c04e130?w=600&q=80',
  goa:     'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80',
  kerala:  'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80',
  rajasthan: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80',
};

function getImage(location: string) {
  const key = location.toLowerCase().split(',')[0].trim();
  return LOCATION_IMAGES[key] ?? LOCATION_IMAGES.default;
}

export function ExperienceCard({ experience, onUpdate, showActions = false }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const [bookModal, setBookModal] = useState(false);
  const [seats, setSeats] = useState('1');
  const [seatsErr, setSeatsErr] = useState('');
  const [imgErr, setImgErr] = useState(false);

  const isOwner  = user?.id === experience.created_by;
  const isAdmin  = user?.role === 'admin';
  const canBook  = user?.role === 'user' || (user?.role === 'admin' && !isOwner);
  const canPublish = experience.status === 'draft' && (isOwner || isAdmin);
  const canBlock   = experience.status !== 'blocked' && isAdmin;

  const handlePublish = async () => {
    setLoading('publish');
    try {
      const updated = await experiencesApi.publish(experience.id);
      toast('Experience published!', 'success');
      onUpdate?.(updated);
    } catch (e: any) {
      toast(e.message, 'error');
    } finally { setLoading(null); }
  };

  const handleBlock = async () => {
    setLoading('block');
    try {
      const updated = await experiencesApi.block(experience.id);
      toast('Experience blocked.', 'warning');
      onUpdate?.(updated);
    } catch (e: any) {
      toast(e.message, 'error');
    } finally { setLoading(null); }
  };

  const handleBook = async () => {
    const s = parseInt(seats);
    if (!s || s < 1) { setSeatsErr('Must be at least 1'); return; }
    setSeatsErr('');
    setLoading('book');
    try {
      await bookingsApi.book(experience.id, s);
      toast(`Booked ${s} seat${s > 1 ? 's' : ''}!`, 'success');
      setBookModal(false);
    } catch (e: any) {
      toast(e.message, 'error');
    } finally { setLoading(null); }
  };

  const formattedDate = new Date(experience.start_time).toLocaleDateString('en-IN', {
    day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'
  });

  return (
    <>
      <div style={{
        background:'var(--surface-raised)', border:'1px solid var(--ink-muted)',
        borderRadius:'var(--radius-lg)', overflow:'hidden', display:'flex',
        flexDirection:'column', transition:'all var(--transition)',
        animation:'fadeIn 0.4s ease',
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor='var(--gold-border)'; e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 8px 32px rgba(201,168,76,0.1)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor='var(--ink-muted)'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
      >
        {/* Image */}
        <div style={{ position:'relative', height:180, overflow:'hidden', background:'var(--ink-soft)' }}>
          <img
            src={imgErr ? LOCATION_IMAGES.default : getImage(experience.location)}
            alt={experience.title}
            onError={() => setImgErr(true)}
            style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.4s ease' }}
          />
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, transparent 50%, rgba(17,21,35,0.8) 100%)' }} />
          <div style={{ position:'absolute', top:12, left:12 }}>
            <Badge variant={experience.status} />
          </div>
          <div style={{ position:'absolute', bottom:12, right:12, background:'var(--gold)', color:'var(--ink)', padding:'4px 12px', borderRadius:99, fontSize:14, fontWeight:700, fontFamily:'var(--font-mono)' }}>
            ₹{experience.price.toLocaleString()}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding:20, flex:1, display:'flex', flexDirection:'column', gap:10 }}>
          <h3 style={{ fontFamily:'var(--font-display)', fontSize:20, fontWeight:600, color:'var(--text-primary)', lineHeight:1.3 }}>
            {experience.title}
          </h3>

          <p style={{ fontSize:13, color:'var(--text-secondary)', lineHeight:1.6, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
            {experience.description}
          </p>

          <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:'auto' }}>
            <MetaChip icon="📍" text={experience.location} />
            <MetaChip icon="🗓" text={formattedDate} />
          </div>

          {/* Actions */}
          {showActions && (
            <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginTop:8, paddingTop:14, borderTop:'1px solid var(--ink-muted)' }}>
              {canBook && experience.status === 'published' && (
                <Button size="sm" variant="primary" onClick={() => setBookModal(true)}>
                  Book Now
                </Button>
              )}
              {canPublish && (
                <Button size="sm" variant="success" loading={loading==='publish'} onClick={handlePublish}>
                  Publish
                </Button>
              )}
              {canBlock && (
                <Button size="sm" variant="danger" loading={loading==='block'} onClick={handleBlock}>
                  Block
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Book Modal */}
      <Modal open={bookModal} onClose={() => setBookModal(false)} title={`Book — ${experience.title}`} width={420}>
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          <div style={{ background:'var(--surface-overlay)', borderRadius:'var(--radius)', padding:16, display:'flex', justifyContent:'space-between' }}>
            <div>
              <div style={{ fontSize:12, color:'var(--text-muted)', fontFamily:'var(--font-mono)' }}>PRICE PER SEAT</div>
              <div style={{ fontSize:24, fontFamily:'var(--font-display)', color:'var(--gold)', fontWeight:600 }}>₹{experience.price.toLocaleString()}</div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:12, color:'var(--text-muted)', fontFamily:'var(--font-mono)' }}>DATE</div>
              <div style={{ fontSize:13, color:'var(--text-secondary)', marginTop:4 }}>{formattedDate}</div>
            </div>
          </div>

          <Input
            label="Number of Seats"
            type="number"
            min={1}
            value={seats}
            onChange={e => { setSeats(e.target.value); setSeatsErr(''); }}
            error={seatsErr}
            icon="🪑"
          />

          {parseInt(seats) > 0 && (
            <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 0', borderTop:'1px solid var(--ink-muted)' }}>
              <span style={{ color:'var(--text-secondary)', fontSize:14 }}>Total</span>
              <span style={{ color:'var(--gold)', fontFamily:'var(--font-display)', fontSize:20, fontWeight:600 }}>
                ₹{(experience.price * (parseInt(seats) || 0)).toLocaleString()}
              </span>
            </div>
          )}

          <Button fullWidth loading={loading==='book'} onClick={handleBook}>
            Confirm Booking
          </Button>
        </div>
      </Modal>
    </>
  );
}

function MetaChip({ icon, text }: { icon: string; text: string }) {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'4px 10px', background:'var(--surface-overlay)', borderRadius:99, fontSize:12, color:'var(--text-secondary)', fontFamily:'var(--font-mono)' }}>
      {icon} {text}
    </span>
  );
}