export interface TooltipProps{
  content:React.ReactNode;
  children:React.ReactNode;
  placement?:'top'|'bottom';
  /** Force open (for docs) */
  open?:boolean;
}
export declare function Tooltip(props:TooltipProps):JSX.Element;
