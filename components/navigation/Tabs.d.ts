export interface TabsProps{
  tabs:(string|{value:string;label:string})[];
  value?:string;
  defaultValue?:string;
  onChange?:(value:string)=>void;
  tone?:'light'|'dark';
  style?:React.CSSProperties;
}
export declare function Tabs(props:TabsProps):JSX.Element;
