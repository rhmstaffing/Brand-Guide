import React from 'react';
import { IconButton } from '../actions/IconButton.jsx';
export function Dialog({open=true,title,children,actions,onClose,width=520,inline=false}){
  if(!open)return null;
  const panel=<div role="dialog" aria-modal="true" onClick={e=>e.stopPropagation()} style={{width,maxWidth:'100%',boxSizing:'border-box',background:'#fff',borderRadius:'var(--radius-md)',boxShadow:'var(--shadow-lg)',padding:28,position:'relative'}}>
    {onClose&&<IconButton icon="x" label="Close" size={36} onClick={onClose} style={{position:'absolute',top:14,right:14}}/>}
    {title&&<div style={{fontFamily:'var(--font-display)',fontWeight:600,fontSize:24,color:'var(--rhm-ink)',paddingRight:40,marginBottom:10}}>{title}</div>}
    <div style={{fontSize:15,lineHeight:1.55,color:'var(--text-body)'}}>{children}</div>
    {actions&&<div style={{display:'flex',justifyContent:'flex-end',gap:10,marginTop:24}}>{actions}</div>}
  </div>;
  if(inline)return panel;
  return <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(6,15,26,0.6)',display:'flex',alignItems:'center',justifyContent:'center',padding:24,zIndex:1000}}>{panel}</div>;
}
