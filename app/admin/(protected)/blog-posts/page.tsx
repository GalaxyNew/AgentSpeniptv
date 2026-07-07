'use client'

import { useEffect, useState, useCallback, useRef } from 'react'

const LOCALES = ['es']
const CATEGORIES = [
  { id: 'guias', label: { es: 'Guías', fr: 'Guides', en: 'Guides', zh: '指南' } },
  { id: 'dispositivos', label: { es: 'Dispositivos', fr: 'Appareils', en: 'Devices', zh: '设备' } },
  { id: 'contenido', label: { es: 'Contenido', fr: 'Contenu', en: 'Content', zh: '内容' } },
  { id: 'comparativas', label: { es: 'Comparativas', fr: 'Comparatifs', en: 'Comparisons', zh: '对比' } },
]

interface BlogTemplate {
  id: string
  name: string
}

interface BlogPost {
  id: string
  title: string
  slug: string
  locale: string
  excerpt: string
  content: string
  category: string
  status: string
  publishAt: string
  metaTitle: string
  metaDescription: string
  canonicalUrl: string
  robots: string
  keywords: string
  templateId: string | null
  template?: { name: string } | null
  createdAt: string
  updatedAt: string
}

const emptyForm = {
  title: '',
  slug: '',
  locale: 'es',
  excerpt: '',
  content: '',
  category: 'guias',
  status: 'published',
  publishAt: '', // Date string
  metaTitle: '',
  metaDescription: '',
  canonicalUrl: '',
  robots: 'index, follow',
  keywords: '',
  templateId: '',
}

export default function BlogPostsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [templates, setTemplates] = useState<BlogTemplate[]>([])
  const [filterLocale, setFilterLocale] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Download a blank article HTML template matching the importer format
  function downloadTemplate() {
    const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- ✅ 文章标题：导入后自动填入「文章标题」与「SEO 标题」字段 -->
  <title>在此填写文章标题</title>

  <!-- ✅ SEO 描述：导入后自动填入「SEO 描述」字段 -->
  <meta name="description" content="在此填写页面 SEO 描述，建议 120-160 个字符" />

  <!-- ✅ SEO 关键词：导入后自动填入「SEO 关键词」字段，多个关键词用英文逗号分隔 -->
  <meta name="keywords" content="关键词1, 关键词2, 关键词3" />
</head>
<body>

  <!-- ✅ 文章正文区域：导入后自动提取 <article> 标签内的全部 HTML 内容 -->
  <!-- 💡 支持完整的 HTML 标签排版，如 h1~h6、p、ul、ol、table、img、a 等 -->
  <article>

    <!-- 文章主标题 -->
    <h1>在此填写文章主标题</h1>

    <!-- 引言段落 -->
    <p>
      在此填写文章引言或摘要段落。简述文章的主要内容，吸引读者继续阅读。
    </p>

    <!-- 第一个章节 -->
    <h2>第一章节标题</h2>
    <p>
      在此填写章节正文内容。可以包含多个段落、列表、图片等。
    </p>
    <ul>
      <li>要点一：在此描述</li>
      <li>要点二：在此描述</li>
      <li>要点三：在此描述</li>
    </ul>

    <!-- 第二个章节 -->
    <h2>第二章节标题</h2>
    <p>
      在此填写第二章节的正文内容。
    </p>

    <!-- 子章节 -->
    <h3>子章节标题</h3>
    <p>
      在此填写子章节正文内容。
    </p>

    <!-- 第三个章节 -->
    <h2>第三章节标题</h2>
    <p>
      在此填写第三章节的正文内容。可以在此添加更多段落。
    </p>

    <!-- 结尾总结 -->
    <h2>总结</h2>
    <p>
      在此填写文章的总结内容，回顾要点，并可加入行动号召（CTA）语句。
    </p>

  </article>

</body>
</html>`

    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'blog-article-template.html'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    const q = filterLocale !== 'all' ? `?locale=${filterLocale}` : ''
    const res = await fetch(`/api/admin/blog-posts${q}`)
    const data = await res.json()
    setPosts(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [filterLocale])

  const fetchTemplates = async () => {
    const res = await fetch('/api/admin/blog-templates')
    const data = await res.json()
    setTemplates(Array.isArray(data) ? data : [])
  }

  useEffect(() => {
    fetchPosts()
    fetchTemplates()
  }, [fetchPosts])

  // Get current datetime string in local format YYYY-MM-DDTHH:MM
  function getLocalDateTimeString() {
    const now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
    return now.toISOString().slice(0, 16)
  }

  function openAdd() {
    setEditingId(null)
    setForm({
      ...emptyForm,
      publishAt: getLocalDateTimeString(),
    })
    setError('')
    setShowForm(true)
  }

  function openEdit(post: BlogPost) {
    setEditingId(post.id)
    
    // Format publishAt date to local datetime string for input type="datetime-local"
    let localPublishAt = ''
    if (post.publishAt) {
      const d = new Date(post.publishAt)
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
      localPublishAt = d.toISOString().slice(0, 16)
    }

    setForm({
      title: post.title,
      slug: post.slug,
      locale: post.locale,
      excerpt: post.excerpt || '',
      content: post.content,
      category: post.category,
      status: post.status,
      publishAt: localPublishAt,
      metaTitle: post.metaTitle || '',
      metaDescription: post.metaDescription || '',
      canonicalUrl: post.canonicalUrl || '',
      robots: post.robots || 'index, follow',
      keywords: post.keywords || '',
      templateId: post.templateId || '',
    })
    setError('')
    setShowForm(true)
  }

  async function handleSave() {
    if (!form.title.trim() || !form.slug.trim()) {
      setError('文章标题和链接别名 (Slug) 不能为空')
      return
    }
    setSaving(true)
    setError('')
    try {
      const url = editingId ? `/api/admin/blog-posts/${editingId}` : '/api/admin/blog-posts'
      const method = editingId ? 'PATCH' : 'POST'
      
      const payload = {
        ...form,
        templateId: form.templateId === '' ? null : form.templateId,
        publishAt: form.status === 'scheduled' ? new Date(form.publishAt).toISOString() : new Date().toISOString(),
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
      fetchPosts()
    } catch (err: any) {
      setError(err.message || '保存失败，请检查数据重试')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('确定要永久删除这篇文章吗？此操作不可撤销。')) return
    await fetch(`/api/admin/blog-posts/${id}`, { method: 'DELETE' })
    fetchPosts()
  }

  // Handle HTML import
  function handleImportHtmlClick() {
    fileInputRef.current?.click()
  }

  function handleHtmlFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      if (!text) return

      try {
        const parser = new DOMParser()
        const doc = parser.parseFromString(text, 'text/html')

        // 1. Title
        const titleVal = doc.querySelector('title')?.innerText || doc.querySelector('h1')?.innerText || ''
        
        // 2. Meta Description
        const descVal = doc.querySelector('meta[name="description"]')?.getAttribute('content') || ''
        
        // 3. SEO Keywords
        const kwVal = doc.querySelector('meta[name="keywords"]')?.getAttribute('content') || ''
        
        // 4. Body Content
        // Try to get primary article elements, otherwise fallback to entire body content
        const articleElement = doc.querySelector('article') || doc.querySelector('#content') || doc.body
        const contentVal = articleElement.innerHTML || ''

        // Generate a guess for the slug if empty
        const slugGuess = titleVal
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .slice(0, 50)

        setForm(f => ({
          ...f,
          title: titleVal || f.title,
          slug: slugGuess || f.slug,
          content: contentVal || f.content,
          metaDescription: descVal || f.metaDescription,
          keywords: kwVal || f.keywords,
          metaTitle: titleVal || f.metaTitle,
        }))

        alert('HTML 文件解析成功！已自动提取并填入相关表单项。')
      } catch (err) {
        console.error(err)
        alert('解析 HTML 文件出错，请手动录入')
      }
    }
    reader.readAsText(file)
    e.target.value = '' // Clear input
  }

  const localeBadgeColor: Record<string, string> = {
    fr: '#3B82F6', es: '#10B981', en: '#F59E0B', zh: '#EC38BC',
  }

  // Map category key to display label based on a fallback locale
  function getCategoryLabel(catId: string) {
    const matched = CATEGORIES.find(c => c.id === catId)
    if (!matched) return catId
    return matched.label.zh || matched.label.es
  }

  // Format Status Badge
  function renderStatusBadge(post: BlogPost) {
    const now = new Date()
    const pubDate = new Date(post.publishAt)

    if (post.status === 'draft') {
      return (
        <span style={{ padding: '0.25rem 0.75rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, background: 'rgba(100,116,139,0.15)', color: '#94a3b8' }}>
          ○ 草稿
        </span>
      )
    } else if (post.status === 'scheduled' && pubDate > now) {
      return (
        <span style={{ padding: '0.25rem 0.75rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, background: 'rgba(245,158,11,0.15)', color: '#F59E0B' }} title={`计划发布时间: ${pubDate.toLocaleString()}`}>
          🕒 定时发布
        </span>
      )
    } else {
      return (
        <span style={{ padding: '0.25rem 0.75rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, background: 'rgba(16,185,129,0.15)', color: '#10B981' }}>
          ● 已发布
        </span>
      )
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: 1000, margin: '0 auto', fontFamily: 'Outfit, Inter, sans-serif' }}>
      {/* Invisible file input */}
      <input type="file" ref={fileInputRef} onChange={handleHtmlFileChange} accept=".html,.htm" style={{ display: 'none' }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--accent-1, #22d3ee)' }}>📰 文章管理</h1>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#94a3b8' }}>撰写、导入及调度你的多语言 Blog 博客文章，支持定时发布与自定义模版套用</p>
        </div>
        <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'center' }}>
          <button onClick={downloadTemplate} style={{
            background: 'rgba(168,85,247,0.12)', border: '1px solid rgba(168,85,247,0.5)',
            color: '#a855f7', borderRadius: 10, padding: '0.625rem 1.1rem',
            fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem',
            transition: 'all 0.2s',
          }}>
            📄 下载文章模板
          </button>
          <button onClick={openAdd} style={{
            background: 'var(--accent-gradient, linear-gradient(90deg,#22d3ee,#a855f7))',
            color: '#fff', border: 'none', borderRadius: 10, padding: '0.625rem 1.25rem',
            fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem'
          }}>
            ＋ 新建文章
          </button>
        </div>
      </div>

      {/* Locale Filter */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {['all', ...LOCALES].map(l => (
          <button key={l} onClick={() => setFilterLocale(l)} style={{
            padding: '0.375rem 1rem', borderRadius: 8, fontWeight: 700, fontSize: '0.8rem',
            cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em',
            border: '2px solid',
            borderColor: filterLocale === l ? 'var(--accent-1, #22d3ee)' : 'rgba(148,163,184,0.25)',
            background: filterLocale === l ? 'var(--accent-1, #22d3ee)' : 'transparent',
            color: filterLocale === l ? '#fff' : '#94a3b8',
            transition: 'all 0.2s',
          }}>
            {l === 'all' ? '全部' : l}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>加载中…</div>
      ) : posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b', borderRadius: 12, border: '2px dashed rgba(148,163,184,0.2)' }}>
          暂无博客文章，点击右上角「新建文章」或导入 HTML 文件开始
        </div>
      ) : (
        <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(148,163,184,0.15)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ background: 'rgba(34,211,238,0.08)' }}>
                {['文章标题', 'URL 路径', '分类', '模板', '状态', '发布日期', '操作'].map(h => (
                  <th key={h} style={{ padding: '0.875rem 1rem', textAlign: 'left', fontWeight: 700, color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map((post, i) => (
                <tr key={post.id} style={{ borderTop: '1px solid rgba(148,163,184,0.1)', background: i % 2 === 0 ? 'transparent' : 'rgba(148,163,184,0.03)', transition: 'background 0.15s' }}>
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 600, color: 'var(--text-primary, #f1f5f9)' }}>
                    {post.title}
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <a href={`/${post.locale}/blog/${post.slug}`} target="_blank" rel="noopener noreferrer" style={{ color: '#22d3ee', textDecoration: 'none', fontSize: '0.85rem' }}>
                      /{post.locale}/blog/{post.slug}
                    </a>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#94a3b8', fontSize: '0.85rem' }}>
                    {getCategoryLabel(post.category)}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#a855f7', fontWeight: 600 }}>
                    {post.template?.name || '无'}
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    {renderStatusBadge(post)}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: '#64748b', fontSize: '0.8rem' }}>
                    {new Date(post.publishAt).toLocaleString('zh-CN')}
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => openEdit(post)} style={{
                        padding: '0.35rem 0.75rem', borderRadius: 7, border: '1px solid rgba(34,211,238,0.4)',
                        background: 'rgba(34,211,238,0.1)', color: '#22d3ee', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer'
                      }}>编辑</button>
                      <button onClick={() => handleDelete(post.id)} style={{
                        padding: '0.35rem 0.75rem', borderRadius: 7, border: '1px solid rgba(239,68,68,0.4)',
                        background: 'rgba(239,68,68,0.1)', color: '#f87171', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer'
                      }}>删除</button>
                    </div>
                  </td>
                </tr>
              ))}
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
            background: '#1e293b', borderRadius: 16, padding: '2rem', width: '100%', maxWidth: 840,
            border: '1px solid rgba(34,211,238,0.2)', boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
            maxHeight: '92vh', overflowY: 'auto', boxSizing: 'border-box'
          }} onClick={e => e.stopPropagation()}>
            
            {/* Form Title & HTML Importer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0 0 1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 800, color: 'var(--accent-1, #22d3ee)' }}>
                {editingId ? '✏️ 编辑文章' : '＋ 新建文章'}
              </h2>
              
              <button onClick={handleImportHtmlClick} style={{
                background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)',
                color: '#10B981', borderRadius: 8, padding: '0.4rem 0.875rem',
                fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem'
              }}>
                📥 导入 HTML 文章
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
              
              {/* Left Column: Post Content */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>文章标题</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="例：2025年最佳智能电视IPTV配置" style={{
                      width: '100%', padding: '0.625rem 0.875rem', borderRadius: 8, fontSize: '0.9rem',
                      background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.2)', color: '#f1f5f9',
                      outline: 'none', boxSizing: 'border-box',
                    }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>链接别名 (Slug)</label>
                  <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                    placeholder="例：mejor-iptv-smart-tv" style={{
                      width: '100%', padding: '0.625rem 0.875rem', borderRadius: 8, fontSize: '0.9rem',
                      background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.2)', color: '#f1f5f9',
                      outline: 'none', boxSizing: 'border-box',
                    }} />
                  <span style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.25rem', display: 'block' }}>
                    预览链接: /{form.locale}/blog/{form.slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-')}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>所属语言</label>
                    <select value={form.locale} onChange={e => setForm(f => ({ ...f, locale: e.target.value }))} style={{
                      width: '100%', padding: '0.625rem 0.875rem', borderRadius: 8, fontSize: '0.9rem',
                      background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.2)', color: '#f1f5f9',
                      outline: 'none', cursor: 'pointer',
                    }}>
                      {LOCALES.map(l => <option key={l} value={l}>{l.toUpperCase()} – {l === 'fr' ? '法语' : l === 'es' ? '西班牙语' : l === 'en' ? '英语' : '中文'}</option>)}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>分类类别</label>
                    <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{
                      width: '100%', padding: '0.625rem 0.875rem', borderRadius: 8, fontSize: '0.9rem',
                      background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.2)', color: '#f1f5f9',
                      outline: 'none', cursor: 'pointer',
                    }}>
                      {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label.zh || c.label.es} ({c.id})</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>文章正文内容 (HTML 代码)</label>
                  <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                    placeholder="请输入页面正文，可直接粘贴带有 HTML 排版标记的内容（如从 WordPress/文件导出的 HTML）" rows={12} style={{
                      width: '100%', padding: '0.625rem 0.875rem', borderRadius: 8, fontSize: '0.9rem',
                      background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.2)', color: '#f1f5f9',
                      outline: 'none', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'monospace'
                    }} />
                </div>
              </div>

              {/* Right Column: Template, Scheduling & SEO */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(15,23,42,0.2)', padding: '1.25rem', borderRadius: 10, border: '1px solid rgba(148,163,184,0.05)' }}>
                <h3 style={{ margin: '0 0 0.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#22d3ee' }}>📅 发布与模版套用</h3>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>套用模板</label>
                  <select value={form.templateId} onChange={e => setForm(f => ({ ...f, templateId: e.target.value }))} style={{
                    width: '100%', padding: '0.625rem 0.875rem', borderRadius: 8, fontSize: '0.9rem',
                    background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.2)', color: '#f1f5f9',
                    outline: 'none', cursor: 'pointer',
                  }}>
                    <option value="">-- 不使用模板 (纯正文展示) --</option>
                    {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>发布状态</label>
                    <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} style={{
                      width: '100%', padding: '0.625rem 0.875rem', borderRadius: 8, fontSize: '0.9rem',
                      background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.2)', color: '#f1f5f9',
                      outline: 'none', cursor: 'pointer',
                    }}>
                      <option value="published">立即发布 (Published)</option>
                      <option value="scheduled">定时发布 (Scheduled)</option>
                      <option value="draft">暂存草稿 (Draft)</option>
                    </select>
                  </div>

                  {form.status === 'scheduled' && (
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>计划发布时间</label>
                      <input type="datetime-local" value={form.publishAt} onChange={e => setForm(f => ({ ...f, publishAt: e.target.value }))}
                        style={{
                          width: '100%', padding: '0.575rem 0.875rem', borderRadius: 8, fontSize: '0.9rem',
                          background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.2)', color: '#f1f5f9',
                          outline: 'none', boxSizing: 'border-box',
                        }} />
                    </div>
                  )}
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid rgba(148,163,184,0.1)', margin: '0.5rem 0' }} />
                <h3 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: '#22d3ee' }}>🔍 SEO 配置与文章参数</h3>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>文章摘要 (Excerpt - 用于列表页)</label>
                  <textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                    placeholder="输入该文章的摘要，用于博客列表的简短呈现（留空则不显示）" rows={2} style={{
                      width: '100%', padding: '0.625rem 0.875rem', borderRadius: 8, fontSize: '0.9rem',
                      background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.2)', color: '#f1f5f9',
                      outline: 'none', boxSizing: 'border-box', resize: 'none'
                    }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SEO 标题 (Meta Title)</label>
                  <input value={form.metaTitle} onChange={e => setForm(f => ({ ...f, metaTitle: e.target.value }))}
                    placeholder="留空则默认使用文章标题" style={{
                      width: '100%', padding: '0.625rem 0.875rem', borderRadius: 8, fontSize: '0.9rem',
                      background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.2)', color: '#f1f5f9',
                      outline: 'none', boxSizing: 'border-box',
                    }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SEO 描述 (Meta Description)</label>
                  <textarea value={form.metaDescription} onChange={e => setForm(f => ({ ...f, metaDescription: e.target.value }))}
                    placeholder="请输入 SEO 页面摘要描述" rows={2} style={{
                      width: '100%', padding: '0.625rem 0.875rem', borderRadius: 8, fontSize: '0.9rem',
                      background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.2)', color: '#f1f5f9',
                      outline: 'none', boxSizing: 'border-box', resize: 'none'
                    }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SEO 关键词 (多个英文逗号分隔)</label>
                  <input value={form.keywords} onChange={e => setForm(f => ({ ...f, keywords: e.target.value }))}
                    placeholder="例如：IPTV España, buy IPTV, lists" style={{
                      width: '100%', padding: '0.625rem 0.875rem', borderRadius: 8, fontSize: '0.9rem',
                      background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.2)', color: '#f1f5f9',
                      outline: 'none', boxSizing: 'border-box',
                    }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>规范链接 (Canonical)</label>
                    <input value={form.canonicalUrl} onChange={e => setForm(f => ({ ...f, canonicalUrl: e.target.value }))}
                      placeholder="留空则自动生成当前链接" style={{
                        width: '100%', padding: '0.625rem 0.875rem', borderRadius: 8, fontSize: '0.9rem',
                        background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.2)', color: '#f1f5f9',
                        outline: 'none', boxSizing: 'border-box',
                      }} />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>爬虫指令</label>
                    <select value={form.robots} onChange={e => setForm(f => ({ ...f, robots: e.target.value }))} style={{
                      width: '100%', padding: '0.625rem 0.875rem', borderRadius: 8, fontSize: '0.9rem',
                      background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(148,163,184,0.2)', color: '#f1f5f9',
                      outline: 'none', cursor: 'pointer',
                    }}>
                      <option value="index, follow">index, follow</option>
                      <option value="noindex, nofollow">noindex, nofollow</option>
                      <option value="noindex, follow">noindex, follow</option>
                    </select>
                  </div>
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
