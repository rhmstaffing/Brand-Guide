import React from 'react';
export function Checkbox({label,checked,defaultChecked=false,onChange,disabled,style}){
  const [c,setC]=React.useState(defaultChecked);const on=checked!==undefined?checked:c;
  const t=()=>{if(disabled)return;const n=!on;setC(n);onChange&&onChange(n)};
  return <label onClick={t} style={{display:'inline-flex',alignItems:'center',gap:10,cursor:disabled?'not-allowed':'pointer',opacity:disabled?0.5:1,fontSize:15,color:'var(--text-strong)',userSelect:'none',...style}}>
    <span role="checkbox" aria-checked={on} style={{width:20,height:20,flex:'none',boxSizing:'border-box',borderRadius:'var(--radius-xs)',border:'1.5px solid '+(on?'var(--rhm-blue)':'var(--border-strong)'),background:on?'var(--rhm-blue)':'#fff',display:'flex',alignItems:'center',justifyContent:'center',transition:'background var(--dur-fast)'}}>
      {on&&<span style={{width:5,height:10,borderRight:'2px solid #fff',borderBottom:'2px solid #fff',transform:'translateY(-1px) rotate(45deg)'}}/>}
    </span>{label}
  </label>;
}
