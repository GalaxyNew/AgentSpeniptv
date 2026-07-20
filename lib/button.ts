export interface ButtonValue {
  text: string
  actionType: 'whatsapp' | 'anchor' | 'page' | 'url'
  actionTarget: string
  whatsappMsg?: string
  href?: string
  font?: string
  gradient?: string
}

// Keep in sync with lib/seo.ts: default locale is prefix-free on the public site.
const DEFAULT_LOCALE = 'es'

function localePath(locale: string, path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  if (locale === DEFAULT_LOCALE) return normalized
  return normalized === '/' ? `/${locale}` : `/${locale}${normalized}`
}

export function parseButtonValue(rawStr: string | undefined | null): ButtonValue {
  if (!rawStr) {
    return { text: '', actionType: 'whatsapp', actionTarget: '', whatsappMsg: '' }
  }

  try {
    if (typeof rawStr === 'string' && rawStr.trim().startsWith('{') && rawStr.trim().endsWith('}')) {
      const parsed = JSON.parse(rawStr)
      if (parsed && typeof parsed === 'object' && 'text' in parsed) {
        return {
          text: parsed.text || '',
          actionType: parsed.actionType || (parsed.href ? (parsed.href.startsWith('#') ? 'anchor' : 'url') : 'whatsapp'),
          actionTarget: parsed.actionTarget || parsed.href || '',
          whatsappMsg: parsed.whatsappMsg || '',
          href: parsed.href || '',
          font: parsed.font || '',
          gradient: parsed.gradient || '',
        }
      }
    }
  } catch (e) {}

  return {
    text: String(rawStr),
    actionType: 'whatsapp',
    actionTarget: '',
    whatsappMsg: '',
  }
}

export function getButtonLinkProps(
  buttonValueObj: ButtonValue,
  locale: string,
  settings: any
) {
  const { actionType, actionTarget, whatsappMsg, href: storedHref } = buttonValueObj

  if (actionType === 'whatsapp') {
    const waNumber = settings?.whatsappNumber ?? ''
    const waMsg = whatsappMsg || settings?.[`whatsappMsg_${locale}`] || ''
    const waUrl = `https://wa.me/${waNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(waMsg)}`
    return {
      href: waUrl,
      target: '_blank',
      rel: 'noopener noreferrer'
    }
  }

  if (actionType === 'anchor') {
    const targetStr = actionTarget.trim()
    const href = targetStr.startsWith('#') ? targetStr : `#${targetStr}`
    return {
      href,
    }
  }

  if (actionType === 'page') {
    // Prefer stored public href when present and already prefix-free/canonical.
    if (storedHref && storedHref.startsWith('/') && !storedHref.startsWith(`/${locale}/`)) {
      return { href: storedHref }
    }
    const slug = actionTarget.trim().replace(/^\//, '')
    return {
      href: localePath(locale, `/${slug}`),
    }
  }

  if (actionType === 'url') {
    // If stored href is an internal path, prefer it.
    if (storedHref && storedHref.startsWith('/')) {
      return { href: storedHref }
    }
    let url = actionTarget.trim()
    if (url && !url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/')) {
      url = `https://${url}`
    }
    return {
      href: url || '#',
      target: '_blank',
      rel: 'noopener noreferrer'
    }
  }

  return {
    href: '#'
  }
}
