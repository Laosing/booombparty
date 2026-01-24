import { useEffect, useRef, type ReactNode } from "react"

interface ModalProps {
  title?: string
  children?: ReactNode
  onActionClick?: () => void
  onActionText?: string
  actionDisabled?: boolean
  isOpen: boolean
  onClose: () => void
}

export function Modal({
  title,
  children,
  onActionClick,
  onActionText = "Save",
  actionDisabled = false,
  isOpen,
  onClose,
}: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (isOpen) {
      if (!ref.current?.open) ref.current?.showModal()
    } else {
      if (ref.current?.open) ref.current?.close()
    }
  }, [isOpen])

  return (
    <dialog ref={ref} className="modal" onClose={onClose}>
      <div className="modal-box">
        {title && <h3 className="text-xl font-bold mb-4">{title}</h3>}
        {children}
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              onActionClick?.()
            }}
            disabled={actionDisabled}
          >
            {onActionText}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  )
}
