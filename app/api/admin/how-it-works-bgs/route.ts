import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'

// GET all how_it_works background/collage images by type
export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') || 'background'

  const images = await db.howItWorksBgImage.findMany({
    where: { type },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(images)
}

// POST upload a new how_it_works background/collage image and save in DB
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const type = formData.get('type') as string || 'background'
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Only images allowed' }, { status: 400 })
  }

  // 10MB limit for high-res images
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'how-it-works-bg')
  await mkdir(uploadsDir, { recursive: true })

  const ext = file.name.split('.').pop() ?? 'jpg'
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const filepath = path.join(uploadsDir, filename)
  await writeFile(filepath, buffer)

  const url = `/uploads/how-it-works-bg/${filename}`

  const image = await db.howItWorksBgImage.create({
    data: { url, type }
  })

  return NextResponse.json({ ok: true, data: image })
}

// DELETE a how_it_works background/collage image
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const image = await db.howItWorksBgImage.findUnique({ where: { id } })
    if (!image) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    await db.howItWorksBgImage.delete({ where: { id } })

    // Try to remove the file from filesystem
    try {
      const filepath = path.join(process.cwd(), 'public', image.url)
      await unlink(filepath)
    } catch (e) {
      console.error('Failed to remove file from disk:', e)
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
