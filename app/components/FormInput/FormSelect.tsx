// import './FormInput.css';

function FormSelect({
  id,
  name,
  options
}: {
  id: string;
  name: string;
  options: any[];
}) {
  return (
    <select
      id={id}
      name={name}
      className="FormInput"
      style={{ paddingTop: '6px' }}
    >
      <option></option>
      {options.map(x => <option key={x.entry_iri} value={x.entry_iri}>
        {x.entry_text}
      </option>)}
    </select>
  );
}

export default FormSelect;
