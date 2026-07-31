import { computeGalleryLayout } from '../src/lib/justified'
import { layoutsEqual, validateLayout } from '../src/lib/layoutValidate'

const items = [
  { id: 'a', width: 960, height: 540 },
  { id: 'b', width: 800, height: 500 },
  { id: 'c', width: 420, height: 640 },
  { id: 'd', width: 512, height: 512 },
  { id: 'e', width: 1600, height: 400 },
]

const cases = {
  empty: computeGalleryLayout([], 1200),
  one: computeGalleryLayout([items[0]!], 1200),
  mixed: computeGalleryLayout(items, 1200),
  narrow: computeGalleryLayout(items, 375),
  tall: computeGalleryLayout(
    Array.from({ length: 50 }, (_, i) => ({ id: `t${i}`, width: 300, height: 900 })),
    1100,
  ),
  wide: computeGalleryLayout(
    Array.from({ length: 50 }, (_, i) => ({ id: `w${i}`, width: 1200, height: 400 })),
    1100,
  ),
  many: computeGalleryLayout(
    Array.from({ length: 2000 }, (_, i) => ({
      id: `m${i}`,
      width: 600 + (i % 5) * 40,
      height: 400 + (i % 3) * 30,
    })),
    1440,
  ),
}

const mixedAgain = computeGalleryLayout(items, 1200)

for (const [name, layout] of Object.entries(cases)) {
  const validation = validateLayout(layout)
  const avg =
    layout.rows.length === 0
      ? 0
      : layout.rows.reduce((sum, row) => sum + row.height, 0) / layout.rows.length
  console.log(
    `${name}: items=${layout.itemCount} rows=${layout.rowCount} avgH=${avg.toFixed(1)} ok=${validation.ok}` +
      (validation.issues[0] ? ` (${validation.issues[0].message})` : ''),
  )
}

console.log('deterministic=', layoutsEqual(cases.mixed, mixedAgain))
