// Keep the camera/photo frame single-touch only.
// One finger remains available for dragging; a second finger is blocked so
// the invitation never changes photoZoom or allows pinch-to-zoom.
const activePointers = new Set()
const blockedPointers = new Set()

function shouldHandle(e) {
  return e.target instanceof Element && e.target.closest('.camera-window')
}

function onPointerDown(e) {
  if (!shouldHandle(e)) return
  if (activePointers.size >= 1) {
    blockedPointers.add(e.pointerId)
    e.preventDefault()
    e.stopImmediatePropagation()
    return
  }
  activePointers.add(e.pointerId)
}

function onPointerMove(e) {
  if (blockedPointers.has(e.pointerId)) {
    e.preventDefault()
    e.stopImmediatePropagation()
  }
}

function onPointerUp(e) {
  if (blockedPointers.has(e.pointerId)) {
    blockedPointers.delete(e.pointerId)
    e.preventDefault()
    e.stopImmediatePropagation()
    return
  }
  activePointers.delete(e.pointerId)
}

function onPointerCancel(e) {
  blockedPointers.delete(e.pointerId)
  activePointers.delete(e.pointerId)
}

document.addEventListener('pointerdown', onPointerDown, true)
document.addEventListener('pointermove', onPointerMove, true)
document.addEventListener('pointerup', onPointerUp, true)
document.addEventListener('pointercancel', onPointerCancel, true)
