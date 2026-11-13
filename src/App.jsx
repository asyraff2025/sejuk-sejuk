import {useState} from 'react';import useOrders from './lib/useOrders';import {TECHS} from './lib/helpers';
import AdminPortal from './components/AdminPortal';import TechPortal from './components/TechPortal';
import ReviewList from './components/ReviewList';import KpiDashboard from './components/KpiDashboard';import AskAI from './components/AskAI';
const TABS={Admin:['Orders'],Technician:['My jobs'],Manager:['Review','KPI','Ask AI']};
export default function App(){
 const [role,setRole]=useState('Admin'),[tab,setTab]=useState('Orders'),[tech,setTech]=useState(TECHS[0]);
 const {orders,refresh,err}=useOrders();
 const pick=r=>{setRole(r);setTab(TABS[r][0])};
 const props={orders,refresh,tech};
 return <div className="max-w-3xl mx-auto p-3">
  <div className="flex flex-wrap items-center justify-between gap-2 mb-3"><h1 className="text-lg font-bold">Sejuk Sejuk Ops</h1>
   <div className="flex gap-1.5">{Object.keys(TABS).map(r=><button key={r} onClick={()=>pick(r)} className={`px-3 py-1.5 rounded-full border ${r===role?'bg-sky-700 text-white border-sky-700':'bg-white border-slate-300'}`}>{r}</button>)}</div></div>
  {role==='Technician'&&<select className="inp mb-2" value={tech} onChange={e=>setTech(e.target.value)}>{TECHS.map(t=><option key={t}>{t}</option>)}</select>}
  <div className="flex gap-1.5 border-b border-slate-200 pb-2 mb-3">{TABS[role].map(t=><button key={t} onClick={()=>setTab(t)} className={`px-3 py-1 rounded-full ${t===tab?'bg-sky-100 text-sky-900 font-semibold':'text-slate-600'}`}>{t}</button>)}</div>
  {err&&<div className="card text-red-700">Could not load data: {err}. Check your .env and run supabase/schema.sql.</div>}
  {role==='Admin'&&<AdminPortal {...props}/>}{role==='Technician'&&<TechPortal {...props}/>}
  {role==='Manager'&&tab==='Review'&&<ReviewList {...props}/>}{role==='Manager'&&tab==='KPI'&&<KpiDashboard {...props}/>}{role==='Manager'&&tab==='Ask AI'&&<AskAI/>}
 </div>}
