'use client'

import { useEffect, useState } from 'react'
import { getAdminToken, setAdminToken } from '@/lib/admin'
import AdminPanel from '@/components/AdminPanel'

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const token = getAdminToken()
    if (token) {
      // Verify token is still valid
      fetch('/api/admin/gifts', { headers: { 'x-admin-token': token } })
        .then(r => { if (r.ok) setAuthed(true) })
        .finally(() => setChecking(false))
    } else {
      setChecking(false)
    }
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    setLoading(false)
    if (res.ok) {
      const { token } = await res.json()
      setAdminToken(token)
      setAuthed(true)
    } else {
      setError('Невірний пароль')
    }
  }

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#05050f' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', border: '3px solid rgba(255,45,120,0.2)', borderTopColor: '#ff2d78', animation: 'discospin 0.8s linear infinite' }} />
      </div>
    )
  }

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#05050f', padding: 16 }}>
        <div
          className="glass-card"
          style={{ width: '100%', maxWidth: 380, padding: 40, textAlign: 'center' }}
        >
          <span style={{ fontSize: 48 }}>🔐</span>
          <h1
            className="font-display font-black"
            style={{ fontSize: 26, color: '#e8e8f0', marginTop: 16, marginBottom: 6 }}
          >
            Admin
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(232,232,240,0.4)', marginBottom: 28 }}>
            Введи пароль для доступу
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <input
              className="neon-input"
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
              required
            />

            {error && (
              <p style={{ fontSize: 13, color: '#f87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '8px 12px' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              className="neon-btn"
              style={{ padding: '13px 24px', borderRadius: 12, fontSize: 15 }}
              disabled={loading}
            >
              {loading ? 'Перевірка...' : 'Увійти'}
            </button>
          </form>

          <a
            href="/"
            style={{ display: 'block', marginTop: 20, fontSize: 13, color: 'rgba(232,232,240,0.3)', textDecoration: 'none' }}
          >
            ← На головну
          </a>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#05050f', paddingTop: 60 }}>
      <AdminPanel />
    </div>
  )
}
