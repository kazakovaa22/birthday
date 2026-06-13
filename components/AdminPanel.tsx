'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { Gift } from '@/lib/types'
import { adminHeaders, clearAdminToken } from '@/lib/admin'

interface GiftFormData {
  name: string
  description: string
  price: string
  store_url: string
  image_url: string
  sort_order: string
}

const EMPTY_FORM: GiftFormData = {
  name: '', description: '', price: '', store_url: '', image_url: '', sort_order: '0',
}

export default function AdminPanel() {
  const [gifts, setGifts] = useState<Gift[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'gifts' | 'add' | 'meme'>('gifts')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<GiftFormData>(EMPTY_FORM)
  const [memeUrl, setMemeUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/gifts', { headers: adminHeaders() })
      if (res.ok) setGifts(await res.json())
    } finally { setLoading(false) }
  }

  async function loadConfig() {
    const res = await fetch('/api/admin/config', { headers: adminHeaders() })
    if (res.ok) {
      const configs: Array<{ key: string; value: string }> = await res.json()
      const meme = configs.find(c => c.key === 'meme_url')
      if (meme) setMemeUrl(meme.value)
    }
  }

  useEffect(() => { load(); loadConfig() }, [])

  function flash(text: string) {
    setMsg(text)
    setTimeout(() => setMsg(''), 3000)
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/admin/upload', { method: 'POST', headers: adminHeaders(), body: fd })
    const data = await res.json()
    if (res.ok) setForm(f => ({ ...f, image_url: data.url }))
    else flash('Помилка завантаження: ' + data.error)
    setUploading(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    const body = {
      name: form.name,
      description: form.description || null,
      price: form.price ? Number(form.price) : null,
      store_url: form.store_url || null,
      image_url: form.image_url || null,
      sort_order: Number(form.sort_order) || 0,
    }

    let res: Response
    if (editingId) {
      res = await fetch(`/api/admin/gifts/${editingId}`, {
        method: 'PUT', headers: { ...adminHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    } else {
      res = await fetch('/api/admin/gifts', {
        method: 'POST', headers: { ...adminHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
    }

    setSaving(false)
    if (res.ok) {
      flash(editingId ? 'Подарунок оновлено ✓' : 'Подарунок додано ✓')
      setForm(EMPTY_FORM); setEditingId(null); setTab('gifts')
      load()
    } else {
      const d = await res.json()
      flash('Помилка: ' + d.error)
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Видалити "${name}"?`)) return
    const res = await fetch(`/api/admin/gifts/${id}`, { method: 'DELETE', headers: adminHeaders() })
    if (res.ok) { flash('Видалено ✓'); load() }
  }

  async function handleResetReservation(id: string) {
    if (!confirm('Скасувати резервацію?')) return
    const res = await fetch(`/api/admin/gifts/${id}`, { method: 'PATCH', headers: adminHeaders() })
    if (res.ok) { flash('Резервацію скасовано ✓'); load() }
  }

  function startEdit(gift: Gift) {
    setForm({
      name: gift.name,
      description: gift.description || '',
      price: gift.price ? String(gift.price) : '',
      store_url: gift.store_url || '',
      image_url: gift.image_url || '',
      sort_order: String(gift.sort_order),
    })
    setEditingId(gift.id)
    setTab('add')
  }

  async function saveMeme(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/admin/config', {
      method: 'POST',
      headers: { ...adminHeaders(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'meme_url', value: memeUrl }),
    })
    setSaving(false)
    flash(res.ok ? 'Мем оновлено ✓' : 'Помилка')
  }

  const reserved = gifts.filter(g => g.is_reserved).length

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 16px 80px' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display font-black" style={{ fontSize: 28, color: '#e8e8f0' }}>
            Admin Panel
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(232,232,240,0.4)', marginTop: 4 }}>
            {gifts.length} подарунків · {reserved} зарезервовано
          </p>
        </div>
        <button
          onClick={() => { clearAdminToken(); window.location.reload() }}
          style={{
            padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171',
          }}
        >
          Вийти
        </button>
      </div>

      {/* Flash message */}
      {msg && (
        <div style={{
          padding: '12px 18px', borderRadius: 10, marginBottom: 20, fontSize: 14,
          background: msg.startsWith('Помилка') ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
          border: `1px solid ${msg.startsWith('Помилка') ? 'rgba(239,68,68,0.25)' : 'rgba(34,197,94,0.25)'}`,
          color: msg.startsWith('Помилка') ? '#f87171' : '#4ade80',
        }}>
          {msg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-8" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', paddingBottom: 0 }}>
        {(['gifts', 'add', 'meme'] as const).map(t => (
          <button
            key={t}
            onClick={() => { setTab(t); if (t !== 'add') { setEditingId(null); setForm(EMPTY_FORM) } }}
            style={{
              padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 14, fontWeight: 600, borderBottom: `2px solid ${tab === t ? '#ff2d78' : 'transparent'}`,
              color: tab === t ? '#ff2d78' : 'rgba(232,232,240,0.5)',
              transition: 'all 0.2s',
              marginBottom: -1,
            }}
          >
            {t === 'gifts' ? `📋 Подарунки (${gifts.length})` : t === 'add' ? (editingId ? '✏️ Редагувати' : '➕ Додати') : '😂 Мем'}
          </button>
        ))}
      </div>

      {/* Gifts list */}
      {tab === 'gifts' && (
        <div>
          {loading ? (
            <p style={{ color: 'rgba(232,232,240,0.4)', textAlign: 'center', padding: 40 }}>Завантаження...</p>
          ) : gifts.length === 0 ? (
            <div className="glass-card text-center" style={{ padding: 60 }}>
              <span style={{ fontSize: 48 }}>🎁</span>
              <p style={{ marginTop: 16, color: 'rgba(232,232,240,0.5)' }}>Додай перший подарунок!</p>
              <button className="neon-btn" style={{ marginTop: 20, padding: '10px 24px', borderRadius: 10, fontSize: 14 }} onClick={() => setTab('add')}>
                ➕ Додати подарунок
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="flex justify-end mb-2">
                <button className="neon-btn" style={{ padding: '9px 20px', borderRadius: 10, fontSize: 13 }} onClick={() => setTab('add')}>
                  ➕ Додати подарунок
                </button>
              </div>

              {gifts.map(gift => (
                <div key={gift.id} className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ width: 56, height: 56, borderRadius: 10, overflow: 'hidden', background: 'rgba(255,45,120,0.1)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {gift.image_url
                      ? <Image src={gift.image_url} alt={gift.name} width={56} height={56} style={{ objectFit: 'cover', width: '100%', height: '100%' }} unoptimized />
                      : <span style={{ fontSize: 28 }}>🎁</span>
                    }
                  </div>

                  <div style={{ flex: 1, minWidth: 200 }}>
                    <p style={{ fontWeight: 700, color: '#e8e8f0', fontSize: 15 }}>{gift.name}</p>
                    {gift.price && <p style={{ fontSize: 13, color: 'rgba(255,45,120,0.8)' }}>{gift.price.toLocaleString('uk-UA')} ₴</p>}
                    {gift.is_reserved && (
                      <p style={{ fontSize: 12, color: '#4ade80', marginTop: 2 }}>
                        ✓ Зарезервовано: <strong>{gift.reserved_by}</strong>
                      </p>
                    )}
                  </div>

                  <span className={gift.is_reserved ? 'badge-reserved' : 'badge-available'}>
                    {gift.is_reserved ? 'Reserved' : 'Available'}
                  </span>

                  <div className="flex gap-2 flex-wrap">
                    <button onClick={() => startEdit(gift)} style={btnStyle('#3b82f6')}>✏️ Ред.</button>
                    {gift.is_reserved && (
                      <button onClick={() => handleResetReservation(gift.id)} style={btnStyle('#f59e0b')}>↩ Скасувати</button>
                    )}
                    <button onClick={() => handleDelete(gift.id, gift.name)} style={btnStyle('#ef4444')}>🗑 Видалити</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add/Edit form */}
      {tab === 'add' && (
        <form onSubmit={handleSave} className="glass-card" style={{ padding: 32, maxWidth: 600 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#e8e8f0', marginBottom: 24 }}>
            {editingId ? 'Редагувати подарунок' : 'Новий подарунок'}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Field label="Назва *">
              <input className="neon-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="iPhone 15 Pro" required />
            </Field>

            <Field label="Опис">
              <textarea className="neon-input" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Короткий опис..." rows={3} style={{ resize: 'vertical' }} />
            </Field>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Ціна (₴)">
                <input className="neon-input" type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="1500" min="0" />
              </Field>
              <Field label="Порядок сортування">
                <input className="neon-input" type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: e.target.value }))} placeholder="0" />
              </Field>
            </div>

            <Field label="Посилання на магазин">
              <input className="neon-input" type="url" value={form.store_url} onChange={e => setForm(f => ({ ...f, store_url: e.target.value }))} placeholder="https://..." />
            </Field>

            <Field label="Фото">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {form.image_url && (
                  <div style={{ position: 'relative', width: 120, height: 90, borderRadius: 8, overflow: 'hidden' }}>
                    <Image src={form.image_url} alt="Preview" fill style={{ objectFit: 'cover' }} unoptimized />
                    <button type="button" onClick={() => setForm(f => ({ ...f, image_url: '' }))} style={{ position: 'absolute', top: 4, right: 4, background: 'rgba(0,0,0,0.7)', border: 'none', color: '#fff', borderRadius: '50%', width: 22, height: 22, cursor: 'pointer', fontSize: 13, lineHeight: 1 }}>×</button>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading} style={{ ...btnStyle('#6366f1'), alignSelf: 'flex-start', padding: '8px 16px' }}>
                  {uploading ? '⏳ Завантаження...' : '📷 Завантажити фото'}
                </button>
                <p style={{ fontSize: 12, color: 'rgba(232,232,240,0.35)' }}>або вставити URL:</p>
                <input className="neon-input" type="url" value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} placeholder="https://..." />
              </div>
            </Field>
          </div>

          <div className="flex gap-3 mt-6">
            <button type="submit" className="neon-btn" style={{ padding: '12px 28px', borderRadius: 10, fontSize: 15 }} disabled={saving}>
              {saving ? 'Збереження...' : editingId ? 'Оновити' : 'Додати подарунок'}
            </button>
            <button type="button" onClick={() => { setForm(EMPTY_FORM); setEditingId(null); setTab('gifts') }} style={{ ...btnStyle('#6b7280'), padding: '12px 20px', borderRadius: 10 }}>
              Скасувати
            </button>
          </div>
        </form>
      )}

      {/* Meme tab */}
      {tab === 'meme' && (
        <form onSubmit={saveMeme} className="glass-card" style={{ padding: 32, maxWidth: 500 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#e8e8f0', marginBottom: 20 }}>Мем дня</h2>
          <Field label="URL зображення">
            <input className="neon-input" type="url" value={memeUrl} onChange={e => setMemeUrl(e.target.value)} placeholder="https://..." />
          </Field>
          {memeUrl && (
            <div style={{ marginTop: 16, borderRadius: 12, overflow: 'hidden', maxWidth: 320 }}>
              <Image src={memeUrl} alt="Meme preview" width={320} height={240} style={{ width: '100%', height: 'auto' }} unoptimized onError={() => {}} />
            </div>
          )}
          <button type="submit" className="neon-btn" style={{ marginTop: 20, padding: '12px 28px', borderRadius: 10, fontSize: 15 }} disabled={saving}>
            {saving ? 'Збереження...' : 'Зберегти мем'}
          </button>
        </form>
      )}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, color: 'rgba(232,232,240,0.55)', marginBottom: 6, fontWeight: 500 }}>{label}</label>
      {children}
    </div>
  )
}

function btnStyle(color: string): React.CSSProperties {
  return {
    padding: '7px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
    background: `${color}18`, border: `1px solid ${color}40`, color,
    transition: 'all 0.2s',
  }
}
