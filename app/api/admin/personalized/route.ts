import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// GET personalized settings for a locale
export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const locale = searchParams.get('locale') || 'fr'

  let settings = await db.personalizedSettings.findUnique({
    where: { locale },
  })

  // If not found, return empty fields to start
  if (!settings) {
    settings = {
      id: '',
      locale,
      activeTheme: '',
      activeFont: '',
      brandName: '',
      brandLogoUrl: '',
      whatsappNumber: '',
      whatsappMsg: '',
      telegramUrl: '',
      contactEmail: '',
      supportPopupDelay: null,
      showSupportWidget: true,
      googleSiteVerification: '',
      bingSiteVerification: '',
    }
  }

  return NextResponse.json(settings)
}

// PATCH update personalized settings
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await req.json()
  const { locale, id: _id, ...updateData } = data

  if (!locale) {
    return NextResponse.json({ error: 'Locale is required' }, { status: 400 })
  }

  // Parse supportPopupDelay as number or null
  if (updateData.supportPopupDelay !== undefined && updateData.supportPopupDelay !== null) {
    updateData.supportPopupDelay = parseInt(updateData.supportPopupDelay) || 0
  }

  const result = await db.personalizedSettings.upsert({
    where: { locale },
    update: updateData,
    create: { locale, ...updateData },
  })

  return NextResponse.json({ ok: true, data: result })
}
