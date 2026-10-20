import React from 'react';
import { Icon } from '../brand/Icon.jsx';
const V={
  primary:{bg:'var(--action-primary)',hover:'var(--action-primary-hover)',fg:'#fff',bd:'transparent'},
  accent:{bg:'var(--action-accent)',hover:'var(--action-accent-hover)',fg:'var(--rhm-ink)',bd:'transparent'},
  secondary:{bg:'transparent',hover:'var(--blue-50)',fg:'var(--rhm-navy)',bd:'var(--rhm-navy)'},
  ghost:{bg:'transparent',hover:'var(--blue-50)',fg:'var(--rhm-blue)',bd:'transparent'},
  inverse:{bg:'#fff',hover:'var(--sky-100)',fg:'var(--rhm-navy)',bd:'transparent'},
  outlineInverse:{bg:'transparent',hover:'rgba(255,255,255,0.12)',fg:'#fff',bd:'rgba(255,255,255,0.7)'},
};
const S={sm:{h:36,px:14,fs:14,ic:16},md:{h:44,px:20,fs:15,ic:18},lg:{h:52,px:26,fs:16,ic:20}};
export function Button({variant='primary',size='md',iconLeft,iconRight,disabled=false,fullWidth=false,children,style,onClick,...rest}){
  const [h,setH]=React.useState(false);const [p,setP]=React.useState(false);
  const v=V[variant]||V.primary,s=S[size]||S.md;
  return <button disabled={disabled} onClick={onClick}
    onMouseEnter={()=>setH(true)} onMouseLeave={()=>{setH(false);setP(false)}} onMouseDown={()=>setP(true)} onMouseUp={()=>setP(false)}
    style={{display:fullWidth?'flex':'inline-flex',width:fullWidth?'100%':undefined,alignItems:'center',justifyContent:'center',gap:8,height:s.h,padding:'0 '+s.px+'px',
    fontFamily:'var(--font-body)',fontWeight:500,fontSize:s.fs,letterSpacing:'0.01em',whiteSpace:'nowrap',
    color:v.fg,background:h&&!disabled?v.hover:v.bg,border:'1.5px solid '+v.bd,borderRadius:'var(--radius-sm)',
    cursor:disabled?'not-allowed':'pointer',opacity:disabled?0.45:1,transform:p&&!disabled?'translateY(1px)':'none',
    transition:'background var(--dur-base) var(--ease-standard),transform var(--dur-fast)',...style}} {...rest}>
    {iconLeft&&<Icon name={iconLeft} size={s.ic}/>}{children}{iconRight&&<Icon name={iconRight} size={s.ic}/>}
  </button>;
}
