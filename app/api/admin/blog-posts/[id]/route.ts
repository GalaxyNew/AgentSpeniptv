import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

interface Params { params: Promise<{ id: string }> }

export async function GET(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const post = await db.blogPost.findUnique({
    where: { id },
    include: { template: true },
  })
  
  if (!post) {
    return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
  }
  return NextResponse.json(post)
}

export async function PATCH(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const data = await req.json()
  const {
    title,
    slug,
    locale,
    content,
    category,
    status,
    publishAt,
    metaTitle,
    metaDescription,
    canonicalUrl,
    robots,
    keywords,
    templateId,
  } = data

  const current = await db.blogPost.findUnique({ where: { id } })
  if (!current) {
    return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
  }

  let formattedSlug = current.slug
  if (slug !== undefined) {
    formattedSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-')
  }

  const targetLocale = locale !== undefined ? locale : current.locale

  // Check unique constraint if slug or locale changed
  if (formattedSlug !== current.slug || targetLocale !== current.locale) {
    const existing = await db.blogPost.findUnique({
      where: {
        locale_slug: {
          locale: targetLocale,
          slug: formattedSlug,
        },
      },
    })
    if (existing && existing.id !== id) {
      return NextResponse.json({ error: `Blog post with slug "${formattedSlug}" already exists for locale "${targetLocale}"` }, { status: 400 })
    }
  }

  const updated = await db.blogPost.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(slug !== undefined && { slug: formattedSlug }),
      ...(locale !== undefined && { locale }),
      ...(content !== undefined && { content }),
      ...(category !== undefined && { category }),
      ...(status !== undefined && { status }),
      ...(publishAt !== undefined && { publishAt: new Date(publishAt) }),
      ...(metaTitle !== undefined && { metaTitle }),
      ...(metaDescription !== undefined && { metaDescription }),
      ...(canonicalUrl !== undefined && { canonicalUrl }),
      ...(robots !== undefined && { robots }),
      ...(keywords !== undefined && { keywords }),
      ...(templateId !== undefined && { templateId }),
    },
  })

  return NextResponse.json(updated)
}

export async function DELETE(req: Request, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const current = await db.blogPost.findUnique({ where: { id } })
  if (!current) {
    return NextResponse.json({ error: 'Blog post not found' }, { status: 404 })
  }

  await db.blogPost.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
