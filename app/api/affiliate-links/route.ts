import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const locale = searchParams.get('locale') ?? 'fr'

  const links = await db.affiliateLink.findMany({
    where: { locale, isActive: true },
    orderBy: { sortOrder: 'asc' },
    select: { id: true, title: true, url: true },
  })
  return NextResponse.json(links)
}
