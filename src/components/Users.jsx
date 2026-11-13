import {useEffect,useState} from 'react';import {listUsers,addUser,deleteUser} from '../lib/api';
const blank={username:'',password:'',name:'',role:'Technician',phone:''};
export default function Users({token,refresh}){
 const [users,setUsers]=useState([]),[f,setF]=useState(blank),[err,setErr]=useState(''),[ok,setOk]=useState(''),[busy,setBusy]=useState(false);
 const set=k=>e=>setF({...f,[k]:e.target.value});
 const load=async()=>{try{const u=await listUsers(token);setUsers(u);return u}catch(e){setErr(e.message);return []}};
 useEffect(()=>{load()},[]);
 const add=async()=>{
  if(!f.username||!f.password||!f.name)return setErr('ID, password and name are required.');
  setBusy(true);setErr('');setOk('');
  try{await addUser(token,f);const u=await load();
   if(u.some(x=>x.username===f.username.trim().toLowerCase())){setOk(`Account "${f.username}" saved.`);setF(blank);refresh()}
   else setErr('The account was not found in the database after saving.')}
  catch(e){setErr(e.message)}
  setBusy(false)};
 const del=async u=>{if(!confirm(`Delete account ${u.username}?`))return;setErr('');setOk('');try{await deleteUser(token,u.id);await load();refresh()}catch(e){setErr(e.message)}};
 return <>
  <div className="card"><h2 className="font-semibold">Add account</h2>
   <div className="grid sm:grid-cols-2 gap-2"><div><label className="lbl">Role</label><select className="inp" value={f.role} onChange={set('role')}><option>Technician</option><option>Admin</option></select></div>
    <div><label className="lbl">Display name</label><input className="inp" value={f.name} onChange={set('name')}/></div>
    <div><label className="lbl">Login ID</label><input className="inp" autoCapitalize="none" value={f.username} onChange={set('username')}/></div>
    <div><label className="lbl">Password (min 6)</label><input className="inp" type="password" value={f.password} onChange={set('password')}/></div></div>
   {f.role==='Technician'&&<><label className="lbl">WhatsApp phone, e.g. 60121234567</label><input className="inp" value={f.phone} onChange={set('phone')}/></>}
   {err&&<div className="text-sm text-red-700 mt-2">{err}</div>}{ok&&<div className="text-sm text-green-700 mt-2">{ok}</div>}
   <button className="btn" disabled={busy} onClick={add}>Add account</button></div>
  <div className="card overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left"><th>ID</th><th>Name</th><th>Role</th><th></th></tr></thead>
   <tbody>{users.map(u=><tr key={u.id} className="border-t"><td className="py-1.5">{u.username}</td><td>{u.name}</td><td>{u.role}</td><td>{u.role!=='Manager'&&<button className="text-red-700" onClick={()=>del(u)}>Delete</button>}</td></tr>)}</tbody></table></div></>}