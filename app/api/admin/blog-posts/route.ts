import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const locale = searchParams.get('locale')

  const posts = await db.blogPost.findMany({
    where: locale ? { locale } : undefined,
    include: { template: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(posts)
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
    category,
    status = 'published',
    publishAt,
    metaTitle = '',
    metaDescription = '',
    canonicalUrl = '',
    robots = 'index, follow',
    keywords = '',
    templateId = null,
  } = data

  if (!title || !slug || !locale || !category || content === undefined) {
    return NextResponse.json({ error: 'title, slug, locale, category and content are required' }, { status: 400 })
  }

  // Format slug to lowercase, alphanumeric and dashes only
  const formattedSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-')

  // Check unique constraint
  const existing = await db.blogPost.findUnique({
    where: {
      locale_slug: {
        locale,
        slug: formattedSlug,
      },
    },
  })

  if (existing) {
    return NextResponse.json({ error: `Blog post with slug "${formattedSlug}" already exists for locale "${locale}"` }, { status: 400 })
  }

  const parsedPublishAt = publishAt ? new Date(publishAt) : new Date()

  const post = await db.blogPost.create({
    data: {
      title,
      slug: formattedSlug,
      locale,
      content,
      category,
      status,
      publishAt: parsedPublishAt,
      metaTitle,
      metaDescription,
      canonicalUrl,
      robots,
      keywords,
      templateId,
    },
  })
  return NextResponse.json(post, { status: 201 })
}
