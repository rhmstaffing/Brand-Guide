export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement>{
  label?:string;
  hint?:string;
  error?:string;
  options:(string|{value:string;label:string})[];
  placeholder?:string;
}
export declare function Select(props:SelectProps):JSX.Element;
