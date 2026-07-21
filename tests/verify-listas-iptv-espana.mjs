import assert from 'node:assert/strict'
import fs from 'node:fs'

const payload = JSON.parse(fs.readFileSync('scripts/listas-iptv-espana-post.json', 'utf8'))
const page = fs.readFileSync('app/[locale]/blog/[slug]/page.tsx', 'utf8')
const expectedCanonical = 'https://mejorsiptv.shop/listas-iptv-espana-legales/'

assert.equal(payload.canonicalUrl, expectedCanonical, 'canonical must match the approved public URL')
assert.ok(payload.metaDescription.length <= 155, `meta description too long: ${payload.metaDescription.length}`)
assert.equal((payload.content.match(/data-faq-item="true"/g) || []).length, 7, 'visible FAQ count')
assert.equal((payload.content.match(/<img\b/g) || []).length, 6, 'image count')
assert.equal((payload.content.match(/alt="[^"]*(?:IPTV|iptv)[^"]*"/g) || []).length, 6, 'all image alts must mention IPTV naturally')
assert.ok(!payload.content.includes('/alternativas-legales-tdt-deporte/'), 'known 404 link must be removed')
assert.ok(payload.content.includes('https://mejorsiptv.shop/blog'), 'verified internal HTTP 200 link must be present')
assert.match(page, /'@type': 'BlogPosting'/, 'BlogPosting schema must be rendered')
assert.match(page, /'@type': 'FAQPage'/, 'FAQPage schema must be rendered')
assert.match(page, /const canonicalPostUrl = post\.canonicalUrl \|\| postUrl/, 'BlogPosting must honor custom canonical')
assert.match(page, /faqSchema && \(/, 'FAQ schema must only render when visible FAQ exists')

const response = await fetch('https://mejorsiptv.shop/blog', { redirect: 'follow' })
assert.equal(response.status, 200, `replacement internal link returned ${response.status}`)

console.log(JSON.stringify({
  pass: true,
  canonical: payload.canonicalUrl,
  metaDescriptionLength: payload.metaDescription.length,
  visibleFaqCount: 7,
  faqSchema: true,
  blogPostingSchema: true,
  imageAltWithIptvCount: 6,
  replacementInternalLink: 'https://mejorsiptv.shop/blog',
  replacementInternalLinkStatus: response.status,
}, null, 2))
