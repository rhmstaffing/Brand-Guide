export interface DialogProps{
  open?:boolean;
  title?:React.ReactNode;
  children?:React.ReactNode;
  /** Buttons, right aligned */
  actions?:React.ReactNode;
  onClose?:()=>void;
  width?:number;
  /** Render the panel without the fixed overlay (for docs and cards) */
  inline?:boolean;
}
export declare function Dialog(props:DialogProps):JSX.Element|null;
