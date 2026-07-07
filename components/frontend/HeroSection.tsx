import { db } from '@/lib/db'
import EditableText from './EditableText'
import Script from 'next/script'
import { parseButtonValue, getButtonLinkProps } from '@/lib/button'

interface HeroSectionProps {
  locale: string
  settings: any
  isEditMode: boolean
}

export default async function HeroSection({ locale, settings, isEditMode }: HeroSectionProps) {
  const contents = await db.moduleContent.findMany({
    where: { moduleId: 'hero', locale },
  })
  const c = Object.fromEntries(contents.map((x) => [x.key, x.value]))

  const primaryBtn = parseButtonValue(c.cta_primary)
  const primaryProps = getButtonLinkProps(primaryBtn, locale, settings)

  const secondaryBtn = parseButtonValue(c.cta_secondary)
  const secondaryProps = getButtonLinkProps(secondaryBtn, locale, settings)

  const stats = [
    { value: c.stat_channels ?? '26,000+', label: c.stat_channels_label ?? 'Channels' },
    { value: c.stat_quality ?? '4K', label: c.stat_quality_label ?? 'Ultra HD' },
    { value: c.stat_uptime ?? '99.9%', label: c.stat_uptime_label ?? 'Uptime' },
    { value: c.stat_trial ?? '24h', label: c.stat_trial_label ?? 'Free Trial' },
  ]

  const h1Lines = (c.h1 ?? 'Premium IPTV\nSubscription').split('\n')

  const bgImageUrl = c.bg_image_url || ''
  const layoutMode = c.layout_mode || 'center'

  const showBgImage = c.show_bg_image !== 'false'
  const bgBlur = c.bg_blur ? parseFloat(c.bg_blur) : 0
  const bgOverlayOpacity = c.bg_overlay_opacity ? parseFloat(c.bg_overlay_opacity) : 0.55
  const displayBg = showBgImage && bgImageUrl

  return (
    <section
      id="hero"
      data-module="hero"
      className={displayBg ? 'has-bg-image' : ''}
      suppressHydrationWarning={true}
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: layoutMode === 'left' ? 'flex-start' : 'center',
        background: displayBg ? 'transparent' : 'var(--hero-gradient)',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: 70,
      }}
    >
      {/* Background Image Layer with blur */}
      {displayBg && (
        <div
          id="hero-bg"
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: `url(${bgImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            filter: `blur(${bgBlur}px)`,
            transform: bgBlur > 0 ? 'scale(1.08)' : 'none',
            zIndex: 0,
          }}
        />
      )}

      {/* Background decoration / tint overlay */}
      {displayBg ? (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundColor: '#0f172a',
          opacity: bgOverlayOpacity,
          zIndex: 0,
        }} />
      ) : (
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(34,211,238,0.12) 0%, transparent 60%)',
          zIndex: 0,
        }} />
      )}

      <div className="hero-container" style={{ position: 'relative', zIndex: 1, width: '100%' }}>
        <div className="hero-content-card">

          {/* Badge */}
          <div className="hero-badge-container badge-anchor" style={{ marginBottom: '1.5rem' }}>
            <span className="badge animate-fade-in-up">
              <EditableText moduleId="hero" locale={locale} fieldKey="badge" tag="span" isEditMode={isEditMode}>
                {c.badge ?? '🔥 26,000+ HD & 4K Channels'}
              </EditableText>
            </span>
          </div>

          {/* H1 */}
          <h1
            className="animate-fade-in-up delay-100"
            style={{
              fontSize: 'clamp(2.25rem, 6vw, 4rem)',
              fontWeight: 900,
              fontFamily: 'Outfit, Inter, sans-serif',
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              color: displayBg ? '#ffffff' : 'var(--text-primary)',
            }}
          >
            {h1Lines.map((line, i) => (
              <span key={i}>
                <EditableText moduleId="hero" locale={locale} fieldKey={i === 0 ? 'h1' : `h1_line${i}`} tag="span" isEditMode={isEditMode}>
                  {line}
                </EditableText>
                {i < h1Lines.length - 1 && <br />}
              </span>
            ))}
          </h1>

          {/* Subtitle */}
          <p
            className="animate-fade-in-up delay-200"
            style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
              color: displayBg ? 'rgba(255, 255, 255, 0.8)' : 'var(--text-secondary)',
              marginBottom: '2.5rem',
              lineHeight: 1.7,
              maxWidth: 600,
              margin: layoutMode === 'left' ? '0 0 2.5rem 0' : '0 auto 2.5rem',
            }}
          >
            <EditableText moduleId="hero" locale={locale} fieldKey="subtitle" tag="span" isEditMode={isEditMode}>
              {c.subtitle ?? ''}
            </EditableText>
          </p>

          {/* CTA Buttons */}
          <div className="animate-fade-in-up delay-300 hero-cta-wrap" style={{ display: 'flex', gap: '1rem', justifyContent: layoutMode === 'left' ? 'flex-start' : 'center', flexWrap: 'wrap', marginBottom: '4rem' }}>
            <a {...secondaryProps} className="btn-secondary" style={{ fontSize: '1.0625rem', padding: '1rem 2.25rem' }}>
              <EditableText moduleId="hero" locale={locale} fieldKey="cta_secondary" tag="span" isEditMode={isEditMode} noLink={true}>
                {c.cta_secondary ?? 'View Plans'}
              </EditableText>
            </a>
            <a {...primaryProps} className="btn-primary" style={{ fontSize: '1.0625rem', padding: '1rem 2.25rem' }}>
              💬 <EditableText moduleId="hero" locale={locale} fieldKey="cta_primary" tag="span" isEditMode={isEditMode} noLink={true}>
                {c.cta_primary ?? 'Get Started'}
              </EditableText>
            </a>
          </div>

          {/* Stats */}
          <div className="stats-grid animate-fade-in-up delay-400">
            {stats.map((stat, i) => (
              <div key={i} className="stat-item" style={{ textAlign: layoutMode === 'left' ? 'left' : 'center' }}>
                <div className="stat-value" style={{ fontWeight: 800, color: 'var(--accent-1)', fontFamily: 'Outfit, sans-serif', lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div className="stat-label" style={{ color: displayBg ? 'rgba(255, 255, 255, 0.55)' : 'var(--text-secondary)', marginTop: '0.25rem', fontWeight: 500 }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .hero-badge-container {
          display: none !important;
          margin-bottom: 1.5rem;
        }
        .edit-mode .hero-badge-container {
          display: inline-block !important;
        }
        .hero-container {
          padding-left: 1.5rem;
          padding-right: 1.5rem;
          padding-top: 4rem;
          padding-bottom: 4rem;
        }
        .hero-content-card {
          width: 60%;
          margin: 0 auto;
          text-align: center;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          padding: 1.5rem 0;
          width: 100%;
          max-width: 650px;
          margin: ${layoutMode === 'left' ? '0' : '0 auto'};
        }
        .stat-item {
          min-width: 0;
        }
        .stat-value {
          font-size: clamp(1.4rem, 2.5vw, 2rem);
          white-space: nowrap;
        }
        .stat-label {
          font-size: 0.8125rem;
          white-space: nowrap;
        }
        @media (min-width: 1024px) {
          .hero-container {
            padding-left: ${layoutMode === 'left' ? '10%' : '1.5rem'};
            padding-right: ${layoutMode === 'left' ? '10%' : '1.5rem'};
            padding-top: ${layoutMode === 'left' ? '10vh' : '4rem'};
            padding-bottom: ${layoutMode === 'left' ? '10vh' : '4rem'};
          }
          .hero-content-card {
            width: ${layoutMode === 'left' ? '100%' : '60%'};
            max-width: ${layoutMode === 'left' ? '650px' : 'none'};
            margin: ${layoutMode === 'left' ? '0' : '0 auto'};
            text-align: ${layoutMode === 'left' ? 'left' : 'center'};
          }
        }
        @media (min-width: 640px) and (max-width: 1024px) {
          .hero-container {
            padding-left: ${layoutMode === 'left' ? '10%' : '1.5rem'};
            padding-right: ${layoutMode === 'left' ? '10%' : '1.5rem'};
            padding-top: ${layoutMode === 'left' ? '10vh' : '4rem'};
            padding-bottom: ${layoutMode === 'left' ? '10vh' : '4rem'};
          }
          .hero-content-card {
            width: 80%;
            margin: ${layoutMode === 'left' ? '0' : '0 auto'};
            text-align: ${layoutMode === 'left' ? 'left' : 'center'};
          }
        }
        @media (max-width: 640px) {
          #hero {
            min-height: auto !important;
            padding-bottom: 0 !important;
          }
          #hero .hero-container {
            padding-left: 0.5rem !important;
            padding-right: 0.5rem !important;
            padding-top: 30px !important;
            padding-bottom: 30px !important;
          }
          #hero .hero-content-card {
            width: 100% !important;
            padding: 0 !important;
            margin: 0 auto !important;
            text-align: center !important;
          }
          .hero-badge-container {
            margin-bottom: 0.75rem !important;
          }
          .hero-cta-wrap {
            margin-bottom: 1.25rem !important;
          }
          #hero .stats-grid {
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 0.2rem !important;
            padding: 0.75rem 0 0 0 !important;
            max-width: 100% !important;
            margin: 0 auto !important;
          }
          #hero .stat-value {
            font-size: 1.05rem !important;
            white-space: nowrap !important;
          }
          #hero .stat-label {
            font-size: 0.625rem !important;
            white-space: nowrap !important;
            line-height: 1.25 !important;
            letter-spacing: -0.015em !important;
            margin-top: 0.25rem !important;
            display: block !important;
          }
        }
      `}</style>

      {c.bg_image_fixed !== 'false' && (
        <Script id="hero-parallax" dangerouslySetInnerHTML={{ __html: `
          (function() {
            var bg = document.getElementById('hero-bg');
            if (!bg) return;
            var scaleStr = bg.style.transform && bg.style.transform.indexOf('scale') !== -1 ? ' scale(1.08)' : '';
            var ticking = false;
            window.addEventListener('scroll', function() {
              if (!ticking) {
                window.requestAnimationFrame(function() {
                  var scrollY = window.scrollY;
                  if (scrollY < 1000) {
                    bg.style.transform = 'translateY(' + (scrollY * 0.35) + 'px)' + scaleStr;
                  }
                  ticking = false;
                });
                ticking = true;
              }
            }, { passive: true });
          })();
        `}} />
      )}

    </section>
  )
}
