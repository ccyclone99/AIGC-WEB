import type { ReactNode } from 'react'
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

export function Modal({ title, children, onClose, size = 'large' }: ModalProps) {
  return (
    <div className="overlay-backdrop" role="presentation">
      <section className={`modal-panel modal-${size}`} role="dialog" aria-modal="true" aria-label={title}>
        <OverlayHeader title={title} onClose={onClose} />
        {children}
      </section>
    </div>
  )
}

export function Drawer({ title, children, onClose }: OverlayProps) {
  return (
    <div className="overlay-backdrop" role="presentation">
      <section className="drawer-panel" role="dialog" aria-modal="true" aria-label={title}>
        <OverlayHeader title={title} onClose={onClose} />
        {children}
      </section>
    </div>
  )
}

export function Sheet({ title, children, onClose }: OverlayProps) {
  return (
    <div className="overlay-backdrop" role="presentation">
      <section className="sheet-panel" role="dialog" aria-modal="true" aria-label={title}>
        <OverlayHeader title={title} onClose={onClose} />
        {children}
      </section>
    </div>
  )
}

export function Lightbox({ title, image, kind, videoSrc, onClose }: LightboxProps) {
  return (
    <div className="overlay-backdrop" role="presentation">
      <section className="lightbox-panel" role="dialog" aria-modal="true" aria-label={`${title} 预览`}>
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
