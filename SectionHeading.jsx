import React from 'react';
export function SectionHeading({eyebrow,title,lead,align='left',tone='light',titleFace='display',style}){
  const dark=tone==='dark';
  return <div style={{textAlign:align,maxWidth:align==='center'?760:680,margin:align==='center'?'0 auto':0,...style}}>
    {eyebrow&&<div style={{fontFamily:'var(--font-display)',fontWeight:600,fontSize:'var(--fs-eyebrow)',letterSpacing:'var(--ls-eyebrow)',textTransform:'uppercase',color:dark?'var(--rhm-sky)':'var(--rhm-blue)',marginBottom:10}}>{eyebrow}</div>}
    <h2 style={titleFace==='title'
      ?{fontFamily:'var(--font-title)',fontWeight:400,fontSize:'var(--fs-h1)',lineHeight:1,letterSpacing:'var(--ls-title)',textTransform:'uppercase',margin:0,color:dark?'#fff':'var(--rhm-navy)'}
      :{fontFamily:'var(--font-display)',fontWeight:600,fontSize:'var(--fs-h2)',lineHeight:'var(--lh-heading)',margin:0,color:dark?'#fff':'var(--rhm-ink)',textWrap:'balance'}}>{title}</h2>
    {lead&&<p style={{fontSize:'var(--fs-lead)',lineHeight:1.5,margin:'14px 0 0',color:dark?'var(--text-on-dark-muted)':'var(--text-body)',textWrap:'pretty'}}>{lead}</p>}
  </div>;
}
