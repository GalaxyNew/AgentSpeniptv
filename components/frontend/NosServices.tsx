import { db } from '@/lib/db'
import EditableText from './EditableText'
import EditableIcon from './EditableIcon'
import ModuleBgWrapper from './ModuleBgWrapper'

interface NosServicesProps {
  locale: string
  settings: any
  isEditMode: boolean
}

export default async function NosServices({ locale, settings, isEditMode }: NosServicesProps) {
  const contents = await db.moduleContent.findMany({ where: { moduleId: 'nos_services', locale } })
  const c = Object.fromEntries(contents.map((x) => [x.key, x.value]))

  const services = [
    { prefix: 's1', iconKey: 's1_icon', defaultIcon: 'Globe', title: c.s1_title ?? '', desc: c.s1_desc ?? '' },
    { prefix: 's2', iconKey: 's2_icon', defaultIcon: 'ShieldCheck', title: c.s2_title ?? '', desc: c.s2_desc ?? '' },
    { prefix: 's3', iconKey: 's3_icon', defaultIcon: 'Tv', title: c.s3_title ?? '', desc: c.s3_desc ?? '' },
  ]

  return (
    <ModuleBgWrapper moduleId="nos_services" locale={locale} className="services-section">
      <div className="container">
        {/* Header Area */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="badge-anchor" style={{ marginBottom: '0.75rem' }}>
            <span className="badge">
              <EditableText moduleId="nos_services" locale={locale} fieldKey="badge" tag="span" isEditMode={isEditMode}>
                {c.badge ?? 'NOS SERVICES'}
              </EditableText>
            </span>
          </div>
          <h2 className="section-title" style={{ marginBottom: '1rem' }}>
            <EditableText moduleId="nos_services" locale={locale} fieldKey="title" tag="span" isEditMode={isEditMode}>
              {c.title ?? 'LE LEADER DU MARCHÉ'}
            </EditableText>
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto', maxWidth: '800px' }}>
            <EditableText moduleId="nos_services" locale={locale} fieldKey="subtitle" tag="span" isEditMode={isEditMode}>
              {c.subtitle ?? ''}
            </EditableText>
          </p>
        </div>

        {/* Services Grid */}
        <div className="services-grid">
          {services.map((svc, i) => (
            <div key={i} className="service-card">
              <div className="service-card-icon-wrap" style={{
                background: i === 0 ? 'var(--service-icon-1-bg)' : i === 1 ? 'var(--service-icon-2-bg)' : 'var(--service-icon-3-bg)',
                color: i === 0 ? 'var(--service-icon-1)' : i === 1 ? 'var(--service-icon-2)' : 'var(--service-icon-3)'
              }}>
                <EditableIcon
                  moduleId="nos_services"
                  locale={locale}
                  fieldKey={svc.iconKey}
                  iconValue={c[svc.iconKey] ?? svc.defaultIcon}
                  iconSizeValue={c[svc.iconKey + '_size']}
                  iconColorValue={c[svc.iconKey + '_color']}
                  defaultIcon={svc.defaultIcon}
                  defaultSize={32}
                  defaultColor={i === 0 ? 'var(--service-icon-1)' : i === 1 ? 'var(--service-icon-2)' : 'var(--service-icon-3)'}
                  isEditMode={isEditMode}
                />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem', fontFamily: 'Outfit, sans-serif' }}>
                <EditableText moduleId="nos_services" locale={locale} fieldKey={`${svc.prefix}_title`} tag="span" isEditMode={isEditMode}>
                  {svc.title}
                </EditableText>
              </h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <EditableText moduleId="nos_services" locale={locale} fieldKey={`${svc.prefix}_desc`} tag="span" isEditMode={isEditMode}>
                  {svc.desc}
                </EditableText>
              </p>
            </div>
          ))}
        </div>
      </div>
    </ModuleBgWrapper>
  )
}
