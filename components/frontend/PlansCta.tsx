import { db } from '@/lib/db'
import EditableText from './EditableText'
import ModuleBgWrapper from './ModuleBgWrapper'
import { parseButtonValue, getButtonLinkProps } from '@/lib/button'

interface PlansCtaProps { locale: string; settings: any; isEditMode: boolean }

export default async function PlansCta({ locale, settings, isEditMode }: PlansCtaProps) {
  const contents = await db.moduleContent.findMany({ where: { moduleId: 'plans_cta', locale } })
  const c = Object.fromEntries(contents.map((x) => [x.key, x.value]))

  const btnVal = parseButtonValue(c.btn_text)
  const btnProps = getButtonLinkProps(btnVal, locale, settings)

  const defaults: Record<string, { title: string; subtitle: string; btn_text: string }> = {
    fr: {
      title: 'Profitez des dernières sorties de films et séries',
      subtitle: 'Nous proposons une large sélection de films et de séries en haute qualité. Plus de 120 000 titres à portée de clic !',
      btn_text: 'Nos Tarifs',
    },
    es: {
      title: 'Disfruta de los últimos estrenos de películas y series',
      subtitle: 'Ofrecemos una amplia variedad de películas y series en alta calidad. ¡Más de 120,000 títulos estarán a tu disposición a solo un clic de distancia!',
      btn_text: 'Planes De Precios',
    },
    en: {
      title: 'Enjoy the latest movie and series releases',
      subtitle: 'We offer a wide variety of movies and series in high quality. More than 120,000 titles at your disposal just a click away!',
      btn_text: 'Pricing Plans',
    },
    zh: {
      title: '享受最新的电影和电视剧',
      subtitle: '我们提供高质量的丰富电影和电视剧。只需点击一下，即可为您提供超过 120,000 部作品！',
      btn_text: '价格套餐',
    },
  }
  const L = defaults[locale] || defaults.en

  return (
    <ModuleBgWrapper moduleId="plans_cta" locale={locale} defaultBgColor="var(--bg-primary)" className="cta-section-pad">
      <div className="container">
        <div className="cta-card">
          <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
            <div className="badge-anchor">
              <span className="badge">
                <EditableText moduleId="plans_cta" locale={locale} fieldKey="badge" tag="span" isEditMode={isEditMode}>
                  {c.badge ?? (locale === 'es' ? 'Precios' : locale === 'en' ? 'Pricing' : locale === 'zh' ? '价格方案' : 'Tarifs')}
                </EditableText>
              </span>
            </div>
          </div>
          <h2 className="section-title" style={{ textAlign: 'center', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontFamily: 'inherit' }}>
            <EditableText moduleId="plans_cta" locale={locale} fieldKey="title" tag="span" isEditMode={isEditMode}>
              {c.title ?? L.title}
            </EditableText>
          </h2>
          <p className="section-subtitle" style={{ textAlign: 'center', color: 'var(--text-secondary)', fontWeight: 500, fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)', lineHeight: 1.6, maxWidth: '800px' }}>
            <EditableText moduleId="plans_cta" locale={locale} fieldKey="subtitle" tag="span" isEditMode={isEditMode}>
              {c.subtitle ?? L.subtitle}
            </EditableText>
          </p>
          <a
            {...btnProps}
            className="btn-primary"
            style={{
              padding: '1rem 2.25rem',
              borderRadius: '12px',
              fontWeight: 700,
              marginTop: '0.5rem',
            }}
          >
            <EditableText moduleId="plans_cta" locale={locale} fieldKey="btn_text" tag="span" isEditMode={isEditMode} noLink={true}>
              {c.btn_text ?? L.btn_text}
            </EditableText>
            <span>→</span>
          </a>
        </div>
      </div>
    </ModuleBgWrapper>
  )
}
