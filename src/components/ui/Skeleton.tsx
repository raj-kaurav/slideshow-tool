type SkeletonProps = {
  className?: string
}

/**
 * Premium loading surface — soft gradient shimmer.
 * Static under prefers-reduced-motion (CSS).
 */
export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={['skeleton-shimmer', className].filter(Boolean).join(' ')}
    />
  )
}
