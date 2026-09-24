export interface TagProps{
  icon?:string;
  selected?:boolean;
  onClick?:()=>void;
  tone?:'light'|'dark';
  children?:React.ReactNode;
  style?:React.CSSProperties;
}
export declare function Tag(props:TagProps):JSX.Element;
