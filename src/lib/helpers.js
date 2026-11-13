export const TECHS=['Ali','John','Bala','Yusoff'];
export const TYPES=['Aircond cleaning','Repair','Gas refill','Installation','Servicing'];
export const PHONES={Ali:'60121110001',John:'60121110002',Bala:'60121110003',Yusoff:'60121110004'};
export const rm=n=>'RM '+Number(n||0).toFixed(2);
export const fdt=t=>new Date(t).toLocaleString('en-MY',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});
export const waLink=(phone,msg)=>{let p=String(phone).replace(/\D/g,'');if(p[0]==='0')p='6'+p;return `https://wa.me/${p}?text=${encodeURIComponent(msg)}`};
export const techMsg=o=>`Hi ${o.technician}, new job ${o.order_no}: ${o.service_type} at ${o.address}. Customer ${o.customer_name} (${o.phone}). Issue: ${o.problem}. Quoted ${rm(o.quoted_price)}.`;
export const customerMsg=(o,c)=>`Hi ${o.customer_name},\nJob ${o.order_no} has been completed by Technician ${c.technician} at ${fdt(c.completed_at)}.\nPlease check and leave feedback.\nThank you!`;
// Workflow supervisor rules (rule-based flags)
export const flagsOf=o=>{const c=o.completions,f=[];if(!c)return f;
 if(c.final_amount>o.quoted_price*1.3)f.push(`Final ${rm(c.final_amount)} vs quoted ${rm(o.quoted_price)}`);
 if(!c.files?.length)f.push('No photos uploaded');return f};
export const weekStart=()=>{const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-((d.getDay()+6)%7));return d.getTime()};
