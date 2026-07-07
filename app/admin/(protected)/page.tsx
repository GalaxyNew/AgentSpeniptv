import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import QuickActions from '@/components/admin/QuickActions'

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const [settings, modules] = await Promise.all([
    db.siteSettings.findUnique({ where: { id: 'main' } }),
    db.pageModule.findMany({ orderBy: { sortOrder: 'asc' } }),
  ])

  const visibleCount = modules.filter(m => m.isVisible).length

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: '#f1f5f9' }}>
        📊 仪表盘
      </h1>
      <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '0.9rem' }}>
        欢迎回来，{session.user?.name}
      </p>

      {/* Stats cards — no event handlers, safe in Server Component */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: '当前主题', value: settings?.activeTheme ?? 'dark-tech', icon: '🎨' },
          { label: '可见模块', value: `${visibleCount} / ${modules.length}`, icon: '📦' },
          { label: '默认语言', value: (settings?.defaultLocale ?? 'fr').toUpperCase(), icon: '🌍' },
        ].map((stat, i) => (
          <div key={i} style={{
            padding: '1.5rem',
            background: 'rgba(30,41,59,0.8)',
            border: '1px solid rgba(148,163,184,0.08)',
            borderRadius: '0.75rem',
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#22d3ee' }}>{stat.value}</div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions — Client Component handles hover */}
      <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#94a3b8', marginBottom: '1rem' }}>快速操作</h2>
      <QuickActions />
    </div>
  )
}
