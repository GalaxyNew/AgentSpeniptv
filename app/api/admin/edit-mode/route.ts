import { NextResponse } from 'next/server'
import { draftMode } from 'next/headers'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/admin/edit-mode?to=/  — enter edit mode (Next Draft Mode) then redirect.
// Draft Mode sets the __prerender_bypass cookie, which switches the otherwise
// statically-cached (ISR) public pages into dynamic rendering *only* for this
// authenticated editor, leaving the cached version intact for everyone else.
export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  const dm = await draftMode()
  dm.enable()

  const { searchParams } = new URL(req.url)
  const to = searchParams.get('to') || '/'
  // Only allow same-origin relative paths to avoid open-redirects
  const safeTo = to.startsWith('/') && !to.startsWith('//') ? to : '/'
  return NextResponse.redirect(new URL(safeTo, req.url))
}

// DELETE /api/admin/edit-mode — exit edit mode
export async function DELETE() {
  const dm = await draftMode()
  dm.disable()
  return NextResponse.json({ ok: true })
}
