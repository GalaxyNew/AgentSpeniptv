import { db } from '../lib/db'

async function main() {
  const settings = await db.siteSettings.upsert({
    where: { id: 'main' },
    update: {
      siteDomain: 'https://igoriptv2.com',
    },
    create: {
      id: 'main',
      siteDomain: 'https://igoriptv2.com',
      brandName: 'IGOR IPTV',
      defaultLocale: 'fr',
    },
  })
  console.log('Production domain updated successfully in DB:', settings.siteDomain)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
