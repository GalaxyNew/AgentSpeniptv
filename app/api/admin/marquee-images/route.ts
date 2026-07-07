import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'

// GET – list by type (sports|movies|series)
export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type')

  const images = await db.marqueeImage.findMany({
    where: type ? { type } : undefined,
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
  })
  return NextResponse.json(images)
}

// POST – upload a new marquee image or bulk import static images
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const contentType = req.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      const body = await req.json()
      const { type, urls } = body
      if (!type || !Array.isArray(urls)) {
        return NextResponse.json({ error: 'Missing type or urls array' }, { status: 400 })
      }

      const last = await db.marqueeImage.findFirst({ where: { type }, orderBy: { sortOrder: 'desc' } })
      let currentSortOrder = (last?.sortOrder ?? -1) + 1

      const createdImages = []
      for (const url of urls) {
        const image = await db.marqueeImage.create({
          data: {
            type,
            url,
            sortOrder: currentSortOrder++
          }
        })
        createdImages.push(image)
      }

      return NextResponse.json({ ok: true, data: createdImages }, { status: 201 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const type = (formData.get('type') as string) || 'sports'

    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })
    if (!file.type.startsWith('image/')) return NextResponse.json({ error: 'Only images allowed' }, { status: 400 })
    if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: 'Max 10MB' }, { status: 400 })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'marquee', type)
    await mkdir(uploadsDir, { recursive: true })

    const ext = file.name.split('.').pop() ?? 'webp'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    await writeFile(path.join(uploadsDir, filename), buffer)

    const url = `/uploads/marquee/${type}/${filename}`

    // sortOrder = current max + 1
    const last = await db.marqueeImage.findFirst({ where: { type }, orderBy: { sortOrder: 'desc' } })
    const sortOrder = (last?.sortOrder ?? -1) + 1

    const image = await db.marqueeImage.create({ data: { type, url, sortOrder } })
    return NextResponse.json({ ok: true, data: image }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// DELETE – remove image by id
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const image = await db.marqueeImage.findUnique({ where: { id } })
    if (!image) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    await db.marqueeImage.delete({ where: { id } })

    // Remove file from disk (only uploaded files, not /images/ statics)
    if (image.url.startsWith('/uploads/')) {
      try {
        await unlink(path.join(process.cwd(), 'public', image.url))
      } catch { /* ignore if missing */ }
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
