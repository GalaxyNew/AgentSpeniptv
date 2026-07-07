import { PrismaClient } from '../app/generated/prisma/client.ts'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' })
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  console.log('Migrating database: Adding how_it_works module...')

  // Define new modules order
  const moduleOrders = {
    hero: 1,
    authority: 2,
    pricing: 3,
    features: 4,
    how_it_works: 5,
    content: 6,
    sports_marquee: 7,
    movies_marquee: 8,
    series_marquee: 9,
    devices: 10,
    testimonials: 11,
    faq: 12
  }

  // Update existing modules sort orders
  for (const [id, order] of Object.entries(moduleOrders)) {
    await prisma.pageModule.upsert({
      where: { id },
      update: {
        sortOrder: order,
        sortOrder_fr: order,
        sortOrder_es: order,
        sortOrder_en: order,
      },
      create: {
        id,
        isVisible: true,
        isVisible_fr: true,
        isVisible_es: true,
        isVisible_en: true,
        sortOrder: order,
        sortOrder_fr: order,
        sortOrder_es: order,
        sortOrder_en: order,
      }
    })
    console.log(`✓ Module [${id}] set to sortOrder ${order}`)
  }

  // Seed default contents for how_it_works
  const howItWorksContent: Record<string, Record<string, string>> = {
    fr: {
      title: 'Comment Ça IPTV Travaux ?',
      subtitle: 'Obtenir l\'IPTV est facile, suivez ces étapes.',
      step1_title: '1. Passez Votre Commande',
      step1_desc: 'Choisissez votre forfait IPTV préféré et passez votre commande',
      step1_icon: '/images/icons/step1.svg',
      step2_title: '2. Obtenez Votre Compte',
      step2_desc: 'Obtenez votre accès de connexion après paiement par e-mail ou WhatsApp',
      step2_icon: '/images/icons/step2.svg',
      step3_title: '3. Profitez De Votre Service IPTV !',
      step3_desc: 'Profitez de plus de 31 000 chaînes de télévision en direct et de plus de 120 000 films',
      step3_icon: '/images/icons/step3.svg',
      banner_title: 'TOUTES LES CHAÎNES SPORTIVES SUR DU BOUT DES DOIGTS!',
      banner_desc: "Préparez-vous à une expérience sportive supérieure grâce à notre service IPTV ! Regardez désormais toutes vos chaînes sportives préférées sans vous ruiner. Dites adieu aux frais supplémentaires et profitez d'un divertissement sportif sans fin !",
      banner_image: '/images/sports_collage.png',
    },
    es: {
      title: '¿Cómo funciona el IPTV?',
      subtitle: 'Obtener IPTV es fácil, siga estos pasos.',
      step1_title: '1. Realice su pedido',
      step1_desc: 'Elija su plan de IPTV preferido y complete su pedido',
      step1_icon: '/images/icons/step1.svg',
      step2_title: '2. Obtenga su cuenta',
      step2_desc: 'Obtenga sus credenciales de acceso después de pagar por correo o WhatsApp',
      step2_icon: '/images/icons/step2.svg',
      step3_title: '3. ¡Disfrute de su servicio IPTV!',
      step3_desc: 'Disfrute de más de 31,000 canales de televisión en vivo y más de 120,000 películas',
      step3_icon: '/images/icons/step3.svg',
      banner_title: '¡TODOS LOS CANALES DE DEPORTES AL ALCANCE DE TU MANO!',
      banner_desc: '¡Prepárese para una experiencia deportiva superior con nuestro servicio de IPTV! Vea todos sus canales de deportes favoritos sin gastar una fortuna. ¡Diga adiós a los cargos adicionales y disfrute de entretenimiento ilimitado!',
      banner_image: '/images/sports_collage.png',
    },
    en: {
      title: 'How Does IPTV Work?',
      subtitle: 'Getting IPTV is easy, follow these steps.',
      step1_title: '1. Place Your Order',
      step1_desc: 'Choose your preferred IPTV plan and place your order',
      step1_icon: '/images/icons/step1.svg',
      step2_title: '2. Get Your Account',
      step2_desc: 'Get your connection credentials after payment via email or WhatsApp',
      step2_icon: '/images/icons/step2.svg',
      step3_title: '3. Enjoy Your IPTV Service!',
      step3_desc: 'Enjoy more than 31,000 live TV channels and over 120,000 movies',
      step3_icon: '/images/icons/step3.svg',
      banner_title: 'ALL SPORTS CHANNELS AT YOUR FINGERTIPS!',
      banner_desc: 'Get ready for a premium sports experience with our IPTV service! Watch all your favorite sports channels live without breaking the bank. Say goodbye to extra fees and enjoy endless sports entertainment!',
      banner_image: '/images/sports_collage.png',
    },
  }

  const locales = ['fr', 'es', 'en'] as const
  const moduleId = 'how_it_works'

  for (const locale of locales) {
    const data = howItWorksContent[locale]
    for (const [key, value] of Object.entries(data)) {
      await prisma.moduleContent.upsert({
        where: { moduleId_locale_key: { moduleId, locale, key } },
        update: {}, // keep existing values if already present
        create: { moduleId, locale, key, value }
      })
    }
  }

  console.log('✓ Seeded default translations for how_it_works')
  console.log('Database migration completed successfully!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
