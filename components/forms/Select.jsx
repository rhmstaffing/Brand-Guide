import React from 'react';
const lab={display:'block',fontSize:14,fontWeight:500,color:'var(--text-strong)',marginBottom:6};
const hintS=(err)=>({fontSize:13,marginTop:6,color:err?'var(--status-error)':'var(--text-muted)'});
export function Select({label,hint,error,options=[],placeholder,id,style,...rest}){
  const [f,setF]=React.useState(false);const _id=id||React.useId();
  return <div style={style}>
    {label&&<label htmlFor={_id} style={lab}>{label}</label>}
    <div style={{position:'relative'}}>
      <select id={_id} onFocus={()=>setF(true)} onBlur={()=>setF(false)} defaultValue={placeholder?'':undefined}
        style={{width:'100%',height:44,padding:'0 38px 0 12px',appearance:'none',WebkitAppearance:'none',fontFamily:'var(--font-body)',fontSize:15,color:'var(--text-strong)',background:'#fff',border:'1.5px solid '+(error?'var(--status-error)':f?'var(--rhm-blue)':'var(--border-strong)'),borderRadius:'var(--radius-sm)',outline:'none',boxShadow:f?'var(--shadow-focus)':'none'}} {...rest}>
        {placeholder&&<option value="" disabled>{placeholder}</option>}
        {options.map(o=>typeof o==='string'?<option key={o}>{o}</option>:<option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <span style={{position:'absolute',right:14,top:'50%',width:8,height:8,borderRight:'2px solid var(--rhm-navy)',borderBottom:'2px solid var(--rhm-navy)',transform:'translateY(-70%) rotate(45deg)',pointerEvents:'none'}}/>
    </div>
    {(error||hint)&&<div style={hintS(error)}>{error||hint}</div>}
  </div>;
}
