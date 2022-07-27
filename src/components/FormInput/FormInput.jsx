import './FormInput.css';

const FormInput = ({
  id,
  type,
  name
}) => {
  return (
    <input
      id={id}
      type={type || 'text'}
      name={name}
      className="FormInput"
      placeholder="Vul een waarde in"
    />
  )
}

export default FormInput;
