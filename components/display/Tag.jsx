import React from 'react';
import { Icon } from '../brand/Icon.jsx';
export function Tag({icon,selected=false,onClick,tone='light',children,style}){
  const [h,setH]=React.useState(false);const dark=tone==='dark';
  const bg=selected?(dark?'#fff':'var(--rhm-navy)'):h&&onClick?(dark?'rgba(255,255,255,0.14)':'var(--blue-50)'):'transparent';
  const fg=selected?(dark?'var(--rhm-navy)':'#fff'):(dark?'#fff':'var(--rhm-navy)');
  return <span onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
    style={{display:'inline-flex',alignItems:'center',gap:8,height:36,padding:'0 16px',borderRadius:'var(--radius-pill)',border:'1.5px solid '+(selected?'transparent':dark?'rgba(255,255,255,0.45)':'var(--border-strong)'),background:bg,color:fg,fontSize:14,fontWeight:500,cursor:onClick?'pointer':'default',whiteSpace:'nowrap',transition:'background var(--dur-fast)',...style}}>
    {icon&&<Icon name={icon} size={16}/>}{children}
  </span>;
}
