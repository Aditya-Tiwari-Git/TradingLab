import clsx from 'clsx'
import { motion } from 'framer-motion'

export const Card = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      className={clsx('panel panel-hover rounded-2xl p-5', className)}
    >
      {children}
    </motion.div>
  )
}
