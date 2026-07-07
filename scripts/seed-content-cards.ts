import { PrismaClient } from '../app/generated/prisma/client.ts'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { mkdir, writeFile } from 'fs/promises'
import path from 'path'
import https from 'https'

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' })
const prisma = new PrismaClient({ adapter } as any)

// Helper to download an image from a URL
function downloadImage(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to download image: Status ${res.statusCode}`))
        return
      }
      const data: any[] = []
      res.on('data', (chunk) => data.push(chunk))
      res.on('end', async () => {
        try {
          await writeFile(dest, Buffer.concat(data))
          resolve()
        } catch (e) {
          reject(e)
        }
      })
    }).on('error', reject)
  })
}

const defaultCardsData = {
  t1: [
    {
      title_fr: 'UEFA Champions League', desc_fr: 'Flux en direct HD / 4K',
      title_es: 'UEFA Champions League', desc_es: 'Transmisiones en vivo HD / 4K',
      title_en: 'UEFA Champions League', desc_en: 'HD / 4K Live streams',
      imgUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=400&h=250&q=80'
    },
    {
      title_fr: 'Premier League & LaLiga', desc_fr: 'Tous les matchs en direct',
      title_es: 'Premier League & LaLiga', desc_es: 'Todos los partidos en vivo',
      title_en: 'Premier League & LaLiga', desc_en: 'All matches live',
      imgUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=400&h=250&q=80'
    },
    {
      title_fr: 'Formula 1 & MotoGP', desc_fr: 'Flux à fréquence d\'images élevée',
      title_es: 'Formula 1 & MotoGP', desc_es: 'Transmisiones de alta velocidad de fotogramas',
      title_en: 'Formula 1 & MotoGP', desc_en: 'High frame rate streams',
      imgUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=400&h=250&q=80'
    },
    {
      title_fr: 'NBA & EuroLeague', desc_fr: 'Couverture complète de la saison',
      title_es: 'NBA & EuroLeague', desc_es: 'Cobertura completa de la temporada',
      title_en: 'NBA & EuroLeague', desc_en: 'Full season coverage',
      imgUrl: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a27?auto=format&fit=crop&w=400&h=250&q=80'
    }
  ],
  t2: [
    {
      title_fr: 'Derniers Films du Box-Office', desc_fr: 'Mis à jour chaque semaine',
      title_es: 'Últimas Películas de Taquilla', desc_es: 'Actualizado semanalmente',
      title_en: 'Latest Box Office Movies', desc_en: 'Updated weekly',
      imgUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&h=250&q=80'
    },
    {
      title_fr: 'Séries du Moment (Netflix/HBO)', desc_fr: 'Saisons complètes en VF/VOST',
      title_es: 'Series de Tendencia (Netflix/HBO)', desc_es: 'Temporadas completas en VF/VOST',
      title_en: 'Trending Series (Netflix/HBO)', desc_en: 'Full seasons in VF/VOST',
      imgUrl: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?auto=format&fit=crop&w=400&h=250&q=80'
    },
    {
      title_fr: 'Cinéma 4K Ultra HD', desc_fr: 'Expérience home cinéma immersive',
      title_es: 'Cine 4K Ultra HD', desc_es: 'Experiencia de cine en casa inmersiva',
      title_en: '4K Ultra HD Cinema', desc_en: 'Immersive home theater experience',
      imgUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=400&h=250&q=80'
    },
    {
      title_fr: 'Dessins Animés & Stand-up', desc_fr: 'Bibliothèque diversifiée',
      title_es: 'Anime y Monólogos', desc_es: 'Biblioteca diversa',
      title_en: 'Anime & Stand-up Shows', desc_en: 'Diverse library',
      imgUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&h=250&q=80'
    }
  ],
  t3: [
    {
      title_fr: 'Chaînes Françaises (TF1, Canal+)', desc_fr: 'Bouquet français complet',
      title_es: 'Canales Franceses (TF1, Canal+)', desc_es: 'Paquete francés completo',
      title_en: 'French Channels (TF1, Canal+)', desc_en: 'Full French package',
      imgUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&h=250&q=80'
    },
    {
      title_fr: 'Chaînes Espagnoles (Movistar+)', desc_fr: 'Sports et actualités espagnols',
      title_es: 'Canales Españoles (Movistar+)', desc_es: 'Deportes y noticias españolas',
      title_en: 'Spanish Channels (Movistar+)', desc_en: 'Spanish sports & news',
      imgUrl: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=400&h=250&q=80'
    },
    {
      title_fr: 'Chaînes Premium UK & US', desc_fr: 'Sky, HBO, BBC, et plus',
      title_es: 'Canales Premium de Reino Unido y EE. UU.', desc_es: 'Sky, HBO, BBC y más',
      title_en: 'UK & US Premium Channels', desc_en: 'Sky, HBO, BBC, and more',
      imgUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=400&h=250&q=80'
    },
    {
      title_fr: 'Bouquets Arabes & Africains', desc_fr: 'BeIN, MBC et chaînes locales',
      title_es: 'Paquetes Árabes y Africanos', desc_es: 'BeIN, MBC y canales locales',
      title_en: 'Arabic & African Packages', desc_en: 'BeIN, MBC, and local channels',
      imgUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=400&h=250&q=80'
    }
  ],
  t4: [
    {
      title_fr: 'Disney & Nickelodeon', desc_fr: 'Divertissement pour enfants sécurisé',
      title_es: 'Disney y Nickelodeon', desc_es: 'Entretenimiento infantil seguro',
      title_en: 'Disney & Nickelodeon', desc_en: 'Safe kids entertainment',
      imgUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&h=250&q=80'
    },
    {
      title_fr: 'National Geographic / Discovery', desc_fr: 'Documentaires éducatifs',
      title_es: 'National Geographic / Discovery', desc_es: 'Documentales educativos',
      title_en: 'National Geographic / Discovery', desc_en: 'Educational documentaries',
      imgUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&h=250&q=80'
    },
    {
      title_fr: 'MTV & Chaînes Musicales', desc_fr: 'Pop, Rock, HipHop non-stop',
      title_es: 'MTV y Canales de Música', desc_es: 'Pop, Rock, HipHop sin parar',
      title_en: 'MTV & Music Channels', desc_en: 'Pop, Rock, HipHop non-stop',
      imgUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&h=250&q=80'
    },
    {
      title_fr: 'Comedy Central & Cartoons', desc_fr: 'Du rire pour tous les âges',
      title_es: 'Comedy Central y Dibujos Animados', desc_es: 'Risas para todas las edades',
      title_en: 'Comedy Central & Cartoons', desc_en: 'Laughter for all ages',
      imgUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=400&h=250&q=80'
    }
  ]
}

async function main() {
  console.log('Creating directories for showcase images...')
  const targetDir = path.join(process.cwd(), 'public', 'uploads', 'showcase')
  await mkdir(targetDir, { recursive: true })

  console.log('Downloading category showcase images and seeding content in DB...')

  for (const [tabKey, cards] of Object.entries(defaultCardsData)) {
    for (let i = 0; i < cards.length; i++) {
      const card = cards[i]
      const cardIdx = i + 1
      const localFilename = `${tabKey}_c${cardIdx}.jpg`
      const localDest = path.join(targetDir, localFilename)
      const localUrl = `/uploads/showcase/${localFilename}`

      console.log(`Downloading ${localFilename} from ${card.imgUrl}...`)
      try {
        await downloadImage(card.imgUrl, localDest)
        console.log(`✓ Saved ${localFilename}`)
      } catch (err: any) {
        console.error(`✗ Failed to download ${localFilename}:`, err.message)
      }

      // Seed translations for FR, ES, EN
      const translations = {
        fr: { title: card.title_fr, desc: card.desc_fr },
        es: { title: card.title_es, desc: card.desc_es },
        en: { title: card.title_en, desc: card.desc_en }
      }

      for (const [locale, data] of Object.entries(translations)) {
        // Title
        await prisma.moduleContent.upsert({
          where: { moduleId_locale_key: { moduleId: 'content', locale, key: `${tabKey}_c${cardIdx}_title` } },
          update: { value: data.title },
          create: { moduleId: 'content', locale, key: `${tabKey}_c${cardIdx}_title`, value: data.title }
        })

        // Desc
        await prisma.moduleContent.upsert({
          where: { moduleId_locale_key: { moduleId: 'content', locale, key: `${tabKey}_c${cardIdx}_desc` } },
          update: { value: data.desc },
          create: { moduleId: 'content', locale, key: `${tabKey}_c${cardIdx}_desc`, value: data.desc }
        })

        // Image URL
        await prisma.moduleContent.upsert({
          where: { moduleId_locale_key: { moduleId: 'content', locale, key: `${tabKey}_c${cardIdx}_image` } },
          update: { value: localUrl },
          create: { moduleId: 'content', locale, key: `${tabKey}_c${cardIdx}_image`, value: localUrl }
        })
      }
    }
  }

  console.log('✓ Seeding complete for all tab cards, descriptions, and images!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
