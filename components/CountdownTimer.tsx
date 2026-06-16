'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const TARGET = new Date('2026-06-22T19:30:00')

function getTimeLeft() {
  const diff = TARGET.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, past: true }
  return {
    days:    Math.floor(diff / 86_400_000),
    hours:   Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000)  / 60_000),
    seconds: Math.floor((diff % 60_000)     / 1_000),
    past:    false,
  }
}

function Block({ value, label }: { value: number; label: string }) {
  return (
    <div className="countdown-block flex flex-col items-center gap-1">
      <span
        className="font-display font-black tabular-nums"
        style={{
          fontSize: 'clamp(2rem, 6vw, 3.5rem)',
          background: 'linear-gradient(135deg, #ff2d78, #bf00ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1,
        }}
      >
        {String(value).padStart(2, '0')}
      </span>
      <span style={{ fontSize: 11, letterSpacing: '0.2em', color: 'rgba(45,10,30,0.45)', textTransform: 'uppercase' }}>
        {label}
      </span>
    </div>
  )
}

export default function CountdownTimer() {
  const [time, setTime] = useState(getTimeLeft)

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="section" style={{ zIndex: 1, position: 'relative' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="max-w-2xl mx-auto text-center"
      >
        <p
          className="mb-3 font-semibold tracking-widest uppercase"
          style={{ fontSize: 12, color: 'rgba(255,45,120,0.7)', letterSpacing: '0.35em' }}
        >
          До вечірки залишилось
        </p>

        {time.past ? (
          <p className="gradient-text font-display font-black" style={{ fontSize: 'clamp(2rem, 6vw, 4rem)' }}>
            🎉 Вечірка вже тут! 🎉
          </p>
        ) : (
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <Block value={time.days}    label="днів"   />
            <Separator />
            <Block value={time.hours}   label="годин"  />
            <Separator />
            <Block value={time.minutes} label="хвилин" />
            <Separator />
            <Block value={time.seconds} label="секунд" />
          </div>
        )}
      </motion.div>
    </section>
  )
}

function Separator() {
  return (
    <div
      className="self-center font-black"
      style={{ color: 'rgba(255,45,120,0.35)', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', lineHeight: 1, paddingBottom: 22 }}
    >
      :
    </div>
  )
}
