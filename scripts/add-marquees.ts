import { PrismaClient } from '../app/generated/prisma/client.ts'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' })
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  console.log('Inserting new marquee modules...')

  const newModules = [
    { id: 'sports_marquee', sortOrder: 6 },
    { id: 'movies_marquee', sortOrder: 7 },
    { id: 'series_marquee', sortOrder: 8 },
  ]

  // We want to insert these modules. If other modules have sortOrder >= 6, we should shift them.
  // Let's see what modules exist
  const existingModules = await prisma.pageModule.findMany()
  console.log('Existing modules in DB:', existingModules.map(m => `${m.id} (sortOrder: ${m.sortOrder})`))

  // Shift existing modules (devices, testimonials, faq) by +3 if they are currently at 6, 7, 8
  for (const m of existingModules) {
    if (m.id === 'devices') {
      await prisma.pageModule.update({
        where: { id: m.id },
        data: { sortOrder: 9, sortOrder_fr: 9, sortOrder_es: 9, sortOrder_en: 9 }
      })
    } else if (m.id === 'testimonials') {
      await prisma.pageModule.update({
        where: { id: m.id },
        data: { sortOrder: 10, sortOrder_fr: 10, sortOrder_es: 10, sortOrder_en: 10 }
      })
    } else if (m.id === 'faq') {
      await prisma.pageModule.update({
        where: { id: m.id },
        data: { sortOrder: 11, sortOrder_fr: 11, sortOrder_es: 11, sortOrder_en: 11 }
      })
    }
  }

  // Now create the new modules
  for (const mod of newModules) {
    await prisma.pageModule.upsert({
      where: { id: mod.id },
      update: {},
      create: {
        id: mod.id,
        isVisible: true,
        isVisible_fr: true,
        isVisible_es: true,
        isVisible_en: true,
        sortOrder: mod.sortOrder,
        sortOrder_fr: mod.sortOrder,
        sortOrder_es: mod.sortOrder,
        sortOrder_en: mod.sortOrder,
      }
    })
    console.log(`Module ${mod.id} upserted.`)
  }

  // Seed default contents
  const contents = {
    sports_marquee: {
      fr: {
        title: 'STREAMEZ TOUS VOS SPORTS PRÉFÉRÉS',
        subtitle: 'Toutes les grandes compétitions et événements PPV en direct',
      },
      es: {
        title: 'TRANSMITE TODOS TUS DEPORTES FAVORITOS',
        subtitle: 'Todas las grandes competiciones y eventos PPV en vivo',
      },
      en: {
        title: 'STREAM ALL YOUR FAVORITE SPORTS',
        subtitle: 'All major competitions and PPV events live',
      },
    },
    movies_marquee: {
      fr: {
        title: 'Films Blockbuster à la Demande',
        subtitle: 'Nouvelles sorties chaque jour. Streamez les derniers succès du cinéma en qualité 4K.',
      },
      es: {
        title: 'Películas Blockbuster a la Carta',
        subtitle: 'Nuevos estrenos cada día. Transmite los últimos éxitos del cine en calidad 4K.',
      },
      en: {
        title: 'Blockbuster Movies on Demand',
        subtitle: 'New releases every day. Stream the latest cinema hits in 4K quality.',
      },
    },
    series_marquee: {
      fr: {
        title: 'Séries TV Incontournables',
        subtitle: 'Saisons complètes de vos émissions préférées, des classiques aux nouveautés.',
      },
      es: {
        title: 'Series de TV Imprescindibles',
        subtitle: 'Temporadas completas de tus programas favoritos, desde clásicos hasta novedades.',
      },
      en: {
        title: 'Must-Watch TV Series',
        subtitle: 'Full seasons of your favorite shows, from classics to new releases.',
      },
    }
  }

  const locales = ['fr', 'es', 'en'] as const

  for (const [moduleId, langData] of Object.entries(contents)) {
    for (const locale of locales) {
      const data = langData[locale]
      for (const [key, value] of Object.entries(data)) {
        await prisma.moduleContent.upsert({
          where: { moduleId_locale_key: { moduleId, locale, key } },
          update: {},
          create: { moduleId, locale, key, value }
        })
      }
    }
    console.log(`Content for ${moduleId} upserted.`)
  }

  // Update Spanish refund policy subpage content
  console.log('Updating refund policy subpage...');
  const refundPolicyEsContent = `<h2 style="font-size: 1.5rem; font-weight: 700; color: var(--text-primary); margin-top: 1.5rem; margin-bottom: 1rem;">Garantía de Reembolso en 15 Días</h2><p style="margin-bottom: 1rem;">En {brand}, queremos asegurarnos de que estés 100% satisfecho con nuestro servicio. Si tienes alguna consulta técnica, no dudes en contactarnos. ¡Nuestro equipo técnico no te dejará hasta que estés viendo la televisión! Sin embargo, si sientes que el servicio que compraste no es el más adecuado para tus requisitos y has intentado resolver los problemas con nuestro personal de soporte, queremos solucionarlo.</p><p style="margin-bottom: 1.5rem;">Aunque nos encantaría saber en qué fallamos o cómo podemos mejorar, sigue los pasos a continuación para obtener un reembolso completo dentro de los 15 días posteriores a la fecha de tu compra. Si han pasado los 15 días y tienes un problema, puedes contactarnos en cualquier momento a través de nuestro chat o por correo electrónico para solucionar tu problema.</p><h2 style="font-size: 1.5rem; font-weight: 700; color: var(--text-primary); margin-top: 1.5rem; margin-bottom: 1rem;">Pasos para Solicitar un Reembolso</h2><ol style="padding-left: 1.25rem; margin-bottom: 1rem; list-style-type: decimal;"><li style="margin-bottom: 0.5rem;">Utiliza el formulario de Contacto para solicitar un reembolso.</li><li style="margin-bottom: 0.5rem;">Usa la misma dirección de correo electrónico con la que compraste nuestros servicios.</li><li style="margin-bottom: 0.5rem;">Incluye tu número de factura.</li></ol>`;

  await prisma.subpage.upsert({
    where: { locale_slug: { locale: 'es', slug: 'refund-policy' } },
    update: {
      title: 'Política de reembolso',
      content: refundPolicyEsContent
    },
    create: {
      locale: 'es',
      slug: 'refund-policy',
      title: 'Política de reembolso',
      content: refundPolicyEsContent
    }
  });

  console.log('Database updated successfully!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
