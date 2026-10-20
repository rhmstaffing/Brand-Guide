export interface RadioProps{
  name?:string;
  options:(string|{value:string;label:string})[];
  value?:string;
  defaultValue?:string;
  onChange?:(value:string)=>void;
  direction?:'row'|'column';
  style?:React.CSSProperties;
}
export declare function Radio(props:RadioProps):JSX.Element;
