'use client'

const actions = [
  { href: '/admin/content', label: '✏️ 编辑前台内容', desc: '修改所有文字和图片' },
  { href: '/admin/settings', label: '⚙️ 系统设置', desc: '品牌、WhatsApp、主题' },
  { href: '/admin/pricing', label: '💰 修改定价', desc: '套餐价格和描述' },
  { href: '/admin/seo', label: '🔍 SEO 设置', desc: 'Meta 标题、描述' },
  { href: '/api/admin/edit-mode?to=/', label: '👁️ 可视化编辑', desc: '直接点击前台修改', external: true },
  { href: '/admin/modules', label: '📦 模块开关', desc: '显示/隐藏页面区块' },
]

export default function QuickActions() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', maxWidth: 600 }}>
      {actions.map((action, i) => (
        <a
          key={i}
          href={action.href}
          target={action.external ? '_blank' : undefined}
          rel={action.external ? 'noopener noreferrer' : undefined}
          style={{
            padding: '1rem 1.25rem',
            background: 'rgba(30,41,59,0.5)',
            border: '1px solid rgba(148,163,184,0.08)',
            borderRadius: '0.625rem',
            textDecoration: 'none',
            display: 'block',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(34,211,238,0.3)'
            e.currentTarget.style.background = 'rgba(34,211,238,0.05)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(148,163,184,0.08)'
            e.currentTarget.style.background = 'rgba(30,41,59,0.5)'
          }}
        >
          <div style={{ fontWeight: 600, color: '#f1f5f9', fontSize: '0.9rem' }}>{action.label}</div>
          <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.25rem' }}>{action.desc}</div>
        </a>
      ))}
    </div>
  )
}
