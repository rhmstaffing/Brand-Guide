import React from 'react';
import { Icon } from '../brand/Icon.jsx';
export function IconButton({icon,label,variant='ghost',size=40,style,...rest}){
  const [h,setH]=React.useState(false);
  const map={ghost:['transparent','var(--blue-50)','var(--rhm-navy)','transparent'],solid:['var(--action-primary)','var(--action-primary-hover)','#fff','transparent'],outline:['transparent','var(--blue-50)','var(--rhm-navy)','var(--border-strong)'],inverse:['transparent','rgba(255,255,255,0.12)','#fff','rgba(255,255,255,0.4)']};
  const [bg,hv,fg,bd]=map[variant]||map.ghost;
  return <button aria-label={label} title={label} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
    style={{width:size,height:size,display:'inline-flex',alignItems:'center',justifyContent:'center',borderRadius:'var(--radius-sm)',border:'1.5px solid '+bd,background:h?hv:bg,color:fg,cursor:'pointer',padding:0,transition:'background var(--dur-base)',...style}} {...rest}>
    <Icon name={icon} size={Math.round(size*0.48)}/>
  </button>;
}
