export interface IconButtonProps{
  /** Lucide icon name */
  icon:string;
  /** Accessible label, also shown as tooltip */
  label:string;
  variant?:'ghost'|'solid'|'outline'|'inverse';
  size?:number;
  onClick?:(e:React.MouseEvent)=>void;
  style?:React.CSSProperties;
}
export declare function IconButton(props:IconButtonProps):JSX.Element;
