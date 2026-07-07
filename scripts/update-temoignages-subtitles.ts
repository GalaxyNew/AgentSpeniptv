import { PrismaClient } from '../app/generated/prisma/client.ts'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' })
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  const data = {
    fr: "Regardez les captures d'écran de nos conversations avec nos clients satisfaits.",
    es: "Mire las capturas de pantalla de nuestras conversaciones con clientes satisfechos.",
    en: "Watch the screenshots of our conversations with our satisfied clients."
  }

  for (const [locale, value] of Object.entries(data)) {
    await prisma.moduleContent.upsert({
      where: { moduleId_locale_key: { moduleId: 'temoignages', locale, key: 'subtitle' } },
      update: { value },
      create: { moduleId: 'temoignages', locale, key: 'subtitle', value }
    })
    console.log(`✓ Set subtitle for temoignages [${locale}]`)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
