/** Motion tokens — mirror CSS variables from styles/tokens.css / MOTION_SYSTEM.md */

export const motion = {
  instant: 100,
  fast: 180,
  normal: 280,
  slow: 450,
  revealCell: 900,
  assemble: 1500,
  viewerExpand: 520,
  viewerClose: 480,
  toolbar: 200,
  chromeHideDelay: 2000,
  chromeFade: 180,
  slideshow: 700,
  counter: 200,
  hover: 200,
  staggerMin: 15,
  staggerMax: 25,
  /** Ambient breathing cycle length (ms) — 8–12s range */
  breathePeriodMin: 8000,
  breathePeriodMax: 12000,
  /** Ambient pointer parallax amplitude (px) */
  parallaxMin: 3,
  parallaxMax: 8,
} as const

export const ease = {
  standard: [0.4, 0, 0.2, 1] as const,
  entrance: [0.22, 1, 0.36, 1] as const,
  exit: [0.4, 0, 1, 1] as const,
  slideshow: [0.4, 0, 0.2, 1] as const,
}

/** Over-damped springs — no bounce (MOTION_SYSTEM.md) */
export const spring = {
  shared: { type: 'spring' as const, stiffness: 260, damping: 32 },
  hover: { type: 'spring' as const, stiffness: 300, damping: 28 },
  reveal: { type: 'spring' as const, stiffness: 280, damping: 30 },
}

export const motionLimits = {
  maxRotationDeg: 5,
  maxHoverScale: 1.02,
  maxRevealMovePx: 40,
  revealScaleFrom: 0.97,
  minRevealMovePx: 20,
  maxParallaxPx: 8,
  minParallaxPx: 3,
  breatheAmplitudePx: 1,
  kenBurnsEnd: 1.04,
  navSlidePercent: 0.08,
  dominantTintMin: 0.03,
  dominantTintMax: 0.05,
  hoverBrightness: 1.06,
} as const
