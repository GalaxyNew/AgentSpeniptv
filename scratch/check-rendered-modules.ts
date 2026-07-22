import { db } from '../lib/db'

async function main() {
  const locale = 'es'
  const pageModules = await db.pageModule.findMany({ orderBy: { sortOrder: 'asc' } })
  
  const visibleModules = pageModules
    .filter((m) => {
      if (locale === 'fr') return m.isVisible_fr
      if (locale === 'es') return m.isVisible_es
      if (locale === 'en') return m.isVisible_en
      if (locale === 'zh') return m.isVisible_zh
      return m.isVisible
    })
  
  console.log(`=== Visible Modules for locale: ${locale} ===`)
  console.log(visibleModules.map(m => m.id))
}

main()
