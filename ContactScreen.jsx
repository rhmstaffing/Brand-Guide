function ContactScreen({notify}){
  const {Button,SectionHeading,Input,Select,Radio,Checkbox,Card}=window.RHM;
  const [who,setWho]=React.useState("I'm hiring");
  return <main>
    <section style={{background:'var(--surface-subtle)',padding:'80px 0 96px',position:'relative',overflow:'hidden'}}>
      <img src={A+'lines/wave-blue-01.png'} style={{position:'absolute',left:-200,top:-40,width:1100,opacity:.35,pointerEvents:'none'}}/>
      <div className="wrap" style={{position:'relative',display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(320px,1fr))',gap:64}}>
        <div>
          <SectionHeading eyebrow="Contact" title="Tell us what you need." lead="A recruiter will get back to you within one business day."/>
          <div style={{display:'flex',flexDirection:'column',gap:12,marginTop:32}}>
            <Card icon="phone" title="Call us">Talk to a recruiter at your nearest office.</Card>
            <Card icon="map-pin" title="Offices across the U.S.">Local teams who know your market.</Card>
          </div>
        </div>
        <form onSubmit={e=>{e.preventDefault();notify({title:'Request sent',body:'A recruiter will reach out within one business day.'})}} style={{background:'#fff',borderRadius:'var(--radius-md)',boxShadow:'var(--shadow-md)',padding:36,display:'flex',flexDirection:'column',gap:18}}>
          <Radio direction="row" options={["I'm hiring","I'm looking for work"]} value={who} onChange={setWho}/>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}><Input label="Full name" placeholder="First and last"/><Input label={who==="I'm hiring"?'Work email':'Email'} placeholder="you@email.com"/></div>
          {who==="I'm hiring"?<>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}><Input label="Company"/><Select label="Industry" placeholder="Pick one" options={['Light Industrial','Skilled Trades','Engineering','Embedded Engineering','Architecture Construction','Manufacturing','Life Sciences']}/></div>
            <div><div style={{fontSize:14,fontWeight:500,color:'var(--text-strong)',marginBottom:8}}>Staffing type</div><div style={{display:'flex',gap:20}}><Checkbox label="Temporary"/><Checkbox label="Temp to hire" defaultChecked/><Checkbox label="Direct hire"/></div></div>
          </>:<Select label="What kind of work?" placeholder="Pick one" options={['Light Industrial','Skilled Trades','Engineering','Manufacturing','Life Sciences']}/>}
          <Input label="Anything else?" multiline rows={3} placeholder={who==="I'm hiring"?'Roles, headcount, start date':'Skills, shifts, location'}/>
          <div><Button type="submit" iconRight="arrow-right">Send</Button></div>
        </form>
      </div>
    </section>
  </main>;
}
window.ContactScreen=ContactScreen;
