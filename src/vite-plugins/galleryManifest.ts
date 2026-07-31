import fs from 'node:fs'
import path from 'node:path'

import { imageSize } from 'image-size'
import type { Plugin } from 'vite'

import { aspectRatio } from '../lib/aspectRatio.ts'
import { orientationFromDimensions } from '../lib/orientation.ts'
import {
  createItemId,
  filenameFromRelativePath,
  getExtension,
  isHiddenRelativePath,
  isSupportedImageExtension,
  isValidImageFilename,
  normalizeRelativePath,
  toPublicSrc,
} from '../lib/path.ts'
import type { CollectionMeta, GalleryItem, GalleryManifest } from '../types/gallery.ts'

const DEFAULT_GALLERY_DIR = 'public/gallery'
const DEFAULT_MANIFEST_PATH = 'public/gallery-manifest.json'
const DEFAULT_COLLECTION_CONFIG = 'public/gallery.json'

export type GalleryManifestPluginOptions = {
  /** Directory to scan (relative to project root). Default: public/gallery */
  galleryDir?: string
  /** Output manifest path. Default: public/gallery-manifest.json */
  manifestPath?: string
  /** Optional collection metadata JSON. Default: public/gallery.json */
  collectionConfigPath?: string
}

function readCollectionMeta(configPath: string): CollectionMeta {
  if (!fs.existsSync(configPath)) return {}

  try {
    const raw = JSON.parse(fs.readFileSync(configPath, 'utf8')) as unknown
    if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
      console.warn(`[gallery-manifest] Invalid collection config (expected object): ${configPath}`)
      return {}
    }

    const record = raw as Record<string, unknown>
    const pick = (key: string): string | undefined => {
      const value = record[key]
      return typeof value === 'string' && value.trim() ? value.trim() : undefined
    }

    return {
      title: pick('title'),
      description: pick('description'),
      location: pick('location'),
      dateRange: pick('dateRange'),
      photographer: pick('photographer'),
      coverImage: pick('coverImage'),
    }
  } catch (error) {
    console.warn(`[gallery-manifest] Failed to read collection config: ${configPath}`, error)
    return {}
  }
}

function walkImageFiles(galleryDir: string): string[] {
  if (!fs.existsSync(galleryDir)) {
    fs.mkdirSync(galleryDir, { recursive: true })
    return []
  }

  const results: string[] = []

  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('.')) continue

      const absolute = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(absolute)
        continue
      }
      if (!entry.isFile()) continue

      const relativePath = normalizeRelativePath(path.relative(galleryDir, absolute))
      if (isHiddenRelativePath(relativePath)) continue

      const ext = getExtension(entry.name)
      if (!isSupportedImageExtension(ext)) {
        if (entry.name !== '.gitkeep') {
          console.warn(
            `[gallery-manifest] unsupported-format: skipping ${relativePath}`,
          )
        }
        continue
      }

      results.push(absolute)
    }
  }

  walk(galleryDir)
  return results
}

function buildItem(absolutePath: string, galleryDir: string): GalleryItem | null {
  const relativePath = normalizeRelativePath(path.relative(galleryDir, absolutePath))
  const filename = filenameFromRelativePath(relativePath)

  if (!isValidImageFilename(filename)) {
    console.warn(`[gallery-manifest] invalid-filename: skipping ${relativePath}`)
    return null
  }

  let stats: fs.Stats
  try {
    stats = fs.statSync(absolutePath)
  } catch {
    console.warn(`[gallery-manifest] missing-file: cannot stat ${relativePath}`)
    return null
  }

  let width = 0
  let height = 0
  try {
    const buffer = fs.readFileSync(absolutePath)
    const size = imageSize(buffer)
    width = size.width ?? 0
    height = size.height ?? 0
  } catch (error) {
    console.warn(`[gallery-manifest] invalid-dimensions: cannot read ${relativePath}`, error)
    return null
  }

  if (width <= 0 || height <= 0) {
    console.warn(
      `[gallery-manifest] invalid-dimensions: ${relativePath} → ${width}×${height}`,
    )
    return null
  }

  const id = createItemId(relativePath)

  return {
    id,
    src: toPublicSrc(relativePath),
    filename,
    relativePath,
    width,
    height,
    orientation: orientationFromDimensions(width, height),
    aspectRatio: Number(aspectRatio(width, height).toFixed(6)),
    bytes: stats.size,
    mtime: stats.mtimeMs,
  }
}

export function generateGalleryManifest(options: GalleryManifestPluginOptions = {}): GalleryManifest {
  const root = process.cwd()
  const galleryDir = path.resolve(root, options.galleryDir ?? DEFAULT_GALLERY_DIR)
  const manifestPath = path.resolve(root, options.manifestPath ?? DEFAULT_MANIFEST_PATH)
  const collectionConfigPath = path.resolve(
    root,
    options.collectionConfigPath ?? DEFAULT_COLLECTION_CONFIG,
  )

  const files = walkImageFiles(galleryDir)
  const items: GalleryItem[] = []
  const seenIds = new Map<string, string>()

  for (const absolutePath of files) {
    const item = buildItem(absolutePath, galleryDir)
    if (!item) continue

    const existing = seenIds.get(item.id)
    if (existing) {
      console.warn(
        `[gallery-manifest] duplicate-id: ${item.id} (${existing} vs ${item.relativePath}) — skipping later`,
      )
      continue
    }

    seenIds.set(item.id, item.relativePath)
    items.push(item)
  }

  items.sort((a, b) =>
    a.relativePath.localeCompare(b.relativePath, undefined, {
      numeric: true,
      sensitivity: 'base',
    }),
  )

  const manifest: GalleryManifest = {
    meta: {
      version: 1,
      generatedAt: new Date().toISOString(),
      itemCount: items.length,
    },
    collection: readCollectionMeta(collectionConfigPath),
    items,
  }

  fs.mkdirSync(path.dirname(manifestPath), { recursive: true })
  const serialized = `${JSON.stringify(manifest, null, 2)}\n`

  let previous = ''
  try {
    previous = fs.readFileSync(manifestPath, 'utf8')
  } catch {
    previous = ''
  }

  if (previous !== serialized) {
    fs.writeFileSync(manifestPath, serialized, 'utf8')
    console.info(
      `[gallery-manifest] wrote ${items.length} item(s) → ${path.relative(root, manifestPath)}`,
    )
  }

  return manifest
}

function isGallerySourcePath(
  file: string,
  galleryDir: string,
  collectionConfigPath: string,
): boolean {
  const resolved = path.resolve(file)
  return (
    resolved.startsWith(galleryDir + path.sep) ||
    resolved === galleryDir ||
    resolved === collectionConfigPath
  )
}

export function galleryManifestPlugin(options: GalleryManifestPluginOptions = {}): Plugin {
  const root = () => process.cwd()
  const galleryDir = () => path.resolve(root(), options.galleryDir ?? DEFAULT_GALLERY_DIR)
  const collectionConfigPath = () =>
    path.resolve(root(), options.collectionConfigPath ?? DEFAULT_COLLECTION_CONFIG)

  const regenerate = () => {
    try {
      generateGalleryManifest(options)
    } catch (error) {
      console.error('[gallery-manifest] generation failed', error)
    }
  }

  return {
    name: 'gallery-manifest',
    apply: () => true,
    buildStart() {
      regenerate()
    },
    configureServer(server) {
      regenerate()
      server.watcher.add(galleryDir())
      server.watcher.add(collectionConfigPath())

      const onFsEvent = (file: string) => {
        if (!isGallerySourcePath(file, galleryDir(), collectionConfigPath())) return
        regenerate()
        server.ws.send({ type: 'full-reload' })
      }

      server.watcher.on('add', onFsEvent)
      server.watcher.on('unlink', onFsEvent)
      server.watcher.on('change', onFsEvent)
    },
  }
}
