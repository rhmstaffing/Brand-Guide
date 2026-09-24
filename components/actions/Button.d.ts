/**
 * @startingPoint section="Actions" subtitle="Primary, accent, secondary, ghost and inverse buttons" viewport="700x300"
 */
export interface ButtonProps{
  variant?:'primary'|'accent'|'secondary'|'ghost'|'inverse'|'outlineInverse';
  size?:'sm'|'md'|'lg';
  /** Lucide icon name */
  iconLeft?:string;
  iconRight?:string;
  disabled?:boolean;
  fullWidth?:boolean;
  children?:React.ReactNode;
  onClick?:(e:React.MouseEvent)=>void;
  style?:React.CSSProperties;
}
export declare function Button(props:ButtonProps):JSX.Element;
