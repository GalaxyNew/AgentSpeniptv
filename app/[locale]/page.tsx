import { db } from '@/lib/db'
import { getMergedSettings } from '@/lib/settings'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'

export const revalidate = 60
import HeroSection from '@/components/frontend/HeroSection'
import AuthoritySection from '@/components/frontend/AuthoritySection'
import PricingSection from '@/components/frontend/PricingSection'
import FeaturesSection from '@/components/frontend/FeaturesSection'
import DevicesSection from '@/components/frontend/DevicesSection'
import TestimonialsSection from '@/components/frontend/TestimonialsSection'
import FaqSection from '@/components/frontend/FaqSection'
import ContentShowcase from '@/components/frontend/ContentShowcase'
import SportsMarquee from '@/components/frontend/SportsMarquee'
import MoviesMarquee from '@/components/frontend/MoviesMarquee'
import SeriesMarquee from '@/components/frontend/SeriesMarquee'
import HowItWorks from '@/components/frontend/HowItWorks'
import NosServices from '@/components/frontend/NosServices'
import TemoignagesCarousel from '@/components/frontend/TemoignagesCarousel'
import AffiliateLinksSection from '@/components/frontend/AffiliateLinksSection'
import TrialCta from '@/components/frontend/TrialCta'
import PlansCta from '@/components/frontend/PlansCta'

const MODULE_COMPONENTS: Record<string, React.ComponentType<{ locale: string; settings: any; isEditMode: boolean }>> = {
  hero: HeroSection,
  authority: AuthoritySection,
  pricing: PricingSection,
  features: FeaturesSection,
  how_it_works: HowItWorks,
  nos_services: NosServices,
  content: ContentShowcase,
  sports_marquee: SportsMarquee,
  movies_marquee: MoviesMarquee,
  series_marquee: SeriesMarquee,
  devices: DevicesSection,
  testimonials: TestimonialsSection,
  temoignages: TemoignagesCarousel,
  faq: FaqSection,
  affiliate_links: AffiliateLinksSection,
  trial_cta: TrialCta,
  plans_cta: PlansCta,
}

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function LocalePage({ params }: PageProps) {
  const { locale } = await params
  
  const locales = ['es']
  if (!locales.includes(locale)) {
    notFound()
  }
  
  const { isEnabled: editMode } = await draftMode()

  const [pageModules, settings, faqContents] = await Promise.all([
    db.pageModule.findMany({ orderBy: { sortOrder: 'asc' } }),
    getMergedSettings(locale),
    db.moduleContent.findMany({ where: { moduleId: 'faq', locale } }),
  ])

  const faqMap = Object.fromEntries(faqContents.map((x) => [x.key, x.value]))
  const faqItems = []
  for (let i = 1; i <= 5; i++) {
    const question = faqMap[`q${i}`]
    const answer = faqMap[`a${i}`]
    if (question && answer) {
      faqItems.push({
        '@type': 'Question',
        name: question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: answer
        }
      })
    }
  }
  const faqSchema = faqItems.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems
  } : null

  // Get active modules for current locale
  const visibleModules = pageModules
    .filter((m) => {
      if (locale === 'fr') return m.isVisible_fr
      if (locale === 'es') return m.isVisible_es
      if (locale === 'en') return m.isVisible_en
      if (locale === 'zh') return m.isVisible_zh
      return m.isVisible
    })
    .sort((a, b) => {
      const orderA = locale === 'fr' ? a.sortOrder_fr : locale === 'es' ? a.sortOrder_es : locale === 'en' ? a.sortOrder_en : a.sortOrder_zh
      const orderB = locale === 'fr' ? b.sortOrder_fr : locale === 'es' ? b.sortOrder_es : locale === 'en' ? b.sortOrder_en : b.sortOrder_zh
      return orderA - orderB
    })

  return (
    <>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {visibleModules.map((module) => {
        const Component = MODULE_COMPONENTS[module.id]
        if (!Component) return null
        return (
          <Component
            key={module.id}
            locale={locale}
            settings={settings}
            isEditMode={editMode}
          />
        )
      })}
    </>
  )
}
