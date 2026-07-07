import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// GET all modules
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const modules = await db.pageModule.findMany({ orderBy: { sortOrder: 'asc' } })
  return NextResponse.json(modules)
}

// PATCH update visibility or sortOrder
export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, locale, isVisible, sortOrder } = await req.json()
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const data: Record<string, unknown> = {}
  if (isVisible !== undefined) {
    if (locale === 'fr') {
      data.isVisible_fr = isVisible
    } else if (locale === 'es') {
      data.isVisible_es = isVisible
    } else if (locale === 'en') {
      data.isVisible_en = isVisible
    } else if (locale === 'zh') {
      data.isVisible_zh = isVisible
    } else {
      data.isVisible = isVisible
    }
  }
  if (sortOrder !== undefined) {
    if (locale === 'fr') {
      data.sortOrder_fr = sortOrder
    } else if (locale === 'es') {
      data.sortOrder_es = sortOrder
    } else if (locale === 'en') {
      data.sortOrder_en = sortOrder
    } else if (locale === 'zh') {
      data.sortOrder_zh = sortOrder
    } else {
      data.sortOrder = sortOrder
    }
  }

  const result = await db.pageModule.update({ where: { id }, data })
  return NextResponse.json({ ok: true, data: result })
}
