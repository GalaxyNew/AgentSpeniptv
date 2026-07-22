import { db } from '../lib/db'

async function main() {
  const settings = await db.siteSettings.findUnique({
    where: { id: 'main' },
  })
  console.log('=== SiteSettings in DB ===')
  console.log(settings)
}

main()
