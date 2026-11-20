/* <rhm-line-wave> : animated ribbon of thin lines that flows like water and loops seamlessly.
   Usage: <script src="assets/motion/line-wave.js"></script>
          <rhm-line-wave lines="48" color="#ffffff" period="20" amplitude="1" style="position:absolute;inset:0"></rhm-line-wave>
   Attributes: lines (count), color, period (seconds per loop), amplitude (multiplier), opacity (max alpha), fade ("right"|"left"|"both"|"none"). */
(()=>{if(customElements.get('rhm-line-wave'))return;
const TAU=Math.PI*2;
class RHMLineWave extends HTMLElement{
  connectedCallback(){
    if(!this.style.display)this.style.display='block';
    this.c=document.createElement('canvas');this.c.style.cssText='width:100%;height:100%;display:block';this.appendChild(this.c);
    this.ctx=this.c.getContext('2d');this.t0=performance.now();this.ro=new ResizeObserver(()=>this.size());this.ro.observe(this);this.size();
    this.rm=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const loop=n=>{this.draw((n-this.t0)/1000);if(!this.rm)this.raf=requestAnimationFrame(loop)};this.raf=requestAnimationFrame(loop);
  }
  disconnectedCallback(){cancelAnimationFrame(this.raf);this.ro&&this.ro.disconnect()}
  size(){const d=Math.min(window.devicePixelRatio||1,2),r=this.getBoundingClientRect();this.w=r.width;this.h=r.height;this.c.width=Math.max(1,r.width*d);this.c.height=Math.max(1,r.height*d);this.ctx.setTransform(d,0,0,d,0,0);this.draw(((performance.now()-(this.t0||performance.now()))/1000))}
  draw(s){
    const {ctx,w,h}=this;if(!w||!h)return;
    const N=+this.getAttribute('lines')||40,P=+this.getAttribute('period')||20,A=+(this.getAttribute('amplitude')||1),col=this.getAttribute('color')||'#ffffff',op=+(this.getAttribute('opacity')||0.35),fade=this.getAttribute('fade')||'right';
    const tau=(s%P)/P;ctx.clearRect(0,0,w,h);
    const g=ctx.createLinearGradient(0,0,w,0);const a=x=>col+Math.round(x*255).toString(16).padStart(2,'0');
    if(fade==='right'){g.addColorStop(0,a(op));g.addColorStop(.55,a(op*.45));g.addColorStop(1,a(op*.18))}
    else if(fade==='left'){g.addColorStop(0,a(op*.18));g.addColorStop(.45,a(op*.45));g.addColorStop(1,a(op))}
    else if(fade==='both'){g.addColorStop(0,a(0));g.addColorStop(.2,a(op));g.addColorStop(.8,a(op));g.addColorStop(1,a(0))}
    else{g.addColorStop(0,a(op));g.addColorStop(1,a(op))}
    ctx.strokeStyle=g;ctx.lineWidth=1;
    const steps=Math.max(80,Math.round(w/6));
    for(let i=0;i<N;i++){const k=i/(N-1),kc=k-.5;ctx.beginPath();
      for(let j=0;j<=steps;j++){const x=j/steps,X=-0.02*w+x*w*1.04;
        const base=.12*Math.sin(TAU*(x*.85+tau)+.4)+.07*Math.sin(TAU*(x*1.6-2*tau)+1.3)+.05*Math.sin(TAU*(x*.4+tau)+2.1);
        const spread=.46*(.18+.82*(.5+.5*Math.sin(TAU*(x*.9-tau)+.9)));
        const twist=Math.cos(TAU*(x*.7+tau)+kc*.6);
        const y=h*(.5+A*(base+kc*spread*twist+.015*Math.sin(TAU*(x*2.3+3*tau)+k*3)));
        j?ctx.lineTo(X,y):ctx.moveTo(X,y)}
      ctx.stroke()}
  }
}
customElements.define('rhm-line-wave',RHMLineWave);})();
