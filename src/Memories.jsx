import {useEffect,useState,useRef} from 'react'
import {Download,Trash2,Heart,ArrowLeft} from 'lucide-react'
import {supabase} from './lib/supabase'

async function guestSession(){if(!supabase)return null;const{data:{session}}=await supabase.auth.getSession();if(session)return session;const{data,error}=await supabase.auth.signInAnonymously();return error?null:data.session}
async function downloadBlob(blob){const u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='Abanoub-Engy-Engagement.jpg';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1000)}

export default function Memories(){
 const[memories,setMemories]=useState([]),[session,setSession]=useState(null),audioRef=useRef(null)
 useEffect(()=>{guestSession().then(setSession)},[])
 useEffect(()=>{if(!supabase)return;load();const channel=supabase.channel('memory-wall-full-live').on('postgres_changes',{event:'INSERT',schema:'public',table:'memory_photos'},payload=>setMemories(current=>current.some(m=>m.id===payload.new.id)?current:[payload.new,...current])).on('postgres_changes',{event:'DELETE',schema:'public',table:'memory_photos'},payload=>setMemories(current=>current.filter(m=>m.id!==payload.old.id))).subscribe();return()=>{supabase.removeChannel(channel)}},[])
 useEffect(()=>{
   const audio=audioRef.current;if(!audio)return
   audio.volume=.75
   const saved=Number(sessionStorage.getItem('engagementAudioTime')||localStorage.getItem('engagementAudioTime')||0)
   const restore=()=>{if(saved>0&&Number.isFinite(saved)){try{audio.currentTime=saved}catch{}};audio.play().catch(()=>{})}
   if(audio.readyState>=1)restore();else audio.addEventListener('loadedmetadata',restore,{once:true})
   const saveTime=()=>{if(Number.isFinite(audio.currentTime))sessionStorage.setItem('engagementAudioTime',String(audio.currentTime))}
   const timer=setInterval(saveTime,500)
   const unlock=()=>{saveTime();audio.play().catch(()=>{});window.removeEventListener('touchstart',unlock);window.removeEventListener('pointerdown',unlock)}
   window.addEventListener('touchstart',unlock,{passive:true});window.addEventListener('pointerdown',unlock,{passive:true})
   return()=>{saveTime();clearInterval(timer);audio.removeEventListener('loadedmetadata',restore);window.removeEventListener('touchstart',unlock);window.removeEventListener('pointerdown',unlock)}
 },[])
 async function load(){const{data}=await supabase.from('memory_photos').select('*').order('created_at',{ascending:false});setMemories(data||[])}
 async function downloadMemory(m){try{const r=await fetch(m.image_url);await downloadBlob(await r.blob())}catch{window.open(m.image_url,'_blank')}}
 async function deleteMemory(m){if(!supabase||!session||m.owner_id!==session.user.id)return;const{error}=await supabase.from('memory_photos').delete().eq('id',m.id);if(!error){if(m.storage_path)await supabase.storage.from('memory-photos').remove([m.storage_path]);setMemories(x=>x.filter(y=>y.id!==m.id))}}
 return <main className="memory-page"><audio ref={audioRef} src="/Ed_Sheeran_-_Perfect(256k).mp3" loop preload="auto" playsInline/><div className="memory-page-inner"><a className="memory-back" href="/#camera" aria-label="Back to Camera" onClick={()=>sessionStorage.setItem('returnToCamera','1')}><ArrowLeft size={14}/> Back to Camera</a><p className="eyebrow">Memory wall</p><h1>Moments from<br/><em>our guests.</em></h1>{memories.length?<div className="memory-grid">{memories.map(m=><article key={m.id}><img src={m.image_url} alt="Guest memory"/><div className="memory-actions"><button onClick={()=>downloadMemory(m)}><Download size={14}/> Save</button>{session&&m.owner_id===session.user.id&&<button onClick={()=>deleteMemory(m)}><Trash2 size={14}/> Delete</button>}</div></article>)}</div>:<div className="story-placeholder"><Heart size={18}/><p>No guest memories yet. Be the first to share one.</p></div>}</div></main>
}
