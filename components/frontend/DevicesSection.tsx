import { db } from '@/lib/db'
import EditableText from './EditableText'
import EditableIcon from './EditableIcon'
import ModuleBgWrapper from './ModuleBgWrapper'

interface DevicesProps { locale: string; settings: any; isEditMode: boolean }

export default async function DevicesSection({ locale, settings, isEditMode }: DevicesProps) {
  const contents = await db.moduleContent.findMany({ where: { moduleId: 'devices', locale } })
  const c = Object.fromEntries(contents.map((x) => [x.key, x.value]))

  const defaultIcons = ['Tv', 'Smartphone', 'Apple', 'Laptop', 'Flame', 'Gamepad2', 'Clapperboard', 'Wifi']
  const defaultLabels = ['Smart TV', 'Android', 'iPhone / iPad', 'PC / Mac', 'FireStick', 'Android Box', 'Apple TV', 'MAG Box']

  return (
    <ModuleBgWrapper moduleId="devices" locale={locale} className="section-pad">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="badge-anchor" style={{ marginBottom: '0.75rem' }}>
            <span className="badge" style={{ display: 'inline-flex' }}>
              <EditableText moduleId="devices" locale={locale} fieldKey="badge" tag="span" isEditMode={isEditMode}>
                {c.badge ?? 'Compatibilité'}
              </EditableText>
            </span>
          </div>
          <h2 className="section-title" style={{ margin: '0.75rem 0 1rem' }}>
            <EditableText moduleId="devices" locale={locale} fieldKey="title" tag="span" isEditMode={isEditMode}>
              {c.title ?? 'Compatible avec tous vos appareils'}
            </EditableText>
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            <EditableText moduleId="devices" locale={locale} fieldKey="subtitle" tag="span" isEditMode={isEditMode}>
              {c.subtitle ?? 'Regardez sur votre Smart TV, téléphone, tablette ou ordinateur — où que vous soyez.'}
            </EditableText>
          </p>
        </div>

        <div className="devices-grid">
          {defaultLabels.map((devLabel, i) => {
            const labelKey = `dev${i + 1}_lbl`
            const iconKey = `dev${i + 1}_icon`
            const defaultIcon = defaultIcons[i]
            
            return (
              <div
                key={i}
                className="card"
                style={{
                  padding: '1.5rem 1rem',
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.625rem',
                }}
              >
                <div className="themed-icon-wrap" style={{ marginBottom: '0.25rem' }}>
                  <EditableIcon
                    moduleId="devices"
                    locale={locale}
                    fieldKey={iconKey}
                    iconValue={c[iconKey] ?? defaultIcon}
                    iconSizeValue={c[iconKey + '_size']}
                    iconColorValue={c[iconKey + '_color']}
                    defaultIcon={defaultIcon}
                    defaultSize={24}
                    defaultColor={i % 2 === 0 ? 'var(--accent-1)' : 'var(--accent-2)'}
                    isEditMode={isEditMode}
                  />
                </div>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  <EditableText moduleId="devices" locale={locale} fieldKey={labelKey} tag="span" isEditMode={isEditMode}>
                    {c[labelKey] ?? devLabel}
                  </EditableText>
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </ModuleBgWrapper>
  )
}
