import { db } from '@/lib/db'
import EditableText from './EditableText'
import ModuleBgWrapper from './ModuleBgWrapper'
import { parseButtonValue, getButtonLinkProps } from '@/lib/button'

interface TrialCtaProps { locale: string; settings: any; isEditMode: boolean }

export default async function TrialCta({ locale, settings, isEditMode }: TrialCtaProps) {
  const contents = await db.moduleContent.findMany({ where: { moduleId: 'trial_cta', locale } })
  const c = Object.fromEntries(contents.map((x) => [x.key, x.value]))

  const btnVal = parseButtonValue(c.btn_text)
  const btnProps = getButtonLinkProps(btnVal, locale, settings)

  const defaults: Record<string, { title: string; subtitle: string; btn_text: string }> = {
    fr: {
      title: 'À quoi ressemble notre service',
      subtitle: "Plongez dans l'avenir de la télévision avec notre service IPTV avancé. S'abonner à l'IPTV n'a jamais été aussi simple : accédez à des chaînes de sport VIP du monde entier. Profitez de chaînes illimitées, d'événements PPV et de séries TV avec vos proches.",
      btn_text: 'Essai Gratuit',
    },
    es: {
      title: 'Cómo luce nuestro servicio',
      subtitle: 'Sumérgete en el futuro de la televisión con nuestro avanzado servicio IPTV España. Comprar IPTV en España nunca ha sido tan fácil: suscríbete y accede a canales deportivos VIP de todo el mundo. Disfruta de canales ilimitados, eventos PPV y series de televisión en compañía de tus seres queridos.',
      btn_text: 'Prueba Gratis',
    },
    en: {
      title: 'What our service looks like',
      subtitle: 'Immerse yourself in the future of television with our advanced IPTV service. Buying IPTV has never been easier: subscribe and access VIP sports channels from all over the world. Enjoy unlimited channels, PPV events, and TV series with your loved ones.',
      btn_text: 'Free Trial',
    },
    zh: {
      title: '我们的服务效果如何',
      subtitle: '使用我们先进的 IPTV 服务，沉浸在电视的未来中。购买 IPTV 从未如此简单：订阅并访问来自世界各地的 VIP 体育频道。与您爱的人一起享受无限频道、PPV 活动和电视连续剧。',
      btn_text: '免费试用',
    },
  }
  const L = defaults[locale] || defaults.en

  return (
    <ModuleBgWrapper moduleId="trial_cta" locale={locale} defaultBgColor="var(--bg-primary)" className="cta-section-pad">
      <div className="container">
        <div className="cta-card">
          <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
            <div className="badge-anchor">
              <span className="badge">
                <EditableText moduleId="trial_cta" locale={locale} fieldKey="badge" tag="span" isEditMode={isEditMode}>
                  {c.badge ?? (locale === 'es' ? 'Prueba' : locale === 'en' ? 'Trial' : locale === 'zh' ? '免费试用' : 'Essai')}
                </EditableText>
              </span>
            </div>
          </div>
          <h2 className="section-title" style={{ textAlign: 'center', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontFamily: 'inherit' }}>
            <EditableText moduleId="trial_cta" locale={locale} fieldKey="title" tag="span" isEditMode={isEditMode}>
              {c.title ?? L.title}
            </EditableText>
          </h2>
          <p className="section-subtitle" style={{ textAlign: 'center', color: 'var(--text-secondary)', fontWeight: 500, fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)', lineHeight: 1.6, maxWidth: '800px' }}>
            <EditableText moduleId="trial_cta" locale={locale} fieldKey="subtitle" tag="span" isEditMode={isEditMode}>
              {c.subtitle ?? L.subtitle}
            </EditableText>
          </p>
          <a
            {...btnProps}
            className="btn-primary"
            style={{
              padding: '1rem 2.25rem',
              borderRadius: '12px',
              fontWeight: 700,
              marginTop: '0.5rem',
            }}
          >
            <EditableText moduleId="trial_cta" locale={locale} fieldKey="btn_text" tag="span" isEditMode={isEditMode} noLink={true}>
              {c.btn_text ?? L.btn_text}
            </EditableText>
            <span>→</span>
          </a>
        </div>
      </div>
    </ModuleBgWrapper>
  )
}
