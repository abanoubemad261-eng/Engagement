const applyMemoryWallLimit=()=>{
  if(location.pathname==='/memories')return
  const grid=document.querySelector('.memories-section .memory-grid')
  if(!grid)return
  const existing=grid.querySelector('.memory-see-more-card')
  if(existing)existing.remove()
  const cards=[...grid.children].filter(el=>!el.classList.contains('memory-see-more-card'))
  cards.forEach((card,index)=>{card.style.display=index<5?'':'none'})
  if(cards.length>5){
    const card=document.createElement('article')
    card.className='memory-see-more-card'
    card.innerHTML=`<a class="memory-see-more" href="/memories"><span>See More</span><small>+ ${cards.length-5} more memories</small></a>`
    grid.appendChild(card)
  }
}
let scheduled=false
const schedule=()=>{
  if(scheduled)return
  scheduled=true
  requestAnimationFrame(()=>{scheduled=false;applyMemoryWallLimit()})
}
const observeMemoryWall=()=>{
  schedule()
  const observer=new MutationObserver(schedule)
  observer.observe(document.body,{childList:true,subtree:true})
  window.addEventListener('beforeunload',()=>observer.disconnect(),{once:true})
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',observeMemoryWall)
else observeMemoryWall()
