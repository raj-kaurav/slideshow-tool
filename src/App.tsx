import { LenisRoot } from '@/components/LenisRoot'
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
            <HomePage />
          </LenisRoot>
        </ViewerProvider>
      </GalleryProvider>
    </CursorProvider>
  )
}
