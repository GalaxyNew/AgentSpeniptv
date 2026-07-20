import { NextResponse } from 'next/server'
import { readFile, stat } from 'fs/promises'
import path from 'path'

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params
    if (!pathSegments || pathSegments.length === 0) {
      return new NextResponse('Not found', { status: 404 })
    }

    // Prevent path traversal attacks
    const safePath = pathSegments.map(p => path.basename(p)).join('/')
    const filepath = path.join(process.cwd(), 'public', 'uploads', safePath)

    // Check if file exists
    try {
      const fileStat = await stat(filepath)
      if (!fileStat.isFile()) {
        return new NextResponse('Not found', { status: 404 })
      }
    } catch {
      return new NextResponse('Not found', { status: 404 })
    }

    const fileBuffer = await readFile(filepath)
    const ext = path.extname(filepath).toLowerCase()
    const contentType = MIME_TYPES[ext] || 'application/octet-stream'

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error serving upload file:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
