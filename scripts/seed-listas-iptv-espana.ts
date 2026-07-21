import { db } from '../lib/db'
import fs from 'fs'
import path from 'path'

interface PostPayload {
  title: string
  excerpt: string
  category: string
  metaTitle: string
  metaDescription: string
  canonicalUrl: string
  keywords: string
  content: string
}

async function main() {
  const payloadPath = path.resolve(__dirname, 'listas-iptv-espana-post.json')
  const payload = JSON.parse(fs.readFileSync(payloadPath, 'utf8')) as PostPayload
  const locale = 'es'
  const slug = 'listas-iptv-espana-legales'

  const post = await db.blogPost.upsert({
    where: { locale_slug: { locale, slug } },
    update: {
      ...payload,
      status: 'published',
      robots: 'index, follow',
    },
    create: {
      locale,
      slug,
      ...payload,
      status: 'published',
      robots: 'index, follow',
      publishAt: new Date('2026-07-22T00:00:00+08:00'),
    },
  })

  console.log(`upserted locale=${post.locale} slug=${post.slug} id=${post.id}`)
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => db.$disconnect())
