import { db } from '@/lib/db'
import EditableText from './EditableText'
import EditableImage from './EditableImage'
import ModuleBgWrapper from './ModuleBgWrapper'
import DragToScroll from './DragToScroll'

interface TestimonialsProps { locale: string; settings: any; isEditMode: boolean }

function StarSVG({ fill = '#f7931e', size = 14 }: { fill?: string; size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill={fill} style={{ width: size, height: size, flexShrink: 0 }}>
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  )
}

const defaultReviewsByLocale: Record<string, Array<{
  key: string
  name: string
  city: string
  country: string
  date: string
  title: string
  text: string
  image: string
}>> = {
  fr: [
    {
      key: 'r1',
      name: 'Thomas D.', city: 'Paris', country: '🇫🇷 France', date: '12 février 2026',
      title: 'Enfin tous les matchs de Ligue 1 au même endroit.',
      text: "Plus besoin d'abonnements coûteux chez Canal+ ou DAZN. La qualité d'image est top, même en direct. Je recommande !",
      image: '/images/reviews/1.webp',
    },
    {
      key: 'r2',
      name: 'Sophie M.', city: 'Lyon', country: '🇫🇷 France', date: '5 février 2026',
      title: 'Fonctionne parfaitement.',
      text: "Toutes les chaînes françaises disponibles. Mon mari regarde le sport et moi mes séries. L'installation sur notre Samsung TV était super simple.",
      image: '/images/reviews/2.webp',
    },
    {
      key: 'r3',
      name: 'Marc J.', city: 'Marseille', country: '🇫🇷 France', date: '28 janvier 2026',
      title: "J'étais sceptique, mais l'essai gratuit m'a convaincu.",
      text: "La bibliothèque de films est énorme et propose toujours les dernières sorties. Le support répond aussi très vite via WhatsApp.",
      image: '/images/reviews/3.webp',
    },
    {
      key: 'r4',
      name: 'Julie B.', city: 'Nice', country: '🇫🇷 France', date: '22 janvier 2026',
      title: 'Excellent rapport qualité-prix.',
      text: "Pour moins de dix euros par mois, on regarde tout ce qu'on veut. Pas de coupures et une belle image 4K.",
      image: '/images/reviews/4.webp',
    },
    {
      key: 'r5',
      name: 'Kevin S.', city: 'Lille', country: '🇫🇷 France', date: '15 janvier 2026',
      title: 'Idéal pour la Formule 1.',
      text: "Plus besoin de Canal+ Sport. Les streams sont stables et le commentaire est en français. Service au top !",
      image: '/images/reviews/5.webp',
    },
    {
      key: 'r6',
      name: 'Emma T.', city: 'Toulouse', country: '🇫🇷 France', date: '8 janvier 2026',
      title: 'Facile à utiliser dans la chambre et le salon.',
      text: "Avec un seul abonnement, on regarde sur plusieurs écrans. Les enfants sont ravis avec les chaînes Disney.",
      image: '/images/reviews/6.webp',
    },
    {
      key: 'r7',
      name: 'Antoine W.', city: 'Strasbourg', country: '🇫🇷 France', date: '2 janvier 2026',
      title: 'Service impeccable avec une grande variété de chaînes.',
      text: "La qualité est toujours au rendez-vous et le support client est très réactif. Je recommande vivement !",
      image: '/images/reviews/7.webp',
    },
    {
      key: 'r8',
      name: 'Sarah K.', city: 'Bordeaux', country: '🇫🇷 France', date: '27 décembre 2025',
      title: 'Très satisfaite de la stabilité.',
      text: "Même aux heures de pointe, pas de mise en mémoire tampon. Le service client m'a bien aidée pour l'installation sur mon Fire Stick.",
      image: '/images/reviews/8.webp',
    },
  ],
  es: [
    {
      key: 'r1',
      name: 'Tomás D.', city: 'Madrid', country: '🇪🇸 España', date: '12 de febrero de 2026',
      title: 'Por fin todos los partidos de LaLiga en un solo lugar.',
      text: "Ya no necesito suscripciones caras de Movistar+ o DAZN. La calidad de imagen es excelente, incluso en vivo. ¡Lo recomiendo!",
      image: '/images/reviews/1.webp',
    },
    {
      key: 'r2',
      name: 'Sofía M.', city: 'Barcelona', country: '🇪🇸 España', date: '5 de febrero de 2026',
      title: 'Funciona a la perfección.',
      text: "Todos los canales de España disponibles. Mi marido ve los deportes y yo mis series. La instalación en nuestra Samsung TV fue superfácil.",
      image: '/images/reviews/2.webp',
    },
    {
      key: 'r3',
      name: 'Marcos J.', city: 'Valencia', country: '🇪🇸 España', date: '28 de enero de 2026',
      title: 'Era escéptico, pero la prueba gratuita me convenció.',
      text: "La biblioteca de películas es enorme y siempre tiene los últimos estrenos. El soporte también responde muy rápido por WhatsApp.",
      image: '/images/reviews/3.webp',
    },
    {
      key: 'r4',
      name: 'Julia B.', city: 'Sevilla', country: '🇪🇸 España', date: '22 de enero de 2026',
      title: 'Excelente relación calidad-precio.',
      text: "Por menos de diez euros al mes vemos todo lo que queremos. Sin cortes y con una hermosa imagen en 4K.",
      image: '/images/reviews/4.webp',
    },
    {
      key: 'r5',
      name: 'Kevin S.', city: 'Málaga', country: '🇪🇸 España', date: '15 de enero de 2026',
      title: 'Ideal para la Fórmula 1 y MotoGP.',
      text: "Ya no necesito costosos abonnements. Los streams son estables y con comentarios en español. ¡Servicio de primera!",
      image: '/images/reviews/5.webp',
    },
    {
      key: 'r6',
      name: 'Emma T.', city: 'Zaragoza', country: '🇪🇸 España', date: '8 de enero de 2026',
      title: 'Fácil de usar en la habitación y el salón.',
      text: "Con una sola suscripción vemos en múltiples pantallas. Los niños están encantados con los canales de Disney.",
      image: '/images/reviews/6.webp',
    },
    {
      key: 'r7',
      name: 'Antonio W.', city: 'Bilbao', country: '🇪🇸 España', date: '2 de enero de 2026',
      title: 'Servicio impecable con una gran variedad de canales.',
      text: "La calidad siempre está garantizada y el soporte al cliente es sumamente reactivo. ¡Lo recomiendo mucho!",
      image: '/images/reviews/7.webp',
    },
    {
      key: 'r8',
      name: 'Sara K.', city: 'Alicante', country: '🇪🇸 España', date: '27 de diciembre de 2025',
      title: 'Muy satisfecha con la estabilidad.',
      text: "Incluso en horas pico no hay almacenamiento en búfer. El servicio al cliente me ayudó mucho para instalarlo en mi Fire Stick.",
      image: '/images/reviews/8.webp',
    },
  ],
  en: [
    {
      key: 'r1',
      name: 'Thomas D.', city: 'London', country: '🇬🇧 UK', date: 'February 12, 2026',
      title: 'Finally all Premier League matches in one place.',
      text: "No more expensive Sky or TNT subscriptions. The image quality is top, even live. Highly recommended!",
      image: '/images/reviews/1.webp',
    },
    {
      key: 'r2',
      name: 'Sophie M.', city: 'Manchester', country: '🇬🇧 UK', date: 'February 5, 2026',
      title: 'Works absolutely perfectly.',
      text: "All UK and US channels are available. My husband watches sports and I watch my series. Setup on our Samsung TV was super simple.",
      image: '/images/reviews/2.webp',
    },
    {
      key: 'r3',
      name: 'Marc J.', city: 'Dublin', country: '🇮🇪 Ireland', date: 'January 28, 2026',
      title: 'I was skeptical, but the free trial convinced me.',
      text: "The movie library is huge and always has the latest releases. Support is also very fast via WhatsApp.",
      image: '/images/reviews/3.webp',
    },
    {
      key: 'r4',
      name: 'Julie B.', city: 'New York', country: '🇺🇸 US', date: 'January 22, 2026',
      title: 'Excellent value for money.',
      text: "For less than ten euros a month, we watch whatever we want. No buffering and beautiful 4K quality.",
      image: '/images/reviews/4.webp',
    },
    {
      key: 'r5',
      name: 'Kevin S.', city: 'Boston', country: '🇺🇸 US', date: 'January 15, 2026',
      title: 'Ideal for Formula 1 & sports.',
      text: "No more need for separate sports channels. The streams are stable and in English. Top tier service!",
      image: '/images/reviews/5.webp',
    },
    {
      key: 'r6',
      name: 'Emma T.', city: 'Sydney', country: '🇦🇺 Australia', date: 'January 8, 2026',
      title: 'Easy to use in the bedroom and living room.',
      text: "With a single subscription we watch on multiple screens. The kids love the Disney channels.",
      image: '/images/reviews/6.webp',
    },
    {
      key: 'r7',
      name: 'Antoine W.', city: 'Toronto', country: '🇨🇦 Canada', date: 'January 2, 2026',
      title: 'Impeccable service with a huge variety of channels.',
      text: "The quality is always consistent and the support team is extremely responsive. Highly recommended!",
      image: '/images/reviews/7.webp',
    },
    {
      key: 'r8',
      name: 'Sarah K.', city: 'Vancouver', country: '🇨🇦 Canada', date: 'December 27, 2025',
      title: 'Very satisfied with the stability.',
      text: "Even at peak hours, there is no buffering. Customer support helped me set it up on my Fire Stick.",
      image: '/images/reviews/8.webp',
    },
  ],
  zh: [
    {
      key: 'r1',
      name: '张强', city: '北京', country: '🇨🇳 中国', date: '2026年2月12日',
      title: '终于能在一个地方看全所有体育直播了。',
      text: '不需要购买昂贵的体育会员。画面清晰度极高，即便是在线直播也非常流畅。强烈推荐！',
      image: '/images/reviews/1.webp',
    },
    {
      key: 'r2',
      name: '李娜', city: '深圳', country: '🇨🇳 中国', date: '2026年2月5日',
      title: '运行非常完美。',
      text: '各种国内和国际频道应有尽有。我老公看球赛，我看电视剧。在三星电视上的安装非常简单。',
      image: '/images/reviews/2.webp',
    },
    {
      key: 'r3',
      name: '王伟', city: '广州', country: '🇨🇳 中国', date: '2026年1月28日',
      title: '我起初有些怀疑，但免费试用说服了我。',
      text: '电影库庞大且持续更新最新影片。客服在 WhatsApp 上的回复速度非常快。',
      image: '/images/reviews/3.webp',
    },
    {
      key: 'r4',
      name: '刘洋', city: '上海', country: '🇨🇳 中国', date: '2026年1月22日',
      title: '物超所值，体验极佳。',
      text: '价格实惠，想看的都能看。完全没有卡顿，4K画质非常震撼。',
      image: '/images/reviews/4.webp',
    },
    {
      key: 'r5',
      name: '陈晨', city: '成都', country: '🇨🇳 中国', date: '2026年1月15日',
      title: '看一级方程式赛车（F1）的不二之选。',
      text: '再也不需要购买额外的赛车频道。信号源非常稳定，且支持多音轨切换，服务绝佳！',
      image: '/images/reviews/5.webp',
    },
    {
      key: 'r6',
      name: '周敏', city: '杭州', country: '🇨🇳 中国', date: '2026年1月8日',
      title: '在卧室和客厅都能轻松使用。',
      text: '一个账号支持多台设备同时在线。孩子们非常喜欢迪斯尼频道。',
      image: '/images/reviews/6.webp',
    },
    {
      key: 'r7',
      name: '吴军', city: '武汉', country: '🇨🇳 中国', date: '2026年1月2日',
      title: '服务无可挑剔，电视频道极其丰富。',
      text: '画质一如既往地稳定，技术支持团队的响应速度非常快。强烈推荐！',
      image: '/images/reviews/7.webp',
    },
    {
      key: 'r8',
      name: '赵丽', city: '南京', country: '🇨🇳 中国', date: '2025年12月27日',
      title: '非常满意节目的稳定性。',
      text: '即使在黄金时段也不会出现卡顿缓冲。客服一步步指导我在电视棒上安装好，特别有耐心。',
      image: '/images/reviews/8.webp',
    },
  ],
}

export default async function TestimonialsSection({ locale, settings, isEditMode }: TestimonialsProps) {
  const contents = await db.moduleContent.findMany({ where: { moduleId: 'testimonials', locale } })
  const c = Object.fromEntries(contents.map((x) => [x.key, x.value]))

  const defaultReviews = defaultReviewsByLocale[locale] || defaultReviewsByLocale.en

  return (
    <ModuleBgWrapper moduleId="testimonials" locale={locale} className="section-pad section-alt">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div className="badge-anchor" style={{ marginBottom: '0.75rem' }}>
            <span className="badge">
              <EditableText moduleId="testimonials" locale={locale} fieldKey="badge" tag="span" isEditMode={isEditMode}>
                {c.badge ?? (locale === 'es' ? 'Opiniones' : locale === 'en' ? 'Reviews' : locale === 'zh' ? '用户评价' : 'Avis clients')}
              </EditableText>
            </span>
          </div>
          <h2 className="section-title" style={{ marginBottom: '0.75rem' }}>
            <EditableText moduleId="testimonials" locale={locale} fieldKey="title" tag="span" isEditMode={isEditMode}>
              {c.title ?? (locale === 'es' ? 'Lo Que Dicen Nuestros Clientes' : locale === 'en' ? 'What Our Customers Say' : locale === 'zh' ? '客户的声音' : 'Ce Que Disent Nos Clients')}
            </EditableText>
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            <EditableText moduleId="testimonials" locale={locale} fieldKey="subtitle" tag="span" isEditMode={isEditMode}>
              {c.subtitle ?? (locale === 'es' ? 'Únase a más de 17.500 clientes satisfechos en España y Latinoamérica' : locale === 'en' ? 'Join 17,500+ satisfied customers globally' : locale === 'zh' ? '与全球17,500+满意客户一起享受优质IPTV服务' : 'Rejoignez 17.500+ clients satisfaits en France et en Belgique')}
            </EditableText>
          </p>
        </div>

        {/* Testimonials Header (Trust Rating Banner) */}
        <div className="testimonials-header">
          <div className="rating-display">
            <div className="stars">
              <StarSVG fill="#f7931e" size={24} />
              <StarSVG fill="#f7931e" size={24} />
              <StarSVG fill="#f7931e" size={24} />
              <StarSVG fill="#f7931e" size={24} />
              <StarSVG fill="#f7931e" size={24} />
            </div>
            <span className="rating-text">
              <strong>
                <EditableText moduleId="testimonials" locale={locale} fieldKey="rating_score" tag="span" isEditMode={isEditMode}>
                  {c.rating_score ?? '4.9'}
                </EditableText>
              </strong>{' '}
              <EditableText moduleId="testimonials" locale={locale} fieldKey="rating_text" tag="span" isEditMode={isEditMode}>
                {c.rating_text ?? (locale === 'es' ? 'Excelente • Basado en más de 17.500 opiniones' : locale === 'en' ? 'Excellent • Based on 17,500+ reviews' : locale === 'zh' ? '极佳 • 基于17,500+条真实评价' : 'Excellent • Basé sur 17.500+ avis')}
              </EditableText>
            </span>
          </div>
        </div>

        {/* 8-Card Testimonials Grid */}
        <DragToScroll className="testimonials-grid">
          {defaultReviews.map((rev, i) => {
            const num = i + 1
            const nameKey = `r${num}_name`
            const cityKey = `r${num}_city`
            const countryKey = `r${num}_country`
            const dateKey = `r${num}_date`
            const titleKey = `r${num}_title`
            const textKey = `r${num}_text`
            const imageKey = `r${num}_image`

            const imgSrc = c[imageKey] ?? rev.image
            const initials = (c[nameKey] ?? rev.name)
              .split(' ')
              .map((w: string) => w[0])
              .join('')
              .toUpperCase()
              .slice(0, 2)

            return (
              <div key={rev.key} className="testimonial-card">
                {/* Visual Image Cover */}
                <div className="testimonial-image">
                  <EditableImage
                    moduleId="testimonials"
                    locale={locale}
                    fieldKey={imageKey}
                    src={imgSrc}
                    alt={c[nameKey] ?? rev.name}
                    width={400}
                    height={250}
                    isEditMode={isEditMode}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>

                {/* Content Area */}
                <div className="testimonial-content">
                  <div className="testimonial-header-card">
                    <div className="testimonial-avatar">{initials}</div>
                    <div className="testimonial-info">
                      <strong>
                        <EditableText moduleId="testimonials" locale={locale} fieldKey={nameKey} tag="span" isEditMode={isEditMode}>
                          {c[nameKey] ?? rev.name}
                        </EditableText>
                        <span className="testimonial-verified">✓ Verified</span>
                      </strong>
                      <div className="testimonial-location">
                        <EditableText moduleId="testimonials" locale={locale} fieldKey={countryKey} tag="span" isEditMode={isEditMode}>
                          {c[countryKey] ?? rev.country}
                        </EditableText>
                        <span> • </span>
                        <EditableText moduleId="testimonials" locale={locale} fieldKey={cityKey} tag="span" isEditMode={isEditMode}>
                          {c[cityKey] ?? rev.city}
                        </EditableText>
                      </div>
                    </div>
                  </div>

                  <div className="testimonial-stars">
                    <StarSVG fill="#f7931e" size={14} />
                    <StarSVG fill="#f7931e" size={14} />
                    <StarSVG fill="#f7931e" size={14} />
                    <StarSVG fill="#f7931e" size={14} />
                    <StarSVG fill="#f7931e" size={14} />
                  </div>

                  <div className="testimonial-title">
                    <EditableText moduleId="testimonials" locale={locale} fieldKey={titleKey} tag="span" isEditMode={isEditMode}>
                      {c[titleKey] ?? rev.title}
                    </EditableText>
                  </div>

                  <p className="testimonial-text">
                    <EditableText moduleId="testimonials" locale={locale} fieldKey={textKey} tag="span" isEditMode={isEditMode}>
                      {c[textKey] ?? rev.text}
                    </EditableText>
                  </p>

                  <div className="testimonial-date">
                    <EditableText moduleId="testimonials" locale={locale} fieldKey={dateKey} tag="span" isEditMode={isEditMode}>
                      {c[dateKey] ?? rev.date}
                    </EditableText>
                  </div>
                </div>
              </div>
            )
          })}
        </DragToScroll>
      </div>
    </ModuleBgWrapper>
  )
}
