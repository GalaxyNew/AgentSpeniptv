import { PrismaClient } from '../app/generated/prisma/client.ts'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' })
const prisma = new PrismaClient({ adapter } as any)

async function main() {
  console.log('Migrating testimonials data to 8 items in SQLite DB...')

  const dataByLocale: Record<string, Record<string, string>> = {
    fr: {
      badge: 'Avis clients',
      title: 'Ce Que Disent Nos Clients',
      subtitle: 'Rejoignez 17.500+ clients satisfaits en France et en Belgique',
      rating_score: '4.9',
      rating_text: 'Excellent • Basé sur 17.500+ avis',
      r1_name: 'Thomas D.', r1_city: 'Paris', r1_country: '🇫🇷 France', r1_date: '12 février 2026', r1_title: 'Enfin tous les matchs de Ligue 1 au même endroit.', r1_text: "Plus besoin d'abonnements coûteux chez Canal+ ou DAZN. La qualité d'image est top, même en direct. Je recommande !", r1_image: 'https://meilleure-iptv-pro.fr/wp-content/themes/buenos-aires-3.5.1/assets/images/reviews/1.webp',
      r2_name: 'Sophie M.', r2_city: 'Lyon', r2_country: '🇫🇷 France', r2_date: '5 février 2026', r2_title: 'Fonctionne parfaitement.', r2_text: "Toutes les chaînes françaises disponibles. Mon mari regarde le sport et moi mes séries. L'installation sur notre Samsung TV était super simple.", r2_image: 'https://meilleure-iptv-pro.fr/wp-content/themes/buenos-aires-3.5.1/assets/images/reviews/2.webp',
      r3_name: 'Marc J.', r3_city: 'Marseille', r3_country: '🇫🇷 France', r3_date: '28 janvier 2026', r3_title: "J'étais sceptique, mais l'essai gratuit m'a convaincu.", r3_text: "La bibliothèque de films est énorme et propose toujours les dernières sorties. Le support répond aussi très vite via WhatsApp.", r3_image: 'https://meilleure-iptv-pro.fr/wp-content/themes/buenos-aires-3.5.1/assets/images/reviews/3.webp',
      r4_name: 'Julie B.', r4_city: 'Nice', r4_country: '🇫🇷 France', r4_date: '22 janvier 2026', r4_title: 'Excellent rapport qualité-prix.', r4_text: "Pour moins de dix euros par mois, on regarde tout ce qu'on veut. Pas de coupures et une belle image 4K.", r4_image: 'https://meilleure-iptv-pro.fr/wp-content/themes/buenos-aires-3.5.1/assets/images/reviews/4.webp',
      r5_name: 'Kevin S.', r5_city: 'Lille', r5_country: '🇫🇷 France', r5_date: '15 janvier 2026', r5_title: 'Idéal pour la Formule 1.', r5_text: "Plus besoin de Canal+ Sport. Les streams sont stables et le commentaire est en français. Service au top !", r5_image: 'https://meilleure-iptv-pro.fr/wp-content/themes/buenos-aires-3.5.1/assets/images/reviews/5.webp',
      r6_name: 'Emma T.', r6_city: 'Toulouse', r6_country: '🇫🇷 France', r6_date: '8 janvier 2026', r6_title: 'Facile à utiliser dans la chambre et le salon.', r6_text: "Avec un seul abonnement, on regarde sur plusieurs écrans. Les enfants sont ravis avec les chaînes Disney.", r6_image: 'https://meilleure-iptv-pro.fr/wp-content/themes/buenos-aires-3.5.1/assets/images/reviews/6.webp',
      r7_name: 'Antoine W.', r7_city: 'Strasbourg', r7_country: '🇫🇷 France', r7_date: '2 janvier 2026', r7_title: 'Service impeccable avec une grande variété de chaînes.', r7_text: "La qualité est toujours au rendez-vous et le support client est très réactif. Je recommande vivement !", r7_image: 'https://meilleure-iptv-pro.fr/wp-content/themes/buenos-aires-3.5.1/assets/images/reviews/7.webp',
      r8_name: 'Sarah K.', r8_city: 'Bordeaux', r8_country: '🇫🇷 France', r8_date: '27 décembre 2025', r8_title: 'Très satisfaite de la stabilité.', r8_text: "Même aux heures de pointe, pas de mise en mémoire tampon. Le service client m'a bien aidée pour l'installation sur mon Fire Stick.", r8_image: 'https://meilleure-iptv-pro.fr/wp-content/themes/buenos-aires-3.5.1/assets/images/reviews/8.webp',
    },
    es: {
      badge: 'Opiniones',
      title: 'Lo Que Dicen Nuestros Clientes',
      subtitle: 'Únase a más de 17.500 clientes satisfechos en España y Latinoamérica',
      rating_score: '4.9',
      rating_text: 'Excelente • Basado en más de 17.500 opiniones',
      r1_name: 'Tomás D.', r1_city: 'Madrid', r1_country: '🇪🇸 España', r1_date: '12 de febrero de 2026', r1_title: 'Por fin todos los partidos de LaLiga en un solo lugar.', r1_text: "Ya no necesito suscripciones caras de Movistar+ o DAZN. La calidad de imagen es excelente, incluso en vivo. ¡Lo recomiendo!", r1_image: 'https://meilleure-iptv-pro.fr/wp-content/themes/buenos-aires-3.5.1/assets/images/reviews/1.webp',
      r2_name: 'Sofía M.', r2_city: 'Barcelona', r2_country: '🇪🇸 España', r2_date: '5 de febrero de 2026', r2_title: 'Funciona a la perfección.', r2_text: "Todos los canales de España disponibles. Mi marido ve los deportes y yo mis series. La instalación en nuestra Samsung TV fue superfácil.", r2_image: 'https://meilleure-iptv-pro.fr/wp-content/themes/buenos-aires-3.5.1/assets/images/reviews/2.webp',
      r3_name: 'Marcos J.', r3_city: 'Valencia', r3_country: '🇪🇸 España', r3_date: '28 de enero de 2026', r3_title: 'Era escéptico, pero la prueba gratuita me convenció.', r3_text: "La biblioteca de películas es enorme y siempre tiene los últimos estrenos. El soporte también responde muy rápido por WhatsApp.", r3_image: 'https://meilleure-iptv-pro.fr/wp-content/themes/buenos-aires-3.5.1/assets/images/reviews/3.webp',
      r4_name: 'Julia B.', r4_city: 'Sevilla', r4_country: '🇪🇸 España', r4_date: '22 de enero de 2026', r4_title: 'Excelente relación calidad-precio.', r4_text: "Por menos de diez euros al mes vemos todo lo que queremos. Sin cortes y con una hermosa imagen en 4K.", r4_image: 'https://meilleure-iptv-pro.fr/wp-content/themes/buenos-aires-3.5.1/assets/images/reviews/4.webp',
      r5_name: 'Kevin S.', r5_city: 'Málaga', r5_country: '🇪🇸 España', r5_date: '15 de enero de 2026', r5_title: 'Ideal para la Fórmula 1 y MotoGP.', r5_text: "Ya no necesito costosos abonnements. Los streams son estables y con comentarios en español. ¡Servicio de primera!", r5_image: 'https://meilleure-iptv-pro.fr/wp-content/themes/buenos-aires-3.5.1/assets/images/reviews/5.webp',
      r6_name: 'Emma T.', r6_city: 'Zaragoza', r6_country: '🇪🇸 España', r6_date: '8 de enero de 2026', r6_title: 'Fácil de usar en la habitación y el salón.', r6_text: "Con una sola suscripción vemos en múltiples pantallas. Los niños están encantados con los canales de Disney.", r6_image: 'https://meilleure-iptv-pro.fr/wp-content/themes/buenos-aires-3.5.1/assets/images/reviews/6.webp',
      r7_name: 'Antonio W.', r7_city: 'Bilbao', r7_country: '🇪🇸 España', r7_date: '2 de enero de 2026', r7_title: 'Servicio impecable con una gran variedad de canales.', r7_text: "La calidad siempre está garantizada y el soporte al cliente es sumamente reactivo. ¡Lo recomiendo mucho!", r7_image: 'https://meilleure-iptv-pro.fr/wp-content/themes/buenos-aires-3.5.1/assets/images/reviews/7.webp',
      r8_name: 'Sara K.', r8_city: 'Alicante', r8_country: '🇪🇸 España', r8_date: '27 de diciembre de 2025', r8_title: 'Muy satisfecha con la estabilidad.', r8_text: "Incluso en horas pico no hay almacenamiento en búfer. El servicio al cliente me ayudó mucho para instalarlo en mi Fire Stick.", r8_image: 'https://meilleure-iptv-pro.fr/wp-content/themes/buenos-aires-3.5.1/assets/images/reviews/8.webp',
    },
    en: {
      badge: 'Reviews',
      title: 'What Our Customers Say',
      subtitle: 'Join 17,500+ satisfied customers globally',
      rating_score: '4.9',
      rating_text: 'Excellent • Based on 17,500+ reviews',
      r1_name: 'Thomas D.', r1_city: 'London', r1_country: '🇬🇧 UK', r1_date: 'February 12, 2026', r1_title: 'Finally all Premier League matches in one place.', r1_text: "No more expensive Sky or TNT subscriptions. The image quality is top, even live. Highly recommended!", r1_image: 'https://meilleure-iptv-pro.fr/wp-content/themes/buenos-aires-3.5.1/assets/images/reviews/1.webp',
      r2_name: 'Sophie M.', r2_city: 'Manchester', r2_country: '🇬🇧 UK', r2_date: 'February 5, 2026', r2_title: 'Works absolutely perfectly.', r2_text: "All UK and US channels are available. My husband watches sports and I watch my series. Setup on our Samsung TV was super simple.", r2_image: 'https://meilleure-iptv-pro.fr/wp-content/themes/buenos-aires-3.5.1/assets/images/reviews/2.webp',
      r3_name: 'Marc J.', r3_city: 'Dublin', r3_country: '🇮🇪 Ireland', r3_date: 'January 28, 2026', r3_title: 'I was skeptical, but the free trial convinced me.', r3_text: "The movie library is huge and always has the latest releases. Support is also very fast via WhatsApp.", r3_image: 'https://meilleure-iptv-pro.fr/wp-content/themes/buenos-aires-3.5.1/assets/images/reviews/3.webp',
      r4_name: 'Julie B.', r4_city: 'New York', r4_country: '🇺🇸 US', r4_date: 'January 22, 2026', r4_title: 'Excellent value for money.', r4_text: "For less than ten euros a month, we watch whatever we want. No buffering and beautiful 4K quality.", r4_image: 'https://meilleure-iptv-pro.fr/wp-content/themes/buenos-aires-3.5.1/assets/images/reviews/4.webp',
      r5_name: 'Kevin S.', r5_city: 'Boston', r5_country: '🇺🇸 US', r5_date: 'January 15, 2026', r5_title: 'Ideal for Formula 1 & sports.', r5_text: "No more need for separate sports channels. The streams are stable and in English. Top tier service!", r5_image: 'https://meilleure-iptv-pro.fr/wp-content/themes/buenos-aires-3.5.1/assets/images/reviews/5.webp',
      r6_name: 'Emma T.', r6_city: 'Sydney', r6_country: '🇦🇺 Australia', r6_date: 'January 8, 2026', r6_title: 'Easy to use in the bedroom and living room.', r6_text: "With a single subscription we watch on multiple screens. The kids love the Disney channels.", r6_image: 'https://meilleure-iptv-pro.fr/wp-content/themes/buenos-aires-3.5.1/assets/images/reviews/6.webp',
      r7_name: 'Antoine W.', r7_city: 'Toronto', r7_country: '🇨🇦 Canada', r7_date: 'January 2, 2026', r7_title: 'Impeccable service with a huge variety of channels.', r7_text: "The quality is always consistent and the support team is extremely responsive. Highly recommended!", r7_image: 'https://meilleure-iptv-pro.fr/wp-content/themes/buenos-aires-3.5.1/assets/images/reviews/7.webp',
      r8_name: 'Sarah K.', r8_city: 'Vancouver', r8_country: '🇨🇦 Canada', r8_date: 'December 27, 2025', r8_title: 'Very satisfied with the stability.', r8_text: "Even at peak hours, there is no buffering. Customer support helped me set it up on my Fire Stick.", r8_image: 'https://meilleure-iptv-pro.fr/wp-content/themes/buenos-aires-3.5.1/assets/images/reviews/8.webp',
    },
  }

  const locales = ['fr', 'es', 'en'] as const
  const moduleId = 'testimonials'

  // Clear existing testimonials keys to avoid old stars/text configurations causing visual layout noise
  await prisma.moduleContent.deleteMany({
    where: { moduleId }
  })
  console.log('Cleared old testimonials data keys.')

  for (const locale of locales) {
    const data = dataByLocale[locale]
    for (const [key, value] of Object.entries(data)) {
      await prisma.moduleContent.upsert({
        where: { moduleId_locale_key: { moduleId, locale, key } },
        update: { value },
        create: { moduleId, locale, key, value }
      })
    }
    console.log(`Testimonials for locale "${locale}" upserted.`)
  }

  console.log('Database updated successfully!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
