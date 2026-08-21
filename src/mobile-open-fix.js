/* iPhone/Safari fallback: make the opening CTA fire on the first touch.
   We scope this strictly to the Open Invitation button so the rest of the
   site's click/touch behavior is untouched. */
function installOpenFix(){
  const button=document.querySelector('.opening-content .primary-btn')
  if(!button||button.dataset.openFixInstalled)return
  button.dataset.openFixInstalled='1'

  const activate=e=>{
    if(e.pointerType!=='touch'&&e.type!=='touchend')return
    e.preventDefault()
    e.stopPropagation()
    button.click()
  }

  button.addEventListener('pointerup',activate,{passive:false})
  button.addEventListener('touchend',activate,{passive:false})
}

installOpenFix()
new MutationObserver(installOpenFix).observe(document.documentElement,{childList:true,subtree:true})
