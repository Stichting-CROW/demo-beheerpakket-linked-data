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

import './MapTools.css'

interface ImborResponse {
  head: object,
  results: {
    bindings: Array<string>
  }
}

const getLabel = (object: any) => object.label.value;
const getUri = (object: any) => object.classURI.value;

const EditObject = () => {
  // Define state variables
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [fysicalObjectsArray, setFysicalObjectsArray] = useState([]);
  const [attributesArray, setAttributesArray] = useState([]);
  const [selectedObjectType, setSelectedObjectType] = useState<string>('');

  const fetchFysicalObjects = async () => {
    const response = await getFysicalObjects()

    let objects: any = [];
    Object.keys(response.results.bindings).forEach((key) => {
      const obj = response.results.bindings[key];
      const label = getLabel(obj);
      const uri = getUri(obj);
      objects.push({
        id: label,
        value: label,
        label: uri
      })
    })
    console.log('response', response)
    setFysicalObjectsArray(objects);
  }

  const fetchAttributesForClass = async (classUri: string) => {
    if(! classUri) return;
    const attributes = await getAttributesForClass(classUri);
    console.log(attributes)
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

  if(! fysicalObjectsArray || fysicalObjectsArray.length <= 0) {
    return (
      <div className="EditObject">
        Bezig met laden van objecttypen...
      </div>
    )
  }

  return (
    <div className="EditObject">
      <DatalistInput
        placeholder="Objecttype"
        label="Selecteer een objecttype"
        onSelect={(item) => {
          console.log('item', item)
          setSelectedObjectType(item.label || '')
        }}
        items={fysicalObjectsArray}
      />
      {selectedObjectType && <div style={{margin: '15px 0'}}>
        Hier verschijnen de in te vullen attributen.
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
