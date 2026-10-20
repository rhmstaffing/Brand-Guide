import React from 'react';
import { Icon } from '../brand/Icon.jsx';
const T={success:['circle-check','var(--status-success)'],info:['info','var(--rhm-sky)'],warning:['triangle-alert','#E3A93B'],error:['circle-alert','#E86A6A']};
export function Toast({tone='success',title,children,onClose,style}){
  const [ic,col]=T[tone]||T.info;
  return <div role="status" style={{display:'flex',gap:12,alignItems:'flex-start',width:360,maxWidth:'100%',boxSizing:'border-box',padding:'14px 16px',background:'var(--rhm-ink)',color:'#fff',borderRadius:'var(--radius-md)',boxShadow:'var(--shadow-lg)',...style}}>
    <Icon name={ic} size={20} color={col} style={{marginTop:1}}/>
    <div style={{flex:1,minWidth:0}}>{title&&<div style={{fontWeight:600,fontSize:15}}>{title}</div>}{children&&<div style={{fontSize:14,color:'var(--text-on-dark-muted)',marginTop:2}}>{children}</div>}</div>
    {onClose&&<button aria-label="Dismiss" onClick={onClose} style={{background:'none',border:'none',color:'#fff',opacity:.7,cursor:'pointer',padding:0}}><Icon name="x" size={18}/></button>}
  </div>;
}
