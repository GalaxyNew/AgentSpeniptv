import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const templates = await db.blogTemplate.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(templates)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await req.json()
  const {
    name,
    headerContent = '',
    footerContent = '',
    anchorNavEnabled = true,
    recommendationsType = 'latest',
    recommendationsCount = 3,
    keywordLinks = '',
  } = data

  if (!name) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 })
  }

  const template = await db.blogTemplate.create({
    data: {
      name,
      headerContent,
      footerContent,
      anchorNavEnabled: Boolean(anchorNavEnabled),
      recommendationsType,
      recommendationsCount: Number(recommendationsCount),
      keywordLinks,
    },
  })
  return NextResponse.json(template, { status: 201 })
}
