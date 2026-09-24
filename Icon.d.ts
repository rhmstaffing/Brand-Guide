export interface IconProps{
  /** Lucide icon name in kebab-case, e.g. "arrow-right", "hard-hat", "shield-check" */
  name:string;
  size?:number;
  color?:string;
  style?:React.CSSProperties;
}
export declare function Icon(props:IconProps):JSX.Element;
