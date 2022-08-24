import './FormLabel.css';

const FormLabel = ({
  id,
  title,
  children
}) => {
  return (
    <label htmlFor={id} className="FormLabel">
      <b className="label">
        {title}
      </b>
      <div>
        {children}
      </div>
    </label>
  )
}

export default FormLabel;