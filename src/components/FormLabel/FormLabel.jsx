import './FormLabel.css';

const FormLabel = ({
  id,
  title,
  children
}) => {
  return (
    <label htmlFor={id} className="FormLabel">
      <b>
        {title}
      </b>
      <div>
        {children}
      </div>
    </label>
  )
}

export default FormLabel;