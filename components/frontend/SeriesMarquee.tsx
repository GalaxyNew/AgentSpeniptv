import { db } from '@/lib/db'
import EditableText from './EditableText'
import ModuleBgWrapper from './ModuleBgWrapper'

interface SeriesMarqueeProps { locale: string; settings: any; isEditMode: boolean }

const STATIC_COUNT = 30
const staticImages = Array.from({ length: STATIC_COUNT }, (_, i) => `/images/series/${i + 1}.webp`)

export default async function SeriesMarquee({ locale, settings, isEditMode }: SeriesMarqueeProps) {
  const contents = await db.moduleContent.findMany({ where: { moduleId: 'series_marquee', locale } })
  const c = Object.fromEntries(contents.map((x) => [x.key, x.value]))

  const dbImages = await db.marqueeImage.findMany({
    where: { type: 'series' },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    select: { url: true },
  })

  const sourceImages = dbImages.length > 0 ? dbImages.map(i => i.url) : staticImages
  const items = [...sourceImages, ...sourceImages]

  return (
    <ModuleBgWrapper moduleId="series_marquee" locale={locale} className="poster-slider-section section-alt">
      <div className="container">
        <div className="poster-slider-header">
          <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
            <div className="badge-anchor">
              <span className="badge">
                <EditableText moduleId="series_marquee" locale={locale} fieldKey="badge" tag="span" isEditMode={isEditMode}>
                  {c.badge ?? (locale === 'es' ? 'Series' : locale === 'en' ? 'Series' : locale === 'zh' ? '热门剧集' : 'Séries')}
                </EditableText>
              </span>
            </div>
          </div>
          <h2 className="section-title" style={{ fontSize: '2rem' }}>
            <EditableText moduleId="series_marquee" locale={locale} fieldKey="title" tag="span" isEditMode={isEditMode}>
              {c.title ?? 'Séries TV Incontournables'}
            </EditableText>
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            <EditableText moduleId="series_marquee" locale={locale} fieldKey="subtitle" tag="span" isEditMode={isEditMode}>
              {c.subtitle ?? 'Saisons complètes de vos émissions préférées, des classiques aux nouveautés.'}
            </EditableText>
          </p>
        </div>
      </div>
      <div className="poster-slider-wrap">
        <div className="poster-slider-track poster-slider-reverse" id="series-slider">
          {items.map((src, idx) => (
            <div key={idx} className="poster-slide-item">
              <img
                src={src}
                alt={`Series poster ${idx + 1}`}
                loading="lazy"
                width={180}
                height={270}
              />
            </div>
          ))}
        </div>
      </div>
    </ModuleBgWrapper>
  )
}
