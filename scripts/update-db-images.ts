import { PrismaClient } from '../app/generated/prisma/client.ts'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' })
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  console.log('Migrating database image URLs...')

  const contents = await prisma.moduleContent.findMany({
    where: {
      value: {
        contains: 'meilleure-iptv-pro.fr'
      }
    }
  })

  console.log(`Found ${contents.length} database entries containing remote URLs.`)

  for (const entry of contents) {
    // Remote URL looks like:
    // https://meilleure-iptv-pro.fr/wp-content/themes/buenos-aires-3.5.1/assets/images/reviews/1.webp
    // Or similar paths.
    // We translate them to local paths /images/reviews/1.webp, etc.
    const regex = /https:\/\/meilleure-iptv-pro\.fr\/wp-content\/themes\/[^\/]+\/assets\/images\/reviews\/(\d+\.webp)/;
    const match = entry.value.match(regex);
    if (match) {
      const localPath = `/images/reviews/${match[1]}`;
      await prisma.moduleContent.update({
        where: {
          moduleId_locale_key: {
            moduleId: entry.moduleId,
            locale: entry.locale,
            key: entry.key
          }
        },
        data: {
          value: localPath
        }
      })
      console.log(`✓ Updated [${entry.moduleId}][${entry.locale}][${entry.key}]: ${entry.value} -> ${localPath}`)
    } else {
      // General match for other paths if any
      const genericRegex = /https:\/\/meilleure-iptv-pro\.fr\/.*\/images\/(sports|movies|series|reviews)\/([^\/]+)/i;
      const genericMatch = entry.value.match(genericRegex);
      if (genericMatch) {
        const localPath = `/images/${genericMatch[1].toLowerCase()}/${genericMatch[2]}`;
        await prisma.moduleContent.update({
          where: {
            moduleId_locale_key: {
              moduleId: entry.moduleId,
              locale: entry.locale,
              key: entry.key
            }
          },
          data: {
            value: localPath
          }
        })
        console.log(`✓ Updated generic [${entry.moduleId}][${entry.locale}][${entry.key}]: ${entry.value} -> ${localPath}`)
      } else {
        // Fallback replacement if it's just any sports logo or review image containing the domain
        const sportsRegex = /SPORTS%20\((\d+)\)\.webp/i;
        const sportsMatch = entry.value.match(sportsRegex);
        if (sportsMatch) {
          const localPath = `/images/sports/${sportsMatch[1]}.webp`;
          await prisma.moduleContent.update({
            where: {
              moduleId_locale_key: {
                moduleId: entry.moduleId,
                locale: entry.locale,
                key: entry.key
              }
            },
            data: {
              value: localPath
            }
          })
          console.log(`✓ Updated sports [${entry.moduleId}][${entry.locale}][${entry.key}]: ${entry.value} -> ${localPath}`)
        } else {
          console.log(`✗ Skipped unmatched URL: ${entry.value}`)
        }
      }
    }
  }

  console.log('Database migration completed successfully!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
