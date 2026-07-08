import { NextResponse } from 'next/server'
import pg from 'pg'

const pool = new pg.Pool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'seo_db',
  user: process.env.DB_USER || 'seo_user',
  password: process.env.DB_PASSWORD || 'changeme_in_production',
})

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const { rows: [r] } = await pool.query(`SELECT * FROM seo_release WHERE id = $1`, [id])
    if (!r) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const [items, backups, rollbacks, checks] = await Promise.all([
      pool.query(`SELECT * FROM seo_change_item WHERE release_id = $1 ORDER BY created_at`, [id]),
      pool.query(`SELECT * FROM seo_backup_record WHERE release_id = $1 ORDER BY created_at`, [id]),
      pool.query(`SELECT * FROM seo_rollback_step WHERE release_id = $1 ORDER BY step_no`, [id]),
      pool.query(`SELECT * FROM seo_verification_check WHERE release_id = $1 ORDER BY created_at`, [id]),
    ])

    return NextResponse.json({ ...r, items: items.rows, backups: backups.rows, rollbacks: rollbacks.rows, checks: checks.rows })
  } catch (err) {
    console.error('Release detail error:', err)
    return NextResponse.json({ error: 'Failed to fetch release' }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const body = await request.json()
    const { status } = body
    if (!status) return NextResponse.json({ error: 'status is required' }, { status: 400 })

    const { rows } = await pool.query(`UPDATE seo_release SET status = $1 WHERE id = $2 RETURNING *`, [status, id])
    if (!rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(rows[0])
  } catch (err) {
    console.error('Release PATCH error:', err)
    return NextResponse.json({ error: 'Failed to update release' }, { status: 500 })
  }
}
