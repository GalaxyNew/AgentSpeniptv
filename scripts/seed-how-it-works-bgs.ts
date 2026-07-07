import { PrismaClient } from '../app/generated/prisma/client.ts'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' })
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  console.log('Seeding initial HowItWorksBgImage...')

  // Check if '/images/sports_collage.png' already exists
  const existing = await prisma.howItWorksBgImage.findFirst({
    where: { url: '/images/sports_collage.png' }
  })

  if (!existing) {
    await prisma.howItWorksBgImage.create({
      data: {
        url: '/images/sports_collage.png'
      }
    })
    console.log('Added /images/sports_collage.png to HowItWorksBgImage')
  } else {
    console.log('/images/sports_collage.png already in HowItWorksBgImage')
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
