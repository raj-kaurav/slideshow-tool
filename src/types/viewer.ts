export type FitMode = 'fit' | 'actual'

export type ViewerBackgroundMode = 'charcoal' | 'gray' | 'white' | 'blurred'

export type SlideshowIntervalSec = 2 | 3 | 5 | 10

export type SlideshowSettings = {
  intervalSec: SlideshowIntervalSec
  loop: boolean
  shuffle: boolean
  kenBurns: boolean
}
