// The proxy serves the default locale ('es') prefix-free and 301-redirects
// /es/... to /... — so all public-facing URLs (canonical, hreflang, JSON-LD,
// internal links) must use the prefix-free form to avoid pointing at redirects.
const DEFAULT_LOCALE = 'es'

export function publicPath(locale: string, path: string = '/'): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  if (locale === DEFAULT_LOCALE) return normalized
  return normalized === '/' ? `/${locale}` : `/${locale}${normalized}`
}

export function publicUrl(domain: string, locale: string, path: string = '/'): string {
  const base = domain.replace(/\/$/, '')
  const p = publicPath(locale, path)
  return p === '/' ? `${base}/` : `${base}${p}`
}
