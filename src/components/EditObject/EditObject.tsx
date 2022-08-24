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
        if(! triple['entry_text'] || ! triple['entry_text'].value) return;
        // Define ID
        const id = `js-attribute-input-${triple['entry_text'].value}`;
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
            <small>
              {triple['entry_definition'] ? triple['entry_definition'].value : ''}
            </small>
          </FormLabel>
        </div>
      })}
    </div>
  )
}

const selectedObjectTypeLocation = true;

type lngLat = [number, number][];

const EditObject = () => {
  // Define state variables
  const [counter, setCounter] = useState(0);
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [attributes, setAttributes] = useState([]);
  const [locationOnMap, setLocationOnMap] = useState<lngLat>([]);
  const [selectedObjectType, setSelectedObjectType] = useState<any>();

  // Get store variables
  const physicalObjects = useSelector(selectPhysicalObjects);
  const dispatch = useDispatch();

  // Fetch fysical objects
  const fetchFysicalObjects = async () => {
    const response = await getFysicalObjects()
    if(! response) {
      // window['notify']('Error loading fysical objects')
      return;
    }
    const uniqueTriples = getUniquePhysicalObjects(response.results.bindings);
    dispatch(setPhysicalObjects(uniqueTriples))
  }

  // Fetch attributes for a specific FysicalObject class
  const fetchAttributesForClass = async (classUri: string) => {
    if(! classUri) return;
    const response = await getAttributesForClass(classUri);
    const triples = makeTriplesObject(response);
    setAttributes(triples);
    return triples;
  }

  // Fetch object from storage
  const fetchObjectFromStorage = (uuid: string) => {
    // Load data store
    const dataStore_raw = localStorage.getItem('IMBOR_DEMO_APP_physicalObjects');
    if(! dataStore_raw) return;
    const dataStore = JSON.parse(dataStore_raw);
    // Find uuid
    let result;
    Object.keys(dataStore).forEach(key => {
      if(key === uuid) {
        result = dataStore[key];
      }
    })
    if(result) return result;
  }

  // Function that runs if component loads
  useEffect(() => {
    fetchFysicalObjects()
  }, [])

  // Function that runs if component loads
  useEffect(() => {
    // Listen to markerClicked events
    window.addEventListener("markerClicked", (e: any) => {
      const object = fetchObjectFromStorage(e.detail.uuid);
      // Fetch classUri
      object.forEach(async x => {
        if(x.entry_text === 'objectType') {
          // Fill in 'object type' input field
          const div_objectType = document.getElementById('objectType') as HTMLInputElement | null;
          const input_objectType = div_objectType.getElementsByClassName("react-datalist-input__textbox")[0];
          input_objectType?.setAttribute('placeholder', x.entry_value);
          // Update state
          setSelectedObjectType({
            label: x.entry_iri,
            id: x.entry_value
          });
          // Fetch attributes for object type
          const attributes = await fetchAttributesForClass(x.entry_iri);
          // Fill in all attributes
          object.forEach(x => {
            if(! x.entry_value) return;
            const el = document.getElementById(`js-attribute-input-${x.entry_text}`) as HTMLInputElement | null;
            el?.setAttribute('value', x.entry_value);
          })
          // Add lngLat
          object.forEach(x => {
            if(x.entry_text === 'lngLat') {
              setLocationOnMap(x.entry_value)
            }
          })
        }
      })
    });
    // Listen to markerUpdated events
    window.addEventListener("markerUpdated", (e: any) => {
      setLocationOnMap([e.detail.lng, e.detail.lat]);
    });
  }, [])

  // Function that runs if selected object type changes
  useEffect(() => {
    if(! selectedObjectType) return;

    fetchAttributesForClass(selectedObjectType.label);
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

  const handleSubmit = () => {
    let attributesArray = [];
    // Validate that location was set
    if(! locationOnMap || locationOnMap.length <= 0) {
      window['notify']('Verplaats eerst de marker op de kaart');
      return;
    }
    // Add objectType into dataStore object
    console.log('selectedObjectType', selectedObjectType);
    attributesArray.push({
      entry_text: 'objectType',
      entry_iri: selectedObjectType.label,
      entry_value: selectedObjectType.id
    })
    // Add lnglat into dataStore object
    attributesArray.push({
      entry_text: 'lngLat',
      entry_value: locationOnMap
    })
    // Add all attribute values into dataStore object
    attributes.forEach(x => {
      if(! x.entry_text) return;
      const input_field = document.getElementById(`js-attribute-input-${x.entry_text.value}`) as HTMLInputElement | null;
      const entry_value = input_field?.value;
      if(! entry_value) return;
      attributesArray.push({
        entry_iri: x.entry_iri ? x.entry_iri.value : null,
        entry_text: x.entry_text.value,
        entry_definition: x.entry_definition ? x.entry_definition.value : null,
        entry_value: entry_value,
        group_iri: x.group_iri ? x.group_iri.value : null,
      });
    })
    // Save the data with an unikue ID as key
    const uuid = crypto.randomUUID();
    // Get existing data store
    const dataStore_raw = localStorage.getItem('IMBOR_DEMO_APP_physicalObjects');
    let dataStore = {};
    if(dataStore_raw) {
      dataStore = JSON.parse(dataStore_raw);
    }
    // Store attributesArray with all values into localStorage
    dataStore[uuid] = attributesArray;
    localStorage.setItem('IMBOR_DEMO_APP_physicalObjects', JSON.stringify(dataStore));
    // Close EditForm
    setIsFormVisible(false);
    setAttributes([])
    setLocationOnMap([])
    setSelectedObjectType(false);
    console.info('Saved into localStorage');
  }

  return (
    <form className="EditObject">

      <DatalistInput
        placeholder="Objecttype"
        label="Selecteer een objecttype"
        id="objectType"
        onSelect={(item) => {
          setSelectedObjectType(item)
          
          if(! locationOnMap || locationOnMap.length < 2) {
            let event = new Event("addDraggableMarker");
            window.dispatchEvent(event);
          }
        }}
        items={prepareForDataList(physicalObjects)}
      />

      {selectedObjectType && ! selectedObjectTypeLocation && <p>
        Plaats het object op de kaart
      </p>}

      {selectedObjectType && selectedObjectTypeLocation && <div style={{margin: '15px 0'}}>
        <Attributes data={attributes} />
        <div style={{margin: '15px 0'}}>
          <Button onClick={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          classes="w-full"
          >
            Opslaan
          </Button>
        </div>
      </div>}
    </form>
  )
}

export default EditObject;
