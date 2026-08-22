const AUDIO_KEY='engagementAudioTime'
const RETURN_KEY='returnToCamera'

// Prevent the opening curtain from flashing when returning directly to Camera.
if(location.pathname==='/'&&location.hash==='#camera')document.documentElement.classList.add('returning-to-camera')

function saveAudioTime(){const audio=document.querySelector('audio[src*="Ed_Sheeran"]');if(audio&&Number.isFinite(audio.currentTime))sessionStorage.setItem(AUDIO_KEY,String(audio.currentTime))}
function restoreAudioTime(){const audio=document.querySelector('audio[src*="Ed_Sheeran"]');if(!audio)return;const saved=Number(sessionStorage.getItem(AUDIO_KEY)||0);const restore=()=>{if(saved>0&&Number.isFinite(saved)){try{audio.currentTime=saved}catch{}}audio.play().catch(()=>{})};if(audio.readyState>=1)restore();else audio.addEventListener('loadedmetadata',restore,{once:true})}
function handleCameraReturn(){if(location.pathname==='/'&&location.hash==='#camera'){const hideOpening=()=>{document.documentElement.classList.add('returning-to-camera');const opening=document.querySelector('.opening');if(opening)opening.style.display='none';document.querySelector('#camera')?.scrollIntoView({behavior:'instant',block:'start'});sessionStorage.removeItem(RETURN_KEY);restoreAudioTime()};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(hideOpening),{once:true});else requestAnimationFrame(hideOpening)}}
handleCameraReturn()
restoreAudioTime()
setInterval(saveAudioTime,300)
window.addEventListener('pagehide',saveAudioTime)
window.addEventListener('beforeunload',saveAudioTime)
