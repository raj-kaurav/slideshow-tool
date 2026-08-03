import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react'

const iconControlClass = [
  'inline-flex h-11 w-11 items-center justify-center rounded-sm',
  'text-[color:var(--text-muted)] transition-colors',
  'hover:bg-[color:var(--hover-surface)] hover:text-[color:var(--text)]',
  'disabled:cursor-not-allowed disabled:text-[color:var(--disabled)]',
].join(' ')

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
        className={[iconControlClass, className].join(' ')}
        {...props}
      >
        {children}
      </button>
    )
  },
)

type IconLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  'aria-label': string
  children: ReactNode
}

/** Quiet icon control as an anchor — used for download originals. */
export const IconLink = forwardRef<HTMLAnchorElement, IconLinkProps>(
  function IconLink({ className = '', children, ...props }, ref) {
    return (
      <a ref={ref} className={[iconControlClass, className].join(' ')} {...props}>
        {children}
      </a>
    )
  },
)
