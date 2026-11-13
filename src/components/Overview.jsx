import Status from './Status';import {rm} from '../lib/helpers';
export default function Overview({orders,go}){
 const sod=new Date().setHours(0,0,0,0),today=orders.filter(o=>o.completions&&new Date(o.completions.completed_at)>=sod);
 const S=[['Total orders',orders.length],['Open jobs',orders.filter(o=>['New','Assigned','In Progress'].includes(o.status)).length],['Done today',today.length],['Awaiting review',orders.filter(o=>o.status==='Job Done').length]];
 return <>
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">{S.map(([l,v])=><div key={l} className="card !mb-0"><div className="text-xs text-slate-500">{l}</div><div className="text-3xl font-bold text-sky-700 mt-1">{v}</div></div>)}</div>
  <div className="card"><div className="flex justify-between items-center mb-2"><h2 className="font-semibold">Recent orders</h2><button className="text-xs font-semibold text-sky-700" onClick={()=>go('Orders')}>View all</button></div>
   {orders.slice(0,6).map(o=><div key={o.id} className="flex items-center justify-between gap-2 py-2.5 border-t border-slate-100 first:border-0">
    <div className="min-w-0"><div className="text-sm font-semibold">{o.order_no} · {o.customer_name}</div><div className="text-xs text-slate-500 truncate">{o.service_type} · {rm(o.quoted_price)}{o.technician&&' · '+o.technician}</div></div><Status s={o.status}/></div>)}
   {!orders.length&&<div className="text-sm text-slate-500">No orders yet.</div>}</div></>}