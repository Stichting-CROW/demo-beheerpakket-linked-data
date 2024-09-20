import './Button.css';

interface ButtonProps {
  children: any,
  classes?: string,
  style?: object,
  onClick?: any,
}

const Button = (props: ButtonProps) => {
  return (
    <button className={`Button ${props.classes || ''}`} onClick={props.onClick} style={props.style}>
      {props.children}
    </button>
  )
}

export default Button;
