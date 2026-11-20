import React from 'react';

let filterInjected=false;
function ensureFilter(){
  if(filterInjected||typeof document==='undefined')return;
  filterInjected=true;
  const d=document.createElement('div');
  d.setAttribute('aria-hidden','true');
  d.style.cssText='position:absolute;width:0;height:0;overflow:hidden';
  d.innerHTML='<svg width="0" height="0"><filter id="rhm-liquid-refract" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="2" seed="7" result="n"/><feGaussianBlur in="n" stdDeviation="2" result="nb"/><feDisplacementMap in="SourceGraphic" in2="nb" scale="38" xChannelSelector="R" yChannelSelector="G"/></filter></svg>';
  document.body.appendChild(d);
}
const isChromium=typeof navigator!=='undefined'&&/Chrome\//.test(navigator.userAgent)&&!/Edg\/|OPR\//.test(navigator.userAgent)||false;

export function LiquidGlass({tone='dark',shape='panel',refract=true,interactive=false,radius,padding,as='div',children,style,onClick,...rest}){
  const [h,setH]=React.useState(false);const [p,setP]=React.useState(false);
  React.useEffect(()=>{if(refract)ensureFilter()},[refract]);
  const t={dark:['--glass-dark-fill','--glass-dark-tint','--glass-dark-ring','#fff'],light:['--glass-light-fill','--glass-light-tint','--glass-light-ring','var(--rhm-ink)'],brand:['--glass-brand-fill','--glass-brand-tint','--glass-brand-ring','#fff']}[tone]||[];
  const r=radius??(shape==='pill'?'var(--glass-radius-pill)':shape==='circle'?'50%':'var(--glass-radius)');
  const blur=`blur(var(--glass-blur)) saturate(var(--glass-saturate))`;
  const bf=refract&&isChromium?`url(#rhm-liquid-refract) ${blur}`:blur;
  const Tag=as;
  return <Tag onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>{setH(false);setP(false)}} onMouseDown={()=>setP(true)} onMouseUp={()=>setP(false)} {...rest}
    style={{position:'relative',isolation:'isolate',boxSizing:'border-box',borderRadius:r,padding:padding??(shape==='panel'?'18px 22px':shape==='pill'?'10px 20px':0),
      color:t[3],background:`var(${t[1]}),var(${t[0]})`,backdropFilter:bf,WebkitBackdropFilter:blur,
      boxShadow:`0 0 0 0.5px var(${t[2]}),var(--glass-edge-highlight),var(--glass-edge-shade),${interactive&&h?'var(--glass-drop-lift)':'var(--glass-drop)'}`,
      transform:interactive?(p?'scale(0.97)':h?'translateY(-2px) scale(1.01)':'none'):'none',
      transition:'transform 320ms cubic-bezier(0.34,1.56,0.64,1),box-shadow 240ms var(--ease-standard)',
      cursor:interactive||onClick?'pointer':undefined,overflow:'hidden',...style}}>
    <span aria-hidden="true" style={{position:'absolute',inset:0,borderRadius:'inherit',pointerEvents:'none',zIndex:-1,
      background:'radial-gradient(120% 60% at 30% 0%,rgba(255,255,255,0.18) 0%,rgba(255,255,255,0) 60%)',opacity:tone==='light'?0.9:1}}></span>
    {children}
  </Tag>;
}
