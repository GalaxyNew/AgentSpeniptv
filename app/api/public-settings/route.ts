import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const settings = await db.siteSettings.findUnique({
      where: { id: 'main' },
      select: {
        defaultLocale: true,
      },
    })
    return NextResponse.json({ defaultLocale: settings?.defaultLocale ?? 'fr' })
  } catch (error) {
    console.error('Failed to get public settings:', error)
    return NextResponse.json({ defaultLocale: 'fr' })
  }
}
