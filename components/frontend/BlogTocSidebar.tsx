'use client'

import { useEffect, useState } from 'react'

interface TocItem {
  id: string
  text: string
  level: number
}

interface BlogTocSidebarProps {
  toc: TocItem[]
  titleLabel?: string
}

export default function BlogTocSidebar({ toc, titleLabel = 'Índice del artículo' }: BlogTocSidebarProps) {
  const [activeId, setActiveId] = useState<string>('')
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false)

  useEffect(() => {
    if (toc.length === 0) return

    const handleScroll = () => {
      let currentActive = toc[0].id
      
      for (const item of toc) {
        const el = document.getElementById(item.id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 150) {
            currentActive = item.id
          } else {
            break
          }
        }
      }
      
      setActiveId(currentActive)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [toc])

  const handleClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    setIsMobileOpen(false)

    const el = document.getElementById(id)
    if (el) {
      const offset = 120 // Header height offset
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = el.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  if (toc.length === 0) return null

  return (
    <>
      {/* ── DESKTOP SIDEBAR ─────────────────────────────────── */}
      <aside className="blog-toc-sidebar" style={{
        position: 'sticky',
        top: '120px',
        alignSelf: 'start',
        maxHeight: 'calc(100vh - 160px)',
        overflowY: 'auto',
        padding: '1.5rem',
        background: 'var(--bg-card, rgba(30, 41, 59, 0.4))',
        border: '1px solid var(--border-color, rgba(148, 163, 184, 0.12))',
        borderRadius: '1rem',
        backdropFilter: 'blur(8px)',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <h4 style={{
          fontSize: '0.85rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--text-secondary, #94a3b8)',
          marginBottom: '1rem',
          marginTop: 0,
          borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
          paddingBottom: '0.5rem',
        }}>
          {titleLabel}
        </h4>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {toc.map((item) => {
            const isActive = activeId === item.id
            return (
              <li
                key={item.id}
                style={{
                  paddingLeft: item.level === 3 ? '1rem' : '0',
                  fontSize: item.level === 3 ? '0.85rem' : '0.9rem',
                  lineHeight: 1.4,
                }}
              >
                <button
                  type="button"
                  onClick={(e) => handleClick(item.id, e)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    textDecoration: 'none',
                    color: isActive ? 'var(--accent-1, #22d3ee)' : 'var(--text-muted, #64748b)',
                    fontWeight: isActive ? 700 : 400,
                    transition: 'color 0.2s',
                    display: 'inline-flex',
                    alignItems: 'center',
                  }}
                >
                  <span style={{
                    marginRight: isActive ? '0.4rem' : '0',
                    color: 'var(--accent-1, #22d3ee)',
                    display: isActive ? 'inline-block' : 'none',
                  }}>
                    ✦
                  </span>
                  <span>{item.text}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </aside>

      {/* ── MOBILE FLOATING BUTTON ─────────────────────────── */}
      <button
        type="button"
        onClick={() => setIsMobileOpen(true)}
        className="blog-toc-mobile-btn"
        aria-label="Abrir índice del artículo"
        title={titleLabel}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
      </button>

      {/* ── MOBILE TOC DRAWER MODAL ────────────────────────── */}
      {isMobileOpen && (
        <div
          className="blog-toc-mobile-overlay"
          onClick={() => setIsMobileOpen(false)}
        >
          <div
            className="blog-toc-mobile-drawer"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '1rem',
              borderBottom: '1px solid rgba(148, 163, 184, 0.15)',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>📖</span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f1f5f9', margin: 0, fontFamily: 'Outfit, sans-serif' }}>
                  {titleLabel}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  color: '#94a3b8',
                  fontSize: '1rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                ✕
              </button>
            </div>

            {/* List */}
            <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {toc.map((item) => {
                  const isActive = activeId === item.id
                  return (
                    <li
                      key={item.id}
                      style={{
                        paddingLeft: item.level === 3 ? '1rem' : '0',
                        fontSize: item.level === 3 ? '0.9rem' : '0.95rem',
                        lineHeight: 1.4,
                      }}
                    >
                      <button
                        type="button"
                        onClick={(e) => handleClick(item.id, e)}
                        style={{
                          background: isActive ? 'rgba(34, 211, 238, 0.1)' : 'transparent',
                          border: isActive ? '1px solid rgba(34, 211, 238, 0.25)' : '1px solid transparent',
                          borderRadius: '0.5rem',
                          padding: '0.6rem 0.85rem',
                          width: '100%',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontFamily: 'inherit',
                          fontSize: 'inherit',
                          color: isActive ? '#22d3ee' : '#cbd5e1',
                          fontWeight: isActive ? 700 : 500,
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          boxSizing: 'border-box'
                        }}
                      >
                        <span style={{
                          color: '#22d3ee',
                          fontSize: '0.8rem',
                          visibility: isActive ? 'visible' : 'hidden'
                        }}>
                          ✦
                        </span>
                        <span>{item.text}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ── RESPONSIVE STYLES ───────────────────────────────── */}
      <style dangerouslySetInnerHTML={{ __html: `
        .blog-toc-mobile-btn {
          display: none;
        }
        @media (max-width: 768px) {
          .blog-toc-sidebar {
            display: none !important;
          }
          .blog-toc-mobile-btn {
            display: flex !important;
            align-items: center;
            justify-content: center;
            position: fixed !important;
            bottom: 2rem !important;
            right: 1.5rem !important;
            width: 50px !important;
            height: 50px !important;
            border-radius: 50% !important;
            background: linear-gradient(135deg, #0ea5e9 0%, #10b981 100%) !important;
            color: #ffffff !important;
            border: 2px solid rgba(255, 255, 255, 0.2) !important;
            box-shadow: 0 8px 24px rgba(14, 165, 233, 0.45), 0 2px 8px rgba(0, 0, 0, 0.3) !important;
            cursor: pointer !important;
            z-index: 9998 !important;
            pointer-events: auto !important;
            transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease !important;
          }
          .blog-toc-mobile-btn:active {
            transform: scale(0.92) !important;
          }
          .blog-toc-mobile-overlay {
            position: fixed !important;
            inset: 0 !important;
            background: rgba(15, 23, 42, 0.75) !important;
            backdrop-filter: blur(12px) !important;
            -webkit-backdrop-filter: blur(12px) !important;
            z-index: 99999 !important;
            display: flex !important;
            align-items: flex-end !important;
            justify-content: center !important;
            animation: fadeInTocOverlay 0.25s ease-out forwards;
          }
          .blog-toc-mobile-drawer {
            width: 100% !important;
            max-width: 540px !important;
            background: #0f172a !important;
            border: 1px solid rgba(148, 163, 184, 0.2) !important;
            border-bottom: none !important;
            border-radius: 1.5rem 1.5rem 0 0 !important;
            padding: 1.5rem !important;
            box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.5) !important;
            box-sizing: border-box !important;
            animation: slideUpTocDrawer 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        }
        @keyframes fadeInTocOverlay {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUpTocDrawer {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      ` }} />
    </>
  )
}
