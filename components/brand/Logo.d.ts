export interface LogoProps{
  /** blue for light surfaces, white for navy/ink/photo surfaces */
  tone?:'blue'|'white';
  width?:number|string;
  /** Path prefix to the design-system root, e.g. "../../" */
  basePath?:string;
  style?:React.CSSProperties;
}
export declare function Logo(props:LogoProps):JSX.Element;
