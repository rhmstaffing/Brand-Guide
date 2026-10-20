export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>{
  label?:string;
  hint?:string;
  /** Error message; turns the border red */
  error?:string;
  multiline?:boolean;
  rows?:number;
}
export declare function Input(props:InputProps):JSX.Element;
