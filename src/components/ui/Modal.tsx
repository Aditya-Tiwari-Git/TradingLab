import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}

export const Modal = ({ open, onClose, title, children, className }: ModalProps) => {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={clsx(
              'panel w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl border border-bg-700/80 p-6',
              className
            )}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          >
            <div className="mb-4 flex items-center justify-between">
              {title ? <h3 className="text-lg font-semibold text-slate-100">{title}</h3> : <span />}
              <button onClick={onClose} className="text-sm text-slate-400 hover:text-slate-200">
                Close
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto pr-2">
              {children}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
