function CareersScreen({go,notify}){
  const {Button,SectionHeading,Card,Badge}=window.RHM;
  return <main>
    <Hero bgImg="glass-texture.jpg" wave={null} height={500} eyebrow="Careers at RHM · Now hiring recruiters" title="No cap on commission. Seriously." lead="Zero to one year of experience? Perfect. We train you on the job and pay you for every win.">
      <Button variant="accent" size="lg" iconRight="arrow-right" onClick={()=>notify({title:"You're in the queue",body:'Our team will reach out this week.'})}>Apply to be a recruiter</Button>
      <Button variant="outlineInverse" size="lg" onClick={()=>window.scrollTo({top:560,behavior:'smooth'})}>What's in it for me?</Button>
    </Hero>
    <Section>
      <SectionHeading eyebrow="The perks" title="Base pay, plus a lot more."/>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:16,marginTop:40}}>
        {[['banknote','Base + uncapped commission + bonus','You close it, you earn it. No ceiling.'],['graduation-cap','On-the-job training','Learn sales and recruiting from people who crush it.'],['rocket','Fast track to leadership','Hit your numbers and move up quick.'],['plane','Incentive trips','Top performers travel. On us.'],['heart-pulse','Full benefits','Medical, dental and vision from day one of eligibility.'],['piggy-bank','401(k) match','Future you says thanks.']].map(([i,t,d])=><Card key={t} icon={i} title={t} interactive>{d}</Card>)}
      </div>
    </Section>
    <section style={{background:'var(--rhm-navy) url('+A+'backgrounds/fluted-glass.jpg) center/cover',padding:'96px 0'}}>
      <div className="wrap" style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))',gap:48,alignItems:'center'}}>
        <SectionHeading tone="dark" titleFace="title" eyebrow="The vibe" title="Build your future with a team that invests in your success."/>
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <Card variant="glass" title="You'll talk to people all day">Clients who need help and people who need work. You connect them.</Card>
          <Card variant="glass" title="Your wins are visible">Turning potential into opportunity, one hire at a time.</Card>
          <div><Badge tone="sky">Entry level · 0 to 1 years</Badge></div>
        </div>
      </div>
    </section>
  </main>;
}
window.CareersScreen=CareersScreen;
