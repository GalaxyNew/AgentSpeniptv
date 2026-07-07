import { db } from '@/lib/db'
import FaqSectionClient from './FaqSectionClient'
import ModuleBgWrapper from './ModuleBgWrapper'
import { parseButtonValue, getButtonLinkProps } from '@/lib/button'

interface FaqProps {
  locale: string
  settings: any
  isEditMode: boolean
}

export default async function FaqSection({ locale, settings, isEditMode }: FaqProps) {
  const contents = await db.moduleContent.findMany({ where: { moduleId: 'faq', locale } })
  const c = Object.fromEntries(contents.map((x) => [x.key, x.value]))

  const btnVal = parseButtonValue(c.btn_text)
  const btnProps = getButtonLinkProps(btnVal, locale, settings)

  const faqs = [
    { q: c.q1 ?? '', a: c.a1 ?? '', qKey: 'q1', aKey: 'a1' },
    { q: c.q2 ?? '', a: c.a2 ?? '', qKey: 'q2', aKey: 'a2' },
    { q: c.q3 ?? '', a: c.a3 ?? '', qKey: 'q3', aKey: 'a3' },
    { q: c.q4 ?? '', a: c.a4 ?? '', qKey: 'q4', aKey: 'a4' },
    { q: c.q5 ?? '', a: c.a5 ?? '', qKey: 'q5', aKey: 'a5' },
    { q: c.q6 ?? '', a: c.a6 ?? '', qKey: 'q6', aKey: 'a6' },
    { q: c.q7 ?? '', a: c.a7 ?? '', qKey: 'q7', aKey: 'a7' },
    { q: c.q8 ?? '', a: c.a8 ?? '', qKey: 'q8', aKey: 'a8' },
  ].filter(f => f.q)

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  // Generate WhatsApp contact link
  const whatsappNumber = settings?.whatsappNumber ?? ''
  const presetMsg = locale === 'fr' ? settings?.whatsappMsg_fr : locale === 'es' ? settings?.whatsappMsg_es : settings?.whatsappMsg_en
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(presetMsg ?? '')}`

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <ModuleBgWrapper id="faq" moduleId="faq" locale={locale} className="faq-grid-section">
        <FaqSectionClient
          locale={locale}
          isEditMode={isEditMode}
          c={c}
          faqs={faqs}
          btnProps={btnProps}
        />
      </ModuleBgWrapper>
    </>
  )
}
