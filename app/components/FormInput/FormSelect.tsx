// import './FormInput.css';

const FormSelect = ({
  id,
  name,
  options
}) => {
  return (
    <select
      id={id}
      name={name}
      className="FormInput"
      style={{paddingTop: '6px'}}
    >
      <option></option>
      {options.map(x => <option key={x.entry_iri} value={x.entry_iri}>
        {x.entry_text}
      </option>)}
    </select>
  )
}

export default FormSelect;
