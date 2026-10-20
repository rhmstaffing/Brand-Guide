function ClientsScreen({go}){
  const {Button,SectionHeading,Card,Tag,Tabs}=window.RHM;
  const [tab,setTab]=React.useState('Retention');
  const C={Retention:['Regular check-ins, resume help, gifts and first day walk-ins keep people engaged.','We stay in touch with contractors after they start, not just before.'],'Conversion eligibility':['Temp to hire lets you test the fit with no long-term risk.','We track attendance and performance so you know who is ready to convert.'],'Time to fill':['Referrals, passive seekers, tech schools and community partners feed our pipeline.','We also partner with closing companies to reach skilled people fast.']};
  return <main>
    <Hero bgImg="grain-cobalt-glow.jpg" wave="wave-white-03.png" height={460} eyebrow="For clients" title="Skilled people. Less hassle." lead="Partner with us today to build the workforce that powers your tomorrow.">
      <Button variant="accent" size="lg" iconRight="arrow-right" onClick={()=>go('contact')}>Request talent</Button>
    </Hero>
    <Section>
      <SectionHeading eyebrow="Your top challenges" title="We built our process around them."/>
      <Tabs style={{marginTop:32}} tabs={Object.keys(C)} value={tab} onChange={setTab}/>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))',gap:16,marginTop:28}}>{C[tab].map(t=><Card key={t} icon="check" variant="tint">{t}</Card>)}</div>
    </Section>
    <Section bg="var(--surface-subtle)">
      <SectionHeading eyebrow="What you get" title="Full service, start to finish."/>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:16,marginTop:40}}>
        {[['clipboard-list','Full onboarding','Payroll, benefits, compliance and orientation.'],['shield-check','Compliance support',"E-Verify, workers' comp, drug and background checks."],['chart-line','Market insights','Salary benchmarks from labor analysis tools and contractor feedback.'],['calendar-check','Weekly touchpoints','Regular check-ins and performance reviews.'],['piggy-bank','Flexible cost','No large upfront fees. Scale up or down.'],['users','Large-scale hiring','We have the capacity to staff big ramps.']].map(([i,t,d])=><Card key={t} icon={i} title={t}>{d}</Card>)}
      </div>
    </Section>
    <Section>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))',gap:48,alignItems:'center'}}>
        <SectionHeading eyebrow="Industries" title="Where we staff."/>
        <div style={{display:'flex',flexWrap:'wrap',gap:10}}>{['Light Industrial','Skilled Trades','Engineering','Embedded Engineering','Architecture Construction','Manufacturing','Life Sciences'].map(t=><Tag key={t}>{t}</Tag>)}</div>
      </div>
    </Section>
  </main>;
}
window.ClientsScreen=ClientsScreen;
