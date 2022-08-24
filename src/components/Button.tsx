import './Button.css';

interface ButtonProps {
  children: any,
  classes?: string,
  onClick?: any,
}

const Button = (props: ButtonProps) => {
  return (
    <button className={`Button ${props.classes || ''}`} onClick={props.onClick}>
      {props.children}
    </button>
  )
}

export default Button;
