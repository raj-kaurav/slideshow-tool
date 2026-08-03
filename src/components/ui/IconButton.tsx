import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  'aria-label': string
  children: ReactNode
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ className = '', children, type = 'button', ...props }, ref) {
    return (
      <button
        ref={ref}
        type={type}
        className={[
          'inline-flex h-11 w-11 items-center justify-center rounded-sm',
          'text-[color:var(--text-muted)] transition-colors',
          'hover:bg-[color:var(--hover-surface)] hover:text-[color:var(--text)]',
          'disabled:cursor-not-allowed disabled:text-[color:var(--disabled)]',
          className,
        ].join(' ')}
        {...props}
      >
        {children}
      </button>
    )
  },
)
