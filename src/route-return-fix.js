const AUDIO_KEY='engagementAudioTime'

function saveAudioTime(){
 const audio=document.querySelector('audio[src*="Ed_Sheeran"]')
 if(audio&&Number.isFinite(audio.currentTime))sessionStorage.setItem(AUDIO_KEY,String(audio.currentTime))
}

function restoreAudioTime(){
 const audio=document.querySelector('audio[src*="Ed_Sheeran"]')
 if(!audio)return
 const saved=Number(sessionStorage.getItem(AUDIO_KEY)||0)
 const restore=()=>{
  if(saved>0&&Number.isFinite(saved)){try{audio.currentTime=saved}catch{}}
  audio.play().catch(()=>{})
 }
 if(audio.readyState>=1)restore();else audio.addEventListener('loadedmetadata',restore,{once:true})
}

function handleCameraReturn(){
 if(location.pathname==='/'&&location.hash==='#camera'){
  const hideOpening=()=>{
   const opening=document.querySelector('.opening')
   if(opening)opening.style.display='none'
   document.querySelector('#camera')?.scrollIntoView({behavior:'instant',block:'start'})
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(hideOpening,30),{once:true})
  else setTimeout(hideOpening,30)
 }
}

restoreAudioTime()
handleCameraReturn()
setInterval(saveAudioTime,500)
window.addEventListener('pagehide',saveAudioTime)
window.addEventListener('beforeunload',saveAudioTime)
