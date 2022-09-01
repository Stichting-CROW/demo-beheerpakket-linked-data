import './FormLabel.css';

interface FormLabelProps {
  id: string,
  label: string,
  children: any,
  infoText?: string
}

const FormLabel = ({
  id,
  label,
  children,
  infoText
}: FormLabelProps) => {
  return (
    <label htmlFor={id} className="FormLabel">
      <b className="label">
        {label}
        {infoText && <span className="infoText">
          ℹ️
        </span>}
      </b>
      <div>
        {children}
      </div>
    </label>
  )
}

export default FormLabel;
