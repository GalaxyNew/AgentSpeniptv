import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// GET settings
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const settings = await db.siteSettings.findUnique({ where: { id: 'main' } })
  return NextResponse.json(settings)
}

// PATCH update settings
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await req.json()
  // Remove id from update payload
  const { id: _id, ...updateData } = data

  const result = await db.siteSettings.upsert({
    where: { id: 'main' },
    update: updateData,
    create: { id: 'main', ...updateData },
  })
  return NextResponse.json({ ok: true, data: result })
}
