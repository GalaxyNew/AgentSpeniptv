'use client'

import { useRef } from 'react'
import Image from 'next/image'

interface EditableImageProps {
  moduleId: string
  locale: string
  fieldKey: string
  src: string
  alt: string
  width: number
  height: number
  isEditMode: boolean
  style?: React.CSSProperties
  className?: string
}

export default function EditableImage({
  moduleId,
  locale,
  fieldKey,
  src,
  alt,
  width,
  height,
  isEditMode,
  style,
  className,
}: EditableImageProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  if (!isEditMode) {
    return src ? (
      <img src={src} alt={alt} width={width} height={height} style={style} className={className} loading="lazy" />
    ) : null
  }

  const handleUpload = async (file: File) => {
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('moduleId', moduleId)
      form.append('locale', locale)
      form.append('key', fieldKey)

      const res = await fetch('/api/admin/upload', { method: 'POST', body: form })
      if (res.ok) {
        const { url } = await res.json()
        // Save url to content
        const saveRes = await fetch('/api/admin/content', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ moduleId, locale, key: fieldKey, value: url }),
        })
        if (saveRes.ok) {
          window.location.reload()
        } else {
          const errData = await saveRes.json().catch(() => ({}))
          alert(errData.error || 'Failed to save updated image to settings.')
        }
      } else {
        const errData = await res.json().catch(() => ({}))
        alert(errData.error || `Failed to upload image. Server responded with status ${res.status}.`)
      }
    } catch (err: any) {
      alert(`An unexpected error occurred during upload: ${err.message}`)
    }
  }

  return (
    <div
      data-editable-image="true"
      style={{ position: 'relative', display: 'inline-block', cursor: 'pointer', ...style }}
      onClick={() => inputRef.current?.click()}
      className={className}
    >
      {src ? (
        <img src={src} alt={alt} width={width} height={height} style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
      ) : (
        <div style={{
          width, height,
          background: 'var(--bg-card)',
          border: '2px dashed var(--border-accent)',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-1)',
          fontSize: '0.875rem',
          fontWeight: 600,
        }}>
          🖼️ Upload Image
        </div>
      )}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'white', fontSize: '0.875rem', fontWeight: 600,
        borderRadius: 'inherit',
        opacity: 0,
        transition: 'opacity 0.2s',
      }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '0')}
      >
        🖼️ 点击替换图片
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleUpload(file)
        }}
      />
    </div>
  )
}
