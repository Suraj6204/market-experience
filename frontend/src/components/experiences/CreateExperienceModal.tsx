import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { experiencesApi } from '../../api/experiences';
import { useToast } from '../../context/ToastContext';
import type { Experience } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated: (exp: Experience) => void;
}

interface Form { title: string; description: string; location: string; price: string; start_time: string; }
interface Errors { title?: string; description?: string; location?: string; price?: string; start_time?: string; }

export function CreateExperienceModal({ open, onClose, onCreated }: Props) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Form>({ title:'', description:'', location:'', price:'', start_time:'' });
  const [errors, setErrors] = useState<Errors>({});

  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.title.trim())       e.title       = 'Title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.location.trim())    e.location    = 'Location is required';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) < 0)
      e.price = 'Valid non-negative price required';
    if (!form.start_time)         e.start_time  = 'Start time is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const exp = await experiencesApi.create({
        title: form.title.trim(),
        description: form.description.trim(),
        location: form.location.trim(),
        price: Math.round(Number(form.price)),
        start_time: new Date(form.start_time).toISOString(),
      });
      toast('Experience created as draft!', 'success');
      onCreated(exp);
      setForm({ title:'', description:'', location:'', price:'', start_time:'' });
    } catch (e: any) {
      toast(e.message, 'error');
    } finally { setLoading(false); }
  };

  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(p => ({ ...p, [k]: e.target.value }));
    setErrors(p => ({ ...p, [k]: undefined }));
  };

  return (
    <Modal open={open} onClose={onClose} title="Create New Experience" width={560}>
      <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
        <Input label="Title" value={form.title} onChange={set('title')} error={errors.title} placeholder="e.g. Sunset Trek in Manali" icon="✦" />

        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          <label style={{ fontSize:12, fontWeight:500, color:'var(--text-secondary)', letterSpacing:'0.08em', textTransform:'uppercase', fontFamily:'var(--font-mono)' }}>Description</label>
          <textarea
            value={form.description}
            onChange={set('description')}
            rows={3}
            placeholder="Describe the experience..."
            style={{
              width:'100%', padding:'11px 14px', background:'var(--surface-overlay)',
              border:`1.5px solid ${errors.description ? 'var(--accent-red)' : 'var(--ink-muted)'}`,
              borderRadius:'var(--radius)', color:'var(--text-primary)', fontSize:14,
              fontFamily:'var(--font-body)', resize:'vertical', lineHeight:1.6,
              transition:'border-color var(--transition)',
            }}
            onFocus={e => e.target.style.borderColor = errors.description ? 'var(--accent-red)' : 'var(--gold)'}
            onBlur={e => e.target.style.borderColor  = errors.description ? 'var(--accent-red)' : 'var(--ink-muted)'}
          />
          {errors.description && <span style={{ fontSize:12, color:'var(--accent-red)', fontFamily:'var(--font-mono)' }}>{errors.description}</span>}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
          <Input label="Location" value={form.location} onChange={set('location')} error={errors.location} placeholder="e.g. Manali" icon="📍" />
          <Input label="Price (₹)" type="number" min={0} value={form.price} onChange={set('price')} error={errors.price} placeholder="e.g. 1500" icon="₹" />
        </div>

        <Input label="Start Date & Time" type="datetime-local" value={form.start_time} onChange={set('start_time')} error={errors.start_time} />

        <div style={{ display:'flex', gap:12, marginTop:4 }}>
          <Button variant="ghost" fullWidth onClick={onClose}>Cancel</Button>
          <Button fullWidth loading={loading} onClick={handleSubmit}>Create Experience</Button>
        </div>
      </div>
    </Modal>
  );
}