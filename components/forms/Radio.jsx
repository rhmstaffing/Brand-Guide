import React from 'react';
export function Radio({name,options=[],value,defaultValue,onChange,direction='column',style}){
  const [v,setV]=React.useState(defaultValue);const cur=value!==undefined?value:v;
  return <div role="radiogroup" style={{display:'flex',flexDirection:direction,gap:direction==='row'?20:10,...style}}>
    {options.map(o=>{const val=typeof o==='string'?o:o.value,lab=typeof o==='string'?o:o.label,on=cur===val;
      return <label key={val} onClick={()=>{setV(val);onChange&&onChange(val)}} style={{display:'inline-flex',alignItems:'center',gap:10,cursor:'pointer',fontSize:15,color:'var(--text-strong)'}}>
        <span role="radio" aria-checked={on} style={{width:20,height:20,boxSizing:'border-box',borderRadius:'50%',border:'1.5px solid '+(on?'var(--rhm-blue)':'var(--border-strong)'),display:'flex',alignItems:'center',justifyContent:'center',background:'#fff'}}>{on&&<span style={{width:10,height:10,borderRadius:'50%',background:'var(--rhm-blue)'}}/>}</span>{lab}
      </label>})}
  </div>;
}
