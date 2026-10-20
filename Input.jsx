import React from 'react';
const lab={display:'block',fontSize:14,fontWeight:500,color:'var(--text-strong)',marginBottom:6};
const hintS=(err)=>({fontSize:13,marginTop:6,color:err?'var(--status-error)':'var(--text-muted)'});
export function Input({label,hint,error,multiline=false,rows=4,id,style,...rest}){
  const [f,setF]=React.useState(false);const _id=id||React.useId();
  const Tag=multiline?'textarea':'input';
  return <div style={style}>
    {label&&<label htmlFor={_id} style={lab}>{label}</label>}
    <Tag id={_id} rows={multiline?rows:undefined} onFocus={()=>setF(true)} onBlur={()=>setF(false)}
      style={{width:'100%',boxSizing:'border-box',height:multiline?'auto':44,padding:multiline?'10px 12px':'0 12px',fontFamily:'var(--font-body)',fontSize:15,color:'var(--text-strong)',background:rest.disabled?'var(--gray-50)':'#fff',
      border:'1.5px solid '+(error?'var(--status-error)':f?'var(--rhm-blue)':'var(--border-strong)'),borderRadius:'var(--radius-sm)',outline:'none',boxShadow:f?'var(--shadow-focus)':'none',resize:'vertical',transition:'border-color var(--dur-fast),box-shadow var(--dur-fast)'}} {...rest}/>
    {(error||hint)&&<div style={hintS(error)}>{error||hint}</div>}
  </div>;
}
