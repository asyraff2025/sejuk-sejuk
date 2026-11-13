import {useState} from 'react';import useOrders from './lib/useOrders';import {TECHS} from './lib/helpers';
import Login from './components/Login';import AdminPortal from './components/AdminPortal';import TechPortal from './components/TechPortal';
import ReviewList from './components/ReviewList';import KpiDashboard from './components/KpiDashboard';import AskAI from './components/AskAI';
const TABS={Admin:['Orders'],Technician:['My jobs'],Manager:['Review','KPI','Ask AI']};
const load=()=>{try{return JSON.parse(localStorage.getItem('ss_user'))}catch{return null}};
export default function App(){
 const [user,setUser]=useState(load);
 const login=u=>{try{localStorage.setItem('ss_user',JSON.stringify(u))}catch{}setUser(u)};
 const logout=()=>{try{localStorage.removeItem('ss_user')}catch{}setUser(null)};
 return user?<Portal user={user} onLogout={logout}/>:<Login onLogin={login}/>}
function Portal({user,onLogout}){
 const role=TABS[user.role]?user.role:'Admin',tech=user.tech||TECHS[0];
 const [tab,setTab]=useState(TABS[role][0]),{orders,refresh,err}=useOrders(),props={orders,refresh,tech};
 return <div className="max-w-3xl mx-auto p-3">
  <div className="flex flex-wrap items-center justify-between gap-2 mb-3"><h1 className="text-lg font-bold">Sejuk Sejuk Ops</h1>
   <div className="flex items-center gap-2 text-sm"><span className="chip">{role==='Technician'?`Technician · ${tech}`:role}</span><button className="px-3 py-1.5 rounded-full border border-slate-300 bg-white" onClick={onLogout}>Log out</button></div></div>
  {TABS[role].length>1&&<div className="flex gap-1.5 border-b border-slate-200 pb-2 mb-3">{TABS[role].map(t=><button key={t} onClick={()=>setTab(t)} className={`px-3 py-1 rounded-full ${t===tab?'bg-sky-100 text-sky-900 font-semibold':'text-slate-600'}`}>{t}</button>)}</div>}
  {err&&<div className="card text-red-700">Could not load data: {err}. Check your .env and run supabase/schema.sql.</div>}
  {role==='Admin'&&<AdminPortal {...props}/>}{role==='Technician'&&<TechPortal {...props}/>}
  {role==='Manager'&&tab==='Review'&&<ReviewList {...props}/>}{role==='Manager'&&tab==='KPI'&&<KpiDashboard {...props}/>}{role==='Manager'&&tab==='Ask AI'&&<AskAI/>}
 </div>}