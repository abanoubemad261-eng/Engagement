import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'engagement-wish-indication',
      transform(code, id) {
        if (!id.endsWith('/src/App.jsx')) return null
        return {
          code: code
            .replace(
              "setNotice('Your wish is visible to everyone ❤️')",
              "setNotice('Your wish became part of our special day🤍')"
            )
            .replace(
              "setPhoto(c.toDataURL('image/jpeg',.95));setGalleryMode(false);setPhotoZoom(1);setPhotoOffset({x:0,y:0});",
              "setPhoto(c.toDataURL('image/jpeg',.95));setGalleryMode(true);setPhotoZoom(1);setPhotoOffset({x:0,y:0});"
            )
            .replace(
              'function startDrag(e){if(!galleryMode)return;',
              'function startDrag(e){if(!photo)return;'
            )
            .replace(
              'function moveDrag(e){if(!galleryMode)return;',
              'function moveDrag(e){if(!photo)return;'
            )
            .replace(
              "touchAction:galleryMode?'none':'auto',cursor:galleryMode?'grab':'default'",
              "touchAction:photo?'none':'auto',cursor:photo?'grab':'default'"
            )
            .replace(
              "style={galleryMode?{transform:`translate(${photoOffset.x/100*100}%,${photoOffset.y/100*100}%) scale(${photoZoom})`,transformOrigin:'center center'}:undefined}",
              "style={photo?{transform:`translate(${photoOffset.x/100*100}%,${photoOffset.y/100*100}%) scale(1)`,transformOrigin:'center center'}:undefined}"
            )
            .replace(
              "{galleryMode?'Drag the photo inside the frame and pinch with two fingers to zoom in or out.':'Your photo appears inside the exact opening of our frame.'}",
              "{photo?'Drag the photo inside the frame to choose exactly what appears.':'Your photo appears inside the exact opening of our frame.'}"
            ),
          map: null,
        }
      },
    },
  ],
})
