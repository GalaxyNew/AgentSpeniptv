import { db } from '@/lib/db'
import { getMergedSettings, resolveSiteDomain } from '@/lib/settings'
import { publicUrl } from '@/lib/seo'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const revalidate = 60

// Pre-render visible subpages as ISR; unknown slugs render on-demand + cache.
export async function generateStaticParams() {
  const pages = await db.subpage.findMany({
    where: { locale: 'es', isVisible: true },
    select: { slug: true },
  })
  return pages.map((p) => ({ locale: 'es', slug: p.slug }))
}

interface SubpageProps {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: SubpageProps): Promise<Metadata> {
  const { locale, slug } = await params
  const locales = ['es']
  if (!locales.includes(locale)) {
    notFound()
  }
  const page = await db.subpage.findUnique({
    where: {
      locale_slug: { locale, slug }
    }
  })

  if (!page || !page.isVisible) return {}

  const settings = await getMergedSettings(locale)
  const brandName = settings?.brandName || 'Mejors IPTV'
  
  const domain = resolveSiteDomain(settings?.siteDomain)
  const defaultCanonical = publicUrl(domain, locale, `/${slug}`)

  const processText = (text: string) => {
    let domainVal = brandName
    if (domain) {
      try {
        domainVal = new URL(domain).hostname
      } catch (e) {}
    }
    return text
      .replace(/\{brand\}/g, brandName)
      .replace(/MUNDOIPTV\.ES/gi, domainVal)
      .replace(/MUNDOIPTV/gi, brandName)
  }

  const title = processText(page.metaTitle || page.title)
  const description = page.metaDescription ? processText(page.metaDescription) : undefined

  const excludedSlugs = ['legal', 'privacy-policy', 'terms-of-service', 'refund-policy']
  const robots = excludedSlugs.includes(slug) ? 'noindex, nofollow' : (page.robots || 'index, follow')

  return {
    title,
    description,
    robots,
    alternates: {
      canonical: page.canonicalUrl || defaultCanonical,
    }
  }
}

export default async function Subpage({ params }: SubpageProps) {
  const { locale, slug } = await params
  const locales = ['es']
  if (!locales.includes(locale)) {
    notFound()
  }
  
  const page = await db.subpage.findUnique({
    where: {
      locale_slug: { locale, slug }
    }
  })

  if (!page || !page.isVisible) {
    notFound()
  }

  const settings = await getMergedSettings(locale)
  const brandName = settings?.brandName || 'Mejors IPTV'

  const domain = resolveSiteDomain(settings?.siteDomain)

  const processText = (text: string) => {
    let domainVal = brandName
    if (domain) {
      try {
        domainVal = new URL(domain).hostname
      } catch (e) {}
    }
    return text
      .replace(/\{brand\}/g, brandName)
      .replace(/MUNDOIPTV\.ES/gi, domainVal)
      .replace(/MUNDOIPTV/gi, brandName)
  }

  const processedContent = processText(page.content)
  const processedTitle = processText(page.title)

  return (
    <div style={{
      minHeight: '80vh',
      padding: '120px 1.5rem 5rem',
      background: 'var(--hero-gradient, linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%))',
    }}>
      <div style={{
        maxWidth: 800,
        margin: '0 auto',
        padding: '2.5rem',
        background: 'var(--bg-card, rgba(30, 41, 59, 0.5))',
        border: '1px solid var(--border-color, rgba(148, 163, 184, 0.12))',
        borderRadius: '1rem',
        backdropFilter: 'var(--card-backdrop, blur(12px))',
        boxShadow: 'var(--card-shadow, 0 4px 24px rgba(0, 0, 0, 0.4))',
      }}>
        {/* Breadcrumb */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.85rem',
          color: 'var(--text-secondary, #64748b)',
          marginBottom: '1.5rem',
          fontFamily: 'Outfit, Inter, sans-serif',
        }}>
          <a href={locale === 'es' ? '/' : `/${locale}`} style={{ color: 'var(--accent-1, #22d3ee)', textDecoration: 'none', fontWeight: 600 }}>
            {locale === 'es' ? 'Inicio' : locale === 'fr' ? 'Accueil' : locale === 'zh' ? '首页' : 'Home'}
          </a>
          <span>/</span>
          <span style={{ color: '#94a3b8' }}>{processedTitle}</span>
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 800,
          marginBottom: '2rem',
          fontFamily: 'Outfit, Inter, sans-serif',
          background: 'var(--accent-gradient, linear-gradient(90deg, #22d3ee, #a855f7))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          lineHeight: 1.2,
        }}>
          {processedTitle}
        </h1>

        {/* Content */}
        <div
          style={{
            lineHeight: 1.8,
            color: 'var(--text-secondary, #94a3b8)',
            fontSize: '1rem',
            whiteSpace: 'pre-wrap',
          }}
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />
      </div>
    </div>
  )
}
