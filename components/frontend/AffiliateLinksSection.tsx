import { db } from '@/lib/db'
import EditableText from './EditableText'
import ModuleBgWrapper from './ModuleBgWrapper'

interface AffiliateLinksSectionProps {
  locale: string
  settings: any
  isEditMode: boolean
}

const ctaLabels: Record<string, string> = {
  fr: 'Visiter le site',
  es: 'Visitar sitio web',
  en: 'Visit website',
  zh: '访问网站',
}

function formatExternalUrl(url: string): string {
  if (!url) return '#'
  const cleanUrl = url.trim()
  if (
    cleanUrl.startsWith('http://') ||
    cleanUrl.startsWith('https://') ||
    cleanUrl.startsWith('mailto:') ||
    cleanUrl.startsWith('tel:')
  ) {
    return cleanUrl
  }
  return `https://${cleanUrl}`
}

const DEFAULT_LINKS: Record<string, { title: string; subtitle: string; url: string }[]> = {
  es: [
    { title: 'ExpressVPN Premium', subtitle: 'Servicio VPN ultrarrápido y seguro para streaming IPTV sin interrupciones', url: 'https://expressvpn.com' },
    { title: 'IPTV Smarters Pro', subtitle: 'La mejor aplicación reproductora para Smart TV, Android y Firestick', url: 'https://www.iptvsmarters.com' },
    { title: 'TiviMate IPTV Player', subtitle: 'Reproductor IPTV profesional de alto rendimiento para Android TV', url: 'https://tivimate.com' },
  ],
  fr: [
    { title: 'ExpressVPN Premium', subtitle: 'Service VPN ultra-rapide et sécurisé pour le streaming IPTV sans interruption', url: 'https://expressvpn.com' },
    { title: 'IPTV Smarters Pro', subtitle: 'La meilleure application de lecture pour Smart TV, Android et Firestick', url: 'https://www.iptvsmarters.com' },
    { title: 'TiviMate IPTV Player', subtitle: 'Lecteur IPTV professionnel haute performance pour Android TV', url: 'https://tivimate.com' },
  ],
  en: [
    { title: 'ExpressVPN Premium', subtitle: 'Ultra-fast and secure VPN service for buffer-free IPTV streaming', url: 'https://expressvpn.com' },
    { title: 'IPTV Smarters Pro', subtitle: 'The best player application for Smart TV, Android, and Firestick', url: 'https://www.iptvsmarters.com' },
    { title: 'TiviMate IPTV Player', subtitle: 'High-performance professional IPTV player for Android TV', url: 'https://tivimate.com' },
  ],
  zh: [
    { title: 'ExpressVPN 高速节点', subtitle: '专为 IPTV 无卡顿流媒体优化的全平台加密 VPN', url: 'https://expressvpn.com' },
    { title: 'IPTV Smarters Pro', subtitle: '全平台多终端兼容的专业级 IPTV 播放器', url: 'https://www.iptvsmarters.com' },
    { title: 'TiviMate IPTV Player', subtitle: '电视大屏端极致体验的高清 IPTV 播放工具', url: 'https://tivimate.com' },
  ],
}

async function ensureDefaultLinks(locale: string) {
  try {
    const count = await db.affiliateLink.count({ where: { locale } })
    if (count === 0) {
      const defaults = DEFAULT_LINKS[locale] || DEFAULT_LINKS.es
      for (let i = 0; i < defaults.length; i++) {
        await db.affiliateLink.create({
          data: {
            title: defaults[i].title,
            subtitle: defaults[i].subtitle,
            url: defaults[i].url,
            locale,
            sortOrder: i + 1,
            isActive: true,
          }
        })
      }
    }
  } catch (err) {
    console.error('Failed to auto-seed default affiliate links:', err)
  }
}

export default async function AffiliateLinksSection({ locale, settings, isEditMode }: AffiliateLinksSectionProps) {
  // Query module translations
  const contents = await db.moduleContent.findMany({ where: { moduleId: 'affiliate_links', locale } })
  const c = Object.fromEntries(contents.map((x) => [x.key, x.value]))

  // Query active locale-specific affiliate links
  let links = await db.affiliateLink.findMany({
    where: { locale, isActive: true },
    orderBy: { sortOrder: 'asc' }
  })

  // If no links configured for this locale yet, check and auto-seed defaults
  if (links.length === 0) {
    await ensureDefaultLinks(locale)
    links = await db.affiliateLink.findMany({
      where: { locale, isActive: true },
      orderBy: { sortOrder: 'asc' }
    })
  }

  // Fallback: if still no links for current locale, get active links from any locale
  if (links.length === 0) {
    links = await db.affiliateLink.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    })
  }

  // If no links exist at all, don't show the module unless in edit mode
  if (links.length === 0 && !isEditMode) {
    return null
  }

  const ctaText = ctaLabels[locale] || ctaLabels.en

  return (
    <ModuleBgWrapper moduleId="affiliate_links" locale={locale} className="section-pad">
      <div className="container">
        {/* Header Area */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="badge-anchor" style={{ marginBottom: '0.75rem' }}>
            <span className="badge">
              <EditableText moduleId="affiliate_links" locale={locale} fieldKey="badge" tag="span" isEditMode={isEditMode}>
                {c.badge || (locale === 'fr' ? '🔗 Liens Partenaires' : locale === 'es' ? '🔗 Enlaces de Socios' : locale === 'zh' ? '🔗 推广伙伴' : '🔗 Partner Links')}
              </EditableText>
            </span>
          </div>
          <h2 className="section-title" style={{ marginBottom: '1rem' }}>
            <EditableText moduleId="affiliate_links" locale={locale} fieldKey="title" tag="span" isEditMode={isEditMode}>
              {c.title || (locale === 'fr' ? 'Nos Partenaires Officiels' : locale === 'es' ? 'Nuestros Socios Oficiales' : locale === 'zh' ? '我们的官方合作伙伴' : 'Our Official Partners')}
            </EditableText>
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto', maxWidth: '800px' }}>
            <EditableText moduleId="affiliate_links" locale={locale} fieldKey="subtitle" tag="span" isEditMode={isEditMode}>
              {c.subtitle || (locale === 'fr' ? 'Découvrez nos partenaires de confiance pour optimiser votre expérience IPTV.' : locale === 'es' ? 'Descubra nuestros socios de confianza para optimizar su experiencia de IPTV.' : locale === 'zh' ? '探索我们信任的合作伙伴，以优化您的 IPTV 体验。' : 'Discover our trusted partners to optimize your IPTV experience.')}
            </EditableText>
          </p>
        </div>

        {/* Affiliate Links Grid */}
        <div className="partner-grid">
          {links.map((link) => {
            return (
              <a
                key={link.id}
                href={formatExternalUrl(link.url)}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="partner-card"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  textDecoration: 'none',
                  borderRadius: '1rem',
                  background: 'rgba(30, 41, 59, 0.45)',
                  border: '1px solid rgba(148, 163, 184, 0.12)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#f1f5f9', fontFamily: 'Outfit, sans-serif', margin: 0, lineHeight: 1.3 }}>
                    {link.title}
                  </h3>
                  {link.subtitle && (
                    <p style={{ fontSize: '0.875rem', color: '#94a3b8', margin: '0.5rem 0 0', lineHeight: 1.5 }}>
                      {link.subtitle}
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#22d3ee', fontSize: '0.875rem', fontWeight: 600 }}>
                  <span>{ctaText}</span>
                  <span className="arrow-icon">→</span>
                </div>
              </a>
            )
          })}

          {links.length === 0 && isEditMode && (
            <div
              style={{
                gridColumn: '1 / -1',
                padding: '3rem',
                textAlign: 'center',
                background: 'rgba(30,41,59,0.3)',
                border: '1px dashed var(--border-color)',
                borderRadius: '1rem',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
              }}
            >
              ⚠️ {locale === 'zh' ? '当前语言下没有启用推广链接，您可以在后台 "推广链接" 页面进行添加。' : 'No active partner links for this locale. Add links in the admin panel.'}
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .partner-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        @media (max-width: 900px) {
          .partner-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .partner-grid {
            grid-template-columns: 1fr;
          }
        }
        .partner-card {
          transition: all 0.25s ease-in-out;
        }
        .partner-card:hover {
          transform: translateY(-4px);
          border-color: rgba(34, 211, 238, 0.4) !important;
          background: rgba(30, 41, 59, 0.75) !important;
          boxShadow: 0 12px 40px rgba(0, 0, 0, 0.3) !important;
        }
        .partner-card:hover .arrow-icon {
          transform: translateX(4px);
        }
        .arrow-icon {
          transition: transform 0.2s ease;
        }
      `}} />
    </ModuleBgWrapper>
  )
}
