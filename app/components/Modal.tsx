import { useMemo, type ReactNode } from "react"

interface ModalProps {
  id?: string
  title?: string
  children?: ReactNode
  onActionClick?: () => void
  onActionText?: string
  actionDisabled?: boolean
  open?: () => void
  close?: () => void
}

export function Modal({
  id,
  title,
  children,
  onActionClick,
  onActionText = "Save",
  actionDisabled = false,
  open,
  close,
}: ModalProps) {
  return (
    <dialog id={id} className="modal">
      <div className="modal-box">
        {title && <h3 className="text-xl font-bold mb-4">{title}</h3>}
        {children}
        <div className="modal-action">
          <button className="btn btn-ghost" onClick={close}>
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              onActionClick?.()
              close?.()
            }}
            disabled={actionDisabled}
          >
            {onActionText}
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  )
}

export const useModal = (
  id = crypto.randomUUID(),
): [(props: ModalProps) => ReactNode, () => void, () => void] => {
  const idRef = useMemo(() => id, [])

  const open = () => {
    ;(document.getElementById(idRef) as HTMLDialogElement)?.showModal()
  }

  const close = () => {
    ;(document.getElementById(idRef) as HTMLDialogElement)?.close()
  }

  const ModalComponent = useMemo(
    () => (props: ModalProps) => {
      return <Modal id={idRef} open={open} close={close} {...props} />
    },
    [],
  )

  return [ModalComponent, open, close]
}
