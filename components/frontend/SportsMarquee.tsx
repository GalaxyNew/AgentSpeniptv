import { db } from '@/lib/db'
import EditableText from './EditableText'
import ModuleBgWrapper from './ModuleBgWrapper'

interface SportsMarqueeProps { locale: string; settings: any; isEditMode: boolean }

const STATIC_COUNT = 14
const staticImages = Array.from({ length: STATIC_COUNT }, (_, i) => `/images/sports/${i + 1}.webp`)

export default async function SportsMarquee({ locale, settings, isEditMode }: SportsMarqueeProps) {
  const contents = await db.moduleContent.findMany({ where: { moduleId: 'sports_marquee', locale } })
  const c = Object.fromEntries(contents.map((x) => [x.key, x.value]))

  const dbImages = await db.marqueeImage.findMany({
    where: { type: 'sports' },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    select: { url: true },
  })

  const sourceImages = dbImages.length > 0 ? dbImages.map(i => i.url) : staticImages
  const items = [...sourceImages, ...sourceImages]

  return (
    <ModuleBgWrapper moduleId="sports_marquee" locale={locale} className="sports-showcase">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
          <div className="badge-anchor">
            <span className="badge">
              <EditableText moduleId="sports_marquee" locale={locale} fieldKey="badge" tag="span" isEditMode={isEditMode}>
                {c.badge ?? (locale === 'es' ? 'Deportes' : locale === 'en' ? 'Sports' : locale === 'zh' ? '体育直播' : 'Sports')}
              </EditableText>
            </span>
          </div>
        </div>
        <h2 className="section-title">
          <EditableText moduleId="sports_marquee" locale={locale} fieldKey="title" tag="span" isEditMode={isEditMode}>
            {c.title ?? 'STREAMEZ TOUS VOS SPORTS PRÉFÉRÉS'}
          </EditableText>
        </h2>
        <p className="sports-subtitle">
          <EditableText moduleId="sports_marquee" locale={locale} fieldKey="subtitle" tag="span" isEditMode={isEditMode}>
            {c.subtitle ?? 'Toutes les grandes compétitions et événements PPV en direct'}
          </EditableText>
        </p>
      </div>
      <div className="sports-slider-wrap">
        <div className="sports-slider-track">
          {items.map((src, idx) => (
            <div key={idx} className="sports-slide-item">
              <img
                src={src}
                alt={`Sport logo ${idx + 1}`}
                loading="lazy"
                width={160}
                height={160}
              />
            </div>
          ))}
        </div>
      </div>
    </ModuleBgWrapper>
  )
}
