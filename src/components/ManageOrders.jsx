import {useState} from 'react';import {createOrder,updateOrder,deleteOrder} from '../lib/api';import {TYPES,rm} from '../lib/helpers';
const STATUS=['New','Assigned','In Progress','Job Done','Reviewed','Closed'];
const blank={name:'',phone:'',address:'',problem:'',type:TYPES[0],quoted:'',tech:'',notes:'',status:'New'};
const toForm=o=>({name:o.customer_name,phone:o.phone,address:o.address,problem:o.problem||'',type:o.service_type,quoted:o.quoted_price,tech:o.technician||'',notes:o.admin_notes||'',status:o.status});
export default function ManageOrders({orders,techs,refresh}){
 const [f,setF]=useState(null),[id,setId]=useState(null),[busy,setBusy]=useState(false);
 const set=k=>e=>setF({...f,[k]:e.target.value});
 const save=async()=>{if(!f.name||!f.phone||!f.address)return alert('Name, phone and address are required.');setBusy(true);
  try{id?await updateOrder(id,f):await createOrder(f);setF(null);setId(null);refresh()}catch(e){alert(e.message)}setBusy(false)};
 const del=async o=>{if(!confirm(`Delete ${o.order_no}? This also removes its completion record and history.`))return;
  try{await deleteOrder(o.id);refresh()}catch(e){alert(e.message)}};
 if(f)return <div className="card"><h2 className="font-semibold">{id?'Edit order':'New order'}</h2>
  <div className="grid sm:grid-cols-2 gap-2"><div><label className="lbl">Customer name</label><input className="inp" value={f.name} onChange={set('name')}/></div><div><label className="lbl">Phone</label><input className="inp" value={f.phone} onChange={set('phone')}/></div></div>
  <label className="lbl">Address</label><textarea className="inp" value={f.address} onChange={set('address')}/>
  <label className="lbl">Problem description</label><textarea className="inp" value={f.problem} onChange={set('problem')}/>
  <div className="grid sm:grid-cols-2 gap-2"><div><label className="lbl">Service type</label><select className="inp" value={f.type} onChange={set('type')}>{TYPES.map(t=><option key={t}>{t}</option>)}</select></div><div><label className="lbl">Quoted price (RM)</label><input className="inp" type="number" min="0" value={f.quoted} onChange={set('quoted')}/></div></div>
  <div className="grid sm:grid-cols-2 gap-2"><div><label className="lbl">Technician</label><select className="inp" value={f.tech} onChange={set('tech')}><option value="">Unassigned</option>{techs.map(t=><option key={t.name}>{t.name}</option>)}</select></div>
   {id&&<div><label className="lbl">Status</label><select className="inp" value={f.status} onChange={set('status')}>{STATUS.map(s=><option key={s}>{s}</option>)}</select></div>}</div>
  <label className="lbl">Admin notes</label><textarea className="inp" value={f.notes} onChange={set('notes')}/>
  <button className="btn" disabled={busy} onClick={save}>Save</button><button className="btn btn-alt" onClick={()=>{setF(null);setId(null)}}>Cancel</button></div>;
 return <><button className="btn !mt-0 mb-3" onClick={()=>{setId(null);setF(blank)}}>+ New order</button>
  {orders.map(o=><div key={o.id} className="card"><div className="flex justify-between"><b>{o.order_no}</b><span className="chip">{o.status}</span></div>
   <div className="text-sm text-slate-500">{o.customer_name} · {o.service_type} · {rm(o.quoted_price)}{o.technician&&' · '+o.technician}</div>
   <button className="btn btn-alt" onClick={()=>{setId(o.id);setF(toForm(o))}}>Edit</button><button className="btn btn-alt !text-red-700" onClick={()=>del(o)}>Delete</button></div>)}</>}