import { db } from '@/lib/db'
import EditableText from './EditableText'
import EditableIcon from './EditableIcon'
import EditableImage from './EditableImage'

interface HowItWorksProps { locale: string; settings: any; isEditMode: boolean }

export default async function HowItWorks({ locale, settings, isEditMode }: HowItWorksProps) {
  const contents = await db.moduleContent.findMany({ where: { moduleId: 'how_it_works', locale } })
  const c = Object.fromEntries(contents.map((x) => [x.key, x.value]))

  const steps = [
    {
      iconKey: 'step1_icon',
      titleKey: 'step1_title',
      descKey: 'step1_desc',
      defaultIcon: 'Tv',
      defaultTitle: '1. Passez Votre Commande',
      defaultDesc: 'Choisissez votre forfait IPTV préféré et passez votre commande',
    },
    {
      iconKey: 'step2_icon',
      titleKey: 'step2_title',
      descKey: 'step2_desc',
      defaultIcon: 'Smartphone',
      defaultTitle: '2. Obtenez Votre Compte',
      defaultDesc: 'Obtenez votre accès de connexion après paiement par e-mail ou WhatsApp',
    },
    {
      iconKey: 'step3_icon',
      titleKey: 'step3_title',
      descKey: 'step3_desc',
      defaultIcon: 'Play',
      defaultTitle: '3. Profitez De Votre Service IPTV !',
      defaultDesc: 'Profitez de plus de 31 000 chaînes de télévision en direct et de plus de 120 000 films',
    },
  ]

  const showBgImage = c.show_bg_image !== 'false'
  const bgImage = c.bg_image_url || '/images/sports_stadium_bg.webp'
  const bgBlur = c.bg_blur ? parseFloat(c.bg_blur) : 0
  const bgOverlayOpacity = c.bg_overlay_opacity ? parseFloat(c.bg_overlay_opacity) : 0.85

  return (
    <section 
      id="how_it_works"
      data-module="how_it_works" 
      className="how-it-works-section"
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: showBgImage ? 'transparent' : 'var(--bg-primary)',
      }}
    >
      {/* Background Layer with blur */}
      {showBgImage && (
        <div 
          style={{
            position: 'absolute',
            top: bgBlur > 0 ? `-${bgBlur * 2}px` : 0,
            left: bgBlur > 0 ? `-${bgBlur * 2}px` : 0,
            right: bgBlur > 0 ? `-${bgBlur * 2}px` : 0,
            bottom: bgBlur > 0 ? `-${bgBlur * 2}px` : 0,
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: c.bg_image_fixed === 'false' ? 'scroll' : 'fixed',
            filter: `blur(${bgBlur}px)`,
            zIndex: -2,
          }}
        />
      )}
      {/* Dark Overlay Layer */}
      {showBgImage && (
        <div 
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'var(--bg-primary)',
            opacity: bgOverlayOpacity,
            zIndex: -1,
          }}
        />
      )}

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header Area */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="badge-anchor">
            <span className="badge">
              <EditableText moduleId="how_it_works" locale={locale} fieldKey="badge" tag="span" isEditMode={isEditMode}>
                {c.badge ?? (locale === 'es' ? 'Cómo Funciona' : locale === 'en' ? 'How It Works' : locale === 'zh' ? '工作流程' : 'Comment ça marche')}
              </EditableText>
            </span>
          </div>
          <h2 className="section-title">
            <EditableText moduleId="how_it_works" locale={locale} fieldKey="title" tag="span" isEditMode={isEditMode}>
              {c.title ?? 'Comment Ça IPTV Travaux ?'}
            </EditableText>
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto', marginTop: '0.75rem' }}>
            <EditableText moduleId="how_it_works" locale={locale} fieldKey="subtitle" tag="span" isEditMode={isEditMode}>
              {c.subtitle ?? 'Obtenir l\'IPTV est facile, suivez ces étapes.'}
            </EditableText>
          </p>
        </div>

        {/* Steps Grid */}
        <div className="steps-grid">
          {steps.map((step, idx) => (
            <div key={idx} className="step-card">
              <div className="step-icon-wrap">
                <EditableIcon
                  moduleId="how_it_works"
                  locale={locale}
                  fieldKey={step.iconKey}
                  iconValue={c[step.iconKey] ?? step.defaultIcon}
                  iconSizeValue={c[step.iconKey + '_size']}
                  iconColorValue={c[step.iconKey + '_color']}
                  defaultIcon={step.defaultIcon}
                  defaultSize={32}
                  defaultColor={idx % 2 === 0 ? 'var(--accent-1)' : 'var(--accent-2)'}
                  isEditMode={isEditMode}
                />
              </div>
              <h3 className="step-card-title">
                <EditableText moduleId="how_it_works" locale={locale} fieldKey={step.titleKey} tag="span" isEditMode={isEditMode}>
                  {c[step.titleKey] ?? step.defaultTitle}
                </EditableText>
              </h3>
              <p className="step-card-desc">
                <EditableText moduleId="how_it_works" locale={locale} fieldKey={step.descKey} tag="span" isEditMode={isEditMode}>
                  {c[step.descKey] ?? step.defaultDesc}
                </EditableText>
              </p>
            </div>
          ))}
        </div>

        {/* Large Sports Banner */}
        {c.show_banner !== 'false' && (
          <div 
            className="sports-banner-card"
            style={{ 
              marginTop: '3rem',
              padding: '2.5rem', 
              border: '1px solid var(--border-color)', 
              background: 'var(--bg-card)', 
              backdropFilter: 'var(--card-backdrop)',
              borderRadius: '1rem', 
              display: 'grid', 
              gridTemplateColumns: '1.2fr 1fr', 
              gap: '2.5rem', 
              alignItems: 'center',
              boxShadow: 'var(--card-shadow)'
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem', lineHeight: 1.25 }}>
                <EditableText moduleId="how_it_works" locale={locale} fieldKey="banner_title" tag="span" isEditMode={isEditMode}>
                  {c.banner_title ?? 'ALL SPORTS CHANNELS AT YOUR FINGERTIPS!'}
                </EditableText>
              </h3>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <EditableText moduleId="how_it_works" locale={locale} fieldKey="banner_desc" tag="span" isEditMode={isEditMode}>
                  {c.banner_desc ?? 'Get ready for a premium sports experience with our IPTV service! Watch all your favorite sports channels live without breaking the bank.'}
                </EditableText>
              </p>
            </div>
            <div>
              <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: '0 12px 32px rgba(0, 0, 0, 0.3)' }}>
                <EditableImage
                  moduleId="how_it_works"
                  locale={locale}
                  fieldKey="banner_image"
                  src={c.banner_image || '/images/sports_collage.png'}
                  alt="Sports channels collage"
                  width={600}
                  height={400}
                  isEditMode={isEditMode}
                  style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .sports-banner-card {
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
            padding: 1.5rem !important;
            text-align: center;
          }
        }
      `}</style>
    </section>
  )
}
