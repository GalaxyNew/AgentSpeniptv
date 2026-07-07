import { db } from '@/lib/db'
import EditableText from './EditableText'
import ModuleBgWrapper from './ModuleBgWrapper'

interface TemoignagesProps {
  locale: string
  settings: any
  isEditMode: boolean
}

export default async function TemoignagesCarousel({ locale, settings, isEditMode }: TemoignagesProps) {
  const contents = await db.moduleContent.findMany({ where: { moduleId: 'temoignages', locale } })
  const c = Object.fromEntries(contents.map((x) => [x.key, x.value]))

  const uploadedImages = await db.testimonialImage.findMany({
    where: { locale },
    orderBy: { createdAt: 'desc' }
  })

  // Default fallback screenshots if none uploaded
  const defaultImages = [
    { id: 'd1', url: '/images/reviews/1.webp' },
    { id: 'd2', url: '/images/reviews/2.webp' },
    { id: 'd3', url: '/images/reviews/3.webp' },
    { id: 'd4', url: '/images/reviews/4.webp' },
    { id: 'd5', url: '/images/reviews/5.webp' },
    { id: 'd6', url: '/images/reviews/6.webp' },
  ]

  const images = uploadedImages.length > 0 ? uploadedImages : defaultImages

  // Duplicate images list for infinite loop animation
  const scrollImages = [...images, ...images, ...images]

  return (
    <ModuleBgWrapper moduleId="temoignages" locale={locale} className="temoignages-section">
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div className="badge-anchor" style={{ marginBottom: '0.75rem' }}>
            <span className="badge">
              <EditableText moduleId="temoignages" locale={locale} fieldKey="badge" tag="span" isEditMode={isEditMode}>
                {c.badge ?? 'TÉMOIGNAGES'}
              </EditableText>
            </span>
          </div>
          <h2 className="section-title">
            <EditableText moduleId="temoignages" locale={locale} fieldKey="title" tag="span" isEditMode={isEditMode}>
              {c.title ?? 'CE QUE DISENT NOS CLIENTS'}
            </EditableText>
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto', marginTop: '0.75rem' }}>
            <EditableText moduleId="temoignages" locale={locale} fieldKey="subtitle" tag="span" isEditMode={isEditMode}>
              {c.subtitle ?? 'Regardez les captures d\'écran de nos conversations avec nos clients satisfaits.'}
            </EditableText>
          </p>
        </div>

        {/* Carousel / Marquee Track */}
        <div className="temoignages-container">
          <div className="temoignages-marquee">
            <div className="temoignages-track">
              {scrollImages.map((img, idx) => (
                <div key={`${img.id}-${idx}`} className="testimonial-screenshot-card">
                  <img
                    src={img.url}
                    alt={`Testimonial screenshot ${idx + 1}`}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ModuleBgWrapper>
  )
}
