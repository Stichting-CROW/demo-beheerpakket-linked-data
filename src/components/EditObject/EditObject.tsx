import {useState, useEffect, useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DatalistInput from 'react-datalist-input';
import 'react-datalist-input/dist/styles.css';

// Import models
import {
  URL,
  UUID,
  Object,
  Literal,
  AttributeRelationValue
} from '../../models/Object';

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
  getDataStore,
  getObject
} from '../../helpers/dataStore';
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
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [attributes, setAttributes] = useState([]);
  const [locationOnMap, setLocationOnMap] = useState<lngLat>([]);
  const [activeUuid, setActiveUuid] = useState<any>();
  const [selectedObjectType, setSelectedObjectType] = useState<any>();

  // Get store variables
  const physicalObjects = useSelector(selectPhysicalObjects);
  const dispatch = useDispatch();

  // Fetch fysical objects
  const fetchFysicalObjects = async () => {
    const response = await getFysicalObjects()
    if(! response || ! response.results) {
      return;
    }
    const uniqueTriples = getUniquePhysicalObjects(response.results.bindings);
    dispatch(setPhysicalObjects(uniqueTriples))
  }

  // Fetch attributes for a specific FysicalObject class
  const fetchAttributesForClass = async (classUri: URL) => {
    if(! classUri) return;
    const response = await getAttributesForClass(classUri);
    const triples = makeTriplesObject(response);
    setAttributes(triples);
    return triples;
  }

  // Function that runs if component loads
  useEffect(() => {
    fetchFysicalObjects()
  }, [])

  // Function that runs if component loads
  useEffect(() => {
    const markerClickedCallback = async (e: any) => {
      // Get clicked object data
      const object = getObject(null, e.detail.uuid);
      // Make edit form visible
      setIsFormVisible(true);
      // Set this UUID as active UUID
      setActiveUuid(e.detail.uuid)
      // Fill in 'object type' input field
      const div_objectType = document.getElementById('objectType') as HTMLInputElement | null;
      const input_objectType = div_objectType.getElementsByClassName("react-datalist-input__textbox")[0];
      input_objectType?.setAttribute('placeholder', object.label);
      // Update 'objectType' state variable
      setSelectedObjectType({ label: object.uri, id: object.label });
      // Add lngLat to state
      if(object.geometry) {
        setLocationOnMap(object.geometry);
      }
      // Fetch attributes for object type
      const attributes = await fetchAttributesForClass(object.uri);
      // Fill in all attributes
      object.attributes.forEach(x => {
        if(! x.value) return;
        const el = document.getElementById(`js-attribute-input-${x.label}`) as HTMLInputElement | null;
        el?.setAttribute('value', x.value);
      })
    }

    const markerUpdatedCallback = (e: any) => {
      setLocationOnMap([e.detail.lng, e.detail.lat]);
    }

    // Listen to markerClicked events
    window.addEventListener("markerClicked", markerClickedCallback);

    // Listen to markerUpdated events
    window.addEventListener("markerUpdated", markerUpdatedCallback);

    return () => {
      window.removeEventListener("markerClicked", markerClickedCallback);
      window.removeEventListener("markerUpdated", markerUpdatedCallback);
    }
  }, [
    activeUuid
  ])

  // Function that runs if selected objectType changes
  useEffect(() => {
    if(! selectedObjectType) return;

    fetchAttributesForClass(selectedObjectType.label);
  }, [selectedObjectType])

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

  const resetFormState = () => {
    setAttributes([])
    setLocationOnMap([])
    setSelectedObjectType(false);
    setActiveUuid(false)
    // Clear form
    const form = document.getElementById('js-editObjectForm') as HTMLFormElement | null;
    form.reset();
    // Reload data
    const myEvent = new CustomEvent("fysicalObjectsUpdated");
    window.dispatchEvent(myEvent);
  }

  // Function that runs if user saves object
  const handleSubmit = () => {
    // Validate that location was set
    if(! locationOnMap || locationOnMap.length <= 0) {
      window['notify']('Verplaats eerst de marker op de kaart');
      return;
    }

    // Create an unique UUID or save the data with existing id
    const uuid: UUID = activeUuid || crypto.randomUUID();

    // Populate attributes array
    let attributesArray = [] as AttributeRelationValue<Literal>[];
    attributes.forEach(x => {
      if(! x.entry_text) return;
      // Get input value
      const input_field = document.getElementById(`js-attribute-input-${x.entry_text.value}`) as HTMLInputElement | null;
      const entry_value = input_field?.value;
      // Check if field has a value
      if(! entry_value) return;

      attributesArray.push({
        uri: x.entry_iri,// type URL
        type: x.group_iri ? x.group_iri.value : null,// group URL
        value: entry_value,
        label: x.entry_text.value
      });
    })

    const object: Object = {
      uri: selectedObjectType.label,
      label: selectedObjectType.id,

      uuid: uuid,
      type: '',
      geometry: locationOnMap,
      attributes: attributesArray
    }

    // Store attributesArray with all values into localStorage
    const dataStore = getDataStore();
    dataStore[uuid] = object;
    localStorage.setItem('IMBOR_DEMO_APP_physicalObjects', JSON.stringify(dataStore));

    // Close EditForm
    resetFormState();
    setIsFormVisible(false);

    // Return
    console.info('Saved into localStorage');
    return true;
  }

  const showAttributes = selectedObjectType && locationOnMap && locationOnMap.length == 2;

  // If physical objects did not load: Show loading text
  if(! physicalObjects || physicalObjects.length <= 0) {
    return (
      <div className="EditObject">
        Bezig met laden van objecttypen...
      </div>
    )
  }

  return (
    <>
      <Button
        classes="w-full"
        onClick={() => {
          setIsFormVisible(! isFormVisible);
          resetFormState();
        }}
        >
        {isFormVisible ? 'Annuleer' : 'Object toevoegen'}
      </Button>

      {showAttributes && (
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
      )}

      <div
        className="InfoBox"
        style={{display: isFormVisible ? 'block' : 'none'}}
      >

        <form className="EditObject" id="js-editObjectForm">

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

          {selectedObjectType && (! locationOnMap || locationOnMap.length < 2) && ! activeUuid && <p>
            <b>Plaats het object op de kaart door de marker te verplaatsen.</b>
          </p>}

          {showAttributes && <div style={{margin: '15px 0'}}>
            <Attributes data={attributes} />
          </div>}
        </form>

      </div>
    </>
  )
}

export default EditObject;
