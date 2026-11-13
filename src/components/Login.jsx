import {useState} from 'react';import {TECHS} from '../lib/helpers';
const ROLES=[['Admin','Create orders and assign technicians'],['Technician','View and complete your assigned jobs'],['Manager','Review jobs, KPI dashboard and AI assistant']];
export default function Login({onLogin}){
 const [role,setRole]=useState('Admin'),[tech,setTech]=useState(TECHS[0]);
 return <div className="max-w-sm mx-auto p-4 mt-12"><h1 className="text-xl font-bold mb-1">Sejuk Sejuk Ops</h1><p className="text-sm text-slate-500 mb-3">Choose your role to log in</p>
  <div className="card">
   {ROLES.map(([r,d])=><label key={r} className={`flex gap-3 items-start p-3 mb-2 rounded-lg border cursor-pointer ${role===r?'border-sky-700 bg-sky-50':'border-slate-200'}`}>
    <input type="radio" name="role" className="mt-1" checked={role===r} onChange={()=>setRole(r)}/><span><b>{r}</b><span className="block text-sm text-slate-500">{d}</span></span></label>)}
   {role==='Technician'&&<><label className="lbl">Technician</label><select className="inp" value={tech} onChange={e=>setTech(e.target.value)}>{TECHS.map(t=><option key={t}>{t}</option>)}</select></>}
   <button className="btn w-full" onClick={()=>onLogin({role,tech:role==='Technician'?tech:null})}>Log in as {role==='Technician'?tech:role}</button>
  </div></div>}