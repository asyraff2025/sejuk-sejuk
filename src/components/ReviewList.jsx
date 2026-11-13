import {setStatus} from '../lib/api';import {rm,fdt,flagsOf} from '../lib/helpers';
export default function ReviewList({orders,refresh}){
 const l=orders.filter(o=>['Job Done','Reviewed'].includes(o.status)&&o.completions);
 if(!l.length)return <div className="card text-slate-500">Nothing waiting for review.</div>;
 return l.map(o=>{const c=o.completions;return <div key={o.id} className="card"><div className="flex justify-between"><b>{o.order_no}</b><span className="chip">{o.status}</span></div>
  <div>{o.service_type} · {c.technician} · {fdt(c.completed_at)}</div><div className="text-sm text-slate-500">Quoted {rm(o.quoted_price)} → Final {rm(c.final_amount)} · {c.files?.length||0} files</div>
  <div className="flex flex-wrap gap-1 mt-1">{flagsOf(o).map(x=><span key={x} className="chip chip-flag">{x}</span>)}</div>
  <button className="btn" onClick={async()=>{await setStatus(o.id,o.status==='Job Done'?'Reviewed':'Closed','Manager');refresh()}}>{o.status==='Job Done'?'Mark reviewed':'Close order'}</button></div>})}
