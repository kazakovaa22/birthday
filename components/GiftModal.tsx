'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import type { Gift } from '@/lib/types'
import ReservationModal from './ReservationModal'

interface Props {
  gift: Gift
  onClose: () => void
  onReserved: () => void
}

export default function GiftModal({ gift, onClose, onReserved }: Props) {
  const [showReserve, setShowReserve] = useState(false)
  const [reserved, setReserved] = useState(gift.is_reserved)
  const [success, setSuccess] = useState(false)

  function handleReserveSuccess() {
    setReserved(true)
    setSuccess(true)
    setShowReserve(false)
    onReserved()
  }

  return (
    <>
      <div className="modal-backdrop" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.93, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 30 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card w-full max-w-2xl overflow-hidden"
          style={{ maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Close */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: 16,
              right: 20,
              zIndex: 10,
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(45,10,30,0.45)',
              fontSize: 20,
              cursor: 'pointer',
              borderRadius: '50%',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
            }}
          >
            ×
          </button>

          {/* Image */}
          <div
            style={{
              width: '100%',
              aspectRatio: '16/9',
              background: 'linear-gradient(135deg, rgba(255,45,120,0.1), rgba(191,0,255,0.1))',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {gift.image_url ? (
              <Image
                src={gift.image_url}
                alt={gift.name}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 672px) 100vw, 672px"
              />
            ) : (
              <span style={{ fontSize: 80 }}>🎁</span>
            )}

            {/* Status overlay */}
            {reserved && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.55)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  className="font-display font-black"
                  style={{
                    fontSize: 'clamp(2rem, 8vw, 3.5rem)',
                    color: '#f87171',
                    transform: 'rotate(-8deg)',
                    textShadow: '0 0 30px rgba(239,68,68,0.8)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Зарезервовано
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div style={{ padding: 'clamp(24px, 5vw, 40px)' }}>
            <div className="flex items-start justify-between gap-4 mb-4">
              <h2
                className="font-display font-black"
                style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', color: '#2d0a1e', lineHeight: 1.2 }}
              >
                {gift.name}
              </h2>
              <span className={reserved ? 'badge-reserved' : 'badge-available'} style={{ flexShrink: 0 }}>
                {reserved ? 'Reserved' : 'Available'}
              </span>
            </div>

            {gift.price && (
              <p
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #ff2d78, #bf00ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: 16,
                }}
              >
                {gift.price.toLocaleString('uk-UA')} ₴
              </p>
            )}

            {gift.description && (
              <p style={{ fontSize: 15, color: 'rgba(45,10,30,0.45)', lineHeight: 1.7, marginBottom: 24 }}>
                {gift.description}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              {!reserved && (
                <button
                  className="neon-btn"
                  style={{ padding: '12px 28px', borderRadius: 12, fontSize: 15 }}
                  onClick={() => setShowReserve(true)}
                >
                  🎁 Зарезервувати
                </button>
              )}

              {gift.store_url && (
                <a
                  href={gift.store_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '12px 24px',
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 600,
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#2d0a1e',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease',
                  }}
                >
                  🛍 Переглянути в магазині ↗
                </a>
              )}
            </div>

            {success && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  marginTop: 20,
                  padding: '14px 18px',
                  background: 'rgba(34,197,94,0.1)',
                  border: '1px solid rgba(34,197,94,0.25)',
                  borderRadius: 12,
                  fontSize: 14,
                  color: '#4ade80',
                }}
              >
                🎉 Дякуємо! Ти зарезервував(ла) цей подарунок.
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showReserve && (
          <ReservationModal
            giftId={gift.id}
            giftName={gift.name}
            onClose={() => setShowReserve(false)}
            onSuccess={handleReserveSuccess}
          />
        )}
      </AnimatePresence>
    </>
  )
}
