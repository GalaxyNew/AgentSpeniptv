'use client'

import { useState } from 'react'
import EditableText from '@/components/frontend/EditableText'

interface PlanLabel {
  id: string
  planId: string
  locale: string
  duration: string
  badgeText: string
  features: string
  ctaText: string
  subText: string
  waMessage: string
  price: number
  originalPrice: number | null
  isRecommended: boolean
  currencySymbol: string
}

interface PricingPlan {
  id: string
  tierId: string
  sortOrder: number
  labels: PlanLabel[]
}

interface TierLabel {
  id: string
  tierId: string
  locale: string
  name: string
}

interface PricingTier {
  id: string
  sortOrder: number
  labels: TierLabel[]
  plans: PricingPlan[]
}

interface PricingSectionClientProps {
  tiers: PricingTier[]
  locale: string
  isEditMode: boolean
  L: Record<string, string>
  waNumber: string
  displayDevices: string
  displayMonths: string
  promoText?: string
  disclaimer?: string
}

export default function PricingSectionClient({
  tiers,
  locale,
  isEditMode,
  L,
  waNumber,
  displayDevices,
  displayMonths,
  promoText,
  disclaimer
}: PricingSectionClientProps) {
  const enabledDevices = (displayDevices || '1,2,3').split(',').map(Number).filter(Boolean)
  const enabledMonths = (displayMonths || '1,3,6,12').split(',').map(Number).filter(Boolean)

  const visibleTiers = tiers.filter(t => enabledDevices.includes(t.sortOrder + 1))

  // Find recommended plan to default active values
  let initialTierId = ''
  let initialMonth = enabledMonths[0] ?? 12

  let found = false
  for (const t of visibleTiers) {
    for (const p of t.plans) {
      const lbl = p.labels[0]
      if (lbl && lbl.isRecommended) {
        const match = lbl.duration.match(/\d+/)
        const mVal = match ? parseInt(match[0]) : 0
        if (enabledMonths.includes(mVal)) {
          initialTierId = t.id
          initialMonth = mVal
          found = true
          break
        }
      }
    }
    if (found) break
  }

  if (!initialTierId) {
    initialTierId = visibleTiers[0]?.id ?? ''
  }

  const [activeTierId, setActiveTierId] = useState<string>(initialTierId)
  const [activeMonth, setActiveMonth] = useState<number>(initialMonth)

  if (visibleTiers.length === 0) return null

  const activeTier = visibleTiers.find(t => t.id === activeTierId) ?? visibleTiers[0]

  const visiblePlans = activeTier.plans.filter(p => {
    const lbl = p.labels[0]
    if (!lbl) return false
    const match = lbl.duration.match(/\d+/)
    const mVal = match ? parseInt(match[0]) : 0
    return enabledMonths.includes(mVal)
  })

  const monthLabels: Record<string, Record<number, string>> = {
    fr: { 1: '1 Mois', 3: '3 Mois', 6: '6 Mois', 12: '12 Mois' },
    es: { 1: '1 Mes', 3: '3 Meses', 6: '6 Meses', 12: '12 Meses' },
    en: { 1: '1 Month', 3: '3 Months', 6: '6 Months', 12: '12 Months' },
    zh: { 1: '1 个月', 3: '3 个月', 6: '6 个月', 12: '12 个月' },
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>

      {/* 2. Promo Banner */}
      <div style={{
        textAlign: 'center',
        background: 'rgba(163, 230, 53, 0.05)',
        border: '1px dashed rgba(163, 230, 53, 0.25)',
        padding: '0.75rem 1rem',
        borderRadius: '0.5rem',
        color: '#a3e635',
        fontSize: '0.875rem',
        fontWeight: 700,
        marginBottom: '2.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
      }}>
        <span>⚡</span>
        <span>
          <EditableText moduleId="pricing" locale={locale} fieldKey="promo_text" tag="span" isEditMode={isEditMode}>
            {promoText || (
              locale === 'zh' ? '限时专享 3 折会员试用 + 模型限时优惠 | Omni 图片低至免费，视频 3.0 全系 8 折起' :
              locale === 'fr' ? 'Offre Limitée : Essai 30% + Promo Spéciale | Images Omni gratuites, Vidéos 3.0 à -20%' :
              locale === 'es' ? 'Oferta Limitada: Prueba 30% + Descuento Especial | Imágenes Omni gratis, Videos 3.0 a -20%' :
              'Limited Time: 30% Trial + Special Discount | Omni Images free, Video 3.0 all at 20% off'
            )}
          </EditableText>
        </span>
      </div>

      {/* 3. Device Selection Tabs (Hidden if single device enabled) */}
      {visibleTiers.length > 1 && (
        <div style={{
          display: 'inline-flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.25rem',
          marginBottom: '1.5rem',
          background: 'var(--pricing-tab-bg, rgba(255, 255, 255, 0.03))',
          border: '1px solid var(--pricing-tab-border, rgba(255, 255, 255, 0.06))',
          padding: '0.25rem',
          borderRadius: '2rem',
          margin: '0 auto 1.5rem auto',
          width: 'max-content',
        }}>
          {visibleTiers.map((tier) => {
            const tLabel = tier.labels[0]?.name ?? ''
            const parts = tLabel.split('|')
            const name = parts[0].trim()
            const tabBadge = parts[1]?.trim()
            const isActive = tier.id === activeTierId

            return (
              <button
                key={tier.id}
                onClick={() => {
                  setActiveTierId(tier.id)
                }}
                style={{
                  padding: '0.5rem 1.5rem',
                  fontSize: '0.875rem',
                  borderRadius: '2rem',
                  border: 'none',
                  background: isActive ? 'var(--pricing-tab-active-bg, rgba(255, 255, 255, 0.08))' : 'transparent',
                  color: isActive ? 'var(--pricing-tab-active-text, #ffffff)' : 'var(--pricing-tab-inactive-text, #94a3b8)',
                  cursor: 'pointer',
                  fontWeight: 700,
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                  boxShadow: isActive ? 'var(--pricing-tab-active-shadow, inset 0 1px 0 rgba(255,255,255,0.1))' : 'none',
                }}
              >
                <span>{name}</span>
                {tabBadge && (
                  <span style={{
                    fontSize: '0.6875rem',
                    background: 'rgba(163, 230, 53, 0.15)',
                    color: '#a3e635',
                    padding: '0.05rem 0.35rem',
                    borderRadius: '0.25rem',
                    border: '1px solid rgba(163, 230, 53, 0.25)',
                    fontWeight: 800,
                  }}>
                    {tabBadge}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      )}

      {/* 4. Months Selection Tabs */}
      {enabledMonths.length > 1 && (
        <div 
          className="pricing-months-tabs"
          style={{
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.25rem',
            marginBottom: '3rem',
            background: 'var(--pricing-tab-bg, rgba(255, 255, 255, 0.03))',
            border: '1px solid var(--pricing-tab-border, rgba(255, 255, 255, 0.06))',
            padding: '0.25rem',
            borderRadius: '2rem',
            margin: '0 auto 3rem auto',
            width: 'max-content',
          }}
        >
          {enabledMonths.map((mVal) => {
            const label = monthLabels[locale]?.[mVal] ?? monthLabels.en[mVal]
            const isActive = mVal === activeMonth

            return (
              <button
                key={mVal}
                onClick={() => setActiveMonth(mVal)}
                style={{
                  padding: '0.5rem 1.5rem',
                  fontSize: '0.875rem',
                  borderRadius: '2rem',
                  border: 'none',
                  background: isActive ? 'var(--pricing-tab-active-bg, rgba(255, 255, 255, 0.08))' : 'transparent',
                  color: isActive ? 'var(--pricing-tab-active-text, #ffffff)' : 'var(--pricing-tab-inactive-text, #94a3b8)',
                  cursor: 'pointer',
                  fontWeight: 700,
                  transition: 'all 0.2s',
                  boxShadow: isActive ? 'var(--pricing-tab-active-shadow, inset 0 1px 0 rgba(255,255,255,0.1))' : 'none',
                }}
              >
                {label}
              </button>
            )
          })}
        </div>
      )}

      {/* 5. Pricing Cards Grid Container */}
      <div 
        className="pricing-cards-container"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '2rem',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        {visiblePlans.map((plan) => {
          const label = plan.labels[0]
          if (!label) return null

          // Parse features
          let features: string[] = []
          try {
            features = JSON.parse(label.features)
          } catch {}

          // Find highlight feature starting with "★"
          const highlightFeature = features.find(f => f.startsWith('★'))
          const regularFeatures = features.filter(f => !f.startsWith('★'))

          const waMsg = label.waMessage ?? ''
          const waUrl = `https://wa.me/${waNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(waMsg)}`

          // Parse membership titles: e.g. "黄金会员 | 1个月"
          const rawDuration = label.duration
          const durParts = rawDuration.split('|')
          const membershipTitle = durParts.length > 1 ? durParts[0].trim() : (
            locale === 'zh' ? '特惠套餐' :
            locale === 'es' ? 'Suscripción Premium' :
            locale === 'fr' ? 'Abonnement Premium' :
            'Premium Plan'
          )
          const durationText = durParts.length > 1 ? durParts[1].trim() : rawDuration
          const isFeatured = label.isRecommended

          const cardBorder = isFeatured
            ? '1px solid var(--price-highlight, #f59e0b)'
            : '1px solid var(--border-color)'
          const cardShadow = isFeatured
            ? '0 8px 32px rgba(245, 158, 11, 0.12), inset 0 0 12px rgba(245, 158, 11, 0.05)'
            : 'var(--card-shadow)'

          const badgeTags = label.badgeText ? label.badgeText.split(',') : []

          const match = label.duration.match(/\d+/)
          const mVal = match ? parseInt(match[0]) : 0
          const isSelectedMobile = mVal === activeMonth

          return (
            <div 
              key={plan.id}
              className={`pricing-card-wrapper ${isSelectedMobile ? 'active-mobile' : ''}`}
              style={{
                width: '100%',
                maxWidth: '380px',
              }} 
            >
              <div
                className="card pricing-card-interactive"
                style={{
                  padding: '2.5rem 1.75rem',
                  textAlign: 'left',
                  position: 'relative',
                  background: 'var(--bg-card)',
                  border: cardBorder,
                  boxShadow: cardShadow,
                  borderRadius: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  backdropFilter: 'var(--card-backdrop)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                  width: '100%',
                }}
              >
                {/* Badge label for featured item */}
                {isFeatured && (
                  <div style={{
                    position: 'absolute', top: 12, right: 12,
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white',
                    fontSize: '0.625rem', fontWeight: 800, padding: '0.125rem 0.375rem',
                    borderRadius: '0.25rem', textTransform: 'uppercase',
                    lineHeight: 1,
                    zIndex: 2,
                  }}>
                    {locale === 'zh' ? '推荐' : locale === 'es' ? 'RECOMENDADO' : locale === 'fr' ? 'RECOMMANDÉ' : 'RECOMMENDED'}
                  </div>
                )}

                <div>
                  {/* Membership Title */}
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: isFeatured ? 'var(--price-highlight, #f59e0b)' : 'var(--text-primary)', marginBottom: '0.75rem' }}>
                    {membershipTitle}
                  </div>

                  {/* Price block */}
                  <div style={{ marginBottom: '0.75rem' }}>
                    {label.originalPrice && (
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted, #64748b)', textDecoration: 'line-through', marginBottom: '0.125rem' }}>
                        {label.currencySymbol}{label.originalPrice.toFixed(2)}
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.15rem' }}>
                      <span style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'Outfit, sans-serif' }}>
                        {label.price}
                      </span>
                      <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {label.currencySymbol}/{durationText}
                      </span>
                    </div>
                  </div>

                  {/* Tags block */}
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1.5rem', minHeight: '1.25rem' }}>
                    {badgeTags.map((tag, ti) => (
                      <span key={ti} style={{
                        fontSize: '0.75rem',
                        border: isFeatured ? '1px solid rgba(245, 158, 11, 0.3)' : '1px solid var(--border-color)',
                        background: isFeatured ? 'rgba(245, 158, 11, 0.1)' : 'rgba(148, 163, 184, 0.08)',
                        color: isFeatured ? 'var(--price-highlight, #f59e0b)' : 'var(--text-secondary)',
                        padding: '0.05rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontWeight: 600,
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary card-cta-button"
                    style={{
                      width: '100%',
                      padding: '0.875rem 1.5rem',
                      fontSize: '0.9rem',
                      fontWeight: 800,
                      borderRadius: '2rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.375rem',
                      textDecoration: 'none',
                      textAlign: 'center',
                      boxSizing: 'border-box',
                      marginBottom: '0.5rem',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {label.ctaText || (locale === 'zh' ? '特惠订阅' : 'S\'abonner')}
                  </a>
                  
                  {/* Secondary subtext under CTA */}
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '2rem' }}>
                    {label.subText !== undefined && label.subText !== '' 
                      ? label.subText 
                      : (locale === 'zh' ? '首购仅一次，可随时取消' : 'Single promo, cancel anytime')}
                  </div>

                  {/* Main Highlight Points Box */}
                  {highlightFeature && (() => {
                    const rawHL = highlightFeature.replace('★', '').trim()
                    const hlParts = rawHL.split('|')
                    const hlTitle = hlParts[0].trim()
                    const hlSub = hlParts[1]?.trim()
                    return (
                      <div style={{
                        background: 'rgba(148, 163, 184, 0.03)',
                        borderRadius: '0.5rem',
                        padding: '0.75rem',
                        marginBottom: '1.5rem',
                        border: isFeatured ? '1px solid rgba(245, 158, 11, 0.25)' : '1px solid var(--border-color)',
                      }}>
                        <div style={{ fontSize: '0.85rem', color: isFeatured ? 'var(--price-highlight, #f59e0b)' : 'var(--text-primary)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <span>★</span>
                          <span>{hlTitle}</span>
                        </div>
                        {hlSub && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>
                            {hlSub}
                          </div>
                        )}
                      </div>
                    )
                  })()}

                  {/* Feature items */}
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                    {regularFeatures.map((feat, fi) => {
                      const parts = feat.split('|')
                      const name = parts[0].trim()
                      const tag = parts[1]?.trim()

                      return (
                        <li key={fi} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.375rem' }}>
                            <span style={{ color: '#84cc16', fontWeight: 900 }}>✓</span>
                            <span>{name}</span>
                          </div>
                          {tag && (
                            <span style={{
                              fontSize: '0.6875rem',
                              padding: '0.05rem 0.35rem',
                              borderRadius: '0.25rem',
                              fontWeight: 700,
                              background: tag === '免费' || tag.includes('免费') || tag.includes('Free') ? 'rgba(132, 204, 22, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                              color: tag === '免费' || tag.includes('免费') || tag.includes('Free') ? '#84cc16' : '#ef4444',
                              border: `1px solid ${tag === '免费' || tag.includes('免费') || tag.includes('Free') ? 'rgba(132,204,22,0.2)' : 'rgba(239,68,68,0.2)'}`,
                              whiteSpace: 'nowrap',
                            }}>
                              {tag}
                            </span>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer disclaimer */}
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem' }}>
        <EditableText moduleId="pricing" locale={locale} fieldKey="disclaimer" tag="span" isEditMode={isEditMode}>
          {disclaimer || (
            locale === 'zh' ? '① 开启特惠试用后，将立即获得相应包特权，到期后将按照各计划费率自动续费。' : 
            '① Subscriptions automatically renew after the selected package duration ends unless cancelled.'
          )}
        </EditableText>
      </div>

      <style>{`
        .pricing-card-interactive:hover {
          transform: translateY(-6px) scale(1.01) !important;
          border-color: var(--accent-1, #22d3ee) !important;
        }
        .card-cta-button:hover {
          transform: translateY(-2px) scale(1.02) !important;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12) !important;
          filter: brightness(0.96) !important;
        }

        @media (max-width: 599px) {
          .pricing-months-tabs {
            display: inline-flex !important;
          }
          .pricing-card-wrapper {
            display: none !important;
          }
          .pricing-card-wrapper.active-mobile {
            display: flex !important;
          }
        }

        @media (min-width: 600px) and (max-width: 991px) {
          .pricing-months-tabs {
            display: none !important;
          }
          .pricing-cards-container {
            display: grid !important;
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 1.5rem !important;
          }
          .pricing-card-wrapper {
            display: flex !important;
            max-width: none !important;
          }
          .pricing-card-wrapper > .pricing-card-interactive {
            height: 100% !important;
            width: 100% !important;
          }
        }

        @media (min-width: 992px) {
          .pricing-months-tabs {
            display: none !important;
          }
          .pricing-cards-container {
            display: flex !important;
            flex-flow: row nowrap !important;
            gap: 1rem !important;
            align-items: stretch !important;
          }
          .pricing-card-wrapper {
            display: flex !important;
            flex: 1 1 0% !important;
            max-width: none !important;
          }
          .pricing-card-wrapper > .pricing-card-interactive {
            height: 100% !important;
            width: 100% !important;
          }
          .pricing-cards-container > :only-child {
            max-width: 380px !important;
            margin: 0 auto !important;
          }
        }
      `}</style>
    </div>
  )
}
