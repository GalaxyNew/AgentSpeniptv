import { db } from '@/lib/db'
import EditableText from './EditableText'
import ModuleBgWrapper from './ModuleBgWrapper'

interface MoviesMarqueeProps { locale: string; settings: any; isEditMode: boolean }

const STATIC_COUNT = 30
const staticImages = Array.from({ length: STATIC_COUNT }, (_, i) => `/images/movies/${i + 1}.webp`)

export default async function MoviesMarquee({ locale, settings, isEditMode }: MoviesMarqueeProps) {
  const contents = await db.moduleContent.findMany({ where: { moduleId: 'movies_marquee', locale } })
  const c = Object.fromEntries(contents.map((x) => [x.key, x.value]))

  const dbImages = await db.marqueeImage.findMany({
    where: { type: 'movies' },
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    select: { url: true },
  })

  const sourceImages = dbImages.length > 0 ? dbImages.map(i => i.url) : staticImages
  const items = [...sourceImages, ...sourceImages]

  return (
    <ModuleBgWrapper moduleId="movies_marquee" locale={locale} className="poster-slider-section">
      <div className="container">
        <div className="poster-slider-header">
          <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
            <div className="badge-anchor">
              <span className="badge">
                <EditableText moduleId="movies_marquee" locale={locale} fieldKey="badge" tag="span" isEditMode={isEditMode}>
                  {c.badge ?? (locale === 'es' ? 'Películas' : locale === 'en' ? 'Movies' : locale === 'zh' ? '热门电影' : 'Films')}
                </EditableText>
              </span>
            </div>
          </div>
          <h2 className="section-title" style={{ fontSize: '2rem' }}>
            <EditableText moduleId="movies_marquee" locale={locale} fieldKey="title" tag="span" isEditMode={isEditMode}>
              {c.title ?? 'Films Blockbuster à la Demande'}
            </EditableText>
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            <EditableText moduleId="movies_marquee" locale={locale} fieldKey="subtitle" tag="span" isEditMode={isEditMode}>
              {c.subtitle ?? 'Nouvelles sorties chaque jour. Streamez les derniers succès du cinéma en qualité 4K.'}
            </EditableText>
          </p>
        </div>
      </div>
      <div className="poster-slider-wrap">
        <div className="poster-slider-track" id="movies-slider">
          {items.map((src, idx) => (
            <div key={idx} className="poster-slide-item">
              <img
                src={src}
                alt={`Movie poster ${idx + 1}`}
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
