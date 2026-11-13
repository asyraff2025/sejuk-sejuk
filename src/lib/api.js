import {sb} from './supabase';
const event=(order_id,actor,action)=>sb.from('order_events').insert({order_id,actor,action});
export const listOrders=async()=>{const {data,error}=await sb.from('orders').select('*, completions(*)').order('created_at',{ascending:false});if(error)throw error;return data};
export async function createOrder(f){
 const row={customer_name:f.name,phone:f.phone,address:f.address,problem:f.problem,service_type:f.type,quoted_price:+f.quoted||0,technician:f.tech||null,admin_notes:f.notes,status:f.tech?'Assigned':'New'};
 const {data,error}=await sb.from('orders').insert(row).select().single();if(error)throw error;
 await event(data.id,'Admin','Order created'+(f.tech?` and assigned to ${f.tech}`:''));return data}
export async function assign(id,tech){await sb.from('orders').update({technician:tech,status:'Assigned'}).eq('id',id);await event(id,'Admin','Assigned to '+tech)}
export async function setStatus(id,status,actor){await sb.from('orders').update({status}).eq('id',id);await event(id,actor,status)}
export async function postpone(o,actor){await sb.from('orders').update({postponed:o.postponed+1,status:'Assigned'}).eq('id',o.id);await event(o.id,actor,'Postponed')}
export async function complete(o,f,files,tech){
 const paths=[];
 for(const file of files.slice(0,6)){const p=`${o.order_no}/${Date.now()}-${file.name}`;
  const {error}=await sb.storage.from('job-files').upload(p,file);if(!error)paths.push(sb.storage.from('job-files').getPublicUrl(p).data.publicUrl)}
 const extra=+f.extra||0;
 const {data,error}=await sb.from('completions').upsert({order_id:o.id,work_done:f.work,extra_charges:extra,final_amount:o.quoted_price+extra,remarks:f.remarks,technician:tech,files:paths,payment_amount:+f.pay||null,payment_method:f.pay?f.method:null}).select().single();
 if(error)throw error;
 await sb.from('orders').update({status:'Job Done'}).eq('id',o.id);await event(o.id,tech,'Job Done');return data}
