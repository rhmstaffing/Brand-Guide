export interface BadgeProps{
  tone?:'info'|'success'|'warning'|'error'|'neutral'|'brand'|'sky';
  dot?:boolean;
  children?:React.ReactNode;
  style?:React.CSSProperties;
}
export declare function Badge(props:BadgeProps):JSX.Element;
