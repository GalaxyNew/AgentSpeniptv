import { db } from '@/lib/db'
import EditableText from './EditableText'
import EditableImage from './EditableImage'
import PricingSectionClient from './PricingSectionClient'
import ModuleBgWrapper from './ModuleBgWrapper'

interface PricingProps { locale: string; settings: any; isEditMode: boolean }

export default async function PricingSection({ locale, settings, isEditMode }: PricingProps) {
  const tiers = await db.pricingTier.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      labels: { where: { locale } },
      plans: {
        orderBy: { sortOrder: 'asc' },
        include: { labels: { where: { locale } } },
      },
    },
  })

  const waNumber = settings?.whatsappNumber ?? ''

  const contents = await db.moduleContent.findMany({ where: { moduleId: 'pricing', locale } })
  const c = Object.fromEntries(contents.map((x) => [x.key, x.value]))

  const pricingLabels: Record<string, Record<string, string>> = {
    fr: { badge: 'Nos Offres', title: 'Choisissez votre abonnement', subtitle: 'Sans engagement · Livraison instantanée · Support 24/7', recommended: '⭐ Recommandé', save: 'Économisez' },
    es: { badge: 'Nuestras Ofertas', title: 'Elige tu suscripción', subtitle: 'Sin compromiso · Entrega instantánea · Soporte 24/7', recommended: '⭐ Recomendado', save: 'Ahorra' },
    en: { badge: 'Our Plans', title: 'Choose your subscription', subtitle: 'No commitment · Instant delivery · 24/7 Support', recommended: '⭐ Recommended', save: 'Save' },
    zh: { badge: '特惠套餐', title: '选择您的订阅计划', subtitle: '无合约绑定 · 即时开通 · 24/7 客服支持', recommended: '⭐ 官方推荐', save: '立省' },
  }
  const L = pricingLabels[locale] ?? pricingLabels.en

  const isImageMode = c.price_mode === 'image'
  const pricingImageUrl = c.pricing_image_url ?? ''

  return (
    <ModuleBgWrapper id="pricing" moduleId="pricing" locale={locale} className="section-pad">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="badge-anchor" style={{ marginBottom: '0.75rem' }}>
            <span className="badge">
              <EditableText moduleId="pricing" locale={locale} fieldKey="badge" tag="span" isEditMode={isEditMode}>
                {c.badge ?? L.badge}
              </EditableText>
            </span>
          </div>
          <h2 className="section-title" style={{ marginBottom: '1rem' }}>
            <EditableText moduleId="pricing" locale={locale} fieldKey="title" tag="span" isEditMode={isEditMode}>
              {c.title ?? L.title}
            </EditableText>
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            <EditableText moduleId="pricing" locale={locale} fieldKey="subtitle" tag="span" isEditMode={isEditMode}>
              {c.subtitle ?? L.subtitle}
            </EditableText>
          </p>
        </div>

        {isImageMode ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
            <div style={{ maxWidth: '850px', width: '100%', margin: '0 auto', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.25)', border: '1px solid var(--border-color)' }}>
              {isEditMode ? (
                <EditableImage
                  moduleId="pricing"
                  locale={locale}
                  fieldKey="pricing_image_url"
                  src={pricingImageUrl}
                  alt="IPTV Pricing Plans"
                  width={1200}
                  height={800}
                  isEditMode={isEditMode}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              ) : pricingImageUrl ? (
                <img
                  src={pricingImageUrl}
                  alt="IPTV Pricing Plans"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                  loading="lazy"
                />
              ) : (
                <div style={{ padding: '4rem 2rem', textAlign: 'center', background: 'rgba(255,255,255,0.03)', color: 'var(--text-secondary)', borderRadius: '1rem', border: '1px dashed var(--border-color)' }}>
                  ⚠️ {locale === 'zh' ? '暂无价格表图片。请在编辑模式下点击此处上传。' : 'No pricing image uploaded yet. Switch to edit mode to upload.'}
                </div>
              )}
            </div>

            {/* Custom CTA button under the image */}
            {waNumber && (
              <a
                href={`https://wa.me/${waNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(c.cta_wa_message ?? (locale === 'zh' ? '你好，我想订购 IPTV 服务。' : 'Hello, I want to subscribe to IPTV.'))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{
                  padding: '0.875rem 2.0rem',
                  fontSize: '0.9375rem',
                  fontWeight: 800,
                  borderRadius: '2rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  textDecoration: 'none',
                  boxShadow: 'var(--btn-primary-shadow)',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.filter = 'brightness(1.05)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.filter = 'none'
                }}
              >
                <span>💬</span>
                <EditableText moduleId="pricing" locale={locale} fieldKey="cta_text" tag="span" isEditMode={isEditMode}>
                  {c.cta_text ?? (
                    locale === 'zh' ? '立即通过 WhatsApp 订阅' :
                    locale === 'es' ? 'Suscribirse por WhatsApp' :
                    locale === 'en' ? 'Subscribe via WhatsApp' :
                    'S\'abonner via WhatsApp'
                  )}
                </EditableText>
              </a>
            )}
          </div>
        ) : (
          <PricingSectionClient
            tiers={tiers}
            locale={locale}
            isEditMode={isEditMode}
            L={L}
            waNumber={waNumber}
            displayDevices={c.display_devices ?? '1,2,3'}
            displayMonths={c.display_months ?? '1,3,6,12'}
            promoText={c.promo_text}
            disclaimer={c.disclaimer}
          />
        )}
      </div>
    </ModuleBgWrapper>
  )
}
