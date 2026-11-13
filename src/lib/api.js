import {sb} from './supabase';
const fail=e=>{throw new Error(e.message||String(e))};
const ok=async p=>{const {error}=await p;if(error)fail(error)};
const event=(order_id,actor,action)=>ok(sb.from('order_events').insert({order_id,actor,action}));

export const listOrders=async()=>{const {data,error}=await sb.from('orders').select('*, completions(*)').order('created_at',{ascending:false});if(error)fail(error);return data||[]};
export const listTechs=async()=>{const {data,error}=await sb.from('technicians').select('name,phone').order('id');if(error)fail(error);return data||[]};

export async function createOrder(f){
 const row={customer_name:f.name,phone:f.phone,address:f.address,problem:f.problem,service_type:f.type,quoted_price:+f.quoted||0,technician:f.tech||null,admin_notes:f.notes,status:f.tech?'Assigned':'New'};
 const {data,error}=await sb.from('orders').insert(row).select().single();if(error)fail(error);
 const chk=await sb.from('orders').select('id').eq('id',data.id).maybeSingle();
 if(!chk.data)throw new Error('The order was not saved in the database. Check your Supabase URL and policies.');
 await event(data.id,'Admin','Order created'+(f.tech?` and assigned to ${f.tech}`:''));return data}
export async function assign(id,tech){await ok(sb.from('orders').update({technician:tech,status:'Assigned'}).eq('id',id));await event(id,'Admin','Assigned to '+tech)}
export async function setStatus(id,status,actor){await ok(sb.from('orders').update({status}).eq('id',id));await event(id,actor,status)}
export async function postpone(o,actor){await ok(sb.from('orders').update({postponed:o.postponed+1,status:'Assigned'}).eq('id',o.id));await event(o.id,actor,'Postponed')}
export async function complete(o,f,files,tech){
 const paths=[];
 for(const file of files.slice(0,6)){const p=`${o.order_no}/${Date.now()}-${file.name}`;
  const {error}=await sb.storage.from('job-files').upload(p,file);if(error)fail(error);paths.push(sb.storage.from('job-files').getPublicUrl(p).data.publicUrl)}
 const extra=+f.extra||0;
 const {data,error}=await sb.from('completions').upsert({order_id:o.id,work_done:f.work,extra_charges:extra,final_amount:o.quoted_price+extra,remarks:f.remarks,technician:tech,files:paths,payment_amount:+f.pay||null,payment_method:f.pay?f.method:null}).select().single();
 if(error)fail(error);
 await ok(sb.from('orders').update({status:'Job Done'}).eq('id',o.id));await event(o.id,tech,'Job Done');return data}

export async function login(u,p){const {data,error}=await sb.rpc('app_login',{p_user:u,p_pass:p});if(error)fail(error);return data}
export async function listUsers(t){const {data,error}=await sb.rpc('app_list_users',{p_token:t});if(error)fail(error);return data||[]}
export async function addUser(t,f){await ok(sb.rpc('app_add_user',{p_token:t,p_user:f.username,p_pass:f.password,p_role:f.role,p_name:f.name,p_phone:f.phone||null}))}
export async function deleteUser(t,id){await ok(sb.rpc('app_delete_user',{p_token:t,p_id:id}))}
export async function updateOrder(id,f){await ok(sb.from('orders').update({customer_name:f.name,phone:f.phone,address:f.address,problem:f.problem,service_type:f.type,quoted_price:+f.quoted||0,technician:f.tech||null,admin_notes:f.notes,status:f.status}).eq('id',id));await event(id,'Manager','Order edited')}
export async function deleteOrder(id){await ok(sb.from('order_events').delete().eq('order_id',id));await ok(sb.from('completions').delete().eq('order_id',id));await ok(sb.from('orders').delete().eq('id',id))}