'use client'

import { motion } from 'framer-motion'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 py-24" style={{ zIndex: 1 }}>

      {/* Pre-title */}
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        style={{ fontSize: 13, letterSpacing: '0.45em', textTransform: 'uppercase', color: 'rgba(255,45,120,0.85)', fontWeight: 600, marginBottom: 24 }}
      >
        ✨ &nbsp;You are invited&nbsp; ✨
      </motion.p>

      {/* Main title */}
      <motion.h1
        initial={{ opacity: 0, y: 32, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="gradient-text font-display font-black leading-none select-none"
        style={{ fontSize: 'clamp(3.2rem, 12vw, 9rem)', letterSpacing: '-0.03em', marginBottom: 40 }}
      >
        SASHKA'S
        <br />
        BIRTHDAY
      </motion.h1>

      {/* Photo + card row */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-3xl w-full mx-auto">

        {/* ── Birthday photo ── */}
        <motion.div
          initial={{ opacity: 0, x: -40, rotate: -6 }}
          animate={{ opacity: 1, x: 0, rotate: -4 }}
          transition={{ delay: 0.75, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{
            flexShrink: 0,
            animation: 'float 5s ease-in-out infinite',
            animationDelay: '0.5s',
          }}
        >
          <div
            style={{
              background: '#fff',
              padding: '12px 12px 36px',
              borderRadius: 4,
              boxShadow: '0 12px 48px rgba(255,45,120,0.25), 0 4px 16px rgba(0,0,0,0.1)',
              transform: 'rotate(-4deg)',
              position: 'relative',
            }}
          >
            {/* Polaroid image */}
            <div style={{ width: 200, height: 220, overflow: 'hidden', borderRadius: 2, background: '#f9d0e4' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/sashka.jpg"
                alt="Sashka"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            {/* Polaroid label */}
            <p style={{
              position: 'absolute',
              bottom: 8,
              left: 0,
              right: 0,
              textAlign: 'center',
              fontFamily: 'var(--font-display)',
              fontSize: 13,
              color: '#c0006a',
              fontWeight: 700,
              letterSpacing: '0.05em',
            }}>
              Sashka 🎀
            </p>
          </div>

          {/* Sparkle decorations around the photo */}
          <div style={{ position: 'absolute', top: -16, right: -16, fontSize: 22, animation: 'sparkle 2s ease-in-out infinite' }}>✨</div>
          <div style={{ position: 'absolute', bottom: 24, left: -20, fontSize: 18, animation: 'sparkle 1.7s ease-in-out infinite', animationDelay: '0.8s' }}>⭐</div>
        </motion.div>

        {/* ── Invite text card ── */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9, duration: 0.8, ease: 'easeOut' }}
          className="glass-card text-left"
          style={{ padding: 'clamp(22px, 5vw, 36px)', flex: 1, minWidth: 0 }}
        >
          <p className="text-xl font-semibold mb-4" style={{ color: '#2d0a1e' }}>
            Привіт! 👋
          </p>
          <p className="mb-3 leading-relaxed" style={{ color: '#5a1a35', fontSize: 16 }}>
            Я запрошую тебе на свій день народження.
          </p>
          <p className="mb-5 leading-relaxed" style={{ color: '#7a2a4a', fontSize: 15 }}>
            Як такого дрес-коду немає, головне — щоб ти почувався/почувалася комфортно.
          </p>

          <div className="space-y-2 pt-4" style={{ borderTop: '1px solid rgba(255,45,120,0.25)' }}>
            <p style={{ color: '#c0006a', fontWeight: 700, fontSize: 14, letterSpacing: '0.02em' }}>
              👗 P.S. Я БУДУ В ПЛАТТІ НА КАБЛУКАХ.
            </p>
            <p style={{ color: '#8b00cc', fontWeight: 700, fontSize: 14, letterSpacing: '0.02em' }}>
              💃 ДІВЧАТА, ДАВАЙТЕ ЗІ МНОЮ.
            </p>
            <p style={{ color: '#5a1a35', fontSize: 14 }}>
              🕺 І ХЛОПЦІВ СВОЇХ НОРМАЛЬНО ОДЯГНІТЬ.
            </p>
            <p style={{ color: '#c0006a', fontStyle: 'italic', fontSize: 14 }}>
              😎 ЯКЩО ТИ БЕЗ ДІВЧИНИ — ТИ SWAG.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ color: 'rgba(45,10,30,0.4)' }}
      >
        <span style={{ fontSize: 11, letterSpacing: '0.35em', textTransform: 'uppercase' }}>Гортай нижче</span>
        <span className="animate-scroll-bounce text-xl">↓</span>
      </motion.div>
    </section>
  )
}
