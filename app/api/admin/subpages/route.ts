import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const locale = searchParams.get('locale')

  const subpages = await db.subpage.findMany({
    where: locale ? { locale } : undefined,
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(subpages)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await req.json()
  const {
    title,
    slug,
    locale,
    content,
    isVisible = true,
    metaTitle = '',
    metaDescription = '',
    canonicalUrl = '',
    robots = 'index, follow',
  } = data

  if (!title || !slug || !locale || content === undefined) {
    return NextResponse.json({ error: 'title, slug, locale and content are required' }, { status: 400 })
  }

  // Format slug to lowercase, alphanumeric and dashes only
  const formattedSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-')

  // Check unique constraint
  const existing = await db.subpage.findUnique({
    where: {
      locale_slug: {
        locale,
        slug: formattedSlug,
      },
    },
  })

  if (existing) {
    return NextResponse.json({ error: `Subpage with slug "${formattedSlug}" already exists for locale "${locale}"` }, { status: 400 })
  }

  const subpage = await db.subpage.create({
    data: {
      title,
      slug: formattedSlug,
      locale,
      content,
      isVisible: Boolean(isVisible),
      metaTitle,
      metaDescription,
      canonicalUrl,
      robots,
    },
  })
  return NextResponse.json(subpage, { status: 201 })
}
