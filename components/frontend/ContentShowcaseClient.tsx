'use client'

import { useState } from 'react'
import EditableText from './EditableText'
import EditableImage from './EditableImage'
import DragToScroll from './DragToScroll'

interface ContentShowcaseClientProps {
  locale: string
  isEditMode: boolean
  c: Record<string, string>
}

export default function ContentShowcaseClient({ locale, isEditMode, c }: ContentShowcaseClientProps) {
  const [activeTab, setActiveTab] = useState(0)
  const cardImgWidth = parseInt(c.card_image_width || '250', 10)
  const cardImgHeight = parseInt(c.card_image_height || '250', 10)

  const tabs = [
    { key: 't1', icon: '⚽' },
    { key: 't2', icon: '🎬' },
    { key: 't3', icon: '🌍' },
    { key: 't4', icon: '👶' },
  ]

  // Mock showcase content highlights corresponding to each category
  const highlights = [
    [
      { name: 'UEFA Champions League', desc: 'HD / 4K Live streams' },
      { name: 'Premier League & LaLiga', desc: 'All matches live' },
      { name: 'Formula 1 & MotoGP', desc: 'High frame rate streams' },
      { name: 'NBA & EuroLeague', desc: 'Full season coverage' },
    ],
    [
      { name: 'Latest Box Office Movies', desc: 'Updated weekly' },
      { name: 'Trending Series (Netflix/HBO)', desc: 'Full seasons in VF/VOST' },
      { name: '4K Ultra HD Cinema', desc: 'Immersive home theater experience' },
      { name: 'Anime & Stand-up Shows', desc: 'Diverse library' },
    ],
    [
      { name: 'French Channels (TF1, Canal+)', desc: 'Full French package' },
      { name: 'Spanish Channels (Movistar+)', desc: 'Spanish sports & news' },
      { name: 'UK & US Premium Channels', desc: 'Sky, HBO, BBC, and more' },
      { name: 'Arabic & African Packages', desc: 'BeIN, MBC, and local channels' },
    ],
    [
      { name: 'Disney & Nickelodeon', desc: 'Safe kids entertainment' },
      { name: 'National Geographic / Discovery', desc: 'Educational documentaries' },
      { name: 'MTV & Music Channels', desc: 'Pop, Rock, HipHop non-stop' },
      { name: 'Comedy Central & Cartoons', desc: 'Laughter for all ages' },
    ],
  ]

  return (
    <div style={{ width: '100%', margin: '0 auto' }}>
      {/* Category Tabs */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '0.5rem',
        marginBottom: '2rem',
        flexWrap: 'wrap',
      }}>
        {tabs.map((tab, idx) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(idx)}
            className={`btn ${activeTab === idx ? 'btn-primary' : 'btn-secondary'}`}
            style={{
              padding: '0.625rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              borderRadius: '2rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: activeTab === idx ? 'none' : '1px solid var(--border-color)',
            }}
          >
            <span>{tab.icon}</span>
            <EditableText moduleId="content" locale={locale} fieldKey={`${tab.key}_name`} tag="span" isEditMode={isEditMode}>
              {c[`${tab.key}_name`] ?? `Category ${idx + 1}`}
            </EditableText>
          </button>
        ))}
      </div>

      {/* Showcase Grid */}
      <div className="card card-featured" style={{ padding: '2rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
        <p style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '1.5rem', fontWeight: 600, textAlign: 'center' }}>
          <EditableText moduleId="content" locale={locale} fieldKey={`${tabs[activeTab].key}_desc`} tag="span" isEditMode={isEditMode}>
            {c[`${tabs[activeTab].key}_desc`] ?? ''}
          </EditableText>
        </p>

        <DragToScroll className="showcase-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem',
        }}>
          {Array.from({ length: 4 }).map((_, i) => {
            const cardIdx = i + 1
            const cardKey = `${tabs[activeTab].key}_c${cardIdx}`
            const hl = highlights[activeTab][i]
            
            const title = c[`${cardKey}_title`] || hl.name
            const desc = c[`${cardKey}_desc`] || hl.desc
            const imgSrc = c[`${cardKey}_image`] || `/uploads/showcase/${tabs[activeTab].key}_c${cardIdx}.jpg`

            return (
              <div
                key={i}
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '0.75rem',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                {/* Image display with upload trigger in edit mode */}
                <div style={{
                  width: '100%',
                  maxWidth: `${cardImgWidth}px`,
                  aspectRatio: `${cardImgWidth} / ${cardImgHeight}`,
                  margin: '0.5rem auto 0 auto',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '0.5rem',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <EditableImage
                    moduleId="content"
                    locale={locale}
                    fieldKey={`${cardKey}_image`}
                    src={imgSrc}
                    alt={title}
                    width={cardImgWidth}
                    height={cardImgHeight}
                    isEditMode={isEditMode}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                
                <div style={{ padding: '1rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--accent-1)', marginBottom: '0.25rem' }}>
                    <EditableText moduleId="content" locale={locale} fieldKey={`${cardKey}_title`} tag="span" isEditMode={isEditMode}>
                      {title}
                    </EditableText>
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                    <EditableText moduleId="content" locale={locale} fieldKey={`${cardKey}_desc`} tag="span" isEditMode={isEditMode}>
                      {desc}
                    </EditableText>
                  </div>
                </div>
              </div>
            )
          })}
        </DragToScroll>
      </div>
    </div>
  )
}
