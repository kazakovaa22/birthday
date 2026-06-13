'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  giftId: string
  giftName: string
  onClose: () => void
  onSuccess: () => void
}

export default function ReservationModal({ giftId, giftName, onClose, onSuccess }: Props) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gift_id: giftId, name: name.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error === 'Already reserved' ? 'Цей подарунок вже хтось зарезервував 😔' : data.error)
        return
      }

      onSuccess()
    } catch {
      setError('Щось пішло не так. Спробуй ще раз.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card w-full max-w-md"
        style={{ padding: 40, position: 'relative' }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 20,
            background: 'none',
            border: 'none',
            color: 'rgba(45,10,30,0.45)',
            fontSize: 24,
            cursor: 'pointer',
            lineHeight: 1,
          }}
        >
          ×
        </button>

        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <span style={{ fontSize: 40 }}>🎁</span>
          <h3
            className="font-display font-bold mt-3 mb-1"
            style={{ fontSize: 22, color: '#2d0a1e' }}
          >
            Зарезервувати подарунок
          </h3>
          <p style={{ fontSize: 14, color: 'rgba(45,10,30,0.45)', lineHeight: 1.5 }}>
            {giftName}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="reserve-name"
              style={{ display: 'block', fontSize: 13, color: 'rgba(45,10,30,0.45)', marginBottom: 8 }}
            >
              Твоє ім'я
            </label>
            <input
              id="reserve-name"
              className="neon-input"
              type="text"
              placeholder="Як тебе звати?"
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
              required
              maxLength={80}
            />
          </div>

          {error && (
            <p
              style={{
                fontSize: 13,
                color: '#f87171',
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderRadius: 8,
                padding: '10px 14px',
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="neon-btn w-full"
            style={{ padding: '14px 24px', borderRadius: 12, fontSize: 15 }}
          >
            {loading ? 'Резервуємо...' : '✨ Зарезервувати'}
          </button>
        </form>

        <p
          style={{
            fontSize: 12,
            color: 'rgba(45,10,30,0.45)',
            textAlign: 'center',
            marginTop: 16,
            lineHeight: 1.6,
          }}
        >
          Іменинниця не буде знати, хто що зарезервував 🤫
        </p>
      </motion.div>
    </div>
  )
}
