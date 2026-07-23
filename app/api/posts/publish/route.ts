import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

const VALID_CATEGORIES = ['guias', 'dispositivos', 'contenido', 'comparativas']
const VALID_STATUSES = ['published', 'draft', 'scheduled']

export async function POST(req: Request) {
  // 1. Verify token
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null

  // Retrieve token from DB SiteSettings
  let dbToken = null
  try {
    const settings = await db.siteSettings.findUnique({
      where: { id: 'main' },
      select: { apiPublishToken: true }
    })
    dbToken = settings?.apiPublishToken ? settings.apiPublishToken.trim() : null
  } catch (dbErr) {
    console.error('Failed to load SiteSettings for API Token verification:', dbErr)
  }

  // Fallback to environment variable
  const envToken = process.env.API_PUBLISH_TOKEN ? process.env.API_PUBLISH_TOKEN.trim() : null

  // Reject if both are unconfigured or empty
  if (!dbToken && !envToken) {
    console.error('Server Configuration Error: Neither db.apiPublishToken nor process.env.API_PUBLISH_TOKEN is set.')
    return NextResponse.json({ error: 'Server configuration error: API token is not configured on the server.' }, { status: 500 })
  }

  const isAuthorized = (dbToken && token === dbToken) || (envToken && token === envToken)

  if (!token || !isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized: Invalid or missing API token.' }, { status: 401 })
  }

  try {
    const data = await req.json()
    const {
      title,
      slug,
      locale = 'es',
      excerpt = '',
      content,
      category = 'guias',
      status = 'published',
      publishAt,
      updatedAt,
      metaTitle,
      metaDescription,
      canonicalUrl = '',
      robots = 'index, follow',
      keywords = '',
      templateId,
      templateName,
      anchorNavEnabled = true,
    } = data

    // 2. Validate required parameters
    if (!title || !content) {
      return NextResponse.json({ error: 'title and content are required parameters.' }, { status: 400 })
    }

    // 3. Format/Validate Category
    let finalCategory = category.trim().toLowerCase()
    if (!VALID_CATEGORIES.includes(finalCategory)) {
      console.warn(`Warning: Invalid category "${category}" received, falling back to "guias"`)
      finalCategory = 'guias'
    }

    // 4. Format/Validate Status
    let finalStatus = status.trim().toLowerCase()
    if (!VALID_STATUSES.includes(finalStatus)) {
      finalStatus = 'published'
    }

    // 5. Slug processing
    let formattedSlug = slug
    if (!formattedSlug || typeof formattedSlug !== 'string' || !formattedSlug.trim()) {
      // Auto-generate from title: lowercase, replace non-alphanumeric/spaces/dashes with dash
      formattedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .slice(0, 80)
    } else {
      formattedSlug = formattedSlug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-')
    }

    if (!formattedSlug) {
      formattedSlug = `post-${Date.now()}`
    }

    // Check if slug + locale unique constraint is satisfied
    const existing = await db.blogPost.findUnique({
      where: {
        locale_slug: {
          locale,
          slug: formattedSlug,
        },
      },
    })

    if (existing) {
      return NextResponse.json({
        error: `A blog post with slug "${formattedSlug}" already exists for locale "${locale}".`
      }, { status: 400 })
    }

    // 6. Handle scheduled publish date and update date
    let parsedPublishAt = new Date()
    if (finalStatus === 'scheduled') {
      if (!publishAt) {
        return NextResponse.json({ error: 'publishAt parameter is required when status is "scheduled".' }, { status: 400 })
      }
      parsedPublishAt = new Date(publishAt)
      if (isNaN(parsedPublishAt.getTime())) {
        return NextResponse.json({ error: 'Invalid date format for publishAt.' }, { status: 400 })
      }
    } else if (publishAt) {
      const customDate = new Date(publishAt)
      if (!isNaN(customDate.getTime())) {
        parsedPublishAt = customDate
      }
    }

    let parsedUpdatedAt = new Date()
    if (updatedAt) {
      const customUpdateDate = new Date(updatedAt)
      if (!isNaN(customUpdateDate.getTime())) {
        parsedUpdatedAt = customUpdateDate
      }
    }

    // 7. Resolve Template ID
    let resolvedTemplateId = null
    if (templateId) {
      // Validate that the template exists
      const tmpl = await db.blogTemplate.findUnique({ where: { id: templateId } })
      if (tmpl) {
        resolvedTemplateId = templateId
      }
    }
    
    // If not resolved yet, search by templateName
    if (!resolvedTemplateId && templateName) {
      const tmpl = await db.blogTemplate.findFirst({
        where: {
          name: {
            equals: templateName.trim(),
          }
        }
      })
      if (tmpl) {
        resolvedTemplateId = tmpl.id
      } else {
        console.warn(`Warning: Template with name "${templateName}" not found. Creating without template.`)
      }
    }

    // If still not resolved, we can check if there's a default template
    if (!resolvedTemplateId) {
      const defaultTmpl = await db.blogTemplate.findFirst({
        where: { isDefault: true }
      })
      if (defaultTmpl) {
        resolvedTemplateId = defaultTmpl.id
      }
    }

    // 8. Handle SEO values
    const finalMetaTitle = metaTitle ? metaTitle.trim() : title.trim()
    let finalMetaDescription = metaDescription ? metaDescription.trim() : ''
    if (!finalMetaDescription) {
      // Strip HTML tags and take first 150 chars
      const plainText = content.replace(/<[^>]*>/g, '').trim()
      finalMetaDescription = plainText.slice(0, 150)
    }

    // 9. Save to database
    const post = await db.blogPost.create({
      data: {
        title: title.trim(),
        slug: formattedSlug,
        locale,
        excerpt,
        content,
        category: finalCategory,
        status: finalStatus,
        publishAt: parsedPublishAt,
        updatedAt: parsedUpdatedAt,
        metaTitle: finalMetaTitle,
        metaDescription: finalMetaDescription,
        canonicalUrl,
        robots,
        keywords,
        templateId: resolvedTemplateId,
        anchorNavEnabled: Boolean(anchorNavEnabled),
      },
    })

    return NextResponse.json({
      ok: true,
      message: 'Article published successfully.',
      post: {
        id: post.id,
        slug: post.slug,
        locale: post.locale,
        title: post.title,
        status: post.status,
        publishAt: post.publishAt,
      }
    }, { status: 201 })

  } catch (error: any) {
    console.error('Error during public article publishing:', error)
    return NextResponse.json({ error: error.message || 'Failed to publish article.' }, { status: 500 })
  }
}
