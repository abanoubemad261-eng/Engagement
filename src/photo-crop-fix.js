/*
 * Keep the admin camera area fixed while allowing the photo to move only
 * within the real bounds of the cover-cropped image. No zoom is allowed.
 * This layer only constrains the existing App gesture state; it does not
 * change the frame, camera area, or save flow.
 */
let active = null

function clamp(value,min,max){return Math.max(min,Math.min(max,value))}

function imageBounds(win,img){
  const r=win.getBoundingClientRect()
  const nw=img.naturalWidth||0,nh=img.naturalHeight||0
  if(!nw||!nh||!r.width||!r.height)return null
  const imageRatio=nw/nh,boxRatio=r.width/r.height
  const renderedW=imageRatio>boxRatio?r.height*imageRatio:r.width
  const renderedH=imageRatio>boxRatio?r.height:r.width/imageRatio
  return {
    rect:r,
    maxX:Math.max(0,(renderedW-r.width)/r.width*100),
    maxY:Math.max(0,(renderedH-r.height)/r.height*100)
  }
}

function currentOffset(img,rect){
  const t=getComputedStyle(img).transform
  if(!t||t==='none')return{x:0,y:0}
  const m=t.match(/^matrix\(([^)]+)\)$/)
  if(!m)return{x:0,y:0}
  const p=m[1].split(',').map(Number)
  return{x:(p[4]||0)/rect.width*100,y:(p[5]||0)/rect.height*100}
}

function setPointerCoordinate(e,x,y){
  try{
    Object.defineProperty(e,'clientX',{value:x,configurable:true})
    Object.defineProperty(e,'clientY',{value:y,configurable:true})
  }catch{}
}

function install(win){
  if(win.dataset.photoCropFixInstalled)return
  win.dataset.photoCropFixInstalled='1'

  win.addEventListener('pointerdown',e=>{
    if(!win.closest('.camera-section'))return
    const img=win.querySelector('.captured-photo')
    if(!img)return
    if(e.isPrimary===false){
      e.stopPropagation()
      e.preventDefault()
      return
    }
    const bounds=imageBounds(win,img)
    if(!bounds)return
    const offset=currentOffset(img,bounds.rect)
    active={id:e.pointerId,startX:e.clientX,startY:e.clientY,startOffset:offset,maxX:bounds.maxX,maxY:bounds.maxY,rect:bounds.rect}
  },true)

  win.addEventListener('pointermove',e=>{
    if(!active||e.pointerId!==active.id)return
    const nx=clamp(active.startOffset.x+(e.clientX-active.startX)/active.rect.width*100,-active.maxX,active.maxX)
    const ny=clamp(active.startOffset.y+(e.clientY-active.startY)/active.rect.height*100,-active.maxY,active.maxY)
    const safeX=active.startX+(nx-active.startOffset.x)/100*active.rect.width
    const safeY=active.startY+(ny-active.startOffset.y)/100*active.rect.height
    setPointerCoordinate(e,safeX,safeY)
  },true)

  const end=e=>{if(active&&e.pointerId===active.id)active=null}
  win.addEventListener('pointerup',end,true)
  win.addEventListener('pointercancel',end,true)
}

const observer=new MutationObserver(()=>document.querySelectorAll('.camera-window').forEach(install))
observer.observe(document.documentElement,{childList:true,subtree:true})
setTimeout(()=>document.querySelectorAll('.camera-window').forEach(install),0)
