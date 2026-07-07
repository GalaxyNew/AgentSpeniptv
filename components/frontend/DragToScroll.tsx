'use client'

import React, { useRef } from 'react'

interface DragToScrollProps {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export default function DragToScroll({ children, className, style }: DragToScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current
    if (!el) return

    // Only drag with left click, and ignore clicks on interactive edit-mode elements if necessary
    if (e.button !== 0) return

    el.style.scrollBehavior = 'auto'
    const startX = e.pageX - el.offsetLeft
    const scrollLeft = el.scrollLeft
    let isDragging = false

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const x = moveEvent.pageX - el.offsetLeft
      const walk = (x - startX) * 1.5 // Scroll speed multiplier
      if (Math.abs(x - startX) > 5) {
        isDragging = true
        el.classList.add('dragging')
      }
      el.scrollLeft = scrollLeft - walk
    }

    const handleMouseUp = () => {
      el.style.scrollBehavior = 'smooth'
      el.classList.remove('dragging')
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)

      if (isDragging) {
        // Prevent click events (e.g. text selection or edit trigger) if we were dragging
        const preventClick = (clickEvent: MouseEvent) => {
          clickEvent.preventDefault()
          clickEvent.stopPropagation()
          document.removeEventListener('click', preventClick, true)
        }
        document.addEventListener('click', preventClick, true)
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      className={className}
      style={{
        ...style,
        cursor: 'grab',
        userSelect: 'none',
      }}
    >
      {children}
    </div>
  )
}
