// When returning from the full memories page, go directly to Camera.
// This keeps the invitation opening screen from appearing again.
if(location.pathname==='/'&&location.hash==='#camera'){
  const goToCamera=()=>{
    const opening=document.querySelector('.opening')
    if(opening)opening.style.display='none'
    const camera=document.getElementById('camera')
    if(camera)camera.scrollIntoView({behavior:'instant',block:'start'})
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',goToCamera)
  else goToCamera()
  const observer=new MutationObserver(goToCamera)
  observer.observe(document.documentElement,{childList:true,subtree:true})
  setTimeout(()=>observer.disconnect(),3000)
}
