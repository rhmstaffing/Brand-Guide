const INDUSTRIES=[['hard-hat','Light Industrial','Warehouse, assembly, forklift, shipping and receiving.'],['wrench','Skilled Trades','Electricians, welders, HVAC, maintenance techs.'],['drafting-compass','Engineering','Mechanical, electrical, process and quality engineers.'],['cpu','Embedded Engineering','Firmware, controls, PLC and hardware test.'],['building-2','Architecture Construction','Project managers, estimators, superintendents.'],['factory','Manufacturing','Machine operators, CNC, production leads.'],['flask-conical','Life Sciences','Lab techs, QA and QC, validation specialists.']];
function HomeScreen({go}){
  const {Button,SectionHeading,Card,Badge}=window.RHM;
  return <main>
    <Hero bgImg="grain-navy-sky.jpg" eyebrow="Staffing for the trades and engineering" title={<>The best talent won't come to you.<br/>We bring them to you.</>} lead="Temporary, temp to hire and direct hire staffing. Screened people who show up ready to work.">
      <Button variant="accent" size="lg" iconRight="arrow-right" onClick={()=>go('contact')}>Request talent</Button>
      <Button variant="outlineInverse" size="lg" onClick={()=>go('contractors')}>Find a job</Button>
    </Hero>
    <Section>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))',gap:64,alignItems:'end',marginBottom:48}}>
        <SectionHeading eyebrow="Industries we staff" title="We know the work, so we know who fits."/>
        <p style={{fontSize:18,color:'var(--text-body)'}}>We learn the daily tasks and project scope of every role. That is how we match the right person to the right job, the first time.</p>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))',gap:16}}>
        {INDUSTRIES.map(([i,t,d])=><Card key={t} icon={i} title={t} interactive onClick={()=>go('clients')}>{d}</Card>)}
        <Card variant="dark" title="Not sure where you fit?" footer={<Button variant="accent" size="sm" onClick={()=>go('contact')}>Talk to us</Button>}>Tell us the role. We'll tell you how we'd fill it.</Card>
      </div>
    </Section>
    <Section bg="var(--surface-subtle)">
      <SectionHeading align="center" eyebrow="How we screen" title="Four steps. Every role." lead="Same process whether it's a forklift operator or a PLC engineer."/>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))',gap:16,marginTop:48}}>
        {[['phone','Phone screen','We confirm skills, pay range and availability.'],['users','In-person interview','We meet every candidate face to face.'],['clipboard-check','Orientation','Safety, site rules and first day details.'],['shield-check','Reference checks','We call past employers before you do.']].map(([i,t,d],n)=><Card key={t} variant="elevated" icon={i} eyebrow={'Step '+(n+1)} title={t}>{d}</Card>)}
      </div>
    </Section>
    <section style={{position:'relative',background:'var(--rhm-ink) url('+A+'backgrounds/grain-midnight-arc.jpg) center/cover',padding:'96px 0',overflow:'hidden'}}>
      <div className="wrap" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))',gap:64,alignItems:'center',position:'relative'}}>
        <SectionHeading tone="dark" titleFace="title" eyebrow="Three ways to hire" title="Hire how you need to."/>
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {[['Temporary','Cover peaks, projects and call-offs. Scale up or down week to week.'],['Temp to hire','Try the fit first. Convert when you are ready.'],['Direct hire','We find, screen and hand you a finalist. You hire them.']].map(([t,d])=><Card key={t} variant="glass" title={t}>{d}</Card>)}
        </div>
      </div>
    </section>
    <Section>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))',gap:16}}>
        <Card variant="tint" eyebrow="For clients" title="Need people fast?" footer={<Button iconRight="arrow-right" onClick={()=>go('clients')}>See how we work</Button>}>No large upfront fees. Weekly check-ins. Support for large-scale hiring.</Card>
        <Card variant="tint" eyebrow="For contractors" title="Looking for steady work?" footer={<Button variant="secondary" iconRight="arrow-right" onClick={()=>go('contractors')}>See benefits</Button>}>Weekly pay, medical, dental and vision. We check in after you start, too.</Card>
      </div>
    </Section>
  </main>;
}
window.HomeScreen=HomeScreen;
