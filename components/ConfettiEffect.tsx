'use client'

import { useEffect, useState } from 'react'

interface Piece {
  id: number
  left: string
  delay: string
  duration: string
  width: number
  height: number
  colorClass: string
  borderRadius: string
  rotation: number
}

const COLOR_CLASSES = [
  'confetti-pink',
  'confetti-purple',
  'confetti-silver',
  'confetti-gold',
  'confetti-cyan',
]

function makePieces(count: number, offset: number): Piece[] {
  return Array.from({ length: count }, (_, i) => {
    const kind = Math.random()
    const size = 6 + Math.floor(Math.random() * 8)
    return {
      id: offset + i,
      left: `${Math.random() * 100}%`,
      delay: `${(Math.random() * 3).toFixed(2)}s`,
      duration: `${(2.5 + Math.random() * 2).toFixed(2)}s`,
      width: kind < 0.33 ? size / 2 : size,
      height: kind < 0.33 ? size * 3 : size,
      colorClass: COLOR_CLASSES[Math.floor(Math.random() * COLOR_CLASSES.length)],
      borderRadius: kind > 0.66 ? '50%' : '2px',
      rotation: Math.floor(Math.random() * 360),
    }
  })
}

export default function ConfettiEffect() {
  const [pieces, setPieces] = useState<Piece[]>([])

  useEffect(() => {
    // Only runs on client — no hydration mismatch
    setPieces(makePieces(60, 0))

    let wave = 0
    const id = setInterval(() => {
      wave += 1
      if (wave > 4) { clearInterval(id); return }
      setPieces(makePieces(30, wave * 200))
    }, 4500)

    return () => clearInterval(id)
  }, [])

  if (pieces.length === 0) return null

  return (
    <div
      aria-hidden
      style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 10, overflow: 'hidden' }}
    >
      {pieces.map(p => (
        <div
          key={p.id}
          className={`${p.colorClass} animate-confetti`}
          style={{
            position: 'absolute',
            top: -20,
            left: p.left,
            width: p.width,
            height: p.height,
            borderRadius: p.borderRadius,
            animationDelay: p.delay,
            animationDuration: p.duration,
            transform: `rotate(${p.rotation}deg)`,
            opacity: 0.85,
          }}
        />
      ))}
    </div>
  )
}
