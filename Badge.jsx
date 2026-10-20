import React from 'react';
const T={info:['var(--status-info-bg)','var(--status-info)'],success:['var(--status-success-bg)','var(--status-success)'],warning:['var(--status-warning-bg)','var(--status-warning)'],error:['var(--status-error-bg)','var(--status-error)'],neutral:['var(--gray-100)','var(--gray-700)'],brand:['var(--rhm-navy)','#fff'],sky:['var(--rhm-sky)','var(--rhm-ink)']};
export function Badge({tone='info',dot=false,children,style}){
  const [bg,fg]=T[tone]||T.info;
  return <span style={{display:'inline-flex',alignItems:'center',gap:6,height:24,padding:'0 10px',borderRadius:'var(--radius-xs)',background:bg,color:fg,fontSize:12,fontWeight:600,letterSpacing:'0.02em',whiteSpace:'nowrap',...style}}>
    {dot&&<span style={{width:6,height:6,borderRadius:'50%',background:'currentColor'}}/>}{children}
  </span>;
}
