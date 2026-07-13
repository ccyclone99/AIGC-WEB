import { useEffect, useRef, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react'
import { CheckCircle2, X } from 'lucide-react'

import type { PreviewMedia, ToastState } from '../types'

type OverlayProps = {
  title: string
  children: ReactNode
  onClose: () => void
}

type ModalProps = OverlayProps & {
  size?: 'large' | 'small'
}

type LightboxProps = PreviewMedia & {
  onClose: () => void
}

const focusableSelector = [
  'button:not([disabled])',
  'a[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

function useDialogFocus(onClose: () => void) {
  const panelRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const panel = panelRef.current
    const firstFocusable = panel?.querySelector<HTMLElement>(focusableSelector)
    window.requestAnimationFrame(() => (firstFocusable ?? panel)?.focus())

    return () => previousFocus?.focus()
  }, [])

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
      return
    }
    if (event.key !== 'Tab') return

    const focusable = Array.from(panelRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [])
    if (focusable.length === 0) {
      event.preventDefault()
      panelRef.current?.focus()
      return
    }
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return { panelRef, onKeyDown }
}

const closeFromBackdrop = (event: MouseEvent<HTMLDivElement>, onClose: () => void) => {
  if (event.target === event.currentTarget) onClose()
}

export function Modal({ title, children, onClose, size = 'large' }: ModalProps) {
  const dialog = useDialogFocus(onClose)
  return (
    <div className="overlay-backdrop" role="presentation" onMouseDown={(event) => closeFromBackdrop(event, onClose)}>
      <section
        ref={dialog.panelRef}
        className={`modal-panel modal-${size}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        onKeyDown={dialog.onKeyDown}
      >
        <OverlayHeader title={title} onClose={onClose} />
        {children}
      </section>
    </div>
  )
}

export function Drawer({ title, children, onClose }: OverlayProps) {
  const dialog = useDialogFocus(onClose)
  return (
    <div className="overlay-backdrop" role="presentation" onMouseDown={(event) => closeFromBackdrop(event, onClose)}>
      <section
        ref={dialog.panelRef}
        className="drawer-panel"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        onKeyDown={dialog.onKeyDown}
      >
        <OverlayHeader title={title} onClose={onClose} />
        {children}
      </section>
    </div>
  )
}

export function Sheet({ title, children, onClose }: OverlayProps) {
  const dialog = useDialogFocus(onClose)
  return (
    <div className="overlay-backdrop" role="presentation" onMouseDown={(event) => closeFromBackdrop(event, onClose)}>
      <section
        ref={dialog.panelRef}
        className="sheet-panel"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        onKeyDown={dialog.onKeyDown}
      >
        <OverlayHeader title={title} onClose={onClose} />
        {children}
      </section>
    </div>
  )
}

export function Lightbox({ title, image, kind, videoSrc, onClose }: LightboxProps) {
  const dialog = useDialogFocus(onClose)
  return (
    <div className="overlay-backdrop" role="presentation" onMouseDown={(event) => closeFromBackdrop(event, onClose)}>
      <section
        ref={dialog.panelRef}
        className="lightbox-panel"
        role="dialog"
        aria-modal="true"
        aria-label={`${title} 预览`}
        tabIndex={-1}
        onKeyDown={dialog.onKeyDown}
      >
        <button type="button" className="close-button lightbox-close" onClick={onClose} aria-label="关闭">
          <X size={19} />
        </button>
        {kind === 'video' && videoSrc ? (
          <video src={videoSrc} poster={image} autoPlay muted loop playsInline controls />
        ) : (
          <img src={image} alt={`${title} 预览`} />
        )}
      </section>
    </div>
  )
}

export function Toast({ toast, onClose }: { toast: NonNullable<ToastState>; onClose: () => void }) {
  return (
    <section className="toast" role="status">
      <CheckCircle2 size={18} />
      <span>
        <strong>{toast.title}</strong>
        <small>{toast.text}</small>
      </span>
      <button type="button" onClick={onClose} aria-label="关闭提示">
        <X size={16} />
      </button>
    </section>
  )
}

function OverlayHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <header className="overlay-header">
      <strong>{title}</strong>
      <button type="button" className="close-button" onClick={onClose} aria-label="关闭">
        <X size={19} />
      </button>
    </header>
  )
}
