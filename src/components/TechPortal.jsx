import {useState} from 'react';import {complete,setStatus,postpone} from '../lib/api';import {rm,waLink,customerMsg} from '../lib/helpers';
const blank={work:'',extra:'',remarks:'',pay:'',method:'Cash'};
export default function TechPortal({orders,refresh,tech}){
 const [open,setOpen]=useState(null),[sent,setSent]=useState(null),[f,setF]=useState(blank),[files,setFiles]=useState([]),[busy,setBusy]=useState(false);
 const mine=orders.filter(o=>o.technician===tech&&['Assigned','In Progress'].includes(o.status));
 const set=k=>e=>setF({...f,[k]:e.target.value});
 const pick=e=>{const l=[...e.target.files];if(l.length>6)alert('Maximum 6 files. Only the first 6 are kept.');setFiles(l.slice(0,6))};
 const submit=async()=>{if(!f.work.trim())return alert('Describe the work done.');setBusy(true);
  try{const c=await complete(open,f,files,tech);setSent({o:open,c});setOpen(null);setF(blank);setFiles([]);refresh()}catch(e){alert(e.message)}setBusy(false)};
 const banner=sent&&<div className="card"><b className="text-green-700">{sent.o.order_no} marked Job Done</b><div className="text-sm text-slate-500">Manager and accounts can now review it. Send the feedback message:</div>
  <a className="btn btn-wa" target="_blank" rel="noreferrer" href={waLink(sent.o.phone,customerMsg(sent.o,sent.c))}>WhatsApp customer</a></div>;
 if(open)return <div className="card"><h2 className="font-semibold">Complete {open.order_no}</h2><div className="text-sm text-slate-500">{open.customer_name} · {open.address}</div>
  <label className="lbl">Order ID</label><input className="inp" disabled value={open.order_no}/>
  <label className="lbl">Work done</label><textarea className="inp" value={f.work} onChange={set('work')}/>
  <div className="grid grid-cols-2 gap-2"><div><label className="lbl">Extra charges (RM)</label><input className="inp" type="number" min="0" value={f.extra} onChange={set('extra')}/></div><div><label className="lbl">Final amount</label><div className="p-2.5 font-bold">{rm(open.quoted_price+(+f.extra||0))}</div></div></div>
  <label className="lbl">Photos, video or PDF (up to 6)</label><input className="inp" type="file" multiple accept="image/*,video/*,application/pdf" onChange={pick}/><div className="text-sm text-slate-500">{files.length} of 6 files</div>
  <div className="grid grid-cols-2 gap-2"><div><label className="lbl">Payment received (RM)</label><input className="inp" type="number" min="0" value={f.pay} onChange={set('pay')}/></div><div><label className="lbl">Method</label><select className="inp" value={f.method} onChange={set('method')}><option>Cash</option><option>Transfer</option><option>E-wallet</option></select></div></div>
  <label className="lbl">Remarks</label><textarea className="inp" value={f.remarks} onChange={set('remarks')}/>
  <label className="lbl">Technician</label><input className="inp" disabled value={tech}/>
  <button className="btn" disabled={busy} onClick={submit}>Mark job done</button><button className="btn btn-alt" onClick={()=>setOpen(null)}>Back</button></div>;
 return <>{banner}{mine.length?mine.map(o=><div key={o.id} className="card"><div className="flex justify-between"><b>{o.order_no}</b><span className="chip">{o.status}</span></div>
  <div>{o.service_type} · {o.customer_name}</div><div className="text-sm text-slate-500">{o.address}<br/>{o.problem}{o.admin_notes&&<><br/>Note: {o.admin_notes}</>}</div>
  <a className="btn btn-alt" href={`tel:${o.phone}`}>Call</a>
  {o.status==='Assigned'&&<button className="btn btn-alt" onClick={async()=>{await setStatus(o.id,'In Progress',tech);refresh()}}>Start job</button>}
  <button className="btn" onClick={()=>{setSent(null);setOpen(o)}}>Complete</button>
  <button className="btn btn-alt" onClick={async()=>{await postpone(o,tech);refresh()}}>Postpone</button></div>):<div className="card text-slate-500">No open jobs for {tech}.</div>}</>}
