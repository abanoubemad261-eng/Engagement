import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'engagement-final-camera-ui',
      transform(code, id) {
        if (!id.endsWith('/src/App.jsx')) return null
        return {
          code: code
            // Guest photo: always enter the fixed Admin-defined frame with drag-only positioning.
            .replace(
              "setPhoto(c.toDataURL('image/jpeg',.95));setGalleryMode(false);setPhotoZoom(1);setPhotoOffset({x:0,y:0});",
              "setPhoto(c.toDataURL('image/jpeg',.95));setGalleryMode(true);setPhotoZoom(1);setPhotoOffset({x:0,y:0});"
            )
            // One-finger drag only. No pinch / zoom gesture.
            .replace(
              /function startDrag\(e\)\{if\(!galleryMode\)return;[^}]*\}/,
              "function startDrag(e){if(!photo)return;e.preventDefault();const g=gestureRef.current;g.pointers.clear();g.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});setDrag({x:e.clientX,y:e.clientY,ox:photoOffset.x,oy:photoOffset.y});try{e.currentTarget.setPointerCapture(e.pointerId)}catch{}}"
            )
            .replace(
              /function moveDrag\(e\)\{if\(!galleryMode\)return;.*?return\}if\(!drag\)return;const rect=/s,
              "function moveDrag(e){if(!photo||!drag)return;const rect="
            )
            .replace(
              "function endDrag(e){gestureRef.current.pointers.delete(e.pointerId);setDrag(null)}",
              "function endDrag(e){gestureRef.current.pointers.clear();setDrag(null)}"
            )
            // The photo is always cover-cropped inside the fixed Admin camera window; zoom is permanently 1.
            .replace(
              "touchAction:galleryMode?'none':'auto',cursor:galleryMode?'grab':'default'",
              "touchAction:photo?'none':'auto',cursor:photo?'grab':'default'"
            )
            .replace(
              "style={galleryMode?{transform:`translate(${photoOffset.x/100*100}%,${photoOffset.y/100*100}%) scale(${photoZoom})`,transformOrigin:'center center'}:undefined}",
              "style={photo?{transform:`translate(${photoOffset.x}%,${photoOffset.y}%) scale(1)`,transformOrigin:'center center'}:undefined}"
            )
            .replace(
              "{galleryMode?'Drag the photo inside the frame and pinch with two fingers to zoom in or out.':'Your photo appears inside the exact opening of our frame.'}",
              "{photo?'Move the photo inside the frame to choose exactly what appears.':'Your photo appears inside the exact opening of our frame.'}"
            )
            // Remove the two conditional X buttons and put one consistent Back button after all camera/photo actions.
            .replace(
              /<button className=\"camera-close\" aria-label=\"Close camera\" title=\"Close\" onClick=\{resetCameraChoice\}><X size=\{18\} \/><\/button>/,
              ''
            )
            .replace(
              /<button className=\"camera-close\" aria-label=\"Back to photo choices\" title=\"Back\" onClick=\{resetCameraChoice\}><X size=\{18\} \/><\/button>/,
              ''
            )
            .replace(
              "</div><p className=\"camera-note\">{photo?'Move the photo inside the frame to choose exactly what appears.':'Your photo appears inside the exact opening of our frame.'}</p>",
              "</div>{(stream||photo)&&<button className=\"camera-back-final\" aria-label=\"Back\" onClick={resetCameraChoice} style={{display:'inline-flex',alignItems:'center',justifyContent:'center',gap:'8px',marginTop:'12px',padding:'11px 18px',border:'1px solid rgba(255,255,255,.35)',borderRadius:'12px',background:'rgba(255,255,255,.06)',color:'#f7f2eb',fontSize:'10px',textTransform:'uppercase',letterSpacing:'.12em'}}><X size={20}/> Back</button>}<p className=\"camera-note\">{photo?'Move the photo inside the frame to choose exactly what appears.':'Your photo appears inside the exact opening of our frame.'}</p>"
            ),
          map: null,
        }
      },
    },
  ],
})
