import type { ReactNode } from 'react'

type FocusRingProps = {
  children: ReactNode
  className?: string
}

/** Ensures focus-visible ring tokens wrap interactive children consistently. */
export function FocusRing({ children, className = '' }: FocusRingProps) {
  return (
    <span
      className={[
        'inline-flex rounded-sm',
        'focus-within:outline focus-within:outline-2 focus-within:outline-offset-3',
        'focus-within:outline-[color:var(--focus)]',
        className,
      ].join(' ')}
    >
      {children}
    </span>
  )
}
