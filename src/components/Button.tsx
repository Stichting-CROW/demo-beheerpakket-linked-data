import './Button.css';

interface ButtonProps {
  children: any,
  onClick?: any
}

const Button = (props: ButtonProps) => {
  return (
    <button className="Button" onClick={props.onClick}>
      {props.children}
    </button>
  )
}

export default Button;
