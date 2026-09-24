import React from 'react';
const SRC={blue:'assets/logo/rhm-horizontal-blue.png',white:'assets/logo/rhm-horizontal-white.png'};
export function Logo({tone='blue',width=220,basePath='',style,...rest}){
  return <img src={basePath+SRC[tone]} alt="RHM Staffing Solutions" style={{width,height:'auto',display:'block',...style}} {...rest}/>;
}
