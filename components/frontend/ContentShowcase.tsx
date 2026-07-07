import { db } from '@/lib/db'
import EditableText from './EditableText'
import ContentShowcaseClient from './ContentShowcaseClient'
import ModuleBgWrapper from './ModuleBgWrapper'

interface ContentProps { locale: string; settings: any; isEditMode: boolean }

export default async function ContentShowcase({ locale, settings, isEditMode }: ContentProps) {
  const contents = await db.moduleContent.findMany({ where: { moduleId: 'content', locale } })
  const c = Object.fromEntries(contents.map((x) => [x.key, x.value]))

  return (
    <ModuleBgWrapper moduleId="content" locale={locale} className="section-pad section-alt">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div className="badge-anchor" style={{ marginBottom: '0.75rem' }}>
            <span className="badge">
              <EditableText moduleId="content" locale={locale} fieldKey="badge" tag="span" isEditMode={isEditMode}>
                {c.badge ?? 'Contenu'}
              </EditableText>
            </span>
          </div>
          <h2 className="section-title" style={{ marginBottom: '1rem' }}>
            <EditableText moduleId="content" locale={locale} fieldKey="title" tag="span" isEditMode={isEditMode}>
              {c.title ?? 'Chaînes & VOD en illimité'}
            </EditableText>
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            <EditableText moduleId="content" locale={locale} fieldKey="subtitle" tag="span" isEditMode={isEditMode}>
              {c.subtitle ?? 'Le meilleur de la télévision internationale, du sport et du cinéma.'}
            </EditableText>
          </p>
        </div>

        <ContentShowcaseClient locale={locale} isEditMode={isEditMode} c={c} />
      </div>
    </ModuleBgWrapper>
  )
}
