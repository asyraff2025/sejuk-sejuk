import {useState} from 'react';import {createOrder,assign} from '../lib/api';import {TYPES,rm,waLink,techMsg} from '../lib/helpers';
const blank={name:'',phone:'',address:'',problem:'',type:TYPES[0],quoted:'',tech:'',notes:''};
export default function AdminPortal({orders,techs,refresh}){
 const [f,setF]=useState(blank),[sum,setSum]=useState(null),[busy,setBusy]=useState(false);
 const set=k=>e=>setF({...f,[k]:e.target.value});
 const submit=async()=>{if(!f.name||!f.phone||!f.address||!f.problem)return alert('Fill in name, phone, address and problem.');
  setBusy(true);try{setSum(await createOrder(f));setF(blank);refresh()}catch(e){alert(e.message)}setBusy(false)};
 const phoneOf=n=>techs.find(t=>t.name===n)?.phone||'';
 return <>
  {sum&&<div className="card"><b>{sum.order_no} created</b><div className="text-sm text-slate-500">{sum.customer_name} · {sum.service_type} · {rm(sum.quoted_price)} · {sum.status}</div>
   {sum.technician&&<a className="btn btn-wa" target="_blank" rel="noreferrer" href={waLink(phoneOf(sum.technician),techMsg(sum))}>Notify {sum.technician} on WhatsApp</a>}</div>}
  <div className="card"><h2 className="font-semibold">New service order</h2>
   <label className="lbl">Order No</label><input className="inp" disabled value="Auto-generated on save"/>
   <div className="grid sm:grid-cols-2 gap-2"><div><label className="lbl">Customer name</label><input className="inp" value={f.name} onChange={set('name')}/></div><div><label className="lbl">Phone</label><input className="inp" type="tel" value={f.phone} onChange={set('phone')}/></div></div>
   <label className="lbl">Address</label><textarea className="inp" value={f.address} onChange={set('address')}/>
   <label className="lbl">Problem description</label><textarea className="inp" value={f.problem} onChange={set('problem')}/>
   <div className="grid sm:grid-cols-2 gap-2"><div><label className="lbl">Service type</label><select className="inp" value={f.type} onChange={set('type')}>{TYPES.map(t=><option key={t}>{t}</option>)}</select></div><div><label className="lbl">Quoted price (RM)</label><input className="inp" type="number" min="0" value={f.quoted} onChange={set('quoted')}/></div></div>
   <label className="lbl">Assigned technician</label><select className="inp" value={f.tech} onChange={set('tech')}><option value="">Assign later</option>{techs.map(t=><option key={t.name}>{t.name}</option>)}</select>
   <label className="lbl">Admin notes</label><textarea className="inp" value={f.notes} onChange={set('notes')}/>
   <button className="btn" disabled={busy} onClick={submit}>Create order</button></div>
  <h2 className="font-semibold mb-2">All orders</h2>
  {orders.map(o=><div key={o.id} className="card"><div className="flex justify-between"><b>{o.order_no}</b><span className="chip">{o.status}</span></div>
   <div className="text-sm text-slate-500">{o.customer_name} · {o.service_type} · {rm(o.quoted_price)}{o.technician&&' · '+o.technician}</div>
   {o.status==='New'&&<select className="inp mt-2" defaultValue="" onChange={async e=>{await assign(o.id,e.target.value);refresh()}}><option value="" disabled>Assign technician</option>{techs.map(t=><option key={t.name}>{t.name}</option>)}</select>}</div>)}</>}