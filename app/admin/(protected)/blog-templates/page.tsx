'use client'

import { useEffect, useState } from 'react'

interface BlogTemplate {
  id: string
  name: string
  headerContent: string
  footerContent: string
  anchorNavEnabled: boolean
  recommendationsType: string
  recommendationsCount: number
  keywordLinks: string
  createdAt: string
  updatedAt: string
}

const emptyForm = {
  name: '',
  headerContent: '',
  footerContent: '',
  anchorNavEnabled: true,
  recommendationsType: 'latest',
  recommendationsCount: 3,
  keywordLinksText: '', // for text UI editing (e.g. "Keyword | Url")
}

export default function BlogTemplatesPage() {
  const [templates, setTemplates] = useState<BlogTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchTemplates()
  }, [])

  async function fetchTemplates() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/blog-templates')
      const data = await res.json()
      setTemplates(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  function openAdd() {
    setEditingId(null)
    setForm(emptyForm)
    setError('')
    setShowForm(true)
  }

  function openEdit(tpl: BlogTemplate) {
    setEditingId(tpl.id)
    
    // Convert JSON keywordLinks back to text "Keyword | Url"
    let keywordLinksText = ''
    try {
      const mapping = JSON.parse(tpl.keywordLinks || '{}')
      keywordLinksText = Object.entries(mapping)
        .map(([k, v]) => `${k} | ${v}`)
        .join('\n')
    } catch (e) {
      keywordLinksText = ''
    }

    setForm({
      name: tpl.name,
      headerContent: tpl.headerContent,
      footerContent: tpl.footerContent,
      anchorNavEnabled: tpl.anchorNavEnabled,
      recommendationsType: tpl.recommendationsType,
      recommendationsCount: tpl.recommendationsCount,
      keywordLinksText,
    })
    setError('')
    setShowForm(true)
  }

  async function handleSave() {
    if (!form.name.trim()) {
      setError('模板名称不能为空')
      return
    }

    // Convert "Keyword | Url" lines to JSON
    const mapping: Record<string, string> = {}
    const lines = form.keywordLinksText.split('\n')
    for (const line of lines) {
      const parts = line.split('|')
      if (parts.length >= 2) {
        const kw = parts[0].trim()
        const url = parts.slice(1).join('|').trim()
        if (kw && url) {
          mapping[kw] = url
        }
      }
    }
    const keywordLinks = JSON.stringify(mapping)

    setSaving(true)
    setError('')
    try {
      const url = editingId ? `/api/admin/blog-templates/${editingId}` : '/api/admin/blog-templates'
      const method = editingId ? 'PATCH' : 'POST'
      
      const payload = {
        name: form.name,
        headerContent: form.headerContent,
        footerContent: form.footerContent,
        anchorNavEnabled: form.anchorNavEnabled,
        recommendationsType: form.recommendationsType,
        recommendationsCount: form.recommendationsCount,
        keywordLinks,
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      
      const resData = await res.json()
      if (!res.ok) {
        throw new Error(resData.error || '保存失败')
      }

      setShowForm(false)
      fetchTemplates()
    } catch (err: any) {
      setError(err.message || '保存失败，请检查数据重试')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('确定要删除这个模板吗？使用该模板的文章将不再套用模板内容。')) return
    await fetch(`/api/admin/blog-templates/${id}`, { method: 'DELETE' })
    fetchTemplates()
  }

  return (
    <div style={{ padding: '2rem', maxWidth: 1000, margin: '0 auto', fontFamily: 'Outfit, Inter, sans-serif' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--accent-1, #22d3ee)' }}>🗂️ 模板管理</h1>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#94a3b8' }}>自定义博客文章模版，配置专属页头、页尾、文章推荐及关键词超链接映射</p>
        </div>
        <button onClick={openAdd} style={{
          background: 'var(--accent-gradient, linear-gradient(90deg,#22d3ee,#a855f7))',
          color: '#fff', border: 'none', borderRadius: 10, padding: '0.625rem 1.25rem',
          fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem'
        }}>
          ＋ 新增模板
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>加载中…</div>
      ) : templates.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', borderRadius: 12, border: '2px dashed rgba(148,163,184,0.2)' }}>
          暂无自定义模板，点击右上角「新增模板」开始创建
        </div>
      ) : (
        <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(148,163,184,0.15)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'rgba(34,211,238,0.08)' }}>
                {['模板名称', '页内锚点导航', '推荐配置', '自动链接词数', '创建时间', '操作'].map(h => (
                  <th key={h} style={{ padding: '0.875rem 1rem', textAlign: 'left', fontWeight: 700, color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {templates.map((tpl, i) => {
                let kwCount = 0
                try {
                  kwCount = Object.keys(JSON.parse(tpl.keywordLinks || '{}')).length
                } catch (e) {}

                return (
                  <tr key={tpl.id} style={{ borderTop: '1px solid rgba(148,163,184,0.1)', background: i % 2 === 0 ? 'transparent' : 'rgba(148,163,184,0.03)', transition: 'background 0.15s' }}>
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: 'var(--text-primary, #f1f5f9)' }}>
                      {tpl.name}
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <span style={{
                        padding: '0.2rem 0.6rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700,
                        background: tpl.anchorNavEnabled ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                        color: tpl.anchorNavEnabled ? '#10B981' : '#EF4444',
                      }}>
                        {tpl.anchorNavEnabled ? '已启用' : '已禁用'}
                      </span>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', color: '#f1f5f9' }}>
                      {tpl.recommendationsType === 'latest' ? '最新文章' : '同分类文章'} ({tpl.recommendationsCount}篇)
                    </td>
                    <td style={{ padding: '0.875rem 1rem', color: '#22d3ee', fontWeight: 700 }}>
                      {kwCount} 个词
                    </td>
                    <td style={{ padding: '0.875rem 1rem', color: '#64748b', fontSize: '0.8rem' }}>
                      {new Date(tpl.createdAt).toLocaleString('zh-CN')}
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => openEdit(tpl)} style={{
                          padding: '0.35rem 0.75rem', borderRadius: 7, border: '1px solid rgba(34,211,238,0.4)',
                          background: 'rgba(34,211,238,0.1)', color: '#22d3ee', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer'
                        }}>编辑</button>
                        <button onClick={() => handleDelete(tpl.id)} style={{
                          padding: '0.35rem 0.75rem', borderRadius: 7, border: '1px solid rgba(239,68,68,0.4)',
                          background: 'rgba(239,68,68,0.1)', color: '#f87171', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer'
                        }}>删除</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }} onClick={(e) => { if (e.target === e.currentTarget) setShowForm(false) }}>
          <div style={{
            background: '#1e293b', borderRadius: 16, padding: '2rem', width: '100%', maxWidth: 780,
            border: '1px solid rgba(34,211,238,0.2)', boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
            maxHeight: '90vh', overflowY: 'auto', boxSizing: 'border-box'
          }} onClick={e => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 1.5rem', fontSize: '1.125rem', fontWeight: 800, color: 'var(--accent-1, #22d3ee)' }}>
              {editingId ? '✏️ 编辑模版' : '＋ 新增文章模板'}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {/* Left Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>模板名称</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="例：标准指南模板" style={{
                      width: '100%', padding: '0.625rem 0.875rem', borderRadius: 8, fontSize: '0.9rem',
                      background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.2)', color: '#f1f5f9',
                      outline: 'none', boxSizing: 'border-box',
                    }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>页头 HTML 内容</label>
                  <textarea value={form.headerContent} onChange={e => setForm(f => ({ ...f, headerContent: e.target.value }))}
                    placeholder="在文章正文顶部渲染的 HTML 标签，可用于横幅广告或提示语" rows={4} style={{
                      width: '100%', padding: '0.625rem 0.875rem', borderRadius: 8, fontSize: '0.9rem',
                      background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.2)', color: '#f1f5f9',
                      outline: 'none', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'monospace'
                    }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>页尾 HTML 内容</label>
                  <textarea value={form.footerContent} onChange={e => setForm(f => ({ ...f, footerContent: e.target.value }))}
                    placeholder="在文章正文底部渲染的 HTML 标签，可用于免责声明或附加广告" rows={4} style={{
                      width: '100%', padding: '0.625rem 0.875rem', borderRadius: 8, fontSize: '0.9rem',
                      background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.2)', color: '#f1f5f9',
                      outline: 'none', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'monospace'
                    }} />
                </div>
              </div>

              {/* Right Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(15,23,42,0.2)', padding: '1.25rem', borderRadius: 10, border: '1px solid rgba(148,163,184,0.05)' }}>
                <h3 style={{ margin: '0 0 0.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#22d3ee' }}>⚙️ 模版功能选项</h3>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                  <input type="checkbox" checked={form.anchorNavEnabled} onChange={e => setForm(f => ({ ...f, anchorNavEnabled: e.target.checked }))}
                    style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#22d3ee' }} />
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f1f5f9' }}>启用页内锚点导航 (ToC)</span>
                </label>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>推荐文章策略</label>
                  <select value={form.recommendationsType} onChange={e => setForm(f => ({ ...f, recommendationsType: e.target.value }))} style={{
                    width: '100%', padding: '0.625rem 0.875rem', borderRadius: 8, fontSize: '0.9rem',
                    background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.2)', color: '#f1f5f9',
                    outline: 'none', cursor: 'pointer',
                  }}>
                    <option value="latest">最新发布的文章</option>
                    <option value="category">相同类别下的最新文章</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>推荐文章篇数</label>
                  <input type="number" min={1} max={10} value={form.recommendationsCount} onChange={e => setForm(f => ({ ...f, recommendationsCount: parseInt(e.target.value) || 3 }))}
                    style={{
                      width: '100%', padding: '0.625rem 0.875rem', borderRadius: 8, fontSize: '0.9rem',
                      background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.2)', color: '#f1f5f9',
                      outline: 'none', boxSizing: 'border-box',
                    }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    关键词链接埋入 (每行一条)
                  </label>
                  <textarea value={form.keywordLinksText} onChange={e => setForm(f => ({ ...f, keywordLinksText: e.target.value }))}
                    placeholder="格式：关键词 | 目标链接&#10;例如：&#10;IPTV España | /es/#pricing&#10;IPTV Trial | https://wa.me/xxx" rows={5} style={{
                      width: '100%', padding: '0.625rem 0.875rem', borderRadius: 8, fontSize: '0.9rem',
                      background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.2)', color: '#f1f5f9',
                      outline: 'none', boxSizing: 'border-box', resize: 'vertical'
                    }} />
                  <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.25rem', display: 'block' }}>
                    当正文中出现对应的关键词时，系统会安全且自动地将其加为指定的链接。
                  </span>
                </div>
              </div>
            </div>

            {error && <p style={{ color: '#f87171', fontSize: '0.85rem', marginTop: '1rem' }}>⚠️ {error}</p>}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowForm(false)} style={{
                padding: '0.625rem 1.25rem', borderRadius: 9, border: '1px solid rgba(148,163,184,0.25)',
                background: 'transparent', color: '#94a3b8', fontWeight: 700, cursor: 'pointer', fontSize: '0.875rem',
              }}>取消</button>
              <button onClick={handleSave} disabled={saving} style={{
                padding: '0.625rem 1.5rem', borderRadius: 9, border: 'none',
                background: 'var(--accent-gradient, linear-gradient(90deg,#22d3ee,#a855f7))',
                color: '#fff', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', fontSize: '0.875rem',
                opacity: saving ? 0.7 : 1, transition: 'opacity 0.2s',
              }}>
                {saving ? '保存中…' : '保存'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
