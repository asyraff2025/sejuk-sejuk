import {useState} from 'react';import useOrders from './lib/useOrders';
import Login from './components/Login';import Logo from './components/Logo';import Overview from './components/Overview';
import AdminPortal from './components/AdminPortal';import TechPortal from './components/TechPortal';
import ReviewList from './components/ReviewList';import KpiDashboard from './components/KpiDashboard';import AskAI from './components/AskAI';
import ManageOrders from './components/ManageOrders';import Users from './components/Users';
const TABS={Admin:['Overview','Orders'],Technician:['My jobs'],Manager:['Overview','Review','KPI','Ask AI','Orders','Users']};
const load=()=>{try{const u=JSON.parse(localStorage.getItem('ss_user'));return u?.token?u:null}catch{return null}};
export default function App(){
 const [user,setUser]=useState(load);
 const login=u=>{try{localStorage.setItem('ss_user',JSON.stringify(u))}catch{}setUser(u)};
 const logout=()=>{try{localStorage.removeItem('ss_user')}catch{}setUser(null)};
 return user?<Portal user={user} onLogout={logout}/>:<Login onLogin={login}/>}
function Portal({user,onLogout}){
 const role=TABS[user.role]?user.role:'Admin',tech=user.name,tabs=TABS[role];
 const [tab,setTab]=useState(tabs[0]),{orders,techs,refresh,err}=useOrders(),props={orders,techs,refresh,tech,token:user.token,go:setTab};
 const date=new Date().toLocaleDateString('en-MY',{weekday:'long',day:'numeric',month:'long'});
 return <div className="max-w-6xl mx-auto p-3 sm:p-6 md:flex md:gap-5">
  <aside className="hidden md:flex flex-col w-56 shrink-0 card !mb-0 sticky top-6 h-[calc(100vh-3rem)]">
   <div className="mb-6 px-1"><Logo/></div>
   <nav className="flex-1 space-y-1">{tabs.map(t=><button key={t} onClick={()=>setTab(t)} className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition ${t===tab?'bg-sky-600 text-white':'text-slate-600 hover:bg-field'}`}>{t}</button>)}</nav>
   <div className="border-t border-slate-100 pt-3 flex items-center gap-2.5">
    <span className="grid place-items-center w-9 h-9 rounded-full bg-field text-sky-700 font-bold">{user.name[0]}</span>
    <div className="leading-tight min-w-0"><div className="text-sm font-semibold truncate">{user.name}</div><div className="text-xs text-slate-500">{role}</div></div></div>
   <button className="btn btn-alt w-full !mr-0" onClick={onLogout}>Log out</button>
  </aside>
  <div className="md:hidden card !p-3 flex items-center justify-between"><Logo size={22}/><div className="flex items-center gap-2"><span className="text-xs text-slate-500">{user.name} · {role}</span><button className="text-xs font-semibold px-3 py-1.5 rounded-md bg-field" onClick={onLogout}>Log out</button></div></div>
  <main className="flex-1 min-w-0 pb-24 md:pb-6">
   <div className="card !p-4 flex items-center justify-between"><h1 className="text-lg font-bold">{tab}</h1><span className="text-xs text-slate-500">{date}</span></div>
   {err&&<div className="card !bg-red-50 text-red-700 text-sm">Could not load data: {err}</div>}
   {tab==='Overview'&&<Overview {...props}/>}
   {role==='Admin'&&tab==='Orders'&&<AdminPortal {...props}/>}{role==='Technician'&&<TechPortal {...props}/>}
   {role==='Manager'&&<>{tab==='Review'&&<ReviewList {...props}/>}{tab==='KPI'&&<KpiDashboard {...props}/>}{tab==='Ask AI'&&<AskAI/>}{tab==='Orders'&&<ManageOrders {...props}/>}{tab==='Users'&&<Users {...props}/>}</>}
  </main>
  {tabs.length>1&&<nav className="md:hidden fixed bottom-0 inset-x-0 z-20 bg-white border-t border-slate-200 flex shadow-[0_-4px_20px_rgba(0,0,0,.06)]" style={{paddingBottom:'env(safe-area-inset-bottom)'}}>
   {tabs.map(t=><button key={t} onClick={()=>setTab(t)} className={`flex-1 py-3 text-[11px] font-semibold ${t===tab?'text-sky-700 border-t-2 border-sky-600 -mt-px':'text-slate-500'}`}>{t}</button>)}</nav>}
 </div>}