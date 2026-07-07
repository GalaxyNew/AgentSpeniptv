import fs from 'fs'
import path from 'path'
import { pipeline } from 'stream'
import { promisify } from 'util'

const streamPipeline = promisify(pipeline)

const dirs = [
  'public/images/sports',
  'public/images/movies',
  'public/images/series',
  'public/images/reviews',
]

async function downloadFile(url: string, destPath: string) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`)
  }
  if (!response.body) {
    throw new Error(`No body in response for ${url}`)
  }
  const fileStream = fs.createWriteStream(destPath)
  // Web stream to Node.js stream Conversion
  const nodeReadable = response.body as any // response.body is readable web stream in Node 18+
  await streamPipeline(nodeReadable, fileStream)
}

async function main() {
  console.log('Starting downloading images...')

  // Create directories if they do not exist
  for (const d of dirs) {
    const fullPath = path.join(process.cwd(), d)
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true })
      console.log(`Created directory: ${d}`)
    }
  }

  // Define download tasks
  const tasks: Array<{ url: string; dest: string }> = []

  // 1. Sports: 1 to 14
  for (let i = 1; i <= 14; i++) {
    tasks.push({
      url: `https://meilleure-iptv-pro.fr/wp-content/themes/buenos-aires-3.5.1/assets/images/SPORTS%20(${i}).webp`,
      dest: `public/images/sports/${i}.webp`
    })
  }

  // 2. Movies: 1 to 30
  for (let i = 1; i <= 30; i++) {
    tasks.push({
      url: `https://meilleure-iptv-pro.fr/wp-content/themes/buenos-aires-3.5.1/assets/images/movies/${i}.webp`,
      dest: `public/images/movies/${i}.webp`
    })
  }

  // 3. Series: 1 to 30
  for (let i = 1; i <= 30; i++) {
    tasks.push({
      url: `https://meilleure-iptv-pro.fr/wp-content/themes/buenos-aires-3.5.1/assets/images/series/${i}.webp`,
      dest: `public/images/series/${i}.webp`
    })
  }

  // 4. Reviews: 1 to 8
  for (let i = 1; i <= 8; i++) {
    tasks.push({
      url: `https://meilleure-iptv-pro.fr/wp-content/themes/buenos-aires-3.5.1/assets/images/reviews/${i}.webp`,
      dest: `public/images/reviews/${i}.webp`
    })
  }

  console.log(`Prepared ${tasks.length} files to download.`)

  // Run in chunks of 5 parallel downloads to avoid overloading or getting rate-limited
  const chunkSize = 5
  for (let i = 0; i < tasks.length; i += chunkSize) {
    const chunk = tasks.slice(i, i + chunkSize)
    console.log(`Downloading chunk ${i / chunkSize + 1}/${Math.ceil(tasks.length / chunkSize)}...`)
    await Promise.all(
      chunk.map(async (task) => {
        try {
          const destFile = path.join(process.cwd(), task.dest)
          await downloadFile(task.url, destFile)
          console.log(`✓ Downloaded: ${task.dest}`)
        } catch (err: any) {
          console.error(`✗ Error downloading ${task.url}:`, err.message)
        }
      })
    )
  }

  console.log('All downloads completed!')
}

main().catch(console.error)
