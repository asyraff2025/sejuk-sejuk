import {useState} from 'react';import {login} from '../lib/api';import Logo from './Logo';
const DEMO=[['Manager','manager','manager123'],['Admin','admin','admin123'],['Ali','ali','ali123'],['John','john','john123'],['Bala','bala','bala123']];
export default function Login({onLogin}){
 const [id,setId]=useState(''),[pw,setPw]=useState(''),[show,setShow]=useState(false),[msg,setMsg]=useState(''),[busy,setBusy]=useState(false);
 const go=async()=>{if(!id||!pw)return setMsg('Enter your ID and password.');setBusy(true);setMsg('');
  try{const u=await login(id,pw);u?onLogin(u):setMsg('Wrong ID or password.')}catch(e){setMsg('Could not log in: '+e.message)}setBusy(false)};
 return <div className="min-h-screen grid place-items-center p-4"><div className="relative w-full max-w-sm">
  <div className="absolute inset-0 translate-x-5 translate-y-5 rounded-lg bg-white/70 shadow-xl"/>
  <div className="card relative !p-7 !mb-0">
   <div className="flex justify-center mb-4"><Logo/></div>
   <h1 className="text-center font-semibold mb-1">Sign in</h1><p className="text-center text-xs text-slate-500 mb-3">Service operations portal</p>
   <label className="lbl">ID*</label><input className="inp" autoCapitalize="none" autoComplete="username" value={id} onChange={e=>setId(e.target.value)}/>
   <label className="lbl">Password*</label>
   <div className="relative"><input className="inp pr-14" type={show?'text':'password'} autoComplete="current-password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==='Enter'&&go()}/>
    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-sky-700" onClick={()=>setShow(!show)}>{show?'Hide':'Show'}</button></div>
   {msg&&<div className="text-xs text-red-700 bg-red-50 rounded-md px-3 py-2 mt-3">{msg}</div>}
   <button className="btn w-full !mr-0 !mt-5 !py-3" disabled={busy} onClick={go}>{busy?'Logging in…':'Log in'}</button>
   <div className="text-center mt-5"><div className="text-xs text-slate-400 mb-2">Demo accounts, tap to fill</div>
    <div className="flex flex-wrap justify-center gap-1.5">{DEMO.map(([n,u,p])=><button key={u} onClick={()=>{setId(u);setPw(p);setMsg('')}} className="text-xs px-3 py-1 rounded-full bg-field hover:bg-sky-100">{n}</button>)}</div></div>
  </div></div></div>}