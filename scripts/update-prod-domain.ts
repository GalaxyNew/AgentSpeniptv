import { db } from '../lib/db'

async function main() {
  const settings = await db.siteSettings.upsert({
    where: { id: 'main' },
    update: {
      siteDomain: 'https://mejorsiptv.shop',
    },
    create: {
      id: 'main',
      siteDomain: 'https://mejorsiptv.shop',
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
