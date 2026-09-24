export interface SectionHeadingProps{
  eyebrow?:string;
  title:React.ReactNode;
  lead?:React.ReactNode;
  align?:'left'|'center';
  tone?:'light'|'dark';
  /** display = Josefin Sans sentence case, title = RHM Title uppercase */
  titleFace?:'display'|'title';
  style?:React.CSSProperties;
}
export declare function SectionHeading(props:SectionHeadingProps):JSX.Element;
