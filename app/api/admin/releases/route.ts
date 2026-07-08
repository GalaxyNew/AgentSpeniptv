import { NextResponse } from 'next/server'
import pg from 'pg'

const pool = new pg.Pool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'seo_db',
  user: process.env.DB_USER || 'seo_user',
  password: process.env.DB_PASSWORD || 'changeme_in_production',
})

const VALID_STATUS = ['draft', 'approved', 'executing', 'done', 'rolledback']

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const status = url.searchParams.get('status')

    let sql = `
      SELECT r.*,
        COALESCE(c.cnt, 0)::int as "changeItemCount",
        COALESCE(b.cnt, 0)::int as "backupCount",
        COALESCE(v.ok::int, 0) as "verifiedCount",
        COALESCE(v.total::int, 0) as "totalChecks"
      FROM seo_release r
      LEFT JOIN (SELECT release_id, COUNT(*) as cnt FROM seo_change_item GROUP BY release_id) c ON r.id = c.release_id
      LEFT JOIN (SELECT release_id, COUNT(*) as cnt FROM seo_backup_record GROUP BY release_id) b ON r.id = b.release_id
      LEFT JOIN (SELECT release_id, COUNT(*) FILTER (WHERE status = 'passed') as ok, COUNT(*) as total FROM seo_verification_check GROUP BY release_id) v ON r.id = v.release_id
    `
    const params: string[] = []

    if (status && VALID_STATUS.includes(status)) {
      sql += ` WHERE r.status = $1`
      params.push(status)
    }

    sql += ` ORDER BY r.created_at DESC`

    const { rows } = await pool.query(sql, params)
    return NextResponse.json(rows)
  } catch (err) {
    console.error('Releases GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch releases' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, plan, status, changes } = body

    if (!title) {
      return NextResponse.json({ error: 'title is required' }, { status: 400 })
    }

    const client = await pool.connect()
    try {
      await client.query('BEGIN')

      const { rows: [release] } = await client.query(
        `INSERT INTO seo_release (title, plan, status) VALUES ($1, $2, $3) RETURNING *`,
        [title, plan || null, status || 'draft']
      )

      if (changes && Array.isArray(changes)) {
        for (const c of changes) {
          await client.query(
            `INSERT INTO seo_change_item (release_id, description, type) VALUES ($1, $2, $3)`,
            [release.id, c.description, c.type || 'content']
          )
        }
      }

      await client.query('COMMIT')
      return NextResponse.json(release, { status: 201 })
    } catch (e) {
      await client.query('ROLLBACK')
      throw e
    } finally {
      client.release()
    }
  } catch (err) {
    console.error('Releases POST error:', err)
    return NextResponse.json({ error: 'Failed to create release' }, { status: 500 })
  }
}
