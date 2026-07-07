import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'

// GET all backgrounds for a given moduleId
export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const moduleId = searchParams.get('moduleId')
  if (!moduleId) return NextResponse.json({ error: 'Missing moduleId' }, { status: 400 })

  const images = await db.moduleBgImage.findMany({
    where: { moduleId },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(images)
}

// POST upload a new background image for a given moduleId
export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const moduleId = formData.get('moduleId') as string | null

  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })
  if (!moduleId) return NextResponse.json({ error: 'Missing moduleId' }, { status: 400 })

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Only images allowed' }, { status: 400 })
  }

  // 10MB limit for high-res fullscreen backgrounds
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'module-bg', moduleId)
  await mkdir(uploadsDir, { recursive: true })

  const ext = file.name.split('.').pop() ?? 'jpg'
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
  const filepath = path.join(uploadsDir, filename)
  await writeFile(filepath, buffer)

  const url = `/uploads/module-bg/${moduleId}/${filename}`

  const image = await db.moduleBgImage.create({
    data: {
      moduleId,
      url,
    },
  })

  return NextResponse.json({ ok: true, data: image })
}

// DELETE a module background image
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const image = await db.moduleBgImage.findUnique({ where: { id } })
    if (!image) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    await db.moduleBgImage.delete({ where: { id } })

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
