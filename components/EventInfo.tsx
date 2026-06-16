'use client'

import { motion } from 'framer-motion'

const CARDS = [
  {
    icon: '📅',
    label: 'Дата',
    value: '22 червня',
    sub: 'Понеділок',
    accent: '#ff2d78',
  },
  {
    icon: '🕕',
    label: 'Час',
    value: '19:30',
    sub: 'Не запізнюйся',
    accent: '#bf00ff',
  },
  {
    icon: '📍',
    label: 'Адреса',
    value: 'Домовимось потім',
    sub: 'Деталі невдовзі',
    accent: '#66ccff',
  },
]

export default function EventInfo() {
  return (
    <section className="section" style={{ zIndex: 1, position: 'relative' }}>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <h2
          className="text-center font-display font-black mb-12"
          style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            background: 'linear-gradient(135deg, #ff2d78, #bf00ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Деталі
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {CARDS.map((card, i) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              className="glass-card glass-card-hover"
              style={{ padding: '32px 28px', textAlign: 'center' }}
            >
              <div style={{ fontSize: 40, marginBottom: 16 }}>{card.icon}</div>

              <p
                style={{
                  fontSize: 11,
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: card.accent,
                  fontWeight: 600,
                  marginBottom: 10,
                  opacity: 0.8,
                }}
              >
                {card.label}
              </p>

              <p
                className="font-display font-black"
                style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: '#2d0a1e', lineHeight: 1.1, marginBottom: 8 }}
              >
                {card.value}
              </p>

              <p style={{ fontSize: 13, color: 'rgba(45,10,30,0.45)' }}>{card.sub}</p>

              <div
                style={{
                  height: 2,
                  background: `linear-gradient(90deg, transparent, ${card.accent}50, transparent)`,
                  marginTop: 20,
                  borderRadius: 99,
                }}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
