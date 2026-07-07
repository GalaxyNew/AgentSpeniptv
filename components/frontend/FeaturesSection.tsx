import { db } from '@/lib/db'
import EditableText from './EditableText'
import EditableIcon from './EditableIcon'
import ModuleBgWrapper from './ModuleBgWrapper'

interface FeaturesProps { locale: string; settings: any; isEditMode: boolean }

export default async function FeaturesSection({ locale, settings, isEditMode }: FeaturesProps) {
  const contents = await db.moduleContent.findMany({ where: { moduleId: 'features', locale } })
  const c = Object.fromEntries(contents.map((x) => [x.key, x.value]))

  const features = [
    { prefix: 'f1', iconKey: 'f1_icon', defaultIcon: 'Tv', title: c.f1_title ?? '4K Ultra HD', desc: c.f1_desc ?? '' },
    { prefix: 'f2', iconKey: 'f2_icon', defaultIcon: 'Zap', title: c.f2_title ?? 'Anti-Buffering', desc: c.f2_desc ?? '' },
    { prefix: 'f3', iconKey: 'f3_icon', defaultIcon: 'Smartphone', title: c.f3_title ?? 'Multi-Screen', desc: c.f3_desc ?? '' },
    { prefix: 'f4', iconKey: 'f4_icon', defaultIcon: 'Film', title: c.f4_title ?? 'VOD', desc: c.f4_desc ?? '' },
    { prefix: 'f5', iconKey: 'f5_icon', defaultIcon: 'Trophy', title: c.f5_title ?? 'Live Sports', desc: c.f5_desc ?? '' },
    { prefix: 'f6', iconKey: 'f6_icon', defaultIcon: 'Headphones', title: c.f6_title ?? '24/7 Support', desc: c.f6_desc ?? '' },
  ]

  return (
    <ModuleBgWrapper id="features" moduleId="features" locale={locale} className="section-pad">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="badge-anchor" style={{ marginBottom: '0.75rem' }}>
            <span className="badge">
              <EditableText moduleId="features" locale={locale} fieldKey="badge" tag="span" isEditMode={isEditMode}>
                {c.badge ?? 'Features'}
              </EditableText>
            </span>
          </div>
          <h2 className="section-title" style={{ marginBottom: '1rem' }}>
            <EditableText moduleId="features" locale={locale} fieldKey="title" tag="span" isEditMode={isEditMode}>
              {c.title ?? 'Everything you need'}
            </EditableText>
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            <EditableText moduleId="features" locale={locale} fieldKey="subtitle" tag="span" isEditMode={isEditMode}>
              {c.subtitle ?? ''}
            </EditableText>
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {features.map((feat, i) => (
            <div key={i} className="card" style={{ padding: '1.75rem' }}>
              <div className="themed-icon-wrap" style={{ marginBottom: '1.25rem' }}>
                <EditableIcon
                  moduleId="features"
                  locale={locale}
                  fieldKey={feat.iconKey}
                  iconValue={c[feat.iconKey] ?? feat.defaultIcon}
                  iconSizeValue={c[feat.iconKey + '_size']}
                  iconColorValue={c[feat.iconKey + '_color']}
                  defaultIcon={feat.defaultIcon}
                  defaultSize={24}
                  defaultColor={i % 2 === 0 ? 'var(--accent-1)' : 'var(--accent-2)'}
                  isEditMode={isEditMode}
                />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                <EditableText moduleId="features" locale={locale} fieldKey={`${feat.prefix}_title`} tag="span" isEditMode={isEditMode}>
                  {feat.title}
                </EditableText>
              </h3>
              <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <EditableText moduleId="features" locale={locale} fieldKey={`${feat.prefix}_desc`} tag="span" isEditMode={isEditMode}>
                  {feat.desc}
                </EditableText>
              </p>
            </div>
          ))}
        </div>
      </div>
    </ModuleBgWrapper>
  )
}
