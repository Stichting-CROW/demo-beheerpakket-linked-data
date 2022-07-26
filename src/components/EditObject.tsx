import {useState, useEffect, useRef} from 'react';
import DatalistInput from 'react-datalist-input';
import 'react-datalist-input/dist/styles.css';

// Import components
import Button from './Button';

// Import helper functions
import {
  getKern,
  getFysicalObjects,
  getAttributesForClass
} from '../api/imbor'
import {
  makeTriple,
  makeBindingsObject
} from '../helpers/triples.js';

import './MapTools.css'

interface ImborResponse {
  head: object,
  results: {
    bindings: Array<string>
  }
}

const Attributes = ({data}) => {
  if(! data || data.length <= 0) return <></>;

  return (
    <div data-name="attributes">
      {data.map(triple => {
        console.log('attributeURI', triple.get('attributeURI'))
        // Check if attributeLabel exists
        if(! triple.get('attributeLabel')) return;
        // Define ID
        const id = `js-attributeLabel-${triple.get('attributeLabel')}`;
        return <div
          key={id}
          data-name="attribute"
          title={triple.get('attributeDefinition')}
        >
          <label htmlFor={id}>
            {triple.get('attributeLabel')}
          </label>
          <input
            id={id}
            type="text"
            name={triple.get('attributeLabel')}
          />
        </div>
      })}
    </div>
  )
}

const EditObject = () => {
  // Define state variables
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [fysicalObjects, setFysicalObjects] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [selectedObjectType, setSelectedObjectType] = useState<string>('');

  // Fetch fysical objects
  const fetchFysicalObjects = async () => {
    const response = await getFysicalObjects()
    const bindings = makeBindingsObject(response);
    setFysicalObjects(bindings);
  }

  // Fetch attributes for a specific FysicalObject class
  const fetchAttributesForClass = async (classUri: string) => {
    if(! classUri) return;
    const response = await getAttributesForClass(classUri);
    const bindings = makeBindingsObject(response);
    setAttributes(bindings);
  }

  // Function that runs if component loads
  useEffect(() => {
    fetchFysicalObjects()
  }, [])

  // Function that runs if selected object type changes
  useEffect(() => {
    if(selectedObjectType === null) return;

    fetchAttributesForClass(selectedObjectType);
  }, [selectedObjectType])

  if(! fysicalObjects || fysicalObjects.length <= 0) {
    return (
      <div className="EditObject">
        Bezig met laden van objecttypen...
      </div>
    )
  }

  // Function that prepares data to be used for DatalistInput
  const prepareForDataList = (objects) => {
    let ret: any = [];
    for(let x in objects) {
      ret.push({
        id: objects[x].get('label'),
        value: objects[x].get('label'),
        label: objects[x].get('classURI')
      });
    }
    return ret;
  }

  return (
    <div className="EditObject">
      <DatalistInput
        placeholder="Objecttype"
        label="Selecteer een objecttype"
        onSelect={(item) => {
          setSelectedObjectType(item.label || '')
        }}
        items={prepareForDataList(fysicalObjects)}
      />
      {selectedObjectType && <div style={{margin: '15px 0'}}>
        <Attributes data={attributes} />
        <div style={{margin: '15px 0'}}>
          <Button>
            Opslaan
          </Button>
        </div>
      </div>}
    </div>
  )
}

export default EditObject;
