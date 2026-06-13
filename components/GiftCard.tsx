'use client'

import Image from 'next/image'
import type { Gift } from '@/lib/types'

interface Props {
  gift: Gift
  onClick: () => void
}

export default function GiftCard({ gift, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="glass-card glass-card-hover text-left w-full"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        cursor: 'pointer',
        background: 'none',
        border: 'none',
        padding: 0,
      }}
    >
      {/* Image area */}
      <div
        style={{
          width: '100%',
          aspectRatio: '4/3',
          position: 'relative',
          background: 'linear-gradient(135deg, rgba(255,45,120,0.08), rgba(191,0,255,0.08))',
          borderRadius: '20px 20px 0 0',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {gift.image_url ? (
          <>
            <Image
              src={gift.image_url}
              alt={gift.name}
              fill
              style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            {gift.is_reserved && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 900,
                    fontSize: 22,
                    color: '#f87171',
                    transform: 'rotate(-12deg)',
                    textShadow: '0 0 20px rgba(239,68,68,0.8)',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Зарезервовано
                </span>
              </div>
            )}
          </>
        ) : (
          <span style={{ fontSize: 56 }}>🎁</span>
        )}
      </div>

      {/* Info */}
      <div className="glass-card" style={{ padding: '16px 18px', borderRadius: '0 0 20px 20px', flex: 1, background: 'rgba(255,255,255,0.03)' }}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: '#2d0a1e',
              lineHeight: 1.3,
              textAlign: 'left',
            }}
          >
            {gift.name}
          </h3>
          <span className={gift.is_reserved ? 'badge-reserved' : 'badge-available'} style={{ flexShrink: 0 }}>
            {gift.is_reserved ? 'Reserved' : 'Available'}
          </span>
        </div>

        {gift.description && (
          <p
            style={{
              fontSize: 13,
              color: 'rgba(232,232,240,0.5)',
              lineHeight: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textAlign: 'left',
            }}
          >
            {gift.description}
          </p>
        )}

        {gift.price && (
          <p
            style={{
              marginTop: 10,
              fontSize: 16,
              fontWeight: 800,
              background: 'linear-gradient(135deg, #ff2d78, #bf00ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {gift.price.toLocaleString('uk-UA')} ₴
          </p>
        )}
      </div>
    </button>
  )
}
