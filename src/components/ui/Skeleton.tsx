type SkeletonProps = {
  className?: string
}

/** Calm loading surface — static under prefers-reduced-motion (handled via CSS). */
export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={[
        'bg-[color:var(--bg-elevated)]',
        'motion-safe:animate-pulse',
        className,
      ].join(' ')}
    />
  )
}
