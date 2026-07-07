import { PrismaClient } from '../app/generated/prisma/client.ts'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' })
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  const locales = ['fr', 'es', 'en'] as const
  const moduleId = 'content'

  for (const locale of locales) {
    // Width
    await prisma.moduleContent.upsert({
      where: { moduleId_locale_key: { moduleId, locale, key: 'card_image_width' } },
      update: { value: '250' },
      create: { moduleId, locale, key: 'card_image_width', value: '250' }
    })

    // Height
    await prisma.moduleContent.upsert({
      where: { moduleId_locale_key: { moduleId, locale, key: 'card_image_height' } },
      update: { value: '250' },
      create: { moduleId, locale, key: 'card_image_height', value: '250' }
    })
    
    console.log(`✓ Seeded card_image_width/height for content [${locale}]`)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
