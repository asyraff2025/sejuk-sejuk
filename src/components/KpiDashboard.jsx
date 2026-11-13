import {rm,weekStart} from '../lib/helpers';
export default function KpiDashboard({orders,techs}){
 const ws=weekStart(),done=orders.filter(o=>o.completions&&new Date(o.completions.completed_at)>=ws);
 const k=techs.map(({name:t})=>{const j=done.filter(o=>o.completions.technician===t);return {t,n:j.length,amt:j.reduce((s,o)=>s+o.completions.final_amount,0),pp:orders.filter(o=>o.technician===t).reduce((s,o)=>s+o.postponed,0)}});
 const mx=Math.max(1,...k.map(x=>x.n));
 return <>
  <div className="grid grid-cols-3 gap-2 mb-3">{[['Done this week',done.length],['Awaiting review',orders.filter(o=>o.status==='Job Done').length],['Postponed',k.reduce((s,x)=>s+x.pp,0)]].map(([l,v])=><div key={l} className="card !mb-0 text-center"><b className="text-2xl block">{v}</b><span className="text-sm text-slate-500">{l}</span></div>)}</div>
  <div className="card"><h2 className="font-semibold mb-2">Leaderboard · this week</h2>{[...k].sort((a,b)=>b.n-a.n).map(x=><div key={x.t} className="grid grid-cols-[70px_1fr_70px] gap-2 items-center my-1.5"><span>{x.t}</span><div className="h-2.5 rounded bg-sky-700" style={{width:`${x.n/mx*100}%`,minWidth:2}}/><span className="text-sm text-slate-500">{x.n} jobs</span></div>)}</div>
  <div className="card overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left"><th>Technician</th><th>Jobs</th><th>Total</th><th>Postponed</th></tr></thead><tbody>{k.map(x=><tr key={x.t} className="border-t"><td className="py-1.5">{x.t}</td><td>{x.n}</td><td>{rm(x.amt)}</td><td>{x.pp}</td></tr>)}</tbody></table></div></>}