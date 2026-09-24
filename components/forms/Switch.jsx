import React from 'react';
export function Switch({label,checked,defaultChecked=false,onChange,disabled,style}){
  const [c,setC]=React.useState(defaultChecked);const on=checked!==undefined?checked:c;
  const t=()=>{if(disabled)return;const n=!on;setC(n);onChange&&onChange(n)};
  return <label onClick={t} style={{display:'inline-flex',alignItems:'center',gap:10,cursor:disabled?'not-allowed':'pointer',opacity:disabled?0.5:1,fontSize:15,color:'var(--text-strong)',userSelect:'none',...style}}>
    <span role="switch" aria-checked={on} style={{width:40,height:24,borderRadius:999,background:on?'var(--rhm-blue)':'var(--gray-300)',position:'relative',transition:'background var(--dur-base)',flex:'none'}}>
      <span style={{position:'absolute',top:3,left:on?19:3,width:18,height:18,borderRadius:'50%',background:'#fff',boxShadow:'var(--shadow-sm)',transition:'left var(--dur-base) var(--ease-out)'}}/>
    </span>{label}
  </label>;
}
