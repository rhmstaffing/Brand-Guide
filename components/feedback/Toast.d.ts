export interface ToastProps{
  tone?:'success'|'info'|'warning'|'error';
  title?:React.ReactNode;
  children?:React.ReactNode;
  onClose?:()=>void;
  style?:React.CSSProperties;
}
export declare function Toast(props:ToastProps):JSX.Element;
