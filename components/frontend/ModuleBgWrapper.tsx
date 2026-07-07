import { db } from '@/lib/db'

interface ModuleBgWrapperProps {
  moduleId: string
  locale: string
  defaultBgColor?: string
  children: React.ReactNode
  id?: string
  className?: string
  style?: React.CSSProperties
}

export default async function ModuleBgWrapper({
  moduleId,
  locale,
  defaultBgColor,
  children,
  id,
  className,
  style = {},
}: ModuleBgWrapperProps) {
  const contents = await db.moduleContent.findMany({ where: { moduleId, locale } })
  const c = Object.fromEntries(contents.map((x) => [x.key, x.value]))

  const showBgImage = c.show_bg_image !== 'false'
  const bgImageUrl = c.bg_image_url || ''
  const bgBlur = c.bg_blur ? parseFloat(c.bg_blur) : 0
  const bgOverlayOpacity = c.bg_overlay_opacity ? parseFloat(c.bg_overlay_opacity) : 0.85
  const displayBg = showBgImage && bgImageUrl

  return (
    <section
      id={id || moduleId}
      data-module={moduleId}
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: displayBg ? 'transparent' : defaultBgColor,
        ...style,
      }}
    >
      {/* Background Image Layer with blur */}
      {displayBg && (
        <div
          style={{
            position: 'absolute',
            top: bgBlur > 0 ? `-${bgBlur * 2}px` : 0,
            left: bgBlur > 0 ? `-${bgBlur * 2}px` : 0,
            right: bgBlur > 0 ? `-${bgBlur * 2}px` : 0,
            bottom: bgBlur > 0 ? `-${bgBlur * 2}px` : 0,
            backgroundImage: `url(${bgImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundAttachment: c.bg_image_fixed === 'false' ? 'scroll' : 'fixed',
            filter: `blur(${bgBlur}px)`,
            zIndex: 0,
          }}
        />
      )}

      {/* Background Overlay Layer */}
      {displayBg && (
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'var(--bg-primary)',
            opacity: bgOverlayOpacity,
            zIndex: 0,
          }}
        />
      )}

      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </section>
  )
}
