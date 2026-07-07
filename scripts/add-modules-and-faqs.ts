import { PrismaClient } from '../app/generated/prisma/client.ts'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' })
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  console.log('Migrating database: Adding new modules and 8 FAQs...')

  // 1. Set updated module orders (14 modules total)
  const moduleOrders = {
    hero: 1,
    authority: 2,
    pricing: 3,
    features: 4,
    how_it_works: 5,
    nos_services: 6,
    content: 7,
    sports_marquee: 8,
    movies_marquee: 9,
    series_marquee: 10,
    devices: 11,
    testimonials: 12,
    temoignages: 13,
    faq: 14
  }

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
    console.log(`✓ Module [${id}] set to order ${order}`)
  }

  // 2. Seed 'nos_services' content
  const servicesContent: Record<string, Record<string, string>> = {
    fr: {
      badge: 'NOS SERVICES',
      title: 'LE LEADER DU MARCHÉ',
      subtitle: 'Nous avons une interface confortable et un site Web IPTV facile à naviguer Aucun processus de paiement compliqué avec un service facile à configurer.',
      s1_title: 'Chaînes de 115 pays',
      s1_desc: 'Vous pouvez regarder des chaînes de télévision du monde entier (Pays-Bas / Belgique / Allemagne / Royaume-Uni / Espagne / Portugal / France / Italie / Ex-Yougoslavie / Hindi / Arabe / Turquie...)',
      s1_icon: 'Globe',
      s2_title: 'Garantie de remboursement de 2 jours',
      s2_desc: "Dans les 2 jours suivant votre achat, vous avez la possibilité d'annuler votre abonnement IPTV si vous n'êtes pas satisfait. Vous recevrez alors un remboursement intégral de notre part.",
      s2_icon: 'ShieldCheck',
      s3_title: 'High Quality HD/FHD/4K/8K',
      s3_desc: "Nous proposons toutes les qualités d'image pour visionner notre service IPTV partout, quelle que soit la vitesse de votre réseau sur : Mobile / TV / Box Android / PC",
      s3_icon: 'Tv',
    },
    es: {
      badge: 'NUESTROS SERVICIOS',
      title: 'EL LÍDER DEL MERCADO',
      subtitle: 'Tenemos una interfaz cómoda y un sitio web de IPTV fácil de navegar. Sin procesos de pago complicados y con un servicio fácil de configurar.',
      s1_title: 'Canales de 115 países',
      s1_desc: 'Puede ver canales de televisión de todo el mundo (Países Bajos / Bélgica / Alemania / Reino Unido / España / Portugal / Francia / Italia / Ex-Yugoslavia / Hindi / Árabe / Turquía...)',
      s1_icon: 'Globe',
      s2_title: 'Garantía de reembolso de 2 días',
      s2_desc: 'Dentro de los 2 días posteriores a su compra, tiene la opción de cancelar su suscripción si no está satisfecho. Recibirá un reembolso completo.',
      s2_icon: 'ShieldCheck',
      s3_title: 'Alta Calidad HD/FHD/4K/8K',
      s3_desc: 'Ofrecemos todas las calidades de imagen para ver nuestro servicio de IPTV en cualquier lugar, independientemente de la velocidad de su red en: Móvil / TV / Android Box / PC',
      s3_icon: 'Tv',
    },
    en: {
      badge: 'OUR SERVICES',
      title: 'THE MARKET LEADER',
      subtitle: 'We have a comfortable interface and an easy-to-navigate IPTV website. No complicated payment process with a service that is easy to set up.',
      s1_title: 'Channels from 115 countries',
      s1_desc: 'You can watch TV channels from all over the world (Netherlands / Belgium / Germany / United Kingdom / Spain / Portugal / France / Italy / Ex-Yugoslavia / Hindi / Arabic / Turkey...)',
      s1_icon: 'Globe',
      s2_title: '2-day money-back guarantee',
      s2_desc: 'Within 2 days of your purchase, you have the option to cancel your IPTV subscription if you are not satisfied. You will receive a full refund from us.',
      s2_icon: 'ShieldCheck',
      s3_title: 'High Quality HD/FHD/4K/8K',
      s3_desc: 'We offer all image qualities to watch our IPTV service anywhere, regardless of your network speed on: Mobile / TV / Android Box / PC',
      s3_icon: 'Tv',
    }
  }

  for (const [locale, data] of Object.entries(servicesContent)) {
    for (const [key, value] of Object.entries(data)) {
      await prisma.moduleContent.upsert({
        where: { moduleId_locale_key: { moduleId: 'nos_services', locale, key } },
        update: { value },
        create: { moduleId: 'nos_services', locale, key, value }
      })
    }
  }
  console.log('✓ Seeded nos_services translations')

  // 3. Seed 'temoignages' content
  const temoignagesContent: Record<string, Record<string, string>> = {
    fr: {
      badge: 'TÉMOIGNAGES',
      title: 'CE QUE DISENT NOS CLIENTS',
    },
    es: {
      badge: 'TESTIMONIOS',
      title: 'LO QUE DICEN NUESTROS CLIENTES',
    },
    en: {
      badge: 'TESTIMONIALS',
      title: 'WHAT OUR CLIENTS SAY',
    }
  }

  for (const [locale, data] of Object.entries(temoignagesContent)) {
    for (const [key, value] of Object.entries(data)) {
      await prisma.moduleContent.upsert({
        where: { moduleId_locale_key: { moduleId: 'temoignages', locale, key } },
        update: { value },
        create: { moduleId: 'temoignages', locale, key, value }
      })
    }
  }
  console.log('✓ Seeded temoignages translations')

  // 4. Seed 8 FAQ items matching xenomiptv.com
  const faqContent: Record<string, Record<string, string>> = {
    fr: {
      badge: 'FAQ',
      title: 'Vous Avez Encore Des Questions ?',
      q1: '01. Quels sont les moyens de paiement que vous acceptez actuellement ?',
      a1: 'Vous pouvez régler votre abonnement par Wise, carte bancaire (crédit ou débit), PayPal ou cryptomonnaies. Pour plus de détails, n’hésitez pas à joindre notre service client.',
      q2: '02. Quel type de chaînes, films ou séries proposez-vous dans votre service ?',
      a2: 'Nous proposons plus de 31 000 chaînes en direct et 120 000 VOD (films et séries) en haute définition (HD, FHD, 4K, 8K), couvrant le sport, le divertissement, les actualités et bien plus encore.',
      q3: '03. Votre service fonctionne-t-il partout dans le monde ?',
      a3: "Oui, notre service fonctionne partout dans le monde, tant que vous disposez d'une connexion Internet d'au moins 10 Mbps.",
      q4: '04. Que se passe-t-il si je ne suis pas satisfait de votre service IPTV ?',
      a4: 'Nous offrons une garantie de remboursement de 2 jours. Si le service ne vous convient pas, vous pouvez demander un remboursement complet dans les 48 heures.',
      q5: '05. Combien de temps faut-il pour activer mon abonnement après le paiement ?',
      a5: "L'activation est généralement effectuée dans les 15 à 30 minutes suivant la confirmation du paiement. Vous recevrez vos codes d'accès par e-mail ou WhatsApp.",
      q6: '06. De quelle manière vais-je recevoir mes identifiants ou mon lien après l’achat ?',
      a6: "Vos informations de connexion, y compris l'URL M3U, l'API Xtream Codes et les instructions de configuration détaillées, vous seront envoyées directement par e-mail ou par message WhatsApp.",
      q7: '07. L’abonnement se renouvelle-t-il automatiquement à la fin de la période ?',
      a7: "Non, nos abonnements ne se renouvellent pas automatiquement pour éviter tout prélèvement surprise. Nous vous contacterons avant l'expiration pour vous proposer un renouvellement manuel.",
      q8: '08. Quels types d’appareils ou applications sont compatibles avec votre service ?',
      a8: 'Notre service est compatible avec tous les appareils : Smart TV (Samsung, LG, Sony), appareils Android (TV, Box, téléphone), Apple (Apple TV, iPhone, iPad), FireStick, MAG box, et ordinateurs.',
    },
    es: {
      badge: 'FAQ',
      title: '¿Aún tiene dudas?',
      q1: '01. ¿Qué métodos de pago aceptan actualmente?',
      a1: 'Puede pagar su suscripción mediante Wise, tarjeta bancaria (crédito o débito), PayPal o criptomonedas. Para más detalles, no dude en contactar a nuestro servicio al cliente.',
      q2: '02. ¿Qué tipo de canales, películas o series ofrecen en su servicio?',
      a2: 'Ofrecemos más de 31,000 canales en vivo y 120,000 VOD (películas y series) en alta definición (HD, FHD, 4K, 8K), que cubren deportes, entretenimiento, noticias y mucho más.',
      q3: '03. ¿Su servicio funciona en cualquier parte del mundo?',
      a3: 'Sí, nuestro servicio funciona en todo el mundo, siempre que disponga de una conexión a Internet de al menos 10 Mbps.',
      q4: '04. ¿Qué pasa si no estoy satisfecho con el servicio de IPTV?',
      a4: 'Ofrecemos una garantía de devolución de dinero de 2 días. Si el servicio no le conviene, puede solicitar un reembolso completo dentro de las 48 horas.',
      q5: '05. ¿Cuánto tiempo se tarda en activar mi suscripción después del pago?',
      a5: 'La activación generalmente se realiza entre 15 y 30 minutos después de confirmar el pago. Recibirá sus códigos de acceso por correo electrónico o WhatsApp.',
      q6: '06. ¿Cómo recibiré mis credenciales o enlace después de la compra?',
      a6: 'Sus detalles de conexión, incluyendo la URL M3U, la API Xtream Codes y las instrucciones de configuración, le serán enviados directamente por correo electrónico o WhatsApp.',
      q7: '07. ¿La suscripción se renueva automáticamente al final del período?',
      a7: 'No, nuestras suscripciones no se renuevan automáticamente para evitar cargos sorpresa. Nos pondremos en contacto con usted antes del vencimiento para ofrecerle una renovación manual.',
      q8: '08. ¿Qué tipo de dispositivos o aplicaciones son compatibles con su servicio?',
      a8: 'Nuestro servicio es compatible con todos los dispositivos: Smart TV (Samsung, LG, Sony), dispositivos Android (TV, Box, móvil), Apple (Apple TV, iPhone, iPad), FireStick, MAG box y ordenadores.',
    },
    en: {
      badge: 'FAQ',
      title: 'Do You Still Have Questions?',
      q1: '01. What payment methods do you currently accept?',
      a1: 'You can pay for your subscription via Wise, bank card (credit or debit), PayPal, or cryptocurrencies. For more details, do not hesitate to contact our customer service.',
      q2: '02. What type of channels, movies, or series do you offer?',
      a2: 'We offer over 31,000 live channels and 120,000 VOD (movies and series) in high definition (HD, FHD, 4K, 8K), covering sports, entertainment, news, and more.',
      q3: '03. Does your service work anywhere in the world?',
      a3: 'Yes, our service works worldwide, as long as you have an Internet connection of at least 10 Mbps.',
      q4: '04. What happens if I am not satisfied with your IPTV service?',
      a4: 'We offer a 2-day money-back guarantee. If the service does not suit you, you can request a full refund within 48 hours.',
      q5: '05. How long does it take to activate my subscription after payment?',
      a5: 'Activation is usually completed within 15 to 30 minutes after payment confirmation. You will receive your access codes via email or WhatsApp.',
      q6: '06. How will I receive my login credentials or link after purchase?',
      a6: 'Your connection details, including the M3U URL, Xtream Codes API, and detailed setup instructions, will be sent to you directly via email or WhatsApp.',
      q7: '07. Does the subscription renew automatically at the end of the period?',
      a7: 'No, our subscriptions do not renew automatically to avoid any surprise charges. We will contact you before expiration to offer a manual renewal.',
      q8: '08. What types of devices or apps are compatible with your service?',
      a8: 'Our service is compatible with all devices: Smart TV (Samsung, LG, Sony), Android devices (TV, Box, phone), Apple (Apple TV, iPhone, iPad), FireStick, MAG box, and computers.',
    }
  }

  for (const [locale, data] of Object.entries(faqContent)) {
    for (const [key, value] of Object.entries(data)) {
      await prisma.moduleContent.upsert({
        where: { moduleId_locale_key: { moduleId: 'faq', locale, key } },
        update: { value },
        create: { moduleId: 'faq', locale, key, value }
      })
    }
  }
  console.log('✓ Seeded 8 FAQ items for all locales')

  console.log('Database seeded successfully!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
