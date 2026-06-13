'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Gift } from '@/lib/types'
import GiftCard from './GiftCard'
import GiftModal from './GiftModal'

export default function WishlistSection() {
  const [gifts, setGifts] = useState<Gift[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Gift | null>(null)

  async function loadGifts() {
    try {
      const res = await fetch('/api/gifts')
      if (res.ok) setGifts(await res.json())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadGifts() }, [])

  function handleReserved() {
    if (selected) {
      setGifts(prev => prev.map(g => g.id === selected.id ? { ...g, is_reserved: true } : g))
      setSelected(prev => prev ? { ...prev, is_reserved: true } : prev)
    }
  }

  return (
    <section className="section" style={{ zIndex: 1, position: 'relative' }}>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto"
      >
        <div className="text-center mb-14">
          <p
            style={{ fontSize: 12, letterSpacing: '0.35em', color: 'rgba(255,45,120,0.7)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 12 }}
          >
            ✨ Gift ideas
          </p>
          <h2
            className="font-display font-black"
            style={{
              fontSize: 'clamp(2.5rem, 7vw, 5rem)',
              background: 'linear-gradient(135deg, #ff2d78, #bf00ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.03em',
              lineHeight: 1,
            }}
          >
            Wishlist
          </h2>
          <p style={{ marginTop: 16, fontSize: 14, color: 'rgba(45,10,30,0.45)', maxWidth: 380, margin: '16px auto 0' }}>
            Натисни на подарунок, щоб дізнатись більше або зарезервувати його
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: '3px solid rgba(255,45,120,0.2)',
                borderTopColor: '#ff2d78',
                animation: 'discospin 0.8s linear infinite',
              }}
            />
          </div>
        ) : gifts.length === 0 ? (
          <div
            className="glass-card text-center"
            style={{ padding: 60, maxWidth: 400, margin: '0 auto' }}
          >
            <span style={{ fontSize: 50 }}>🎁</span>
            <p style={{ marginTop: 16, color: 'rgba(45,10,30,0.55)', fontSize: 15 }}>
              Список подарунків скоро буде готовий!
            </p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: 20,
            }}
          >
            {gifts.map((gift, i) => (
              <motion.div
                key={gift.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
              >
                <GiftCard gift={gift} onClick={() => setSelected(gift)} />
              </motion.div>
            ))}
          </div>
        )}

        {/* Legend */}
        {gifts.length > 0 && (
          <div className="flex justify-center gap-6 mt-10">
            <div className="flex items-center gap-2">
              <span className="badge-available">Available</span>
              <span style={{ fontSize: 12, color: 'rgba(45,10,30,0.45)' }}>Можна зарезервувати</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge-reserved">Reserved</span>
              <span style={{ fontSize: 12, color: 'rgba(45,10,30,0.45)' }}>Вже зайнятий</span>
            </div>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {selected && (
          <GiftModal
            gift={selected}
            onClose={() => setSelected(null)}
            onReserved={handleReserved}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
