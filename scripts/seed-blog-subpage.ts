import { PrismaClient } from '../app/generated/prisma/client.ts'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' })
const db = new PrismaClient({ adapter } as any)

const entries = [
  {
    locale: 'es',
    slug: 'blog',
    title: 'Blog - IPTV Guías y Noticias',
    content: '<p>Esta página es el blog principal del sitio.</p>',
    metaTitle: 'Blog IPTV - Guías, Noticias y Consejos',
    metaDescription: 'Descubre artículos sobre IPTV: guías de configuración, comparativas y noticias del sector.',
    robots: 'index, follow',
    isVisible: true,
  },
  {
    locale: 'fr',
    slug: 'blog',
    title: 'Blog - Guides et Actualités IPTV',
    content: '<p>Cette page est le blog principal du site.</p>',
    metaTitle: 'Blog IPTV - Guides, Actualités et Conseils',
    metaDescription: "Découvrez des articles sur IPTV: guides de configuration, comparatifs et actualités.",
    robots: 'index, follow',
    isVisible: true,
  },
  {
    locale: 'en',
    slug: 'blog',
    title: 'Blog - IPTV Guides & News',
    content: '<p>This is the main blog page of the site.</p>',
    metaTitle: 'IPTV Blog - Guides, News & Tips',
    metaDescription: 'Discover articles about IPTV: setup guides, comparisons and industry news.',
    robots: 'index, follow',
    isVisible: true,
  },
  {
    locale: 'zh',
    slug: 'blog',
    title: '博客 - IPTV 指南与新闻',
    content: '<p>这是网站的主要博客页面。</p>',
    metaTitle: 'IPTV 博客 - 指南、新闻与技巧',
    metaDescription: '了解 IPTV 相关文章：配置指南、比较和行业新闻。',
    robots: 'index, follow',
    isVisible: true,
  },
]

async function main() {
  for (const e of entries) {
    const result = await db.subpage.upsert({
      where: { locale_slug: { locale: e.locale, slug: e.slug } },
      update: {
        title: e.title,
        metaTitle: e.metaTitle,
        metaDescription: e.metaDescription,
        robots: e.robots,
        isVisible: true,
      },
      create: e,
    })
    console.log('✅', result.locale, result.slug, result.id)
  }
  await db.$disconnect()
  console.log('Done.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
