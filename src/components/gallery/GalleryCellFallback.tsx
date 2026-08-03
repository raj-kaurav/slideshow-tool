type GalleryCellFallbackProps = {
  label: string
  onRetry: () => void
}

/**
 * Calm in-cell error surface — never collapses reserved geometry.
 */
export function GalleryCellFallback({ label, onRetry }: GalleryCellFallbackProps) {
  return (
    <div
      className="absolute inset-0 z-[2] flex flex-col items-center justify-center gap-[var(--space-2)] bg-[color:var(--bg-elevated)] px-[var(--space-3)] text-center"
      role="group"
      aria-label={`Unable to load ${label}`}
    >
      <p className="m-0 text-[length:var(--text-caption)] text-[color:var(--text-muted)]">
        Unable to load image
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="text-[length:var(--text-caption)] text-[color:var(--accent)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--focus)]"
      >
        Retry
      </button>
    </div>
  )
}
