import type { ReactNode } from "react"

interface ModalProps {
  id: string
  title?: string
  children: ReactNode
  actions?: ReactNode
}

export function Modal({ id, title, children, actions }: ModalProps) {
  return (
    <dialog id={id} className="modal">
      <div className="modal-box">
        {title && <h3 className="text-xl font-bold mb-4">{title}</h3>}
        {children}
        {actions && <div className="modal-action">{actions}</div>}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}
