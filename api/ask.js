// Vercel serverless function. Flow: question -> intent -> controlled read-only query -> facts -> (optional) Claude phrases the answer.
import {createClient} from '@supabase/supabase-js';
const sb=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_KEY);
const TECHS=['Ali','John','Bala','Yusoff'],DAY=864e5,MY=8*36e5; // Malaysia is UTC+8
const sodMY=()=>{const n=Date.now()+MY;return n-(n%DAY)-MY};
const monMY=()=>{const s=sodMY(),dow=(new Date(s+MY).getUTCDay()+6)%7;return s-dow*DAY};
const rm=n=>'RM '+Number(n||0).toFixed(2);
async function done(a,b){const {data,error}=await sb.from('completions').select('technician,final_amount,files,completed_at,orders(order_no,service_type,quoted_price)').gte('completed_at',new Date(a).toISOString()).lt('completed_at',new Date(b).toISOString());if(error)throw error;return data}
const count=rows=>TECHS.map(t=>({t,n:rows.filter(r=>r.technician===t).length,amt:rows.filter(r=>r.technician===t).reduce((s,r)=>s+r.final_amount,0)}));
async function answer(q){
 const s=q.toLowerCase(),ws=monMY(),td=sodMY();let r=null,lab='';
 if(/last week/.test(s)){r=[ws-7*DAY,ws];lab='last week'}else if(/today/.test(s)){r=[td,td+DAY];lab='today'}else if(/week/.test(s)){r=[ws,ws+7*DAY];lab='this week'}
 const tech=TECHS.find(t=>s.includes(t.toLowerCase()));
 if(/flag|issue|suspicious/.test(s)){const rows=await done(ws-7*DAY,ws+7*DAY),f=[];
  rows.forEach(x=>{if(x.final_amount>x.orders.quoted_price*1.3)f.push(`${x.orders.order_no} (${x.technician}): final ${rm(x.final_amount)} vs quoted ${rm(x.orders.quoted_price)}`);if(!x.files?.length)f.push(`${x.orders.order_no} (${x.technician}): no photos uploaded`)});
  return f.length?'Flagged jobs (last two weeks):\n'+f.join('\n'):'No flagged jobs in the last two weeks.'}
 if(/overload|busiest|too many/.test(s)){const k=count(await done(ws,ws+7*DAY)),avg=k.reduce((a,x)=>a+x.n,0)/k.length,hi=k.filter(x=>x.n>=3&&x.n>avg*1.5);
  return hi.length?hi.map(x=>`Technician ${x.t} completed ${x.n} jobs this week, well above the team average of ${avg.toFixed(1)}.`).join('\n'):`No one is clearly overloaded. Team average this week is ${avg.toFixed(1)} jobs.`}
 if(/most|top|best/.test(s)){r=r||[ws,ws+7*DAY];lab=lab||'this week';const k=count(await done(...r)).sort((a,b)=>b.n-a.n);return k[0].n?`Technician ${k[0].t} completed the most jobs ${lab}: ${k[0].n} jobs (${rm(k[0].amt)}).`:'No completed jobs in that period.'}
 if(/how many/.test(s)){r=r||[td,td+DAY];lab=lab||'today';const rows=(await done(...r)).filter(x=>!tech||x.technician===tech);return `${rows.length} job${rows.length===1?'':'s'} completed${tech?' by '+tech:''} ${lab}.`}
 if(tech){r=r||[ws,ws+7*DAY];lab=lab||'this week';const rows=(await done(...r)).filter(x=>x.technician===tech);return rows.length?`Technician ${tech} completed ${rows.length} job${rows.length===1?'':'s'} ${lab}:\n`+rows.map(x=>`${x.orders.order_no} – ${x.orders.service_type}`).join('\n'):`Technician ${tech} has no completed jobs ${lab}.`}
 return null}
export default async function handler(req,res){
 try{const q=String(req.body?.question||'').slice(0,300);const facts=await answer(q);
  if(!facts)return res.json({answer:'I can only answer from completed job records. Try: jobs by a technician (last week, this week, today), who completed the most jobs, how many jobs were done today, flagged jobs, or who looks overloaded.'});
  if(!process.env.ANTHROPIC_API_KEY)return res.json({answer:facts});
  const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'content-type':'application/json','x-api-key':process.env.ANTHROPIC_API_KEY,'anthropic-version':'2023-06-01'},
   body:JSON.stringify({model:process.env.ANTHROPIC_MODEL||'claude-sonnet-4-6',max_tokens:300,system:'You format operations answers for a manager. Use ONLY the facts provided. Do not add numbers or names. Keep order IDs and lists as given. Be brief.',messages:[{role:'user',content:`Question: ${q}\nFacts:\n${facts}`}]})});
  const d=await r.json();res.json({answer:d.content?.[0]?.text||facts})}
 catch(e){res.status(500).json({error:'Query failed: '+e.message})}}
