"use client"

import { useEffect, useState } from 'react'

interface ChangeItem {
  id: string
  description: string
  type: string
}

interface Release {
  id: string
  title: string
  plan: string | null
  status: string
  created_at: string
  updated_at: string
  changeItemCount: number
  backupCount: number
  verifiedCount: number
  totalChecks: number
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  draft: { label: '草稿', color: '#64748b', icon: '📝' },
  approved: { label: '已审批', color: '#fbbf24', icon: '✅' },
  executing: { label: '执行中', color: '#22d3ee', icon: '⚡' },
  done: { label: '已完成', color: '#34d399', icon: '🎯' },
  rolledback: { label: '已回滚', color: '#fb7185', icon: '⏪' },
}

const TYPE_LABELS: Record<string, string> = {
  content: '📄 内容',
  code: '💻 代码',
  config: '⚙️ 配置',
  database: '🗄️ 数据库',
}

export default function ReleasePage() {
  const [releases, setReleases] = useState<Release[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [releaseDetail, setReleaseDetail] = useState<any>(null)

  useEffect(() => {
    fetch('/api/admin/releases')
      .then(r => r.json())
      .then(data => { setReleases(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const toggleDetail = async (id: string) => {
    if (expandedId === id) {
      setExpandedId(null)
      setReleaseDetail(null)
      return
    }
    setExpandedId(id)
    try {
      const res = await fetch(`/api/admin/releases/${encodeURIComponent(id)}`)
      const data = await res.json()
      setReleaseDetail(data)
    } catch { setReleaseDetail(null) }
  }

  const stats = {
    total: releases.length,
    active: releases.filter(r => ['approved', 'executing'].includes(r.status)).length,
    done: releases.filter(r => r.status === 'done').length,
  }

  if (loading) return <div className="p-8 text-gray-400">加载中...</div>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">发布中心</h1>
        <p className="text-sm text-gray-500">发布管理 · 备份记录 · 回滚清单 · 验证检查</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: '总发布', value: stats.total, icon: '📦' },
          { label: '进行中', value: stats.active, icon: '⚡' },
          { label: '已完成', value: stats.done, icon: '🎯' },
        ].map((s, i) => (
          <div key={i} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="text-xl mb-1">{s.icon}</div>
            <div className="text-3xl font-bold text-blue-400">{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Status filter badges */}
      <div className="flex flex-wrap gap-2">
        <span className="text-xs font-semibold text-gray-400">状态：</span>
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
          const count = releases.filter(r => r.status === key).length
          if (count === 0) return null
          return (
            <span key={key} className="text-xs px-2 py-0.5 rounded-full border" style={{ color: cfg.color, background: cfg.color + '18', borderColor: cfg.color + '33' }}>
              {cfg.icon} {cfg.label} ({count})
            </span>
          )
        })}
      </div>

      {/* Release cards */}
      <div className="space-y-3">
        {releases.length === 0 ? (
          <div className="bg-gray-900 rounded-xl p-8 text-center text-gray-500 text-sm">
            暂无发布记录
          </div>
        ) : releases.map(r => {
          const cfg = STATUS_CONFIG[r.status] || STATUS_CONFIG.draft
          const date = new Date(r.created_at)
          return (
            <div key={r.id} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <button onClick={() => toggleDetail(r.id)} className="text-left">
                    <h3 className="font-semibold text-gray-100 hover:text-blue-400">{r.title}</h3>
                  </button>
                  {r.plan && <p className="text-xs text-gray-400 mt-1">{r.plan}</p>}
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full shrink-0" style={{ color: cfg.color, background: cfg.color + '18', border: `1px solid ${cfg.color}33` }}>
                  {cfg.icon} {cfg.label}
                </span>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-2">
                <span>📋 变更 {r.changeItemCount}</span>
                <span>💾 备份 {r.backupCount}</span>
                <span>✅ 验证 {r.verifiedCount}/{r.totalChecks}</span>
                <span className="ml-auto">{date.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}</span>
              </div>
              {r.totalChecks > 0 && (
                <div className="w-full bg-gray-800 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full" style={{ width: `${(r.verifiedCount / r.totalChecks) * 100}%`, background: cfg.color }} />
                </div>
              )}
              {/* Expanded detail */}
              {expandedId === r.id && releaseDetail && (
                <div className="mt-4 pt-4 border-t border-gray-800 space-y-3">
                  {releaseDetail.items?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-400 mb-1">变更项</h4>
                      {releaseDetail.items.map((item: any) => (
                        <div key={item.id} className="text-xs text-gray-500 flex gap-2">
                          <span>{TYPE_LABELS[item.type] || item.type}</span>
                          <span>{item.description}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {releaseDetail.backups?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-400 mb-1">备份记录</h4>
                      {releaseDetail.backups.map((b: any) => (
                        <div key={b.id} className="text-xs text-gray-500">{b.backup_path} — {b.note}</div>
                      ))}
                    </div>
                  )}
                  {releaseDetail.rollbacks?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-gray-400 mb-1">回滚步骤</h4>
                      {releaseDetail.rollbacks.map((s: any) => (
                        <div key={s.id} className="text-xs text-gray-500">Step {s.step_no}: {s.description}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
