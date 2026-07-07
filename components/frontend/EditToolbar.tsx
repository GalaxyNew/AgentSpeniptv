'use client'

import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'

interface EditToolbarProps {
  locale: string
}

export default function EditToolbar({ locale }: EditToolbarProps) {
  const router = useRouter()

  const exitEditMode = async () => {
    await fetch('/api/admin/edit-mode', { method: 'DELETE' })
    router.refresh()
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 9999,
      background: 'linear-gradient(90deg, #0f172a, #1e293b)',
      borderBottom: '2px solid #22d3ee',
      height: 52,
      display: 'flex',
      alignItems: 'center',
      padding: '0 1.5rem',
      gap: '1rem',
    }}>
      {/* Mode indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#22d3ee', fontWeight: 700, fontSize: '0.875rem' }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22d3ee', display: 'inline-block', animation: 'pulse 2s infinite' }} />
        ✏️ 编辑模式
      </div>

      {/* Language tabs */}
      <div style={{ display: 'flex', gap: '0.25rem', marginLeft: '1rem' }}>
        {(['fr', 'es', 'en', 'zh'] as const).map((l) => (
          <a
            key={l}
            href={`/${l}?edit=1`}
            style={{
              padding: '0.25rem 0.75rem',
              borderRadius: '0.375rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              textDecoration: 'none',
              color: l === locale ? '#0f172a' : '#94a3b8',
              background: l === locale ? '#22d3ee' : 'rgba(148,163,184,0.1)',
              transition: 'all 0.2s',
            }}
          >
            {l}
          </a>
        ))}
      </div>

      <div style={{ flex: 1 }} />

      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
        点击任意文字直接编辑 · 点击图片替换
      </span>

      {/* Admin link */}
      <a
        href="/admin"
        style={{
          padding: '0.375rem 1rem',
          borderRadius: '0.375rem',
          fontSize: '0.8125rem',
          fontWeight: 600,
          textDecoration: 'none',
          color: '#94a3b8',
          border: '1px solid rgba(148,163,184,0.2)',
          transition: 'all 0.2s',
        }}
      >
        ⚙️ 后台
      </a>

      {/* Exit */}
      <button
        onClick={exitEditMode}
        style={{
          padding: '0.375rem 1rem',
          borderRadius: '0.375rem',
          fontSize: '0.8125rem',
          fontWeight: 600,
          color: '#ef4444',
          border: '1px solid rgba(239,68,68,0.3)',
          background: 'transparent',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        ✕ 退出编辑
      </button>

      <style>{`@keyframes pulse { 0%,100%{opacity:1}50%{opacity:0.4} }`}</style>
    </div>
  )
}
