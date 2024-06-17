import FormLabel from '../FormLabel/FormLabel';
import FormInput from '../FormInput/FormInput.jsx';
import { useEffect, useState } from 'react';
import { getEnumsForAttribute } from '../../api/common';
import FormSelect from '../FormInput/FormSelect';

const Attribute = ({
  data
}) => {
  const [enumValues, setEnumValues] = useState([]);

  // Load data type or enum values
  useEffect(() => {
    if(! data) return;
    if(! data.entry_iri) return;
    if(! data.entry_iri.value) return;

    (async () => {
      const result = await getEnumsForAttribute(data.entry_iri.value);
      // Remove duplicates
      let uniqueIris: any[] = [];
      let uniqueTriples: any[] = [];
      result?.forEach((x: any) => {
        if(uniqueIris.indexOf(x.entry_iri) > -1) return false;
        uniqueIris.push(x.entry_iri)

        uniqueTriples.push(x);
      });
      // Set in state
      setEnumValues(uniqueTriples);
    })();
  }, [
    data
  ]);
  
  // Basic validation
  if(! data['entry_text'] || ! data['entry_text'].value) return;

  // Define ID
  const id = `js-attribute-input-${data['entry_text'].value}`;

  const hasEnumList = enumValues && enumValues.length > 0;

  return <div
    key={id}
    data-name="attribute"
  >
    <FormLabel
      id={id}
      label={data['entry_text'].value}
      infoText={data['entry_definition'] ? data['entry_definition'].value : ''}
      >
      {! hasEnumList && <FormInput
        id={id}
        type="text"
        name={data['entry_text'].value}
      />}

      {hasEnumList && <FormSelect
        id={id}
        name={data['entry_text'].value}
        options={enumValues}
      />}
    </FormLabel>
  </div>
}

export default Attribute;
