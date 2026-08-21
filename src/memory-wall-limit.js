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
    const link=document.createElement('a')
    link.className='memory-see-more'
    link.href='/memories'
    link.innerHTML=`<span>See More</span><small>+ ${cards.length-5} more memories</small>`
    link.addEventListener('click',event=>{
      event.preventDefault()
      window.location.assign('/memories')
    })
    card.appendChild(link)
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
