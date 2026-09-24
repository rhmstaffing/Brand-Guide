import React from 'react';
export function Tabs({tabs=[],value,defaultValue,onChange,tone='light',style}){
  const [v,setV]=React.useState(defaultValue??(tabs[0]&&(tabs[0].value??tabs[0])));const cur=value!==undefined?value:v;const dark=tone==='dark';
  return <div role="tablist" style={{display:'flex',gap:28,borderBottom:'1px solid '+(dark?'var(--border-on-dark)':'var(--border-subtle)'),...style}}>
    {tabs.map(t=>{const val=t.value??t,lab=t.label??t,on=cur===val;
      return <button key={val} role="tab" aria-selected={on} onClick={()=>{setV(val);onChange&&onChange(val)}}
        style={{background:'none',border:'none',padding:'12px 0',marginBottom:-1,cursor:'pointer',fontFamily:'var(--font-body)',fontSize:15,fontWeight:on?600:500,color:on?(dark?'#fff':'var(--rhm-navy)'):(dark?'var(--text-on-dark-muted)':'var(--text-muted)'),borderBottom:'3px solid '+(on?(dark?'var(--rhm-sky)':'var(--rhm-blue)'):'transparent'),transition:'color var(--dur-fast)'}}>{lab}</button>})}
  </div>;
}
