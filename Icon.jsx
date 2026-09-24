import React from 'react';
export function Icon({name,size=20,color='currentColor',style,...rest}){
  const s=Number(size)||20;
  const url='https://unpkg.com/lucide-static@0.460.0/icons/'+name+'.svg';
  return <span aria-hidden="true" style={{display:'inline-block',width:s,height:s,flex:'none',background:color,WebkitMask:'url('+url+') center/contain no-repeat',mask:'url('+url+') center/contain no-repeat',...style}} {...rest}/>;
}
