'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const FALLBACK_MEME = '/meme.jpg'

export default function MemeSection() {
  const [memeUrl, setMemeUrl] = useState(FALLBACK_MEME)

  useEffect(() => {
    fetch('/api/admin/config')
      .then(r => r.json())
      .then((configs: Array<{ key: string; value: string }>) => {
        const meme = configs?.find(c => c.key === 'meme_url')
        if (meme?.value) setMemeUrl(meme.value)
      })
      .catch(() => {})
  }, [])

  return (
    <section className="section" style={{ zIndex: 1, position: 'relative' }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-md mx-auto text-center"
      >
        <div
          className="glass-card overflow-hidden"
          style={{
            padding: 0,
            borderRadius: 24,
            boxShadow: '0 20px 60px rgba(255,45,120,0.2)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={memeUrl}
            alt="мем"
            style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 24 }}
            onError={() => setMemeUrl(FALLBACK_MEME)}
          />
        </div>

        <p style={{ marginTop: 14, fontSize: 13, color: 'rgba(45,10,30,0.35)', fontStyle: 'italic' }}>
          актуально, довіряй
        </p>
      </motion.div>
    </section>
  )
}
