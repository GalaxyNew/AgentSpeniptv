import { db } from '@/lib/db'
import EditableText from './EditableText'
import ModuleBgWrapper from './ModuleBgWrapper'

interface AuthorityProps { locale: string; settings: any; isEditMode: boolean }

export default async function AuthoritySection({ locale, settings, isEditMode }: AuthorityProps) {
  const contents = await db.moduleContent.findMany({ where: { moduleId: 'authority', locale } })
  const c = Object.fromEntries(contents.map((x) => [x.key, x.value]))

  const stats = [
    { valueKey: 's1_val', labelKey: 's1_lbl', defaultValue: '26 000+', defaultLabel: 'Chaînes disponibles' },
    { valueKey: 's2_val', labelKey: 's2_lbl', defaultValue: '80 000+', defaultLabel: 'Films & Séries VOD' },
    { valueKey: 's3_val', labelKey: 's3_lbl', defaultValue: '15 000+', defaultLabel: 'Clients satisfaits' },
    { valueKey: 's4_val', labelKey: 's4_lbl', defaultValue: '99.9%', defaultLabel: 'Temps de disponibilité' },
  ]

  const badgeKeys = ['badge_1', 'badge_2', 'badge_3', 'badge_4']
  const defaultBadges = ['✅ Paiement sécurisé', '⚡ Activation instantanée', '🔒 Sans engagement', '🌍 Compatible partout']

  return (
    <ModuleBgWrapper id="authority" moduleId="authority" locale={locale} defaultBgColor="var(--section-alt-bg)" className="section-pad">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="badge-anchor">
            <span className="badge">
              <EditableText moduleId="authority" locale={locale} fieldKey="badge" tag="span" isEditMode={isEditMode}>
                {c.badge ?? (locale === 'es' ? 'Garantía' : locale === 'en' ? 'Trust' : locale === 'zh' ? '服务保证' : 'Garantie')}
              </EditableText>
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '2rem',
          marginBottom: '2.5rem',
          textAlign: 'center',
        }}>
          {stats.map((stat, i) => (
            <div key={i}>
              <div style={{
                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                fontWeight: 900,
                fontFamily: 'Outfit, sans-serif',
                color: 'var(--accent-1)',
                lineHeight: 1,
              }}>
                <EditableText moduleId="authority" locale={locale} fieldKey={stat.valueKey} tag="span" isEditMode={isEditMode}>
                  {c[stat.valueKey] ?? stat.defaultValue}
                </EditableText>
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.375rem', fontWeight: 500 }}>
                <EditableText moduleId="authority" locale={locale} fieldKey={stat.labelKey} tag="span" isEditMode={isEditMode}>
                  {c[stat.labelKey] ?? stat.defaultLabel}
                </EditableText>
              </div>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          justifyContent: 'center',
        }}>
          {badgeKeys.map((key, i) => (
            <span key={key} className="badge" style={{ fontSize: '0.875rem' }}>
              <EditableText moduleId="authority" locale={locale} fieldKey={key} tag="span" isEditMode={isEditMode}>
                {c[key] ?? defaultBadges[i]}
              </EditableText>
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          #authority .container > div:first-child {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </ModuleBgWrapper>
  )
}
