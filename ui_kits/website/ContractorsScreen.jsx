const JOBS=[['Forklift Operator','Light Industrial','Aurora, IL','Temporary','$19 to $21/hr'],['Maintenance Technician','Skilled Trades','Elgin, IL','Temp to hire','$28 to $34/hr'],['Controls Engineer','Embedded Engineering','Schaumburg, IL','Direct hire','$95k to $115k'],['QC Lab Technician','Life Sciences','Lake Forest, IL','Temp to hire','$24 to $27/hr']];
function ContractorsScreen({notify}){
  const {Button,SectionHeading,Card,Badge,Tag,Dialog,Input,Select}=window.RHM;
  const [f,setF]=React.useState('All');const [apply,setApply]=React.useState(null);
  const list=JOBS.filter(j=>f==='All'||j[1]===f);
  return <main>
    <Hero bgImg="grain-cyan-streak.jpg" wave="wave-white-01.png" height={460} eyebrow="For contractors" title="Get paid every week." lead="Connecting passionate people with unlimited opportunities. Real benefits for anyone working 30+ hours.">
      <Button variant="inverse" size="lg" iconRight="arrow-down" onClick={()=>window.scrollTo({top:900,behavior:'smooth'})}>See open jobs</Button>
    </Hero>
    <Section>
      <SectionHeading eyebrow="Benefits at a glance" title="Coverage that works for you." lead="Available to eligible full-time contractors working 30+ hours per week."/>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))',gap:16,marginTop:40}}>
        {[['wallet','Weekly pay','Steady cash flow, every week.'],['heart-pulse','Medical','Blue Cross Blue Shield of Illinois. HSA compatible plan available.'],['smile','Dental','Guardian coverage for checkups, fillings, major work and ortho.'],['eye','Vision','Eye exams, glasses, contacts and correction discounts.'],['life-buoy','EAP, 24/7','Support for stress, money, legal and family needs.'],['users','Dependents','Add a spouse and kids up to age 26.'],['tag','Blue365 discounts','Deals on fitness, nutrition, hearing aids and more.'],['handshake','We stay in touch','Check-ins after you start. Help with your resume.']].map(([i,t,d])=><Card key={t} icon={i} title={t}>{d}</Card>)}
      </div>
    </Section>
    <Section bg="var(--surface-subtle)">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'end',gap:24,flexWrap:'wrap'}}>
        <SectionHeading eyebrow="Open jobs" title="Find your next role."/>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>{['All','Light Industrial','Skilled Trades','Embedded Engineering','Life Sciences'].map(t=><Tag key={t} selected={f===t} onClick={()=>setF(t)}>{t}</Tag>)}</div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:12,marginTop:32}}>
        {list.map(j=><div key={j[0]} style={{background:'#fff',border:'1px solid var(--border-subtle)',borderRadius:'var(--radius-md)',padding:'20px 24px',display:'grid',gridTemplateColumns:'minmax(200px,2fr) auto auto auto',gap:20,alignItems:'center'}}>
          <div><div style={{fontFamily:'var(--font-display)',fontWeight:600,fontSize:20,color:'var(--rhm-ink)'}}>{j[0]}</div><div style={{fontSize:14,color:'var(--text-muted)',marginTop:2}}>{j[1]} · {j[2]}</div></div>
          <div><Badge tone={j[3]==='Direct hire'?'brand':j[3]==='Temp to hire'?'sky':'neutral'}>{j[3]}</Badge></div>
          <div style={{fontWeight:600,color:'var(--rhm-navy)'}}>{j[4]}</div>
          <Button size="sm" onClick={()=>setApply(j)}>Apply</Button>
        </div>)}
      </div>
    </Section>
    {apply&&<Dialog title={'Apply: '+apply[0]} onClose={()=>setApply(null)} actions={<><Button variant="ghost" onClick={()=>setApply(null)}>Cancel</Button><Button onClick={()=>{setApply(null);notify({title:'Application sent',body:"A recruiter will text you within 24 hours."})}}>Send application</Button></>}>
      <div style={{display:'flex',flexDirection:'column',gap:14,marginTop:8}}><Input label="Full name" placeholder="First and last"/><Input label="Mobile" placeholder="(555) 555-0100" hint="We text first. It's faster."/><Select label="When can you start?" options={['This week','In 2 weeks','In a month']}/></div>
    </Dialog>}
  </main>;
}
window.ContractorsScreen=ContractorsScreen;
