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

export default function BlogTocSidebar({ toc, titleLabel = 'Indice' }: BlogTocSidebarProps) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    if (toc.length === 0) return

    const handleScroll = () => {
      let currentActive = toc[0].id
      
      for (const item of toc) {
        const el = document.getElementById(item.id)
        if (el) {
          const rect = el.getBoundingClientRect()
          // If the heading is above the top 150px of the viewport
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
    handleScroll() // run once initially

    return () => window.removeEventListener('scroll', handleScroll)
  }, [toc])

  const handleClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
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
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .blog-toc-sidebar {
            display: none !important;
          }
        }
      ` }} />
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
    </>
  )
}
