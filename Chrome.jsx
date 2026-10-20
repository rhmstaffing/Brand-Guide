const NAV=[['clients','For clients'],['contractors','For contractors'],['careers','Careers at RHM'],['contact','Contact']];
function SiteHeader({page,go}){
  const {Logo,Button,IconButton}=window.RHM;
  const [s,setS]=React.useState(false);const [open,setOpen]=React.useState(false);
  const [narrow,setNarrow]=React.useState(()=>window.innerWidth<1040);
  React.useEffect(()=>{const f=()=>setNarrow(window.innerWidth<1040);window.addEventListener('resize',f);return()=>window.removeEventListener('resize',f)},[]);
  React.useEffect(()=>{const f=()=>setS(window.scrollY>10);window.addEventListener('scroll',f);return()=>window.removeEventListener('scroll',f)},[]);
  return <header style={{position:'sticky',top:0,zIndex:100,background:'#fff',borderBottom:'1px solid '+(s?'var(--border-subtle)':'transparent'),boxShadow:s?'var(--shadow-sm)':'none',transition:'box-shadow .2s'}}>
    <div className="wrap" style={{height:76,display:'flex',alignItems:'center',gap:32}}>
      <a onClick={()=>go('home')} style={{cursor:'pointer'}}><Logo width={narrow?190:230} basePath="../../"/></a>
      {narrow?<div style={{marginLeft:'auto',display:'flex',gap:8,alignItems:'center'}}><Button size="sm" onClick={()=>go('contact')}>Request talent</Button><IconButton icon={open?'x':'menu'} label="Menu" onClick={()=>setOpen(!open)}/></div>:<>
      <nav style={{display:'flex',gap:28,marginLeft:'auto'}}>{NAV.map(([k,l])=><a key={k} onClick={()=>go(k)} style={{cursor:'pointer',whiteSpace:'nowrap',fontSize:15,fontWeight:page===k?600:500,color:page===k?'var(--rhm-blue)':'var(--rhm-ink)',textDecoration:'none',paddingBottom:4,borderBottom:'2px solid '+(page===k?'var(--rhm-blue)':'transparent')}}>{l}</a>)}</nav>
      <Button size="sm" onClick={()=>go('contact')}>Request talent</Button></>}
    </div>
    {narrow&&open&&<nav className="wrap" style={{display:'flex',flexDirection:'column',padding:'8px 32px 16px',borderTop:'1px solid var(--border-subtle)'}}>{NAV.map(([k,l])=><a key={k} onClick={()=>{go(k);setOpen(false)}} style={{cursor:'pointer',padding:'12px 0',fontSize:16,fontWeight:page===k?600:500,color:page===k?'var(--rhm-blue)':'var(--rhm-ink)'}}>{l}</a>)}</nav>}
  </header>;
}
function SiteFooter({go}){
  const {Logo,Icon}=window.RHM;
  const col=(h,items)=><div><div style={{fontFamily:'var(--font-display)',fontWeight:600,fontSize:12,letterSpacing:'.18em',textTransform:'uppercase',color:'var(--rhm-sky)',marginBottom:14}}>{h}</div>{items.map(([l,p])=><div key={l} style={{marginBottom:10}}><a onClick={()=>p&&go(p)} style={{color:'var(--text-on-dark-muted)',fontSize:14,cursor:'pointer'}}>{l}</a></div>)}</div>;
  return <footer style={{background:'var(--rhm-ink)',color:'#fff',position:'relative',overflow:'hidden'}}>
    <img src={A+'lines/wave-white-wide-02.png'} style={{position:'absolute',right:-200,bottom:-60,width:1100,opacity:.12,pointerEvents:'none'}}/>
    <div className="wrap" style={{position:'relative',padding:'64px 32px 32px',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:32}}>
      <div><Logo tone="white" width={230} basePath="../../"/><p style={{marginTop:18,fontSize:14,color:'var(--text-on-dark-muted)',maxWidth:280}}>The best talent won't come to you. We bring them to you.</p></div>
      {col('Clients',[['Industries','clients'],['Staffing types','clients'],['Request talent','contact']])}
      {col('Contractors',[['Benefits','contractors'],['Find a job','contractors'],['Apply','contractors']])}
      {col('Company',[['Careers at RHM','careers'],['Contact','contact'],['Offices','contact']])}
    </div>
    <div className="wrap" style={{position:'relative',padding:'20px 32px 28px',borderTop:'1px solid var(--border-on-dark)',display:'flex',justifyContent:'space-between',fontSize:13,color:'var(--text-on-dark-muted)'}}><span>© 2026 RHM Staffing Solutions</span><span style={{display:'flex',gap:14}}><Icon name="linkedin" size={18}/><Icon name="instagram" size={18}/><Icon name="facebook" size={18}/></span></div>
  </footer>;
}
function Section({bg='#fff',children,style,pad=96}){return <section style={{background:bg,padding:pad+'px 0',position:'relative',overflow:'hidden',...style}}><div className="wrap" style={{position:'relative'}}>{children}</div></section>}
function Hero({bgImg,eyebrow,title,lead,children,wave='wave-white-02.png',height=560}){
  return <section style={{position:'relative',minHeight:height,display:'flex',alignItems:'center',background:'var(--rhm-navy) url('+A+'backgrounds/'+bgImg+') center/cover',overflow:'hidden'}}>
    <div style={{position:'absolute',inset:0,background:'var(--gradient-protect)'}}/>
    {wave&&<img src={A+'lines/'+wave} style={{position:'absolute',right:-120,bottom:-80,width:900,opacity:.45,pointerEvents:'none'}}/>}
    <div className="wrap" style={{position:'relative',width:'100%',padding:'80px 32px'}}>
      <div style={{maxWidth:640}}>
        <div style={{fontFamily:'var(--font-display)',fontWeight:600,fontSize:13,letterSpacing:'.18em',textTransform:'uppercase',color:'var(--rhm-sky)'}}>{eyebrow}</div>
        <h1 style={{fontFamily:'var(--font-title)',fontWeight:400,fontSize:'clamp(52px,7vw,84px)',lineHeight:.98,letterSpacing:'.03em',color:'#fff',margin:'14px 0 0',textTransform:'uppercase'}}>{title}</h1>
        {lead&&<p style={{fontSize:20,lineHeight:1.5,color:'var(--text-on-dark-muted)',marginTop:20,maxWidth:520}}>{lead}</p>}
        {children&&<div style={{display:'flex',gap:12,marginTop:32}}>{children}</div>}
      </div>
    </div>
  </section>;
}
Object.assign(window,{SiteHeader,SiteFooter,Section,Hero});
