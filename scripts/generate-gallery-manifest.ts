/**
 * Optional CLI to regenerate public/gallery-manifest.json without starting Vite.
 * Usage: npx tsx scripts/generate-gallery-manifest.ts
 */
import { generateGalleryManifest } from '../src/vite-plugins/galleryManifest.ts'

generateGalleryManifest()
