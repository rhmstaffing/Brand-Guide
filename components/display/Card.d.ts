/**
 * @startingPoint section="Display" subtitle="Feature, benefit and industry cards" viewport="700x340"
 */
export interface CardProps{
  /** Lucide icon name shown in a tinted square */
  icon?:string;
  eyebrow?:string;
  title?:React.ReactNode;
  children?:React.ReactNode;
  footer?:React.ReactNode;
  variant?:'outline'|'elevated'|'tint'|'dark'|'glass';
  /** Lift + shadow on hover */
  interactive?:boolean;
  onClick?:()=>void;
  style?:React.CSSProperties;
}
export declare function Card(props:CardProps):JSX.Element;
