import clsx from 'clsx'
import { motion } from 'framer-motion'
import type { HTMLMotionProps } from 'framer-motion'

interface ButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
}

const styles: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-gradient-to-r from-accent-500 to-accent-400 text-white shadow-glow hover:from-accent-400 hover:to-accent-300',
  secondary: 'bg-bg-800/80 text-slate-200 hover:bg-bg-700/90',
  ghost: 'bg-transparent text-slate-200 hover:bg-bg-800/70',
  danger: 'bg-danger text-white hover:bg-red-500',
}

export const Button = ({ variant = 'primary', className, ...props }: ButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-accent-400/40 disabled:cursor-not-allowed disabled:opacity-50',
        styles[variant],
        className
      )}
      {...props}
    />
  )
}
