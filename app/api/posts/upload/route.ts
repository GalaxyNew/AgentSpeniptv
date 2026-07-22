import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  // 1. Verify token
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null

  // Retrieve token from DB SiteSettings
  let dbToken = null
  try {
    const settings = await db.siteSettings.findUnique({
      where: { id: 'main' },
      select: { apiPublishToken: true }
    })
    dbToken = settings?.apiPublishToken ? settings.apiPublishToken.trim() : null
  } catch (dbErr) {
    console.error('Failed to load SiteSettings for API Token verification:', dbErr)
  }

  // Fallback to environment variable
  const envToken = process.env.API_PUBLISH_TOKEN ? process.env.API_PUBLISH_TOKEN.trim() : null

  // Reject if both are unconfigured or empty
  if (!dbToken && !envToken) {
    console.error('Server Configuration Error: Neither db.apiPublishToken nor process.env.API_PUBLISH_TOKEN is set.')
    return NextResponse.json({ error: 'Server configuration error: API token is not configured on the server.' }, { status: 500 })
  }

  const isAuthorized = (dbToken && token === dbToken) || (envToken && token === envToken)

  if (!token || !isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized: Invalid or missing API token.' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) {
      return NextResponse.json({ error: 'No file field found in form data.' }, { status: 400 })
    }

    // Validate type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only images are allowed.' }, { status: 400 })
    }

    // Limit 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 5MB).' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Save to public/uploads
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadsDir, { recursive: true })

    const ext = file.name.split('.').pop() ?? 'jpg'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const filepath = path.join(uploadsDir, filename)
    await writeFile(filepath, buffer)

    const url = `/uploads/${filename}`
    return NextResponse.json({ ok: true, url })
  } catch (error: any) {
    console.error('Error during public upload:', error)
    return NextResponse.json({ error: error.message || 'Upload failed.' }, { status: 500 })
  }
}
