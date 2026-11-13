export default function Logo({word=true,size=26}){
 const h=[.55,1,.7,1,.45];
 return <span className="inline-flex items-center gap-3 text-sky-600">
  <svg width={size*1.25} height={size} viewBox="0 0 30 24">{h.map((v,i)=><rect key={i} x={i*6} y={12-12*v} width="3.4" height={24*v} rx="1.7" fill="currentColor"/>)}</svg>
  {word&&<span className="font-semibold tracking-[.3em] text-sm">SEJUK</span>}</span>}