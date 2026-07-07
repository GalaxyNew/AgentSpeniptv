import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const locale = searchParams.get('locale')

  const links = await db.affiliateLink.findMany({
    where: locale ? { locale } : undefined,
    orderBy: [{ locale: 'asc' }, { sortOrder: 'asc' }, { createdAt: 'asc' }],
  })
  return NextResponse.json(links)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await req.json()
  const { title, subtitle = '', url, locale, sortOrder = 0, isActive = true } = data

  if (!title || !url || !locale) {
    return NextResponse.json({ error: 'title, url and locale are required' }, { status: 400 })
  }

  const link = await db.affiliateLink.create({
    data: { title, subtitle, url, locale, sortOrder: Number(sortOrder), isActive: Boolean(isActive) },
  })
  return NextResponse.json(link, { status: 201 })
}
