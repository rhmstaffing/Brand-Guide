import React from 'react';
import { Icon } from '../brand/Icon.jsx';
export function Card({icon,eyebrow,title,children,footer,variant='outline',interactive=false,style,onClick}){
  const [h,setH]=React.useState(false);
  const dark=variant==='dark',glass=variant==='glass';
  const base={outline:{background:'#fff',border:'1px solid var(--border-subtle)'},elevated:{background:'#fff',border:'1px solid transparent',boxShadow:'var(--shadow-md)'},tint:{background:'var(--surface-tint)',border:'1px solid transparent'},dark:{background:'var(--rhm-navy)',border:'1px solid var(--border-on-dark)'},glass:{background:'var(--surface-glass)',border:'1px solid var(--border-on-dark)',backdropFilter:'blur(var(--blur-glass))',WebkitBackdropFilter:'blur(var(--blur-glass))'}}[variant];
  const light=dark||glass;
  return <div onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
    style={{boxSizing:'border-box',padding:28,borderRadius:'var(--radius-md)',display:'flex',flexDirection:'column',gap:12,...base,
    ...(interactive&&h?{boxShadow:'var(--shadow-lg)',transform:'translateY(-2px)',borderColor:light?'rgba(255,255,255,0.35)':'var(--blue-200)'}:{}),
    cursor:interactive?'pointer':'default',transition:'box-shadow var(--dur-base) var(--ease-standard),transform var(--dur-base) var(--ease-standard),border-color var(--dur-base)',...style}}>
    {icon&&<div style={{width:44,height:44,borderRadius:'var(--radius-sm)',background:light?'rgba(82,192,228,0.16)':'var(--blue-50)',display:'flex',alignItems:'center',justifyContent:'center',color:light?'var(--rhm-sky)':'var(--rhm-blue)'}}><Icon name={icon} size={22}/></div>}
    {eyebrow&&<div style={{fontFamily:'var(--font-display)',fontWeight:600,fontSize:12,letterSpacing:'var(--ls-eyebrow)',textTransform:'uppercase',color:light?'var(--rhm-sky)':'var(--rhm-blue)'}}>{eyebrow}</div>}
    {title&&<div style={{fontFamily:'var(--font-display)',fontWeight:600,fontSize:'var(--fs-h4)',lineHeight:1.2,color:light?'#fff':'var(--rhm-ink)'}}>{title}</div>}
    {children&&<div style={{fontSize:15,lineHeight:1.55,color:light?'var(--text-on-dark-muted)':'var(--text-body)'}}>{children}</div>}
    {footer&&<div style={{marginTop:'auto',paddingTop:8}}>{footer}</div>}
  </div>;
}
