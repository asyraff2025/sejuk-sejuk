import {useState} from 'react';
const EX=['What jobs did Ali complete last week?','Which technician completed the most jobs this week?','How many jobs were completed today?','Which technician might be overloaded?','Any flagged jobs?'];
export default function AskAI(){
 const [chat,setChat]=useState([]),[q,setQ]=useState(''),[busy,setBusy]=useState(false);
 const send=async text=>{text=(text||q).trim();if(!text)return;setQ('');setBusy(true);setChat(c=>[...c,['me',text]]);
  try{const r=await fetch('/api/ask',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({question:text})});const d=await r.json();setChat(c=>[...c,['ai',d.answer||d.error]])}
  catch{setChat(c=>[...c,['ai','Could not reach the assistant. Is /api/ask deployed?']])}setBusy(false)};
 return <div className="card"><h2 className="font-semibold">Ask about operations</h2><p className="text-sm text-slate-500">Answers use fixed, read-only queries on completed jobs. The assistant never sees the full database.</p>
  {chat.map((m,i)=><div key={i} className={`my-1.5 px-3 py-2 rounded-xl whitespace-pre-wrap max-w-[92%] ${m[0]==='me'?'bg-sky-700 text-white ml-auto':'bg-slate-100'}`}>{m[1]}</div>)}
  <div className="mt-2">{EX.map(x=><button key={x} onClick={()=>send(x)} className="px-3 py-1 mr-1 mb-1.5 rounded-full border border-slate-300 text-sm">{x}</button>)}</div>
  <div className="flex gap-2"><input className="inp" value={q} placeholder="Ask a question" onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()}/><button className="btn !mt-0 !mr-0" disabled={busy} onClick={()=>send()}>Ask</button></div></div>}
