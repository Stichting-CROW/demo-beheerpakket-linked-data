import {useState, useEffect, useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DatalistInput from 'react-datalist-input';
import 'react-datalist-input/dist/styles.css';

// Import components
import Button from '../Button';
import FormLabel from '../FormLabel/FormLabel.jsx';
import FormInput from '../FormInput/FormInput.jsx';

// Import helper functions
import {
  getKern,
  getFysicalObjects,
  getAttributesForClass
} from '../../api/imbor'
import {
  makeTriple,
  makeTriplesObject,
  getUniquePhysicalObjects
} from '../../helpers/triples.js';
import {
  selectPhysicalObjects,
  setPhysicalObjects
} from './editObjectSlice';

import '../MapTools.css'

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
        // Check if attributeLabel exists
        if(! triple['entry_text'].value) return;
        // Define ID
        const id = `js-attributeLabel-${triple['entry_text'].value}`;
        return <div
          key={id}
          data-name="attribute"
          title={triple['entry_definition'] ? triple['entry_definition'].value : ''}
        >
          <FormLabel id={id} title={triple['entry_text'].value}>
            <FormInput
              id={id}
              type="text"
              name={triple['entry_text'].value}
            />
          </FormLabel>
        </div>
      })}
    </div>
  )
}

const selectedObjectTypeLocation = true;

const EditObject = () => {
  // Define state variables
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [attributes, setAttributes] = useState([]);
  const [selectedObjectType, setSelectedObjectType] = useState<string>('');

  // Get store variables
  const physicalObjects = useSelector(selectPhysicalObjects);
  const dispatch = useDispatch();

  // Fetch fysical objects
  const fetchFysicalObjects = async () => {
    const response = await getFysicalObjects()
    const uniqueTriples = getUniquePhysicalObjects(response.results.bindings);
    dispatch(setPhysicalObjects(uniqueTriples))
  }

  // Fetch attributes for a specific FysicalObject class
  const fetchAttributesForClass = async (classUri: string) => {
    if(! classUri) return;
    const response = await getAttributesForClass(classUri);
    const triples = makeTriplesObject(response);
    setAttributes(triples);
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

  if(! physicalObjects || physicalObjects.length <= 0) {
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
        id: objects[x]['label'].value,
        value: objects[x]['label'].value,
        label: objects[x]['classURI'].value
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
        items={prepareForDataList(physicalObjects)}
      />
      {selectedObjectType}

      {selectedObjectType && ! selectedObjectTypeLocation && <p>
        Plaats het object op de kaart
      </p>}

      {selectedObjectType && selectedObjectTypeLocation && <div style={{margin: '15px 0'}}>
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
