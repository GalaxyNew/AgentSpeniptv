'use client'

import { useState, useEffect } from 'react'
import EditableText from './EditableText'
import { parseButtonValue, getButtonLinkProps } from '@/lib/button'

interface SupportWidgetsProps {
  locale: string
  whatsappNumber: string
  whatsappMsg: string
  telegramUrl?: string
  supportPopupDelay?: number // in seconds
  content: any
  isEditMode: boolean
  showSupportWidget?: boolean
}

export default function SupportWidgets({
  locale,
  whatsappNumber,
  whatsappMsg,
  telegramUrl = '',
  supportPopupDelay = 5,
  content,
  isEditMode,
  showSupportWidget = true,
}: SupportWidgetsProps) {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [hasClosedPopup, setHasClosedPopup] = useState(false)
  const [userMsg, setUserMsg] = useState('')

  // Track scroll position for Back to Top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const shouldRenderSupport = showSupportWidget && !!(whatsappNumber || telegramUrl)

  // Auto-popup timer
  useEffect(() => {
    if (!shouldRenderSupport) return

    // If the user already closed the popup in this session, don't auto-pop it
    const dismissed = sessionStorage.getItem('support_popup_dismissed')
    if (dismissed === 'true') {
      setHasClosedPopup(true)
      return
    }

    const timer = setTimeout(() => {
      if (!hasClosedPopup) {
        setShowPopup(true)
      }
    }, supportPopupDelay * 1000)

    return () => clearTimeout(timer)
  }, [supportPopupDelay, hasClosedPopup, shouldRenderSupport])

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowPopup(false)
    setHasClosedPopup(true)
    sessionStorage.setItem('support_popup_dismissed', 'true')
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  // Generate WA link / Custom button link properties
  const finalMsg = userMsg.trim()
    ? `${whatsappMsg}\n\n${userMsg.trim()}`
    : whatsappMsg

  const dynamicSettings = {
    whatsappNumber,
    [`whatsappMsg_${locale}`]: finalMsg
  }
  const btnVal = parseButtonValue(content.button_text)
  const btnProps = getButtonLinkProps(btnVal, locale, dynamicSettings)

  // Translations
  const t: Record<string, { agentName: string; title: string; desc: string; button: string; orTelegram: string }> = {
    fr: {
      agentName: 'Service Client',
      title: 'Besoin d\'aide ?',
      desc: 'Bonjour ! 👋 Comment pouvons-nous vous aider ? Obtenez votre abonnement IPTV en quelques minutes.',
      button: 'Discuter sur WhatsApp',
      orTelegram: 'Ou contactez-nous sur Telegram',
    },
    es: {
      agentName: 'Atención al Cliente',
      title: '¿Necesitas ayuda?',
      desc: '¡Hola! 👋 ¿Cómo podemos ayudarte? Obtén tu suscripción IPTV en pocos minutos.',
      button: 'Chatear por WhatsApp',
      orTelegram: 'O contáctanos por Telegram',
    },
    en: {
      agentName: 'Customer Support',
      title: 'Need Help?',
      desc: 'Hello! 👋 How can we help you today? Get your IPTV subscription in minutes.',
      button: 'Chat on WhatsApp',
      orTelegram: 'Or contact us on Telegram',
    },
    zh: {
      agentName: '在线客服',
      title: '需要帮助吗？',
      desc: '您好！👋 请问有什么可以帮您的？只需几分钟即可开通您的 IPTV 订阅。',
      button: '通过 WhatsApp 咨询',
      orTelegram: '或者通过 Telegram 联系我们',
    },
  }

  const L = t[locale] || t.en

  // If no contact links exist and support is enabled, we don't show support popup, but we still render the Back to top wrapper

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '2rem',
        right: '2rem',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        alignItems: 'flex-end',
        fontFamily: 'Outfit, Inter, sans-serif',
        pointerEvents: 'none',
      }}
    >
      {/* 1. Chat Window Popup */}
      {shouldRenderSupport && (
        <div
          style={{
            width: '320px',
            background: 'var(--bg-secondary, #1e293b)',
            borderRadius: '1rem',
            border: '1px solid var(--border-color, rgba(148, 163, 184, 0.12))',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            opacity: showPopup ? 1 : 0,
            transform: showPopup ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)',
            pointerEvents: showPopup ? 'auto' : 'none',
            marginBottom: '0.5rem',
          }}
        >
        {/* Header */}
        <div
          style={{
            padding: '0.5rem 1.25rem',
            background: 'var(--accent-gradient, linear-gradient(135deg, #10b981, #059669))',
            color: 'var(--text-on-accent, #ffffff)',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          {/* Avatar Container with Green pulsing dot */}
          <div style={{ position: 'relative', width: '32px', height: '32px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Agent SVG */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </div>
            {/* Pulsing online indicator */}
            <span
              style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                background: '#4ade80',
                border: '2px solid var(--accent-1, #10b981)',
                boxShadow: '0 0 8px #4ade80',
              }}
            />
          </div>

          <div>
            <div style={{ fontSize: '0.9375rem', fontWeight: 700, display: 'flex', alignItems: 'center' }}>
              <EditableText moduleId="support_popup" locale={locale} fieldKey="agent_name" tag="span" isEditMode={isEditMode}>
                {content.agent_name ?? L.agentName}
              </EditableText>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            style={{
              position: 'absolute',
              top: '0.6rem',
              right: '1rem',
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              fontSize: '1.25rem',
              cursor: 'pointer',
              opacity: 0.8,
              transition: 'opacity 0.2s',
              padding: 0,
              lineHeight: 1,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.8')}
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary, #94a3b8)', lineHeight: 1.5, margin: 0 }}>
            <EditableText moduleId="support_popup" locale={locale} fieldKey="desc" tag="span" isEditMode={isEditMode}>
              {content.desc ?? L.desc}
            </EditableText>
          </p>

          {/* User message input box */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <textarea
              placeholder={
                locale === 'zh' ? '在此输入您的问题或留言...' :
                locale === 'es' ? 'Escribe tu mensaje aquí...' :
                locale === 'en' ? 'Type your question or message here...' :
                'Écrivez votre message ici...'
              }
              value={userMsg}
              onChange={(e) => setUserMsg(e.target.value)}
              disabled={isEditMode}
              rows={2}
              style={{
                width: '100%',
                padding: '0.625rem 0.875rem',
                background: 'var(--input-bg, rgba(15, 23, 42, 0.6))',
                border: '1px solid var(--input-border, rgba(148, 163, 184, 0.2))',
                borderRadius: '0.5rem',
                color: 'var(--text-primary, #f1f5f9)',
                fontSize: '0.8125rem',
                outline: 'none',
                resize: 'none',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--accent-1, #22d3ee)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--input-border, rgba(148, 163, 184, 0.2))'
              }}
            />
          </div>

          {content.button_text && (
            <a
              {...btnProps}
              onClick={() => {
                setShowPopup(false)
                sessionStorage.setItem('support_popup_dismissed', 'true')
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                background: 'var(--btn-primary-bg, #25d366)',
                color: 'var(--btn-primary-text, #ffffff)',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.875rem',
                transition: 'all 0.2s',
                boxShadow: 'var(--btn-primary-shadow, 0 4px 12px rgba(37, 211, 102, 0.25))',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = 'brightness(0.95)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = 'none'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              {/* WhatsApp Icon SVG */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 2.01 14.07 1.01 11.524 1.01c-5.443 0-9.866 4.372-9.87 9.802 0 1.714.475 3.393 1.374 4.869l-.928 3.39 3.488-.915zM17.41 15.6c-.3-.15-1.78-.88-2.06-.98-.28-.1-.49-.15-.69.15-.2.3-.78.98-.96 1.18-.18.2-.36.23-.66.08-1.54-.77-2.58-1.35-3.62-3.14-.28-.47.28-.44.79-1.46.09-.18.04-.33-.02-.48-.06-.15-.49-1.18-.67-1.62-.18-.43-.37-.37-.5-.37h-.43c-.15 0-.4.05-.61.28-.21.23-.81.8-1.02 1.95-.2 1.15.53 2.27.63 2.42.1.15 1.6 2.44 3.9 3.43.55.24 1 .38 1.33.49.56.18 1.07.15 1.48.09.45-.07 1.78-.73 2.03-1.43.25-.7.25-1.3.17-1.43-.08-.13-.3-.21-.6-.36z" />
              </svg>
              <span>
                <EditableText moduleId="support_popup" locale={locale} fieldKey="button_text" tag="span" isEditMode={isEditMode} noLink={true}>
                  {content.button_text ?? L.button}
                </EditableText>
              </span>
            </a>
          )}

          {telegramUrl && (
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '0.75rem',
                color: 'var(--accent-1, #22d3ee)',
                textAlign: 'center',
                textDecoration: 'none',
                fontWeight: 600,
                marginTop: '-0.25rem',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
              onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
            >
              ✈️ {L.orTelegram}
            </a>
          )}
        </div>
      </div>
    )}

      {/* 2. Floating Buttons Group */}
      <div style={{ display: 'flex', gap: '0.75rem', pointerEvents: 'auto' }}>
        {/* Toggle support popup button */}
        {shouldRenderSupport && (
          <button
            onClick={() => setShowPopup(prev => !prev)}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'var(--accent-gradient, linear-gradient(135deg, #10b981, #059669))',
              border: 'none',
              color: 'var(--text-on-accent, white)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'var(--btn-primary-shadow, 0 4px 15px rgba(16, 185, 129, 0.4))',
              transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              position: 'relative',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {/* Pulse wave animation */}
            {!showPopup && !hasClosedPopup && (
              <span
                className="pulse-wave"
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  border: '3px solid var(--accent-1, #10b981)',
                  animation: 'widget-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
                  pointerEvents: 'none',
                }}
              />
            )}

            {/* SVG WhatsApp Icon or Bubble chat */}
            {showPopup ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.528 2.01 14.07 1.01 11.524 1.01c-5.443 0-9.866 4.372-9.87 9.802 0 1.714.475 3.393 1.374 4.869l-.928 3.39 3.488-.915z" />
              </svg>
            )}
          </button>
        )}

        {/* Back to top button */}
        <button
          onClick={scrollToTop}
          style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'var(--bg-secondary, #1e293b)',
            border: '1px solid var(--border-color, rgba(148, 163, 184, 0.12))',
            color: 'var(--text-primary, #f1f5f9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            opacity: showScrollTop ? 1 : 0,
            transform: showScrollTop ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.8)',
            pointerEvents: showScrollTop ? 'auto' : 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)'
            e.currentTarget.style.background = 'var(--bg-card-solid, #1e293b)'
            e.currentTarget.style.borderColor = 'var(--accent-1, #22d3ee)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.background = 'var(--bg-secondary, #1e293b)'
            e.currentTarget.style.borderColor = 'var(--border-color, rgba(148, 163, 184, 0.12))'
          }}
        >
          {/* Arrow Up SVG */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes widget-ping {
          75%, 100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }
      `}} />
    </div>
  )
}
