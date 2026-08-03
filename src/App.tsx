import { LayoutGroup } from 'framer-motion'

import { LenisRoot } from '@/components/LenisRoot'
import { FullscreenViewer } from '@/components/viewer/FullscreenViewer'
import { CursorProvider } from '@/context/CursorContext'
import { GalleryProvider } from '@/context/GalleryContext'
import { ViewerProvider } from '@/context/ViewerContext'
import { HomePage } from '@/pages/HomePage'

export function App() {
  return (
    <CursorProvider>
      <GalleryProvider>
        <ViewerProvider>
          <LenisRoot>
            <LayoutGroup id="gallery-experience">
              <HomePage />
              <FullscreenViewer />
            </LayoutGroup>
          </LenisRoot>
        </ViewerProvider>
      </GalleryProvider>
    </CursorProvider>
  )
}
