import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

interface Params { params: Promise<{ id: string }> }

export async function GET(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const template = await db.blogTemplate.findUnique({
    where: { id }
  })
  
  if (!template) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 })
  }
  return NextResponse.json(template)
}

export async function PATCH(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const data = await req.json()
  const {
    name,
    headerContent,
    footerContent,
    anchorNavEnabled,
    recommendationsType,
    recommendationsCount,
    keywordLinks,
  } = data

  const current = await db.blogTemplate.findUnique({ where: { id } })
  if (!current) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 })
  }

  const updated = await db.blogTemplate.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(headerContent !== undefined && { headerContent }),
      ...(footerContent !== undefined && { footerContent }),
      ...(anchorNavEnabled !== undefined && { anchorNavEnabled: Boolean(anchorNavEnabled) }),
      ...(recommendationsType !== undefined && { recommendationsType }),
      ...(recommendationsCount !== undefined && { recommendationsCount: Number(recommendationsCount) }),
      ...(keywordLinks !== undefined && { keywordLinks }),
    },
  })

  return NextResponse.json(updated)
}

export async function DELETE(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const current = await db.blogTemplate.findUnique({ where: { id } })
  if (!current) {
    return NextResponse.json({ error: 'Template not found' }, { status: 404 })
  }

  await db.blogTemplate.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
