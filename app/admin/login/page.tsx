'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await signIn('credentials', {
      username,
      password,
      redirect: false,
    })

    setLoading(false)
    if (result?.error) {
      setError('用户名或密码错误')
    } else {
      router.push('/admin')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 400,
        padding: '2.5rem',
        background: 'rgba(30, 41, 59, 0.8)',
        border: '1px solid rgba(148,163,184,0.12)',
        borderRadius: '1rem',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            background: 'linear-gradient(90deg, #22d3ee, #a855f7)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.5rem',
          }}>
            IPTV Pro Admin
          </div>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>管理后台登录</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#94a3b8', marginBottom: '0.375rem' }}>
              用户名
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'rgba(15,23,42,0.8)',
                border: '1px solid rgba(148,163,184,0.2)',
                borderRadius: '0.5rem',
                color: '#f1f5f9',
                fontSize: '0.9375rem',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = 'rgba(34,211,238,0.5)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(148,163,184,0.2)'}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#94a3b8', marginBottom: '0.375rem' }}>
              密码
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                background: 'rgba(15,23,42,0.8)',
                border: '1px solid rgba(148,163,184,0.2)',
                borderRadius: '0.5rem',
                color: '#f1f5f9',
                fontSize: '0.9375rem',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = 'rgba(34,211,238,0.5)'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(148,163,184,0.2)'}
            />
          </div>

          {error && (
            <div style={{
              padding: '0.75rem 1rem',
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '0.5rem',
              color: '#f87171',
              fontSize: '0.875rem',
            }}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            id="login-submit"
            style={{
              padding: '0.875rem',
              background: loading ? 'rgba(34,211,238,0.5)' : 'linear-gradient(90deg, #22d3ee, #a855f7)',
              border: 'none',
              borderRadius: '0.5rem',
              color: 'white',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'opacity 0.2s',
              marginTop: '0.5rem',
            }}
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </form>
      </div>
    </div>
  )
}
