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
  AttributeRelationValue,
  Geometry
} from '../../models/Object';

// Import components
import Button from '../Button';
import FormLabel from '../FormLabel/FormLabel';
import FormInput from '../FormInput/FormInput.jsx';

// Import helper functions
import {
  getKern,
  getFysicalObjects,
  getAttributesForClass,
  getGeoClasses
} from '../../api/imbor'
import {
  makeTriple,
  makeTriplesObject,
  getUniquePhysicalObjects
} from '../../helpers/triples';
import {
  getDataStore,
  getObject
} from '../../helpers/dataStore';
import {
  selectPhysicalObjects,
  selectGeoClasses,
  setPhysicalObjects,
  setGeoClasses,
} from './editObjectSlice';

import '../MapTools.css'
import './EditObject.css'

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
        >
          <FormLabel
            id={id}
            label={triple['entry_text'].value}
            infoText={triple['entry_definition'] ? triple['entry_definition'].value : ''}
            >
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

type lngLat = [number, number][];

const EditObject = () => {
  // Define state variables
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [attributes, setAttributes] = useState([]);
  const [locationOnMap, setLocationOnMap] = useState<lngLat>([]);
  const [activeUuid, setActiveUuid] = useState<any>();
  const [selectedObjectType, setSelectedObjectType] = useState<any>();
  const [geometry, setGeometry] = useState<Geometry>();

  // Get store variables
  const physicalObjects = useSelector(selectPhysicalObjects);
  const geoClasses = useSelector(selectGeoClasses);
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

  // Fetch geo classes
  const fetchGeoClasses = async () => {
    const response = await getGeoClasses();
    if(! response || ! response.results) {
      return;
    }
    // Store geoClasses in local store
    dispatch(setGeoClasses(response.results.bindings))
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
    fetchFysicalObjects();
    fetchGeoClasses();
  }, [])

  // Function that runs if component loads
  useEffect(() => {
    const geometryClickedCallback = async (e: any) => {
      // Get clicked object data
      const object = getObject(null, e.detail.uuid);
      // If no object info was found: stop executing
      if(! object) return;
      // Make edit form visible
      setIsFormVisible(true);
      // Set this UUID as active UUID
      setActiveUuid(e.detail.uuid)
      // Fill in 'object type' input field
      const div_objectType = document.getElementById('objectType') as HTMLInputElement | null;
      const input_objectType = div_objectType.getElementsByClassName("react-datalist-input__textbox")[0];
      input_objectType?.setAttribute('placeholder', object.label);
      // Update 'objectType' state variable
      setSelectedObjectType({
        label: object.uri,
        id: object.label,
        type: object.type
      });
      // Add geometry (marker or polygon) to state
      // But only if it's unedited
      if(object.geometry) {
        setLocationOnMap(object.geometry.inputs);
        setGeometry(object.geometry);
      }
      // Fetch attributes for object type
      const attributes = await fetchAttributesForClass(object.uri);
      // Fill in all attributes after a few milliseconds (so state can update first)
      setTimeout(() => {
        if(! object.attributes) return;
        object.attributes.forEach(x => {
          if(! x.value) return;
          const el = document.getElementById(`js-attribute-input-${x.label}`) as HTMLInputElement | null;
          el?.setAttribute('value', x.value);
        })
      }, 100)
    }

    const markerUpdatedCallback = (e: any) => {
      setLocationOnMap([e.detail.lng, e.detail.lat]);
    }

    const geometryUpdatedCallback = (e: any) => {
      setGeometry(e.detail);
    }

    // Listen to markerClicked events
    window.addEventListener("markerClicked", geometryClickedCallback);

    // Listen to markerUpdated events
    window.addEventListener("markerUpdated", markerUpdatedCallback);

    // Listen to geometryClicked events
    window.addEventListener("geometryClicked", geometryClickedCallback);

    // Listen to geometryUpdated events
    window.addEventListener("geometryUpdated", geometryUpdatedCallback);

    return () => {
      window.removeEventListener("markerClicked", geometryClickedCallback);
      window.removeEventListener("markerUpdated", markerUpdatedCallback);
      window.removeEventListener("geometryUpdated", geometryUpdatedCallback);
      window.removeEventListener("geometryClicked", geometryClickedCallback);
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
        label: objects[x]['classURI'].value,
        type: objects[x]['subClassOf'] ? objects[x]['subClassOf'].value : ''
      });
    }
    return ret;
  }

  const resetFormState = () => {
    setAttributes([])
    setLocationOnMap([])
    setGeometry(null)
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
    if(! geometry || ! geometry.inputs || geometry.inputs.length <= 0) {
      window['notify']('Verplaats eerst de marker op de kaart of teken een gebied in');
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
      geometry: geometry,
      attributes: attributesArray
    }

    // Store attributesArray with all values into localStorage
    const dataStore = getDataStore();
    dataStore[uuid] = object;
    localStorage.setItem('IMBOR_DEMO_APP_physicalObjects', JSON.stringify(dataStore));

    // Close EditForm
    resetFormState();
    setIsFormVisible(false);

    // Disable drawing
    const event = new Event("disableDrawing");
    window.dispatchEvent(event);

    // Return
    console.info('Saved into localStorage');
    return true;
  }

  // Get geo type (point/polygon) of objects parent classUri
  const getGeoClass = (objectType: URL): boolean | string => {
    // Filter geoClasses on objectType
    const foundGeoClass = geoClasses.filter(x => {
      return x.classURI.value === objectType;
    })
    if(objectType === 'Wegvak' || objectType === 'Halteplaats') {
      return 'polygon';
    }
    else if(foundGeoClass.length === 0) {
      return 'point';
    }
    // Return geoClass if found
    if(foundGeoClass[0].geoKlasseLabel.value === 'GM_Point') {
      return 'point';
    }
    else if(foundGeoClass[0].geoKlasseLabel.value === 'GM_Surface') {
      return 'polygon';
    } else {
      return 'point';
    }
  }

  const showAttributes = selectedObjectType && geometry && geometry.inputs;

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
      {showAttributes && (
        <Button onClick={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        >
          Opslaan
        </Button>
      )}

      <Button
        classes={`${isFormVisible ? 'Button-white' : ''} ${(isFormVisible && locationOnMap && locationOnMap.length >= 1) ? 'margin-left' : ''}`}
        onClick={() => {
          setIsFormVisible(! isFormVisible);
          resetFormState();
        }}
        >
        {isFormVisible ? 'Annuleer' : 'Object toevoegen'}
      </Button>

      <div
        className="InfoBox"
        style={{display: isFormVisible ? 'block' : 'none'}}
      >

        <form className="EditObject" id="js-editObjectForm" onSubmit={(e) => {e.preventDefault()}}>

          <DatalistInput
            placeholder="Objecttype"
            label="Selecteer een objecttype"
            id="objectType"
            onSelect={(item) => {
              setSelectedObjectType(item)

              // Get geoClass (point/polygon)
              const geoClass = getGeoClass(item.value);

              if(! geometry || ! geometry.inputs) {
                let event = (
                  geoClass === 'point'
                    ? new Event("addDraggableMarker")
                    : new Event("enableDrawing")
                )
                window.dispatchEvent(event);
              }
            }}
            items={prepareForDataList(physicalObjects)}
          />

          {selectedObjectType && (! locationOnMap || locationOnMap.length < 1) && ! activeUuid && <p className="EditObject-note">
            Verplaats de marker op de kaart om een object toe te voegen.
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
